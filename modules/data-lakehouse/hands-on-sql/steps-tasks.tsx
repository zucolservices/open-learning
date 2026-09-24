"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { SqlBox } from "./ui";
import { Insight, Snippets, useTaskSql } from "./steps-data";

/* 3 ─ Prove the skipping --------------------------------------------------------------------------- */

const CANDIDATES = `-- Which row groups could hold 20 March?
SELECT 'sorted' AS file, count(*) AS row_groups_to_read
FROM parquet_metadata('orders_sorted.parquet')
WHERE path_in_schema = 'order_date'
  AND stats_min <= '2026-03-20' AND stats_max >= '2026-03-20'
UNION ALL
SELECT 'random', count(*)
FROM parquet_metadata('orders_random.parquet')
WHERE path_in_schema = 'order_date'
  AND stats_min <= '2026-03-20' AND stats_max >= '2026-03-20';`;

const timed = (f: string) =>
  `SELECT count(*) AS orders, round(sum(amount)) AS revenue\nFROM '${f}'\nWHERE order_date = DATE '2026-03-20';`;

export function ProveSkipping() {
  const { sql, setSql, seen, markSeen } = useTaskSql("prove", CANDIDATES);
  const [times, setTimes] = useState<{ sorted?: number; random?: number }>({});
  const max = Math.max(times.sorted ?? 0, times.random ?? 0, 1);
  return (
    <StepLayout
      eyebrow="Task 2"
      title="Prove the skipping"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Snippets
            items={[
              ["Count candidate row groups", CANDIDATES],
              ["Time it: sorted file", timed("orders_sorted.parquet")],
              ["Time it: random file", timed("orders_random.parquet")],
            ]}
            onPick={setSql}
          />
          <SqlBox
            value={sql}
            rows={9}
            onChange={setSql}
            onResult={(r) => {
              if (r.columns.includes("row_groups_to_read")) markSeen("candidates");
              if (r.columns.includes("revenue")) {
                if (sql.includes("orders_sorted")) setTimes((t) => ({ ...t, sorted: r.ms }));
                if (sql.includes("orders_random")) setTimes((t) => ({ ...t, random: r.ms }));
              }
            }}
          />
          {(times.sorted !== undefined || times.random !== undefined) && (
            <div className="border-line bg-surface grid gap-1.5 rounded-xl border p-3">
              <p className="text-muted text-[11px]">Your timings (lower is better)</p>
              {(["sorted", "random"] as const).map((k) => (
                <div
                  key={k}
                  className="grid grid-cols-[4rem_1fr_4.5rem] items-center gap-2 text-xs"
                >
                  <span className="text-muted">{k}</span>
                  <div className="bg-surface-2 h-3 rounded">
                    <motion.div
                      initial={false}
                      animate={{ width: `${((times[k] ?? 0) / max) * 100}%` }}
                      className="bg-viz-compute h-full rounded"
                    />
                  </div>
                  <span className="text-right font-mono">
                    {times[k] !== undefined ? `${times[k]!.toFixed(1)} ms` : "—"}
                  </span>
                </div>
              ))}
              <p className="text-subtle text-[10px]">
                Run each a few times: the first run of anything is slower. Differences are small
                here because the files sit in memory.
              </p>
            </div>
          )}
          <Insight show={!!seen.candidates}>
            One row group out of ten for the sorted file, all ten for the random one. Same data,
            same query: sorting decides how much an engine can skip.
          </Insight>
        </div>
      }
    >
      <p>
        When a query filters on a date, DuckDB compares the date with each row group&apos;s min/max{" "}
        <em>before</em> reading it, and skips those that can&apos;t match.
      </p>
      <p>
        First, count the row groups that could hold 20 March in each file, straight from the
        metadata. Then run the real query on both files and compare the times.
      </p>
      <p className="text-muted text-sm">
        Here the files are in memory, so skipping saves milliseconds. On object storage, every
        skipped row group is a network read you don&apos;t pay for.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------------------- */

export function SkipCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What can the engine skip?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="skip-random"
            prompt="The shuffled file has 10 row groups. For WHERE order_date = DATE '2026-03-20', how many can DuckDB skip using min/max statistics alone?"
            options={[
              {
                id: "none",
                label: "None",
                correct: true,
                feedback:
                  "Right. Every row group's range runs from 1 January to 31 December, so every one might contain 20 March.",
              },
              {
                id: "one",
                label: "One",
                feedback: "That's the number it has to read in the sorted file.",
              },
              {
                id: "nine",
                label: "Nine",
                feedback: "That's how many it skips in the sorted file, not the shuffled one.",
              },
              {
                id: "all",
                label: "All ten, because there are only 2,740 matching rows",
                feedback:
                  "The engine can't know which row groups hold them without statistics that rule groups out.",
              },
            ]}
            explanation="Statistics only help when similar values sit together. That's why lakehouses sort, cluster and Z-order their files."
          />
        </div>
      }
    >
      <p>Use what you saw in the metadata.</p>
    </StepLayout>
  );
}

