"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORES, fmtS, run, type Scenario } from "./model";
import type { AqeState } from "./state";

/* 1 ─ Booking the vans ---------------------------------------------------------------------------- */

export function MovingHouse() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Booking the vans"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Monday: the guess",
              "“A three-bedroom house? Book four vans.”",
              "border-line bg-surface",
            ],
            [
              "Friday: the boxes are packed",
              "Only 40 boxes, and one piano. Cancel two vans, send the piano on its own trolley.",
              "border-accent bg-accent-soft",
            ],
          ].map(([t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn("rounded-xl border px-4 py-3", c)}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A removal firm books vans from a guess about the house. Once the boxes are packed, they can
        see exactly what there is, and a sensible firm changes the booking.
      </p>
      <p>
        Catalyst plans a query from estimates before any data is read.{" "}
        <Term id="aqe">Adaptive Query Execution</Term> (AQE) waits until each shuffle has been
        written, looks at the real sizes, and re-plans the rest of the query. It has been on by
        default since Spark 3.2.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Re-plan with real sizes ⭐ ------------------------------------------------------------------ */

export function AqeSim() {
  const [s, set] = useSceneState<AqeState>();
  const r = run(s.scenario, s.aqe, s);
  const base = run(s.scenario, false, s);
  const maxMb = Math.max(...r.tasks);
  const shown = r.tasks.slice(0, 240);
  const scenarios: [Scenario, string, string][] = [
    [
      "tiny",
      "The filter left a tiny table",
      "orders JOIN (customers WHERE country = 'IS'): estimated 2 GB, really 4 MB",
    ],
    ["skew", "One key is huge", "orders JOIN customers, where one customer has 1.6 GB of orders"],
  ];
  const feats: ["coalesce" | "join" | "skew", string][] = [
    ["coalesce", "Coalesce small partitions"],
    ["join", "Switch join strategy"],
    ["skew", "Split skewed partitions"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Re-plan with real sizes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {scenarios.map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.scenario === k}
                onClick={() => set({ scenario: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.scenario === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-muted font-mono text-[11px]">
            {scenarios.find(([k]) => k === s.scenario)![2]}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              aria-pressed={s.aqe}
              onClick={() => set({ aqe: !s.aqe })}
              className={cn(
                "rounded-md border px-3 py-1 font-semibold",
                s.aqe ? "border-good bg-good/15 text-good" : "border-line",
              )}
            >
              AQE {s.aqe ? "on" : "off"}
            </button>
            {feats.map(([k, l]) => (
              <button
                key={k}
                type="button"
                disabled={!s.aqe}
                aria-pressed={s[k]}
                onClick={() => set({ [k]: !s[k] })}
                className={cn(
                  "rounded-md border px-2 py-1 disabled:opacity-40",
                  s[k] ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {s[k] ? "✓ " : ""}
                {l}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-3">
            <div className="flex h-20 items-end gap-px">
              {shown.map((mb, i) => (
                <motion.div
                  key={`${r.tasks.length}-${i}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(2, (mb / maxMb) * 100)}%` }}
                  className={cn(
                    "min-w-px flex-1 rounded-t-[1px]",
                    mb > 256 ? "bg-bad" : "bg-viz-data/70",
                  )}
                />
              ))}
            </div>
            <p className="text-muted mt-1 text-[10px]">
              Each bar is one task in the join stage; height is the data it reads.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {[
                ["join", r.op],
                ["tasks", String(r.tasks.length)],
                ["longest task", fmtS(r.longest)],
                ["stage time", fmtS(r.stage)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-muted text-[10px]">{k}</p>
                  <p className="font-mono font-semibold">{v}</p>
                </div>
              ))}
            </div>
            {s.aqe && r.stage < base.stage && (
              <p className="text-good mt-1 text-xs">
                {fmtS(base.stage)} → {fmtS(r.stage)} on {CORES} cores
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {r.notes.map((n) => (
              <motion.p
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted text-xs"
              >
                • {n}
              </motion.p>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Toy timings on an {CORES}-core cluster; illustrative.
          </p>
        </div>
      }
    >
      <p>
        Turn AQE on and off for two queries. Each shuffle ends a{" "}
        <Term id="query-stage">query stage</Term>; once it has been written, Spark knows every
        partition&apos;s real size and can change the plan for what follows.
      </p>
      <p>
        Databricks&apos; 2020 introduction named three features. AQE <strong>coalesces</strong> lots
        of small shuffle partitions into fewer, bigger ones. It{" "}
        <strong>switches a sort-merge join to a broadcast join</strong> when one side turns out to
        be small. And it <strong>splits skewed partitions</strong> in sort-merge joins into several
        tasks.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reading an adaptive plan -------------------------------------------------------------------- */

export function AdaptivePlan() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading an adaptive plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-xs">Before running: explain()</p>
              <Code>{`AdaptiveSparkPlan isFinalPlan=false
+- SortMergeJoin [customer_id]
   :- Sort
   :  +- Exchange hashpartitioning(200)
   :     +- Scan orders
   +- Sort
      +- Exchange hashpartitioning(200)
         +- Filter country = 'IS'
            +- Scan customers`}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 text-xs">After running: SQL tab in the UI</p>
              <Code>{`AdaptiveSparkPlan isFinalPlan=true
+- BroadcastHashJoin [customer_id]
   :- AQEShuffleRead local
   :  +- ShuffleQueryStage 0
   :     +- Exchange hashpartitioning(200)
   :        +- Scan orders
   +- BroadcastQueryStage 2
      +- BroadcastExchange
         +- AQEShuffleRead local
            +- ShuffleQueryStage 1 ...`}</Code>
            </div>
          </div>
          <p className="text-subtle text-[10px]">Simplified output.</p>
        </div>
      }
    >
      <p>
        With AQE on, <code>explain()</code> shows the starting plan, marked{" "}
        <code>isFinalPlan=false</code>. The plan that actually ran appears in the SQL tab once the
        query finishes, marked <code>isFinalPlan=true</code>.
      </p>
      <p>
        Look for <code>AQEShuffleRead</code> (coalesced, local or skew-split reads) and joins that
        changed type. Switching to a broadcast mid-query isn&apos;t as good as planning it from the
        start, because the shuffle was already written, but it skips the sort and reads those files
        locally.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The settings that matter -------------------------------------------------------------------- */

const KNOBS: [string, string, string][] = [
  ["spark.sql.adaptive.enabled", "true", "The umbrella switch (default on since 3.2.0)."],
  ["…coalescePartitions.enabled", "true", "Merge small shuffle partitions."],
  [
    "…coalescePartitions.parallelismFirst",
    "true",
    "Ignore the 64 MB target and merge only up to 1 MB, to keep parallelism. Docs suggest false on a busy cluster.",
  ],
  ["…advisoryPartitionSizeInBytes", "64 MB", "The target size when merging or splitting."],
  ["…skewJoin.enabled", "true", "Split skewed partitions in sort-merge joins."],
  ["…skewJoin.skewedPartitionFactor", "5.0", "Skewed means over 5× the median…"],
  ["…skewJoin.skewedPartitionThresholdInBytes", "256 MB", "…and over 256 MB."],
];

export function Knobs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The settings that matter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {KNOBS.map(([k, v, d], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-mono text-[11px] break-all">{k}</span>
                <span className="text-accent font-mono text-[11px]">{v}</span>
              </div>
              <p className="text-muted text-[11px]">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The defaults are sensible, and the main win of AQE is that you no longer have to guess the
        right <code>spark.sql.shuffle.partitions</code> for each dataset.
      </p>
      <p>
        AQE needs at least one exchange or subquery to work with, and it doesn&apos;t apply to
        streaming queries.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which feature helps? ------------------------------------------------------------------------ */

export function WhichFeature() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which feature helps?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-aqe-feature"
            prompt="Which AQE feature, if any, helps each situation?"
            categories={[
              { id: "coalesce", label: "Coalesce" },
              { id: "join", label: "Switch join" },
              { id: "skew", label: "Split skew" },
              { id: "none", label: "None" },
            ]}
            items={[
              {
                id: "tiny-parts",
                label: "A groupBy writes 200 shuffle partitions, most under 1 MB",
                category: "coalesce",
                why: "Merging them removes per-task overhead.",
              },
              {
                id: "est",
                label: "A filter leaves 2 MB of a table Spark estimated at 3 GB",
                category: "join",
                why: "Real size is under the threshold, so a broadcast join.",
              },
              {
                id: "hot",
                label: "In a sort-merge join, one customer's rows make one task run for 30 minutes",
                category: "skew",
                why: "The skewed partition is split into several tasks.",
              },
              {
                id: "stream",
                label: "A Structured Streaming query",
                category: "none",
                why: "AQE doesn't apply to streaming queries.",
              },
              {
                id: "noshuffle",
                label: "A filter and write with no shuffle at all",
                category: "none",
                why: "No exchange, so nothing to re-plan.",
              },
            ]}
            explanation="AQE re-plans at shuffle boundaries using real sizes: merge tiny partitions, broadcast what turned out small, split what turned out huge."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Plan, run, look, re-plan", "At every shuffle boundary, with real sizes."],
  ["On by default", "Since Spark 3.2.0 (introduced in 3.0)."],
  ["Three headline features", "Coalesce partitions, switch joins, split skew."],
  ["Final plan in the UI", "explain() shows the starting plan; isFinalPlan=true is what ran."],
  ["Not magic", "No streaming, no queries without an exchange."],
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
      <p>
        Next: below the plan, how Spark makes each row cheap to process, with Tungsten and code
        generation.
      </p>
    </StepLayout>
  );
}
