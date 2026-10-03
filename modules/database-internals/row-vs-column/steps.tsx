"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLUMNS, QUERIES, cost, type Layout, type Query } from "./model";
import type { RcState } from "./state";

/* 1 ─ Marking exam papers ------------------------------------------------------------------------- */

export function AnswerSheets() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Marking exam papers"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">A stack of papers</p>
            <p className="text-muted mt-1 text-sm">
              Perfect for reading one student&apos;s answers. To mark question 3 for everyone, you
              flip through every paper.
            </p>
          </div>
          <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
            <p className="font-semibold">A pile per question</p>
            <p className="text-muted mt-1 text-sm">
              Question 3&apos;s answers, all together. Marking it is quick; rebuilding one
              student&apos;s paper means visiting every pile.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A teacher can keep exam answers by student or by question. Neither is wrong: it depends on
        which job comes up more often.
      </p>
      <p>
        Databases face the same choice. A <Term id="row-store">row store</Term> keeps each record
        together; a <Term id="column-store">column store</Term> keeps each column together. The
        C-Store paper (2005) put it as &ldquo;write-optimized&rdquo; systems versus a
        &ldquo;read-optimized&rdquo; design. The Lakehouse track shows the same idea in Parquet
        files.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Two queries, two layouts ⭐ ----------------------------------------------------------------- */

