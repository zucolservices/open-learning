"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLS, TASKS, fmtMb, fmtN, plan } from "./model";
import type { FilesState } from "./state";

/* 1 ─ A well-run library -------------------------------------------------------------------------- */

export function Library() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A well-run library"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-end justify-center gap-2">
            {["2023", "2024", "2025", "2026"].map((y, i) => (
              <div key={y} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex gap-0.5 rounded-md border p-1.5",
                    i === 3 ? "border-accent bg-accent-soft" : "border-line opacity-50",
                  )}
                >
                  {Array.from({ length: 5 }, (_, k) => (
                    <span
                      key={k}
                      className={cn("h-10 w-2 rounded-sm", i === 3 ? "bg-viz-data" : "bg-viz-idle")}
                    />
                  ))}
                </div>
                <span className="text-muted font-mono text-[10px]">{y}/</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-center text-xs">Want 2026? Walk straight to that aisle.</p>
          <div className="flex flex-wrap justify-center gap-0.5">
            {Array.from({ length: 60 }, (_, k) => (
              <span key={k} className="bg-bad/50 h-3 w-1.5 rounded-[1px]" />
            ))}
          </div>
          <p className="text-muted text-center text-xs">
            The same books torn into loose pages: thousands of things to pick up.
          </p>
        </div>
      }
    >
      <p>
        A library shelves books by year, so finding this year&apos;s books means visiting one aisle.
        And it keeps books whole: a book torn into loose pages would take forever to check out.
      </p>
      <p>
        Files work the same way. Folders per date let Spark skip whole years:{" "}
        <Term id="partition-pruning">partition pruning</Term>. And a few big files beat millions of
        tiny ones: the <Term id="small-files">small files problem</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Plan a write ⭐ ----------------------------------------------------------------------------- */

