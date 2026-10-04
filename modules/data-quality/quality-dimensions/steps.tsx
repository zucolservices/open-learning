"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEFECTS, DIMS, HEAD, ROWS, type Dim } from "./model";
import type { DimState } from "./state";

const DIM_KEYS = Object.keys(DIMS) as Dim[];

/* 1 ─ A health check, not a feeling --------------------------------------------------------------- */

export function HealthCheck() {
  const checks: [string, string][] = [
    ["Blood pressure", "120/80"],
    ["Heart rate", "72 bpm"],
    ["Temperature", "36.8 °C"],
    ["Cholesterol", "high"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="A health check, not a feeling"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="border-line bg-surface w-64 rounded-xl border px-4 py-3">
            <p className="text-muted mb-2 text-xs">&ldquo;I feel a bit off&rdquo; becomes:</p>
            {checks.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="flex justify-between py-0.5 text-sm"
              >
                <span>{k}</span>
                <span className={cn("font-mono", v === "high" ? "text-bad" : "text-good")}>
                  {v}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        &ldquo;I feel unwell&rdquo; is hard to treat. A health check turns it into measurements a
        doctor can act on: blood pressure, heart rate, temperature, each with a normal range.
      </p>
      <p>
        &ldquo;The data is bad&rdquo; is just as vague. Data quality{" "}
        <Term id="dq-dimension">dimensions</Term> break it into separate, measurable questions. DAMA
        UK&apos;s 2013 white paper picked six core ones: completeness, uniqueness, timeliness,
        validity, accuracy and consistency.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the defect, name the dimension ⭐ ------------------------------------------------------ */

export function FindDefects() {
  const [s, set] = useSceneState<DimState>();
  const picks = s.picks ?? {};
  const right = DEFECTS.filter((d) => picks[d.id] === d.dim).length;
  const cellDefect = (r: number, c: number) =>
    DEFECTS.findIndex((d) => d.cell[0] === r && d.cell[1] === c);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find the defect, name the dimension"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[30rem] font-mono text-[10px]">
              <thead className="bg-surface-2">
                <tr>
                  {HEAD.map((h) => (
                    <th key={h} className="px-2 py-1 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, ri) => (
                  <tr key={r[0]} className="border-line border-t">
                    {r.map((c, ci) => {
                      const di = cellDefect(ri, ci);
                      const d = di >= 0 ? DEFECTS[di] : undefined;
                      const ok = d && picks[d.id] === d.dim;
                      return (
                        <td
                          key={ci}
                          className={cn(
                            "relative px-2 py-1",
                            d && (ok ? "bg-good/15" : "bg-bad/10"),
                          )}
                        >
                          {c || <span className="text-subtle">(blank)</span>}
                          {d && (
                            <sup
                              className={cn(
                                "ml-0.5 font-sans font-semibold",
                                ok ? "text-good" : "text-bad",
                              )}
                            >
                              {di + 1}
                            </sup>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-1.5">
            {DEFECTS.map((d, i) => {
              const pick = picks[d.id];
              return (
                <div
                  key={d.id}
                  className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                >
                  <p>
                    <span className="text-muted font-mono">{i + 1}.</span> {d.label}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {DIM_KEYS.map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => set({ picks: { ...picks, [d.id]: k } })}
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[10px]",
                          pick === k
                            ? k === d.dim
                              ? "border-good bg-good/15 text-good"
                              : "border-bad bg-bad/10 text-bad"
                            : "border-line hover:bg-surface-2",
                        )}
                      >
                        {DIMS[k].label}
                      </button>
                    ))}
                  </div>
                  {pick && (
                    <p
                      className={cn(
                        "mt-0.5 text-[11px]",
                        pick === d.dim ? "text-good" : "text-bad",
                      )}
                    >
                      {pick === d.dim ? d.why : `Not quite: ask "${DIMS[pick].question}"`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-muted text-xs">
            {right} of {DEFECTS.length} named. Customer data is made up.
          </p>
        </div>
      }
    >
      <p>
        Eight customer records, seven problems. For each, choose the dimension it breaks. Wrong
        picks show the question that dimension asks, so you can try again.
      </p>
      <p>
        Watch the difference between validity and accuracy. A pincode with a letter O is invalid:
        you can tell from the data alone. An age of 41 when the person is 47 is valid but
        inaccurate; you only find out by checking something outside the data.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Measuring each dimension -------------------------------------------------------------------- */

export function Measure() {
  const [s, set] = useSceneState<DimState>();
  const d = DIMS[s.open] ?? DIMS.completeness;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measuring each dimension"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {DIM_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.open === k}
                onClick={() => set({ open: k })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-semibold",
                  s.open === k ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {DIMS[k].label}
              </button>
            ))}
          </div>
          <motion.div
            key={s.open}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
          >
            <p className="text-sm">{d.question}</p>
            <p className="text-accent mt-2 font-mono">{d.measure}</p>
            <p className="text-muted mt-2">{d.example}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Each dimension turns into a number you can track over time: usually a percentage, or for
        timeliness, a delay. Examples here come from the DAMA UK paper.
      </p>
      <p>
        Two cautions from the same paper: completeness depends on which fields are actually
        required, and accuracy needs something outside the data (the real thing, or a trusted
        reference) to compare against.
      </p>
    </StepLayout>
  );
}

/* 4 ─ More than one list -------------------------------------------------------------------------- */

export function Frameworks() {
  const cards: [string, string][] = [
    [
      "DAMA UK (2013)",
      "Six core dimensions: completeness, uniqueness, timeliness, validity, accuracy, consistency. Its authors call it a checklist, not a rule.",
    ],
    [
      "Wang & Strong (1996)",
      "Asked data users what mattered: 15 dimensions in four families: intrinsic, contextual, representational and accessibility.",
    ],
    [
      "ISO/IEC 25012 (2008)",
      "15 characteristics, split into those about the data itself (accuracy, currentness…) and those that depend on the system holding it (availability, recoverability…).",
    ],
    [
      "ISO 8000",
      "A multi-part ISO series on data quality, especially master data and data exchange.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="More than one list"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {cards.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There&apos;s no single agreed list; even the DAMA UK paper says the dimensions are
        &ldquo;not universally agreed&rdquo;. Names differ too: ISO says currentness where DAMA says
        timeliness.
      </p>
      <p>
        Wang and Strong&apos;s families are a useful reminder that quality is more than correct
        values: data also has to be relevant, understandable and reachable by the people who need
        it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which dimension? ---------------------------------------------------------------------------- */

export function NameDimension() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which dimension?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-dimension"
            prompt="Which dimension does each problem break?"
            categories={DIM_KEYS.map((k) => ({ id: k, label: DIMS[k].label }))}
            items={[
              {
                id: "nulls",
                label: "30% of orders have no delivery postcode",
                category: "completeness",
                why: "Required values missing.",
              },
              {
                id: "twice",
                label: "The same invoice was loaded twice",
                category: "uniqueness",
                why: "One thing, two records.",
              },
              {
                id: "date",
                label: "A date column contains '31/02/2026'",
                category: "validity",
                why: "Not a real date: breaks the format rules.",
              },
              {
                id: "price",
                label: "A product's price is a valid number, but not what the shop charges",
                category: "accuracy",
                why: "Plausible but untrue.",
              },
              {
                id: "late",
                label: "This morning's dashboard still shows last Tuesday",
                category: "timeliness",
                why: "Too old for when it's needed.",
              },
              {
                id: "two",
                label: "Finance and sales have different totals for the same month",
                category: "consistency",
                why: "Two representations disagree.",
              },
            ]}
            explanation="Completeness: missing. Uniqueness: duplicated. Validity: breaks the rules. Accuracy: untrue. Timeliness: too old. Consistency: copies disagree."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Dimensions make it measurable", "One question, one number."],
  ["Six common ones", "Completeness, uniqueness, validity, accuracy, timeliness, consistency."],
  ["Valid isn't accurate", "Accuracy needs an outside reference."],
  ["Context decides", "Which fields are required, how fresh is fresh enough."],
  ["No single standard", "DAMA, Wang & Strong and ISO all differ."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next chapter: turning these dimensions into automatic tests that run on every load.</p>
    </StepLayout>
  );
}
