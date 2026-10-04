"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FLOW, JOBS, RESULTS, type Job, type Shape } from "./model";
import type { OState } from "./state";

/* 1 ─ The till and the accounts ------------------------------------------------------------------- */

export function TillAndLedger() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The till and the accounts"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The till",
              "Hundreds of sales a day, each recorded in a second, each one exactly right.",
              "border-viz-data bg-viz-data/10",
            ],
            [
              "The year-end accounts",
              "Once a year, every sale added up by month, product and branch.",
              "border-viz-meta bg-viz-meta/10",
            ],
          ].map(([t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn("rounded-xl border px-4 py-4", c)}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A shop&apos;s till and its accountant both use the same sales, but want very different
        things. The till needs each sale recorded instantly and correctly. The accountant wants to
        add up a whole year, sliced every which way.
      </p>
      <p>
        Databases split the same way. <Term id="oltp">OLTP</Term> (online transaction processing)
        records and updates individual transactions. <Term id="olap">OLAP</Term> (online analytical
        processing) groups and summarises lots of them. Each favours a different shape of model.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One model, two jobs ⭐ ---------------------------------------------------------------------- */

export function TwoJobs() {
  const [s, set] = useSceneState<OState>();
  const shapes: [Shape, string][] = [
    ["norm", "Normalised (3NF)"],
    ["denorm", "Denormalised (one wide table)"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One model, two jobs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {shapes.map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.shape === k}
                onClick={() => set({ shape: k })}
                className={cn(
                  "rounded-md border px-3 py-1 text-xs",
                  s.shape === k ? "border-accent bg-accent-soft font-semibold" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {(Object.keys(JOBS) as Job[]).map((j) => {
              const r = RESULTS[s.shape][j];
              return (
                <button
                  key={j}
                  type="button"
                  aria-pressed={s.job === j}
                  onClick={() => set({ job: j })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left",
                    s.job === j
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{JOBS[j].name}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 font-mono text-[10px]",
                        JOBS[j].kind === "OLTP" ? "bg-viz-data/20" : "bg-viz-meta/20",
                      )}
                    >
                      {JOBS[j].kind}
                    </span>
                  </div>
                  <div className="bg-surface-2 mt-1.5 h-2 overflow-hidden rounded">
                    <motion.div
                      animate={{ width: `${r.work}%` }}
                      className={cn("h-full", r.ok ? "bg-good" : "bg-bad/70")}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          {(() => {
            const r = RESULTS[s.shape][s.job];
            return (
              <motion.div
                key={`${s.shape}-${s.job}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-xs",
                  r.ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
                )}
              >
                <p className="text-muted">{JOBS[s.job].desc}</p>
                <p className="mt-1 font-semibold">
                  {r.rows} · {r.tables}
                </p>
                <p className="text-muted mt-1">{r.note}</p>
              </motion.div>
            );
          })()}
          <p className="text-subtle text-[10px]">
            Bars show relative work; all figures illustrative.
          </p>
        </div>
      }
    >
      <p>
        Run three jobs against two shapes of the same sales data. Watch which shape makes which job
        easy.
      </p>
      <p>
        The normalised model is excellent for the transaction jobs and slow for the report. The
        wide, <Term id="denormalisation">denormalised</Term> table is the reverse. Neither is wrong:
        they suit different work. As Kent put it, normalising protects integrity &ldquo;at some
        possible performance cost for certain retrieval applications&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two systems, one pipeline ------------------------------------------------------------------- */

const CLS: Record<string, string> = {
  "viz-data": "border-viz-data bg-viz-data/10",
  "viz-compute": "border-viz-compute bg-viz-compute/10",
  "viz-meta": "border-viz-meta bg-viz-meta/10",
  "viz-add": "border-viz-add bg-viz-add/10",
};

export function Pipeline() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two systems, one pipeline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex flex-col gap-2">
              {FLOW.slice(0, 2).map((f) => (
                <div key={f.name} className={cn("rounded-lg border px-3 py-2 text-xs", CLS[f.cls])}>
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-muted text-[10px]">{f.sub}</p>
                </div>
              ))}
            </div>
            {FLOW.slice(2).map((f, i) => (
              <div key={f.name} className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 * i }}
                  className="text-accent"
                >
                  →
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * i }}
                  className={cn("rounded-lg border px-3 py-2 text-xs", CLS[f.cls])}
                >
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-muted text-[10px]">{f.sub}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        So most companies keep both. Applications write to OLTP databases, modelled to keep each
        fact once. A pipeline (<Term id="etl">ETL or ELT</Term>) copies the data, reshapes it and
        loads it into an analytical store modelled for reading. AWS puts it simply: OLTP databases
        &ldquo;can be one among several data sources for an OLAP system&rdquo;.
      </p>
      <p>
        The rest of this track is mostly about that second model: the star schema (module 6) and its
        alternatives.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where “OLAP” came from ---------------------------------------------------------------------- */

export function Origins() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where “OLAP” came from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-accent font-mono text-[10px]">1993</p>
            <p className="text-sm font-semibold">
              &ldquo;Providing OLAP to User-Analysts: An IT Mandate&rdquo;
            </p>
            <p className="text-muted mt-1">
              E. F. Codd, S. B. Codd and C. T. Salley. Introduced the term and twelve rules for
              judging analytical products.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A complicated debut</p>
            <p className="text-muted mt-1">
              The paper drew criticism because Codd had consulted for Arbor Software, whose Essbase
              product it discussed; The Register later reported that Computerworld retracted it. The
              term stuck regardless.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The same Codd who defined normalisation coined &ldquo;OLAP&rdquo; in 1993, describing tools
        that let analysts look at data from many angles, often pictured as a cube of measures by
        dimensions.
      </p>
      <p>
        AWS&apos;s modern summary: OLAP systems use star, snowflake or other analytical models; OLTP
        systems use normalised or denormalised ones.
      </p>
    </StepLayout>
  );
}

/* 5 ─ OLTP or OLAP? ------------------------------------------------------------------------------- */

export function WhichSystem() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="OLTP or OLAP?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="oltp-or-olap"
            prompt="Which kind of system does each describe best?"
            categories={[
              { id: "oltp", label: "OLTP" },
              { id: "olap", label: "OLAP" },
            ]}
            items={[
              {
                id: "writes",
                label: "Thousands of small writes a second",
                category: "oltp",
                why: "Recording individual transactions.",
              },
              {
                id: "scan",
                label: "Scanning millions of rows to answer one question",
                category: "olap",
                why: "Summarising lots of history.",
              },
              {
                id: "instant",
                label: "A payment must show up the instant it happens",
                category: "oltp",
                why: "Current, exact state.",
              },
              {
                id: "star",
                label: "Organised as star schemas",
                category: "olap",
                why: "Built for slicing and summing.",
              },
              {
                id: "loaded",
                label: "Loaded from other systems on a schedule",
                category: "olap",
                why: "Fed by pipelines from OLTP sources.",
              },
              {
                id: "once",
                label: "Each fact stored once to keep updates safe",
                category: "oltp",
                why: "Normalised for consistent writes.",
              },
            ]}
            explanation="OLTP records and changes individual things quickly and exactly; OLAP reads and summarises lots of history, usually copied in from OLTP systems."
          />
        </div>
      }
    >
      <p>Sort the descriptions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["OLTP", "Many small, exact writes; usually normalised."],
  ["OLAP", "Big reads and summaries; star schemas."],
  ["Denormalising", "Fewer joins, faster reads; copies to keep in sync."],
  ["Both, joined by a pipeline", "ETL/ELT from OLTP into the warehouse."],
  ["Shape follows the work", "No single model is best for everything."],
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
      <p>Next: the star schema, the classic shape for analytical data.</p>
    </StepLayout>
  );
}