export function WritePlanner() {
  const [s, set] = useSceneState<FilesState>();
  const p = plan(s.col, s.repart);
  const colName = s.col === "none" ? "" : s.col;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Plan a write"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`events${s.repart && colName ? `.repartition("${colName}")` : ""}   # 100 GB in ${TASKS} partitions
  .write${colName ? `.partitionBy("${colName}")` : ""}.parquet("s3://lake/events/")`}</Code>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-24">partition by</span>
              {COLS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={s.col === c.id}
                  onClick={() => set({ col: c.id })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                    s.col === c.id ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-24">before writing</span>
              <button
                type="button"
                disabled={s.col === "none"}
                aria-pressed={s.repart}
                onClick={() => set({ repart: !s.repart })}
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[11px] disabled:opacity-40",
                  s.repart ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {s.repart ? "✓ " : ""}repartition by that column
              </button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                p.verdict === "good"
                  ? "border-good bg-good/10"
                  : p.verdict === "small"
                    ? "border-bad bg-bad/10"
                    : "border-viz-compute bg-viz-compute/10",
              )}
            >
              <p className="text-muted text-[10px]">WRITE</p>
              <p className="font-mono text-lg font-semibold">{fmtN(p.files)} files</p>
              <p className="text-xs">about {fmtMb(p.avgMb)} each</p>
              <p className="text-muted mt-1 text-[11px]">
                {p.verdict === "small"
                  ? "Small files: slow to list, open and read."
                  : p.verdict === "big"
                    ? "Very large files: fine to read, but few tasks can work on them at once."
                    : "A healthy size."}
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">
                THEN READ … WHERE date = &apos;2026-10-01&apos;
              </p>
              <p className="font-mono text-lg font-semibold">{fmtMb(p.scanMb)} scanned</p>
              <p className="text-xs">
                {fmtN(p.filesRead)} files opened · {fmtN(p.readTasks)} read tasks
              </p>
              <p className="text-muted mt-1 text-[11px]">
                {p.pruned
                  ? "Only the date=2026-10-01/ folder is read."
                  : "No date folders, so every file is opened."}
              </p>
            </div>
          </div>
          <motion.div
            layout
            className="border-line bg-surface-2 rounded-lg px-3 py-2 font-mono text-[10px]"
          >
            s3://lake/events/
            {s.col === "none" ? (
              <p className="pl-3">part-00000.parquet … part-00199.parquet</p>
            ) : (
              <>
                <p className="pl-3">
                  {s.col}=
                  {s.col === "date" ? "2026-10-01" : s.col === "country" ? "IN" : "u_000001"}/
                </p>
                <p className="pl-6">part-00000.parquet{s.repart ? "" : ` … part-00199.parquet`}</p>
                <p className="pl-3">…</p>
              </>
            )}
          </motion.div>
          <p className="text-subtle text-[10px]">
            Assumes every task holds rows for every value unless repartitioned; sizes illustrative.
          </p>
        </div>
      }
    >
      <p>
        Every write task writes its own file into every folder it has rows for. With 200 tasks and
        365 dates, that&apos;s up to 73,000 files. Try each column, then repartition by it first, so
        each value&apos;s rows sit in one task.
      </p>
      <p>
        On reading, Spark packs files into read partitions of up to 128 MB, counting each file as 4
        MB extra for the cost of opening it. Partition on columns with few values that you filter
        on, like dates; never on IDs.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reading less -------------------------------------------------------------------------------- */

export function Pruning() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading less"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`spark.read.parquet("s3://lake/events/")
  .where("date = '2026-10-01' AND amount > 100")
  .select("user_id", "amount").explain()

FileScan parquet [user_id, amount, date]
  PartitionFilters: [isnotnull(date), (date = 2026-10-01)]
  PushedFilters:    [IsNotNull(amount), GreaterThan(amount,100)]
  ReadSchema:       struct<user_id:string, amount:double>`}</Code>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["Partition pruning", "Skips whole folders that can't match.", "PartitionFilters"],
              [
                "Predicate pushdown",
                "Parquet and ORC skip blocks whose min/max can't match. Not for CSV or JSON.",
                "PushedFilters",
              ],
              ["Column pruning", "Columnar files read only the columns you use.", "ReadSchema"],
            ].map(([t, d, k]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-accent font-mono text-[10px]">{k}</p>
                <p className="text-muted mt-1">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Simplified output.</p>
        </div>
      }
    >
      <p>
        The fastest data to read is data you skip. The scan node of <code>explain()</code> shows
        three kinds of skipping, each needing something from you: filter on partition columns, use a
        columnar format, and select only what you need.
      </p>
      <p>
        Since Spark 3.0, dynamic partition pruning can also skip folders based on a filter applied
        to the other side of a join.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fixing small files -------------------------------------------------------------------------- */

const FIXES: [string, string, string][] = [
  [
    "Repartition before writing",
    `df.repartition("date").write.partitionBy("date")…`,
    "One task per value, so one file per folder (or a few).",
  ],
  [
    "Coalesce or REBALANCE",
    `SELECT /*+ REBALANCE(date) */ * FROM events`,
    "Fewer, evenly sized output partitions.",
  ],
  [
    "Cap huge files",
    `.option("maxRecordsPerFile", 5_000_000)`,
    "Splits files that would be too big. It doesn't merge small ones.",
  ],
  [
    "Compact the table",
    `OPTIMIZE events   -- Delta Lake`,
    "Table formats rewrite small files into bigger ones: Delta OPTIMIZE and auto compaction, Iceberg's rewrite_data_files, Hudi clustering.",
  ],
];

export function SmallFiles() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fixing small files"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FIXES.map(([t, c, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-accent overflow-x-auto font-mono text-[11px] whitespace-nowrap">
                {c}
              </p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Opening and closing thousands of tiny files is slow, on object stores especially. Databricks
        suggests aiming for files between 16 MB and 1 GB; 128 MB to 1 GB is a common target.
      </p>
      <p>
        Fix it when writing if you can, and let the table format compact what&apos;s left (the
        lakehouse track covers those formats).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Thousands of tiny files --------------------------------------------------------------------- */

export function DailyFiles() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Thousands of tiny files"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="daily-files"
            prompt='A daily job aggregates 10 GB, then writes it with .partitionBy("date", "hour"). Each day produces 4,800 files of about 2 MB. What&apos;s the best fix?'
            options={[
              {
                id: "records",
                label: "Set maxRecordsPerFile",
                feedback: "That only splits big files; these are already tiny.",
              },
              {
                id: "more",
                label: "Raise spark.sql.shuffle.partitions",
                feedback: "More tasks write even more files.",
              },
              {
                id: "repart",
                label: 'repartition("date", "hour") before the write',
                correct: true,
                feedback:
                  "Each hour's rows land in one task, so about 24 files a day of roughly 400 MB.",
              },
              {
                id: "user",
                label: "Also partition by user_id",
                feedback: "High-cardinality partitions make far more, smaller files.",
              },
            ]}
            explanation="Files written = tasks × folders each task touches. Line the tasks up with the partition columns before writing."
          />
        </div>
      }
    >
      <p>Choose the fix.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Files = tasks × folders", "Each task writes into every folder it has rows for."],
  ["Partition on few values", "Dates and regions, which you filter on; not IDs."],
  ["Skip what you can", "Partition filters, pushed filters, needed columns."],
  ["Aim for big files", "Roughly 128 MB to 1 GB."],
  ["Compact the rest", "Table formats rewrite small files."],
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
      <p>Next: the same DataFrame API, running continuously on streams.</p>
    </StepLayout>
  );
}
