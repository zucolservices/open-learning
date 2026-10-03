"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CUSTOMERS, METHODS, ORDERS, best, fmt, work, type Method } from "./model";
import type { JoinState } from "./state";

/* 1 ─ The wedding seating plan -------------------------------------------------------------------- */

export function SeatingPlan() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The wedding seating plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Go through the whole table list for every guest",
              "Fine for 10 guests; hopeless for 500.",
              "Nested loop",
            ],
            [
              "Make a board: surname → table, then look each guest up",
              "Two quick passes, but you need room for the board.",
              "Hash join",
            ],
            [
              "Sort both lists by surname and walk them together",
              "Great if both lists are already sorted.",
              "Merge join",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
              <p className="text-accent font-mono text-[10px]">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        At a wedding, every guest must be matched to their table on the seating plan. There are
        three sensible ways to do it, and which is quickest depends on how many guests there are and
        how the lists are kept.
      </p>
      <p>
        A <Term id="join">join</Term> faces exactly this problem: match each order to its customer.
        Databases use the same three methods, and the planner picks one per join.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to join ⭐ ----------------------------------------------------------------------- */

export function ThreeJoins() {
  const [s, set] = useSceneState<JoinState>();
  const methods = Object.keys(METHODS) as Method[];
  const vals = methods.map((m) => work(m, s.c, s.o, s.index, s.sorted));
  const maxLog = Math.log10(Math.max(...vals, 10));
  const pick = best(s.c, s.o, s.index, s.sorted);
  const chip = (on: boolean) =>
    cn(
      "rounded-full border px-2.5 py-1 font-mono text-[11px]",
      on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
    );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Three ways to join"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{"SELECT … FROM customers c JOIN orders o ON o.customer_id = c.id"}</Code>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted w-20">customers</span>
            {CUSTOMERS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ c: n })}
                className={chip(s.c === n)}
              >
                {n.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted w-20">orders</span>
            {ORDERS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ o: n })}
                className={chip(s.o === n)}
              >
                {n.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={s.index}
              onClick={() => set({ index: !s.index })}
              className={chip(s.index)}
            >
              {s.index ? "✓ " : ""}index on orders.customer_id
            </button>
            <button
              type="button"
              aria-pressed={s.sorted}
              onClick={() => set({ sorted: !s.sorted })}
              className={chip(s.sorted)}
            >
              {s.sorted ? "✓ " : ""}both inputs already sorted
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {methods.map((m, i) => (
              <div
                key={m}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  pick === m ? "border-good/60 bg-good/5" : "border-line bg-surface",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold">
                    {METHODS[m].name}{" "}
                    {pick === m && (
                      <span className="text-good text-xs font-normal">
                        · planner&apos;s likely choice
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs">{fmt(vals[i])}</span>
                </div>
                <div className="bg-surface-2 mt-1 h-2 overflow-hidden rounded-full">
                  <motion.div
                    animate={{
                      width: `${Math.max(2, (Math.log10(Math.max(vals[i], 1)) / maxLog) * 100)}%`,
                    }}
                    className="bg-accent/70 h-full rounded-full"
                  />
                </div>
                <p className="text-muted mt-0.5 text-[10px]">{METHODS[m].idea}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative &ldquo;rows touched&rdquo;, log-scale bars. Real planners use full cost
            models.
          </p>
        </div>
      }
    >
      <p>
        Change the table sizes and the two helpers, and see which method needs the least work.
        PostgreSQL&apos;s docs describe the three: in a nested loop &ldquo;the right relation is
        scanned once for every row found in the left relation&rdquo;; in a hash join it&apos;s
        &ldquo;first scanned and loaded into a hash table&rdquo;; in a merge join &ldquo;each
        relation is sorted on the join attributes before the join starts&rdquo;.
      </p>
      <p>
        SQL Server sums up when nested loops shine: when &ldquo;the outer input is small and the
        inner input is preindexed and large&rdquo;. Without that index, a nested loop over big
        tables is a disaster.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When the hash table doesn't fit ------------------------------------------------------------- */

export function Memory() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the hash table doesn't fit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`Hash Join
  ->  Seq Scan on orders o
  ->  Hash
        Buckets: 262144  Batches: 8  Memory Usage: 8193kB
        -- Batches > 1: it spilled to temporary files`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">PostgreSQL</p>
              <p className="text-muted">
                A hash table may use work_mem (default 4 MB) × hash_mem_multiplier (default 2.0)
                before spilling to temporary disk files.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">MySQL and SQL Server</p>
              <p className="text-muted">
                MySQL added hash joins in 8.0.18 and dropped block nested loops in 8.0.20. SQL
                Server also has an adaptive join (2017+) that chooses at run time.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A hash join is fast as long as its lookup table fits in memory. When it doesn&apos;t, the
        database splits the work into batches and writes them to temporary files, which is much
        slower. EXPLAIN ANALYZE shows it as &ldquo;Batches&rdquo; above 1.
      </p>
      <p>
        Raising work_mem helps, carefully: the docs warn total memory &ldquo;could be many times the
        value of work_mem&rdquo;, because every sort and hash in every running query can use that
        much.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which table first? -------------------------------------------------------------------------- */

const COUNT: [number, string][] = [
  [2, "2"],
  [4, "24"],
  [6, "720"],
  [8, "40,320"],
  [12, "479 million"],
];

export function JoinOrder() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Which table first?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px]">
            Orders in which n tables can be joined left to right (n!):
          </p>
          {COUNT.map(([n, c], i) => (
            <div key={n} className="grid grid-cols-[5rem_1fr_6rem] items-center gap-2 text-xs">
              <span>{n} tables</span>
              <div className="bg-surface-2 h-2.5 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((i + 1) / COUNT.length) * 100}%` }}
                  transition={{ delay: 0.08 * i }}
                  className="bg-viz-compute/60 h-full rounded-full"
                />
              </div>
              <span className="text-right font-mono">{c}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        With several tables, the planner also chooses the order of joins, and the number of choices
        explodes. PostgreSQL&apos;s docs say the number of possible plans &ldquo;grows
        exponentially&rdquo; with the number of joins.
      </p>
      <p>
        So beyond a point it stops searching exhaustively: at 12 or more tables in FROM, PostgreSQL
        switches to a genetic optimiser that finds a reasonable, not necessarily best, plan.
        Settings like join_collapse_limit (default 8) bound the search; setting it to 1 makes
        PostgreSQL keep the join order you wrote.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Pick the join ------------------------------------------------------------------------------- */

export function PickJoin() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the join"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-join"
            prompt="Which join method suits each situation best?"
            categories={[
              { id: "nested", label: "Nested loop" },
              { id: "hash", label: "Hash join" },
              { id: "merge", label: "Merge join" },
            ]}
            items={[
              {
                id: "few",
                label: "5 customers, and orders has an index on customer_id",
                category: "nested",
                why: "Five quick index lookups.",
              },
              {
                id: "range",
                label: "Join on a range: o.created_at BETWEEN p.start AND p.end",
                category: "nested",
                why: "Hash joins need an equality condition.",
              },
              {
                id: "big",
                label: "Two large, unsorted tables joined on equal ids",
                category: "hash",
                why: "One pass to build, one to probe.",
              },
              {
                id: "report",
                label: "A report joining all orders to all customers, no useful index",
                category: "hash",
                why: "Big inputs, equality, nothing pre-sorted.",
              },
              {
                id: "sorted",
                label: "Both inputs come out of indexes already sorted by the key",
                category: "merge",
                why: "No sorting needed: just walk them together.",
              },
              {
                id: "ordered",
                label: "A large join whose result must also be ordered by the join key",
                category: "merge",
                why: "The merge produces rows in key order for free.",
              },
            ]}
            explanation="Few outer rows with an index: nested loop. Big unsorted equality joins: hash. Pre-sorted inputs: merge."
          />
        </div>
      }
    >
      <p>Think seating plans.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Nested loop", "Small outer side, indexed inner side."],
  ["Hash join", "Big equality joins; needs memory."],
  ["Merge join", "Inputs sorted, or output must be."],
  ["Watch for spills", "Batches > 1 in EXPLAIN ANALYZE."],
  ["Join order explodes", "Planners search smartly, not exhaustively."],
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
      <p>Next: the numbers the planner relies on, and what happens when they&apos;re wrong.</p>
    </StepLayout>
  );
}
