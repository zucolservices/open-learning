"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Term } from "@/toolkit/glossary/term";
import { FILES, ROWS, fmtMB, type QueryResult } from "./duck";
import { EngineBadge, SqlBox, useDuck } from "./ui";
import type { SqlState } from "./state";

/** Snippet chips that load a query into the editor. */
export function Snippets({
  items,
  onPick,
}: {
  items: [string, string][];
  onPick(sql: string): void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([label, sql]) => (
        <button
          key={label}
          type="button"
          onClick={() => onPick(sql)}
          className="border-line hover:bg-surface-2 rounded-full border px-2.5 py-1 text-xs"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** Scene-state-backed editor text for one task. */
export function useTaskSql(id: string, initial: string) {
  const [s, set] = useSceneState<SqlState>();
  const sql = s.sql[id] ?? initial;
  const setSql = (v: string) => set({ sql: { ...s.sql, [id]: v } });
  const markSeen = (key: string) => {
    if (!s.seen[key]) set({ seen: { ...s.seen, [key]: true } });
  };
  return { sql, setSql, seen: s.seen, markSeen };
}

export function Insight({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-good/40 bg-good/10 rounded-xl border px-4 py-3 text-sm"
    >
      {children}
    </motion.div>
  );
}

/* 1 ─ A real engine in this page ------------------------------------------------------------------- */

const MEET: [string, string][] = [
  ["Peek at the data", "SELECT *\nFROM 'orders_sorted.parquet'\nLIMIT 10;"],
  ["Count the rows", "SELECT count(*) AS orders\nFROM 'orders_sorted.parquet';"],
  [
    "Revenue by city",
    "SELECT city, count(*) AS orders, round(sum(amount)) AS revenue\nFROM 'orders_sorted.parquet'\nGROUP BY city\nORDER BY revenue DESC;",
  ],
];

export function MeetData() {
  const { sql, setSql, seen, markSeen } = useTaskSql("meet", MEET[0][1]);
  const { status } = useDuck();
  return (
    <StepLayout
      eyebrow="Hands on"
      title="A real engine, inside this page"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <EngineBadge />
          {status.kind === "ready" && (
            <div className="grid grid-cols-2 gap-2">
              {FILES.map((f) => (
                <div key={f} className="border-line bg-surface rounded-xl border px-3 py-2">
                  <p className="font-mono text-xs">{f}</p>
                  <p className="text-muted text-[11px]">
                    {ROWS.toLocaleString("en-IN")} orders · 10 row groups ·{" "}
                    {fmtMB(status.duck.sizes[f])}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Snippets items={MEET} onPick={setSql} />
          <SqlBox value={sql} onChange={setSql} onResult={() => markSeen("meet")} />
          <Insight show={!!seen.meet}>
            That query ran on your own computer. DuckDB found the file, read its footer, and scanned
            only what it needed. Try the other snippets, or change the SQL.
          </Insight>
        </div>
      }
    >
      <p>
        So far you&apos;ve watched diagrams. Now you get the real thing:{" "}
        <Term id="duckdb">DuckDB</Term>, compiled to WebAssembly and running in this browser tab.
        Your queries never leave your machine.
      </p>
      <p>
        When it starts, it creates a year of fake Brewline orders and writes them as two{" "}
        <Term id="parquet">Parquet</Term> files with identical rows. One is sorted by date; the
        other is shuffled. Keep that difference in mind.
      </p>
      <p className="text-muted text-sm">
        Querying a file is as simple as putting its name in quotes after <code>FROM</code>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Look inside a Parquet file ------------------------------------------------------------------- */

const meta = (f: string) =>
  `SELECT row_group_id, row_group_num_rows AS num_rows,\n       stats_min AS min_date, stats_max AS max_date\nFROM parquet_metadata('${f}')\nWHERE path_in_schema = 'order_date'\nORDER BY row_group_id;`;

function dayOfYear(d: string) {
  const t = Date.parse(d + "T00:00:00Z");
  return (t - Date.parse("2026-01-01T00:00:00Z")) / 86_400_000;
}

function RangeChart({ r }: { r: QueryResult }) {
  const iMin = r.columns.indexOf("min_date");
  const iMax = r.columns.indexOf("max_date");
  if (iMin < 0 || iMax < 0) return null;
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-muted mb-2 text-[11px]">Date range in each row group (Jan → Dec)</p>
      <div className="grid gap-1">
        {r.rows.map((row, i) => {
          const a = dayOfYear(row[iMin]);
          const b = dayOfYear(row[iMax]);
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-subtle w-4 font-mono text-[9px]">{i}</span>
              <div className="bg-surface-2 relative h-3 flex-1 rounded-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((b - a + 1) / 365) * 100}%` }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-viz-data absolute inset-y-0 rounded-sm"
                  style={{ left: `${(a / 365) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function InsideFile() {
  const { sql, setSql, seen, markSeen } = useTaskSql("inside", meta("orders_sorted.parquet"));
  const [last, setLast] = useState<QueryResult | null>(null);
  return (
    <StepLayout
      eyebrow="Task 1"
      title="Look inside a Parquet file"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Snippets
            items={[
              ["Sorted file", meta("orders_sorted.parquet")],
              ["Random file", meta("orders_random.parquet")],
            ]}
            onPick={setSql}
          />
          <SqlBox
            value={sql}
            onChange={setSql}
            onResult={(r) => {
              setLast(r);
              if (sql.includes("orders_random") && r.columns.includes("min_date"))
                markSeen("inside-random");
              if (sql.includes("orders_sorted") && r.columns.includes("min_date"))
                markSeen("inside-sorted");
            }}
          />
          {last && <RangeChart r={last} />}
          <Insight show={!!(seen["inside-random"] && seen["inside-sorted"])}>
            Same rows, very different statistics. In the sorted file each row group covers about
            five weeks. In the shuffled one, every row group spans the whole year, so its min/max
            can&apos;t rule anything out.
          </Insight>
        </div>
      }
    >
      <p>
        Every Parquet file ends with a footer describing its <Term id="row-group">row groups</Term>:
        how many rows each holds and, for every column, <Term id="statistics">statistics</Term> such
        as the minimum and maximum value.
      </p>
      <p>
        DuckDB&apos;s <code>parquet_metadata()</code> function shows you that footer as a table. Run
        it on the sorted file, then on the random file, and compare the date ranges.
      </p>
      <p className="text-muted text-sm">
        DuckDB writes row groups of about 100,000 rows (rounded to a multiple of its 2,048-value
        vectors).
      </p>
    </StepLayout>
  );
}