export function TwoLayouts() {
  const [s, set] = useSceneState<RcState>();
  const q = QUERIES[s.query];
  const c = cost(s.layout, s.query);
  const maxMb = 200;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Two queries, two layouts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented<Query>
              size="sm"
              value={s.query}
              onChange={(query) => set({ query })}
              options={[
                ["checkout", "Show one order"],
                ["report", "Monthly revenue"],
              ]}
            />
            <Segmented<Layout>
              size="sm"
              value={s.layout}
              onChange={(layout) => set({ layout })}
              options={[
                ["row", "Row store"],
                ["column", "Column store"],
              ]}
            />
          </div>
          <Code>{q.sql}</Code>
          <div className="border-line bg-surface rounded-xl border p-3">
            {s.layout === "row" ? (
              <div className="flex flex-col gap-1">
                {Array.from({ length: 5 }, (_, r) => (
                  <div key={r} className="flex gap-0.5">
                    {COLUMNS.map((col) => {
                      const hit = s.query === "report" || r === 2;
                      return (
                        <motion.div
                          key={col}
                          animate={{ opacity: hit ? 1 : 0.25 }}
                          className={cn(
                            "h-4 flex-1 rounded-sm",
                            hit ? "bg-accent/60" : "bg-surface-2",
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
                <p className="text-muted mt-1 text-[10px]">
                  Each line is a row stored together; highlighted cells are read.
                </p>
              </div>
            ) : (
              <div className="flex gap-1.5">
                {COLUMNS.map((col) => {
                  const hit = q.needs.includes(col);
                  return (
                    <div key={col} className="flex flex-1 flex-col items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, r) => (
                        <motion.div
                          key={r}
                          animate={{ opacity: hit && (s.query === "report" || r === 2) ? 1 : 0.25 }}
                          className={cn(
                            "h-4 w-full rounded-sm",
                            hit && (s.query === "report" || r === 2)
                              ? "bg-accent/60"
                              : "bg-surface-2",
                          )}
                        />
                      ))}
                      <span className="text-muted mt-0.5 font-mono text-[8px]">{col}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Data read</p>
              <p className="font-mono text-sm font-semibold">
                {c.mb < 1 ? `${Math.round(c.mb * 1000)} kB` : `${c.mb} MB`}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Separate reads</p>
              <p className="font-mono text-sm font-semibold">{c.reads.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="bg-surface-2 h-2 overflow-hidden rounded-full">
            <motion.div
              animate={{ width: `${Math.max(1, (c.mb / maxMb) * 100)}%` }}
              className="bg-accent/70 h-full rounded-full"
            />
          </div>
          <p className="text-sm">{c.note}</p>
          <p className="text-subtle text-[10px]">
            Illustrative: one million orders of about 200 bytes each.
          </p>
        </div>
      }
    >
      <p>
        Two jobs on the same orders table: the checkout page shows one order, the finance report
        adds up a million. Try both queries on both layouts.
      </p>
      <p>
        Microsoft&apos;s guidance for SQL Server puts the rule simply: row storage for transactional
        work that does &ldquo;mostly table seeks&rdquo;, column storage for &ldquo;analytic queries
        that scan large amounts of data&rdquo;. That split is called <Term id="oltp">OLTP</Term>{" "}
        versus analytics (OLAP).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Columns compress ---------------------------------------------------------------------------- */

export function Compression() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Columns compress"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`city column:   Pune Pune Pune Pune Delhi Delhi Mumbai Mumbai Mumbai
dictionary:    0=Pune 1=Delhi 2=Mumbai
encoded:       0 0 0 0 1 1 2 2 2
run-length:    0×4  1×2  2×3`}</Code>
          <Code>{`status column: paid paid paid paid paid refunded paid paid …
run-length:    paid×5  refunded×1  paid×…`}</Code>
        </div>
      }
    >
      <p>
        A column holds one kind of value, and neighbours are often the same. That makes columns easy
        to compress: replace repeated text with small numbers (dictionary encoding), then replace
        runs with a count (run-length encoding). Parquet files use both.
      </p>
      <p>
        Smaller data means fewer pages to read. Column engines also process a whole batch of values
        at once, which DuckDB calls a &ldquo;columnar-vectorized query execution engine&rdquo;,
        instead of one row at a time. Vendors quote compression &ldquo;up to&rdquo; ten times; your
        data decides.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who stores what ----------------------------------------------------------------------------- */

const STORES: [string, string][] = [
  [
    "Row stores",
    "PostgreSQL, MySQL (InnoDB), SQL Server tables, Oracle tables, SQLite: built for many small reads and writes of whole records.",
  ],
  [
    "Column stores",
    "ClickHouse (“a column-oriented SQL database management system (DBMS) for online analytical processing”), DuckDB, Amazon Redshift, Google BigQuery, Vertica (which commercialised the C-Store design).",
  ],
  [
    "Both at once",
    "SQL Server columnstore indexes on transactional tables; Oracle Database In-Memory keeps “columnar and row formats simultaneously”; MySQL HeatWave adds an in-memory analytics accelerator; PostgreSQL extensions add column storage.",
  ],
];

export function WhoStores() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Who stores what"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {STORES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
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
        Most companies run both: a row store behind the app, and a column store (or a lakehouse of
        Parquet files) for reports, copied across regularly. The Streaming Data and Lakehouse tracks
        cover how data gets from one to the other.
      </p>
      <p>
        Hybrid systems try to do both in one place. They help, but the underlying trade-off
        doesn&apos;t go away: one layout is always better for a given job.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Row or column? ------------------------------------------------------------------------------ */

export function RowOrColumn() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Row or column?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="row-or-column"
            prompt="Which layout suits each workload best?"
            categories={[
              { id: "row", label: "Row store" },
              { id: "column", label: "Column store" },
            ]}
            items={[
              {
                id: "checkout",
                label: "Placing and updating orders as customers shop",
                category: "row",
                why: "Small writes of whole records, many at once.",
              },
              {
                id: "profile",
                label: "Loading one customer's profile page",
                category: "row",
                why: "Every column of one record.",
              },
              {
                id: "bank",
                label: "Debiting and crediting accounts in a payment",
                category: "row",
                why: "Transactional updates to a few rows.",
              },
              {
                id: "revenue",
                label: "Revenue by city for the last three years",
                category: "column",
                why: "Two or three columns over millions of rows.",
              },
              {
                id: "dashboard",
                label: "A dashboard averaging delivery times per week",
                category: "column",
                why: "Scans and aggregates a few columns.",
              },
              {
                id: "logs",
                label: "Counting error events across a billion log lines",
                category: "column",
                why: "Huge scans of one or two columns, which compress well.",
              },
            ]}
            explanation="Whole records, small and often: rows. A few columns across many records: columns."
          />
        </div>
      }
    >
      <p>Which job comes up most?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Rows together", "Great for one record at a time."],
  ["Columns together", "Great for a few columns over many rows."],
  ["Columns compress", "Dictionary and run-length encoding."],
  ["OLTP vs analytics", "Different workloads, different layouts."],
  ["Most firms use both", "And copy data between them."],
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
      <p>Next: keeping the right pages in memory, the job of the buffer pool.</p>
    </StepLayout>
  );
}