/* 5 ─ Only the columns you need ------------------------------------------------------------------- */

const SIZES = (f: string) =>
  `-- Compressed bytes per column\nSELECT path_in_schema AS column_name,\n       round(sum(total_compressed_size) / 1e6, 2) AS mb\nFROM parquet_metadata('${f}')\nGROUP BY column_name\nORDER BY mb DESC;`;

const EXPLAIN = `EXPLAIN\nSELECT sum(amount)\nFROM 'orders_sorted.parquet'\nWHERE order_date = DATE '2026-03-20';`;

export function OnlyColumns() {
  const { sql, setSql, seen, markSeen } = useTaskSql("columns", SIZES("orders_sorted.parquet"));
  return (
    <StepLayout
      eyebrow="Task 3"
      title="Only the columns you need"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Snippets
            items={[
              ["Column sizes: sorted", SIZES("orders_sorted.parquet")],
              ["Column sizes: random", SIZES("orders_random.parquet")],
              ["EXPLAIN a query", EXPLAIN],
            ]}
            onPick={setSql}
          />
          <SqlBox
            value={sql}
            rows={7}
            onChange={setSql}
            onResult={(r) => {
              if (r.columns.includes("mb")) markSeen("sizes");
              if (r.columns.includes("explain_value")) markSeen("explain");
            }}
          />
          <Insight show={!!seen.sizes}>
            The <code>notes</code> column is almost half the file. A query that doesn&apos;t mention
            it never reads those bytes. Compare <code>order_date</code> in the two files too:
            sorted, it compresses to almost nothing.
          </Insight>
          <Insight show={!!seen.explain}>
            Find the <code>PARQUET_SCAN</code> box. <code>Projections</code> lists the only column
            it reads for the answer; <code>Filters</code> shows the date check happening inside the
            scan, where row groups can be skipped.
          </Insight>
        </div>
      }
    >
      <p>
        Because Parquet stores each column separately, an engine reads only the columns a query
        uses. That&apos;s <Term id="projection-pushdown">projection pushdown</Term>; pushing the
        filter into the scan is <Term id="predicate-pushdown">predicate pushdown</Term>.
      </p>
      <p>
        See how big each column is, then ask DuckDB for its <Term id="query-plan">plan</Term> with{" "}
        <code>EXPLAIN</code> and find both pushdowns in it.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: reading the plan ---------------------------------------------------------------- */

const PLAN_TEXT = `┌───────────────────────────┐
│       PARQUET_SCAN        │
│    Projections: amount    │
│          Filters:         │
│  order_date='2026-03-20'  │
│       ~200,000 rows       │
└───────────────────────────┘`;

export function PlanCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Read the scan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Code className="w-fit">{PLAN_TEXT}</Code>
          <ChoiceCheckpoint
            id="read-scan"
            prompt="What does the Filters line inside PARQUET_SCAN tell you?"
            options={[
              {
                id: "inside",
                label:
                  "The date check happens while scanning, so row groups whose stats rule it out are skipped",
                correct: true,
                feedback:
                  "Right. That's predicate pushdown, and it's what makes min/max statistics useful.",
              },
              {
                id: "after",
                label: "All rows are read first, then filtered",
                feedback: "Then the filter would sit in a separate FILTER step above the scan.",
              },
              {
                id: "exact",
                label: "Exactly 200,000 rows match",
                feedback:
                  "~200,000 is the planner's estimate before running. The real answer is 2,740.",
              },
              {
                id: "cols",
                label: "Only order_date is read",
                feedback:
                  "Projections lists amount, the column the query returns; the filter column is used by the scan itself.",
              },
            ]}
            explanation="When a query is slow, look at the scan first: are the filters pushed into it, and does it read only the columns it needs?"
          />
        </div>
      }
    >
      <p>Here&apos;s the key part of the plan you just produced.</p>
    </StepLayout>
  );
}

