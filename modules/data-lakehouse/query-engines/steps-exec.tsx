"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { EnginesState } from "./state";

/* 4 ─ One row at a time, or a batch at a time? ------------------------------------------------- */

const VALUES = [320, 1250, 480, 290, 640, 210, 905, 150, 760, 430, 1180, 95, 350, 610, 275, 820];
const ROWS = 10_000_000;
const BATCH = 2048;

export function Vectorised() {
  const [s, set] = useSceneState<EnginesState>();
  const row = s.exec === "row";
  const trips = row ? ROWS : Math.ceil(ROWS / BATCH);
  return (
    <StepLayout
      eyebrow="Under the hood"
      title="One row at a time, or a batch at a time?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.exec}
            options={[
              ["row", "Row at a time"],
              ["vector", "Vectorised"],
            ]}
            onChange={(v) => set({ exec: v as EnginesState["exec"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-4">
            <p className="text-muted mb-2 font-mono text-[10px]">amount column → SUM(amount)</p>
            <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-16">
              {VALUES.map((v, i) => (
                <motion.div
                  key={`${s.exec}-${i}`}
                  animate={{
                    backgroundColor: ["var(--surface)", "var(--accent-soft)", "var(--surface)"],
                  }}
                  transition={{
                    duration: row ? 0.35 : 0.9,
                    delay: row ? i * 0.35 : Math.floor(i / 8) * 0.9,
                    repeat: Infinity,
                    repeatDelay: row ? (VALUES.length - 1) * 0.35 : 0.9,
                  }}
                  className="border-line rounded border px-1 py-1.5 text-center font-mono text-[10px]"
                >
                  {v}
                </motion.div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.pre
                key={s.exec}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-surface-2 mt-3 overflow-x-auto rounded-lg px-3 py-2 font-mono text-[11px]"
              >
                {row
                  ? 'for each row:\n  # which type? null? look it up\n  value = row.get("amount")\n  # a function call per value\n  total = add(total, value)'
                  : "for each batch of 2,048 amounts:\n  # one tight loop over one type;\n  # the CPU adds several at once\n  total += sum(batch)"}
              </motion.pre>
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Trips through the engine for 10 million rows</p>
              <p className="font-mono text-lg">{trips.toLocaleString("en-IN")}</p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                row ? "border-bad/40 bg-bad/5" : "border-good/40 bg-good/5",
              )}
            >
              <p className="text-muted text-[10px]">Overhead per value</p>
              <p className="text-sm">
                {row ? "Type checks and a call, every value" : "Paid once per 2,048 values"}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Older engines pulled one row at a time through every step of the plan. For each value
        they&apos;d check its type, handle nulls and call a function: bookkeeping that costs more
        than the arithmetic.
      </p>
      <p>
        <Term id="vectorised">Vectorised</Term> engines work on a batch of values from one column at
        once. The bookkeeping happens once per batch, and the inner loop is simple enough for the
        CPU to add several numbers per instruction.
      </p>
      <p className="text-muted text-sm">
        It fits columnar files perfectly: Parquet already stores a column&apos;s values together.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Reading a query plan ---------------------------------------------------------------------- */

const PLAN: { id: string; depth: number; text: string; title: string; about: string }[] = [
  {
    id: "final",
    depth: 0,
    text: "HashAggregate  keys=[city]  functions=[sum(amount)]",
    title: "Final aggregate",
    about: "Adds up the partial sums for each city into the final answer.",
  },
  {
    id: "exchange",
    depth: 1,
    text: "Exchange  hashpartitioning(city)",
    title: "Exchange (shuffle)",
    about:
      "Moves rows between workers over the network so all of one city's partial sums meet on the same worker. Shuffles are often the most expensive part of a query.",
  },
  {
    id: "partial",
    depth: 2,
    text: "HashAggregate  keys=[city]  functions=[partial_sum(amount)]",
    title: "Partial aggregate",
    about:
      "Each worker sums its own rows first, so only a few numbers per city cross the network instead of every row.",
  },
  {
    id: "scan",
    depth: 3,
    text: "BatchScan sales.orders\n  PushedFilters: [order_date = 2026-09-12]\n  ReadSchema: city, amount, order_date",
    title: "Scan",
    about:
      "Check two things here. Is your filter in PushedFilters (so files and row groups can be skipped)? Does ReadSchema list only the columns you need?",
  },
  {
    id: "metrics",
    depth: 3,
    text: "  files read: 50 of 36,500   bytes read: 330 MB",
    title: "Runtime metrics",
    about:
      "Only available once the query has run: EXPLAIN ANALYZE in Trino and DuckDB, or the SQL tab of the Spark UI. Files read vs total is the quickest health check there is.",
  },
];

export function PlanReader() {
  const [s, set] = useSceneState<EnginesState>();
  const node = PLAN.find((n) => n.id === s.planNode) ?? PLAN[3];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Reading a query plan"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="bg-surface-2 overflow-x-auto rounded-xl p-3 font-mono text-[11px]">
            {PLAN.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => set({ planNode: n.id })}
                style={{ paddingLeft: `${n.depth * 1.25 + 0.5}rem` }}
                className={cn(
                  "block w-full rounded py-1 pr-2 text-left whitespace-pre transition",
                  s.planNode === n.id
                    ? "bg-accent-soft text-accent ring-accent/50 ring-1"
                    : "hover:bg-surface",
                )}
              >
                {n.id !== "metrics" && n.depth > 0 ? "└─ " : ""}
                {n.text}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{node.title}</p>
              <p className="text-muted mt-1 text-sm">{node.about}</p>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Simplified, Spark-style output. Trino, DuckDB and others print different words for the
            same ideas: scan, filter, aggregate, exchange, join.
          </p>
        </div>
      }
    >
      <p>
        Every engine will show you its plan: put <code>EXPLAIN</code> in front of the query. Read it
        from the bottom up, because data flows from the scan upwards.
      </p>
      <p>Click each line. The scan is where most slow queries give themselves away.</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: the slow dashboard ------------------------------------------------------------ */

export function SlowQueryCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The slow dashboard"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="slow-query"
            prompt={
              <>
                A dashboard query on a table partitioned by <code>order_date</code> takes four
                minutes. It filters with{" "}
                <code>
                  WHERE date_format(order_date, &apos;yyyy-MM-dd&apos;) = &apos;2026-09-12&apos;
                </code>
                . The plan says: <code>PushedFilters: []</code>, files read 36,500 of 36,500. What
                should you try first?
              </>
            }
            options={[
              {
                id: "workers",
                label: "Add more workers to the cluster",
                feedback:
                  "It would read the whole table a bit faster, and cost more. The real problem is that nothing is skipped.",
              },
              {
                id: "rewrite",
                label: "Compare the column directly: WHERE order_date = DATE '2026-09-12'",
                correct: true,
                feedback:
                  "Right. Wrapped in a function, the filter usually can't be matched to partitions or min/max stats. Written plainly, it's pushed down and 36,450 files are skipped.",
              },
              {
                id: "compact",
                label: "Compact the table's small files",
                feedback: "Fewer files would help a little, but every one would still be read.",
              },
              {
                id: "engine",
                label: "Switch to a faster engine",
                feedback: "Any engine has to read what it can't skip. Fix the skipping first.",
              },
            ]}
            explanation="When a query is slow, look at files and bytes read before anything else. The cheapest speed-up is almost always reading less."
          />
        </div>
      }
    >
      <p>Time to use what you&apos;ve seen: the plan tells you what&apos;s wrong.</p>
    </StepLayout>
  );
}
