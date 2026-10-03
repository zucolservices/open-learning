"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NODES, SQL } from "./model";
import type { QpState } from "./state";

/* 1 ─ What, not how ------------------------------------------------------------------------------- */

export function WhatNotHow() {
  return (
    <StepLayout
      eyebrow="Story"
      title="What, not how"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">You order</p>
            <p className="text-sm font-semibold">
              &ldquo;Two masala dosas and a filter coffee, please.&rdquo;
            </p>
          </div>
          <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">The kitchen decides</p>
            <p className="text-sm">
              Which cook, which pan, batter first or coffee first, whether to make both dosas
              together.
            </p>
          </div>
          <Code>{SQL}</Code>
        </div>
      }
    >
      <p>
        At a restaurant you say what you want, not how to cook it. SQL works the same way. As SQL
        Server&apos;s documentation puts it, a SELECT statement &ldquo;doesn&apos;t state the exact
        steps that the database server should use to retrieve the requested data.&rdquo;
      </p>
      <p>
        The planner builds those steps: a <Term id="query-plan">query plan</Term>, a tree of
        operations. The command <Term id="explain">EXPLAIN</Term> shows you the plan it chose, which
        is the single most useful tool for understanding a slow query.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Read a plan ⭐ ------------------------------------------------------------------------------ */

export function ReadPlan() {
  const [s, set] = useSceneState<QpState>();
  const active = NODES.find((n) => n.id === s.node) ?? NODES[0];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Read a plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<"est" | "analyze">
              size="sm"
              value={s.analyze ? "analyze" : "est"}
              onChange={(v) => set({ analyze: v === "analyze" })}
              options={[
                ["est", "EXPLAIN"],
                ["analyze", "EXPLAIN ANALYZE"],
              ]}
            />
          </div>
          <div className="border-line bg-surface-2 overflow-x-auto rounded-xl border px-2 py-2">
            {NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => set({ node: n.id })}
                className={cn(
                  "block w-full rounded px-2 py-1 text-left font-mono text-[10px] whitespace-pre sm:text-[11px]",
                  s.node === n.id ? "bg-accent-soft ring-accent ring-1" : "hover:bg-surface",
                )}
                style={{ paddingLeft: 8 + n.depth * 16 }}
              >
                {n.line}
                {s.analyze && <span className="text-good"> {n.actual}</span>}
                {n.detail && (
                  <span className="text-muted block" style={{ paddingLeft: 28 }}>
                    {n.detail}
                  </span>
                )}
              </button>
            ))}
            {s.analyze && (
              <p className="text-muted px-2 pt-1 font-mono text-[10px]">
                Buffers: shared hit=1188 read=32{"\n"}Execution Time: 18.4 ms
              </p>
            )}
          </div>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3 text-sm"
          >
            {active.explain}
          </motion.div>
          <p className="text-subtle text-[10px]">
            Illustrative plan and numbers, in PostgreSQL 18&apos;s format.
          </p>
        </div>
      }
    >
      <p>
        Click each line of the plan for the query on the previous step. Read it from the most
        indented lines upwards: the leaves fetch rows, and each node passes its rows to the one
        above.
      </p>
      <p>
        Each node shows the planner&apos;s estimates: start-up cost, total cost, rows it will
        produce and their width in bytes. Switch to EXPLAIN ANALYZE to run the query for real and
        see actual times and row counts beside them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Estimates and reality ----------------------------------------------------------------------- */

export function Costs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Estimates and reality"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)

  345 pages × seq_page_cost 1.0   = 345
  10,000 rows × cpu_tuple_cost 0.01 = 100
                                     ---
  total cost                        445`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good/40 bg-good/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">estimated rows=1000, actual 1012</p>
              <p className="text-muted">Close: the planner understood the data.</p>
            </div>
            <div className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">estimated rows=10, actual 480,000</p>
              <p className="text-muted">
                Way off: the plan was chosen for a different world (module 12).
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Costs are in made-up units, set by convention so reading one page sequentially costs 1.0.
        They&apos;re for comparing plans, not predicting milliseconds. The example is
        PostgreSQL&apos;s own, from its &ldquo;Using EXPLAIN&rdquo; chapter.
      </p>
      <p>
        With ANALYZE, compare estimates with reality. The docs: &ldquo;The thing that&apos;s usually
        most important to look for is whether the estimated row counts are reasonably close to
        reality.&rdquo; One caution: EXPLAIN ANALYZE really runs the statement, so wrap an UPDATE or
        DELETE in BEGIN and ROLLBACK.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Scans and plan caching ---------------------------------------------------------------------- */

const SCANS: [string, string][] = [
  ["Seq Scan", "Read every page of the table, in order."],
  ["Index Scan", "Walk the index, fetching each matching row from the table."],
  ["Index Only Scan", "Answer from the index alone, without visiting the table."],
  [
    "Bitmap Index + Bitmap Heap Scan",
    "Collect matching row locations from the index, sort them into physical order, then read the table page by page.",
  ],
];

export function ScanTypes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Scans and plan caching"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SCANS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="font-mono text-xs font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        These four are the leaves of almost every PostgreSQL plan. Other engines have their own
        names: MySQL shows plans with EXPLAIN FORMAT=TREE and EXPLAIN ANALYZE; SQL Server&apos;s
        Query Store keeps a history of plans and is on by default for new databases since SQL Server
        2022.
      </p>
      <p>
        Planning takes time too, so prepared statements can reuse a plan. PostgreSQL runs the
        &ldquo;first five executions&rdquo; with custom plans for the actual values, then switches
        to a generic plan if it isn&apos;t much worse. Settings like enable_seqscan exist, but the
        docs call them &ldquo;a crude method of influencing the query plans&rdquo;; fixing
        statistics is the better cure.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What does the cost mean? -------------------------------------------------------------------- */

export function WhatIsCost() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does the cost mean?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="what-is-cost"
            prompt="In 'Seq Scan on orders (cost=0.00..1150.00 rows=50000 width=24)', what is 1150.00?"
            options={[
              {
                id: "ms",
                label: "The query will take 1,150 milliseconds",
                feedback: "Costs aren't times; actual time only appears with EXPLAIN ANALYZE.",
              },
              {
                id: "pages",
                label: "Exactly 1,150 pages will be read",
                feedback:
                  "Page reads are one part of the cost formula, along with per-row CPU costs.",
              },
              {
                id: "units",
                label:
                  "The planner's estimated total cost, in its own units (one sequential page read = 1.0)",
                correct: true,
                feedback: "Right: a relative number for comparing alternative plans.",
              },
              {
                id: "rows",
                label: "The number of rows in the table",
                feedback: "rows=50000 is the estimate of rows this node will output.",
              },
            ]}
            explanation="Costs compare plans; times come from ANALYZE; rows are estimated output after filters."
          />
        </div>
      }
    >
      <p>A classic source of confusion.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["SQL is a request", "The planner decides the steps."],
  ["Plans are trees", "Read from the leaves upwards."],
  ["Costs are relative", "Not milliseconds."],
  ["Compare estimates with actuals", "Big gaps explain bad plans."],
  ["Know the scan types", "Seq, index, index-only, bitmap."],
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
      <p>Next: the join node, up close. Three ways to combine two tables.</p>
    </StepLayout>
  );
}