/* 7 ─ Playground ---------------------------------------------------------------------------------- */

const PLAY: [string, string][] = [
  ["Summarise every column", "SUMMARIZE SELECT * FROM 'orders_sorted.parquet';"],
  ["File schema", "SELECT name, type FROM parquet_schema('orders_sorted.parquet');"],
  [
    "Busiest weekday",
    "SELECT dayname(order_date) AS weekday, count(*) AS orders\nFROM 'orders_sorted.parquet'\nGROUP BY weekday\nORDER BY orders DESC;",
  ],
  [
    "Top customers",
    "SELECT customer_id, count(*) AS orders, round(sum(amount)) AS spent\nFROM 'orders_sorted.parquet'\nGROUP BY customer_id\nORDER BY spent DESC\nLIMIT 10;",
  ],
  [
    "Running total (window)",
    "SELECT order_date, round(sum(amount)) AS revenue,\n       round(sum(sum(amount)) OVER (ORDER BY order_date)) AS running_total\nFROM 'orders_sorted.parquet'\nWHERE order_date < DATE '2026-02-01'\nGROUP BY order_date\nORDER BY order_date;",
  ],
  [
    "Write your own Parquet",
    "COPY (\n  SELECT * FROM 'orders_random.parquet' ORDER BY customer_id\n) TO 'by_customer.parquet' (FORMAT parquet);\n\nSELECT row_group_id, stats_min, stats_max\nFROM parquet_metadata('by_customer.parquet')\nWHERE path_in_schema = 'customer_id';",
  ],
];

export function Playground() {
  const { sql, setSql } = useTaskSql("play", PLAY[0][1]);
  return (
    <StepLayout
      eyebrow="Free play"
      title="Your turn"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Snippets items={PLAY} onPick={setSql} />
          <SqlBox value={sql} rows={8} onChange={setSql} />
        </div>
      }
    >
      <p>
        The sandbox is yours. Start from a snippet or write your own SQL: aggregates, window
        functions, even writing a new Parquet file sorted a different way.
      </p>
      <p className="text-muted text-sm">
        Everything lives in this tab&apos;s memory and disappears when you close it. Nothing you do
        here can break anything.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Metadata is readable",
    "parquet_metadata() shows row groups and min/max stats: the same facts engines use to skip.",
  ],
  [
    "Sorting decides skipping",
    "Identical rows: one row group to read when sorted, all of them when shuffled.",
  ],
  [
    "Columns are separate",
    "A query reads only the columns it names. Wide text columns cost nothing if you don't select them.",
  ],
  [
    "EXPLAIN tells the truth",
    "Look for Projections and Filters in the scan to confirm both pushdowns.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You&apos;ve now seen with your own queries what the earlier modules described. The same SQL
        works in DuckDB on a laptop against Parquet, Iceberg or Delta tables in real storage.
      </p>
      <p>Next: how one copy of lakehouse data serves dashboards, machine learning and AI.</p>
    </StepLayout>
  );
}
