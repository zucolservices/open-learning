"use client";

import { motion } from "motion/react";
import { Map as MapIcon } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORR, outcome, type Stage } from "./model";
import type { CoState } from "./state";

/* 1 ─ An old map ---------------------------------------------------------------------------------- */

export function OldMap() {
  return (
    <StepLayout
      eyebrow="Story"
      title="An old map"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <MapIcon className="text-accent size-8" />
          <div className="grid w-full gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="font-semibold">The map says</p>
              <p className="text-muted text-sm">&ldquo;The bypass is a quiet lane.&rdquo;</p>
            </div>
            <div className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3">
              <p className="font-semibold">Since then</p>
              <p className="text-muted text-sm">
                A new estate opened. The lane is jammed every morning.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A satnav with an old map will cheerfully send you down a road that&apos;s now gridlocked.
        Its route-finding is fine; its picture of the world is out of date.
      </p>
      <p>
        The query planner is the same. It chooses plans using{" "}
        <Term id="table-statistics">statistics</Term> about the data: how many rows, how values are
        spread. A study by Leis and colleagues (VLDB) found every estimator they tested made large
        errors, and that the cost model has &ldquo;much less influence on query performance than the
        cardinality estimates&rdquo;. Bad <Term id="cardinality-estimate">row estimates</Term> in,
        bad plans out.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The overnight load ⭐ ----------------------------------------------------------------------- */

const STAGES: [Stage, string][] = [
  [0, "Before the load"],
  [1, "After loading 1M rows"],
  [2, "After ANALYZE"],
];

export function StaleStats() {
  const [s, set] = useSceneState<CoState>();
  const o = outcome(s.stage);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The overnight load"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map(([st, l], i) => (
              <button
                key={st}
                type="button"
                aria-pressed={s.stage === st}
                onClick={() => set({ stage: st })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.stage === st
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {i + 1}. {l}
              </button>
            ))}
          </div>
          <Code>
            {
              "SELECT m.name, p.amount FROM payments p\nJOIN merchants m ON m.id = p.merchant_id\nWHERE p.merchant_id = 77;"
            }
          </Code>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Statistics say", o.statsRows],
              ["Estimate", o.estimate],
              ["Actual", o.actual],
            ].map(([l, v], i) => (
              <div
                key={l}
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  i === 2 && !o.good ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-xs font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <Code>{o.plan}</Code>
          <motion.div
            key={s.stage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              o.good ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            <p className="font-mono font-semibold">{o.time}</p>
            <p className="text-muted">{o.note}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">Illustrative tables, plans and timings.</p>
        </div>
      }
    >
      <p>
        A payments table is fine all week. Then a batch job loads a million rows overnight, and next
        morning a report that took 2 ms takes 41 seconds. Step through what happened.
      </p>
      <p>
        PostgreSQL&apos;s advice for bulk loads is a heading of its own: &ldquo;Run ANALYZE
        Afterwards&rdquo;. Autovacuum would analyse eventually (after 50 rows plus 10% of the table
        change), but the morning&apos;s queries don&apos;t wait for it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What the planner knows ---------------------------------------------------------------------- */

export function WhatsCollected() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the planner knows"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`SELECT * FROM pg_stats WHERE tablename = 'payments' AND attname = 'status';
 null_frac          | 0
 n_distinct         | 4
 most_common_vals   | {paid,refunded,failed,pending}
 most_common_freqs  | {0.91,0.05,0.03,0.01}
 histogram_bounds   | (for other columns: equal-population buckets)
 correlation        | 0.02   -- physical order vs value order`}</Code>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "PostgreSQL",
                "ANALYZE samples 30,000 rows by default (300 × a statistics target of 100); autovacuum re-analyses after 50 + 10% of rows change.",
              ],
              [
                "MySQL InnoDB",
                "Persistent statistics, recalculated in the background when more than 10% of a table's rows change.",
              ],
              [
                "SQL Server",
                "Auto-update thresholds that, since SQL Server 2016, shrink relative to table size for big tables.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        For each column, PostgreSQL keeps the share of nulls, the number of distinct values, the
        most common values with their frequencies, a histogram of the rest, and how closely the
        physical order follows the value order. From these it estimates how many rows each step will
        produce.
      </p>
      <p>
        These are samples, not counts, and they go stale as data changes. When a plan looks wrong,
        the first question is: are the statistics current?
      </p>
    </StepLayout>
  );
}

/* 4 ─ Pune and 411001 ----------------------------------------------------------------------------- */

export function Correlated() {
  const [s, set] = useSceneState<CoState>();
  const naive = Math.round(CORR.rows * CORR.city * CORR.pin);
  const real = Math.round(CORR.rows * CORR.pin);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Pune and 411001"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{"SELECT * FROM customers\nWHERE city = 'Pune' AND pincode = '411001';"}</Code>
          <button
            type="button"
            aria-pressed={s.extended}
            onClick={() => set({ extended: !s.extended })}
            className={cn(
              "self-start rounded-full border px-3 py-1 text-xs",
              s.extended ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {s.extended ? "✓ " : ""}CREATE STATISTICS (dependencies) ON city, pincode
          </button>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                s.extended ? "border-good/50 bg-good/5" : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">Planner&apos;s estimate</p>
              <p className="font-mono text-lg font-semibold">
                {(s.extended ? real : naive).toLocaleString("en-IN")} rows
              </p>
              <p className="text-muted text-[10px]">
                {s.extended ? "knows 411001 implies Pune" : "5% × 0.4% × 1,000,000"}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Reality</p>
              <p className="font-mono text-lg font-semibold">{real.toLocaleString("en-IN")} rows</p>
              <p className="text-muted text-[10px]">every 411001 is in Pune</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">Illustrative percentages.</p>
        </div>
      }
    >
      <p>
        PostgreSQL&apos;s docs: &ldquo;the planner normally assumes that multiple conditions are
        independent of each other&rdquo;, so it multiplies their selectivities. But a pincode
        determines the city; the conditions aren&apos;t independent, and the estimate comes out
        twenty times too small.
      </p>
      <p>
        Extended statistics tell the planner which columns move together. They take effect after the
        next ANALYZE.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What would you do? -------------------------------------------------------------------------- */

export function FixIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What would you do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="fix-plan"
            prompt="After a big data import, EXPLAIN ANALYZE shows estimated rows=50 but actual rows=400,000 on a key step, and the query is suddenly slow. What's the best first move?"
            options={[
              {
                id: "seqoff",
                label: "SET enable_nestloop = off for the whole server",
                feedback: "A crude, global override that can hurt every other query.",
              },
              {
                id: "analyze",
                label: "Run ANALYZE on the table, then check the plan again",
                correct: true,
                feedback:
                  "Refresh the statistics first; the planner usually fixes itself once its numbers are right.",
              },
              {
                id: "index",
                label: "Add more indexes",
                feedback: "The problem is the estimate, not a missing index.",
              },
              {
                id: "bigger",
                label: "Move to a bigger server",
                feedback: "A plan doing 400,000 lookups stays slow on any machine.",
              },
            ]}
            explanation="Big gaps between estimated and actual rows point to statistics. Refresh them before reaching for overrides."
          />
        </div>
      }
    >
      <p>The classic morning-after-the-import puzzle.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Plans follow estimates", "Estimates come from statistics."],
  ["Statistics go stale", "Bulk loads especially; run ANALYZE after."],
  ["Compare estimated and actual", "Big gaps explain bad plans."],
  ["Columns can be correlated", "Extended statistics fix the multiplication."],
  ["Fix numbers before forcing plans", "Overrides are a last resort."],
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
        Next chapter: keeping data correct when the power fails and when users collide, starting
        with the write-ahead log.
      </p>
    </StepLayout>
  );
}
