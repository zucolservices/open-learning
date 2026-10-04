"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DIMS, FACTS, GRAINS, MIXED, QUESTIONS, STEPS } from "./model";
import type { GrainState } from "./state";

/* 1 ─ Decide what one row means ------------------------------------------------------------------- */

export function Recipe() {
  const rows: [string, string][] = [
    ["One row per tree", "You can count trees, and see each one's height."],
    ["One row per hectare", "Good for maps; you've lost individual trees."],
    ["One row per forest", "One number. Fine for a headline, useless for anything else."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Decide what one row means"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A forest survey has to decide, before anything else, what one line of the survey describes:
        a tree, a hectare or the forest. Everything else, from what to measure to which questions
        you can answer, follows from that choice.
      </p>
      <p>
        In dimensional modelling that choice is the <Term id="grain">grain</Term>. Kimball calls
        declaring it &ldquo;the pivotal step&rdquo;: it says &ldquo;exactly what a single fact table
        row represents&rdquo;, and it must come before choosing dimensions or facts.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design a supermarket fact table ⭐ ---------------------------------------------------------- */

export function FourSteps() {
  const [s, set] = useSceneState<GrainState>();
  const st = STEPS[s.step] ?? STEPS[0];
  const picked = (id: string) =>
    st.multi ? (s[st.key] as string[]).includes(id) : s[st.key] === id;
  const pick = (id: string) => {
    if (st.multi) {
      const cur = s[st.key] as string[];
      set({ [st.key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
    } else set({ [st.key]: id });
  };
  const goodDims = DIMS.filter((d) => d.ok && s.dims.includes(d.id));
  const goodFacts = FACTS.filter((f) => f.ok && s.facts.includes(f.id));
  const grain = GRAINS.find((g) => g.id === s.grain);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Design a supermarket fact table"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.step}
            count={STEPS.length}
            onChange={(n) => set({ step: n })}
            label={st.title}
          />
          <div className="flex flex-col gap-1.5">
            {st.opts.map((o) => {
              const on = picked(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(o.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs",
                    on
                      ? o.ok
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span className="font-semibold">
                    {st.multi && (on ? "☑ " : "☐ ")}
                    {o.label}
                  </span>
                  {on && (
                    <span className={cn("mt-0.5 block", o.ok ? "text-good" : "text-bad")}>
                      {o.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface-2 rounded-xl border px-3 py-2 font-mono text-[11px]">
            <p className="text-accent font-semibold">fact_sales_line</p>
            <p className="text-muted">
              grain: {grain ? grain.label.toLowerCase() : "not declared yet"}
            </p>
            <p>
              keys: {goodDims.length ? goodDims.map((d) => `${d.id}_key`).join(", ") : "…"}
              {grain?.id === "line" ? ", receipt_no" : ""}
            </p>
            <p>
              facts:{" "}
              {goodFacts.length
                ? goodFacts.map((f) => f.label.toLowerCase().replace(/ /g, "_")).join(", ")
                : "…"}
            </p>
          </div>
          {s.step === 1 && grain && (
            <div className="flex flex-col gap-0.5 text-[11px]">
              {QUESTIONS.map((q) => {
                const ok = q.needs.includes(grain.id);
                return (
                  <p key={q.q} className={ok ? "text-good" : "text-bad"}>
                    {ok ? "✓" : "✗"} {q.q}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      }
    >
      <p>
        Kimball&apos;s design comes down to four decisions, in this order: select the business
        process, declare the grain, identify the dimensions, identify the facts. Work through each
        for a supermarket.
      </p>
      <p>
        At step 2, see which questions each grain can answer. At steps 3 and 4, every dimension and
        fact must make sense for one row at the grain you chose. The receipt number has no table of
        its own: a <Term id="degenerate-dimension">degenerate dimension</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Never mix grains ---------------------------------------------------------------------------- */

export function Mixing() {
  const sum = MIXED.reduce((a, [, , v]) => a + v, 0);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Never mix grains"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line overflow-hidden rounded-lg border font-mono text-xs">
            {MIXED.map(([r, item, v], i) => (
              <div
                key={item}
                className={cn(
                  "grid grid-cols-3 px-3 py-1",
                  i === 0 ? "bg-bad/10 text-bad" : i % 2 ? "bg-surface" : "bg-surface-2",
                )}
              >
                <span>{r}</span>
                <span>{item}</span>
                <span className="text-right">₹{v}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm">
            SUM(amount) = <span className="text-bad font-mono font-semibold">₹{sum}</span> · real
            takings <span className="text-good font-mono font-semibold">₹{sum / 2}</span>
          </p>
        </div>
      }
    >
      <p>
        Someone adds the receipt totals into the line-item table &ldquo;for convenience&rdquo;. Now
        any sum counts every sale twice.
      </p>
      <p>
        Kimball&apos;s rule: &ldquo;different grains must not be mixed in the same fact
        table&rdquo;. A receipt-level fact like the total belongs in a receipt-grain fact table of
        its own.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Start atomic -------------------------------------------------------------------------------- */

export function Atomic() {
  const [s, set] = useSceneState<GrainState>();
  const g = GRAINS.find((x) => x.id === s.zoom) ?? GRAINS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Start atomic"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {GRAINS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.zoom === x.id}
                onClick={() => set({ zoom: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.zoom === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {QUESTIONS.map((q) => {
              const ok = q.needs.includes(g.id);
              return (
                <motion.div
                  key={q.q + g.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    ok ? "border-good bg-good/10" : "border-bad bg-bad/10 text-muted",
                  )}
                >
                  {ok ? "✓" : "✗"} {q.q}
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        The <Term id="atomic-grain">atomic grain</Term> is the lowest level a process captures.
        Kimball strongly encourages starting there, because it &ldquo;withstands the assault of
        unpredictable user queries&rdquo;.
      </p>
      <p>
        Summaries can always be built from atomic data, and they&apos;re worth adding for speed. But
        they presume the questions; the reverse trip, from summary back to detail, is impossible.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which step? --------------------------------------------------------------------------------- */

export function WhichStep() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which step?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-step"
            prompt="Which of the four decisions is each statement about?"
            categories={[
              { id: "process", label: "Process" },
              { id: "grain", label: "Grain" },
              { id: "dims", label: "Dimensions" },
              { id: "facts", label: "Facts" },
            ]}
            items={[
              {
                id: "claims",
                label: "We'll model insurance claims being processed",
                category: "process",
                why: "An operational activity.",
              },
              {
                id: "row",
                label: "One row per class registration by a student",
                category: "grain",
                why: "What a single row represents.",
              },
              {
                id: "who",
                label: "Each row links to the student, the course and the term",
                category: "dims",
                why: "The context.",
              },
              {
                id: "fee",
                label: "Record the fee paid and credits earned",
                category: "facts",
                why: "The numbers measured.",
              },
              {
                id: "order",
                label: "We'll start with customers placing orders",
                category: "process",
                why: "Another process, straight from Kimball's examples.",
              },
            ]}
            explanation="Process first, then the grain, then dimensions and facts that are true for one row at that grain."
          />
        </div>
      }
    >
      <p>Sort the statements.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Four decisions, in order", "Process, grain, dimensions, facts."],
  ["Grain is a contract", "Exactly what one row represents."],
  ["One grain per table", "Mixing grains double-counts."],
  ["Start atomic", "Summaries later, for speed."],
  ["From events, not reports", "Design for the process, not one dashboard."],
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
      <p>Next: not every fact table records single events. Three kinds of fact table.</p>
    </StepLayout>
  );
}
