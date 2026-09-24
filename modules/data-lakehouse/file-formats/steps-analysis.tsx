"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLUMNS, ORDERS, ROW_BYTES, WIDTH, type Column } from "./data";
import type { FormatsState, QueryId, SplitFormat } from "./state";

/* 3 ─ What a query reads -------------------------------------------------- */

const QUERIES: Record<QueryId, { label: string; sql: string; cols: Column[] }> = {
  sum: { label: "Total revenue", sql: "SELECT SUM(amount) FROM orders", cols: ["amount"] },
  "by-city": {
    label: "Revenue by city",
    sql: "SELECT city, SUM(amount) FROM orders GROUP BY city",
    cols: ["city", "amount"],
  },
  all: { label: "Export everything", sql: "SELECT * FROM orders", cols: [...COLUMNS] },
  append: { label: "Write one new order", sql: "INSERT INTO orders VALUES (88219, …)", cols: [] },
};

export function QueryReads() {
  const [s, set] = useSceneState<FormatsState>();
  const q = QUERIES[s.query];
  const columnar = s.queryLayout === "column";
  const isWrite = s.query === "append";
  const colBytes = q.cols.reduce((n, c) => n + WIDTH[c], 0);
  const share = isWrite ? 0 : columnar ? colBytes / ROW_BYTES : 1;

  return (
    <StepLayout
      eyebrow="Measure it"
      title="How much does each query read?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.queryLayout}
              options={[
                ["row", "Row format (CSV, JSON, Avro)"],
                ["column", "Columnar (Parquet, ORC)"],
              ]}
              onChange={(queryLayout) => set({ queryLayout })}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(QUERIES) as QueryId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ query: id })}
                className={cn(
                  "h-8 rounded-full border px-3 text-xs transition-colors",
                  s.query === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted hover:text-fg",
                )}
              >
                {QUERIES[id].label}
              </button>
            ))}
          </div>
          <pre className="bg-surface-2/60 overflow-x-auto rounded-xl px-4 py-2.5 font-mono text-xs">
            {q.sql}
          </pre>

          <div className="border-line bg-bg/40 overflow-x-auto rounded-2xl border p-3">
            <table className="w-full min-w-[34rem] border-separate border-spacing-0.5 font-mono text-[10px]">
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th
                      key={c}
                      className={cn(
                        "px-1 py-1 text-left font-medium",
                        q.cols.includes(c) ? "text-accent" : "text-subtle",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o, ri) => (
                  <tr key={o.order_id}>
                    {COLUMNS.map((c) => {
                      const read = !isWrite && (columnar ? q.cols.includes(c) : true);
                      return (
                        <td
                          key={c}
                          className={cn(
                            "truncate rounded px-1 py-1 transition-colors duration-500",
                            read ? "bg-viz-compute/35 text-fg" : "bg-surface-2/50 text-subtle",
                          )}
                          style={{ transitionDelay: `${ri * 30}ms` }}
                        >
                          {String(o[c])}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {isWrite && (
                  <tr>
                    {COLUMNS.map((c) => (
                      <td key={c} className="bg-viz-add/40 rounded px-1 py-1">
                        {c === "order_id" ? "88219" : "…"}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AnimatePresence mode="wait">
            {isWrite ? (
              <motion.div
                key={`w-${s.queryLayout}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  columnar
                    ? "border-viz-compute/40 bg-viz-compute/10"
                    : "border-good/40 bg-good/10",
                )}
              >
                {columnar ? (
                  <>
                    <strong>Columnar files are written in batches.</strong> To add one order
                    you&apos;d rewrite every column. So engines buffer many rows and write a whole
                    row group at once. That&apos;s why streams usually use a row format like Avro
                    first.
                  </>
                ) : (
                  <>
                    <strong>Row formats shine here:</strong> append the new order to the end of the
                    file, one record, done. This is why event streams use JSON or Avro.
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4"
              >
                <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded-full">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      share < 0.5 ? "bg-good" : "bg-viz-compute",
                    )}
                    animate={{ width: `${share * 100}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                  />
                </div>
                <p className="w-40 text-right text-sm">
                  reads <strong className="tabular-nums">{Math.round(share * 100)}%</strong> of the
                  file
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>Pick a query, then switch between a row format and a columnar one.</p>
      <p>
        Columnar wins big when a query needs <strong>a few columns</strong> from many rows, which is
        what analytics usually does. When you need every column, it&apos;s a tie.
      </p>
      <p>
        Now try <strong>Write one new order</strong>. The trade-off flips.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Why columns compress better ------------------------------------------ */

const STATUSES: string[] = [
  ...Array<string>(20).fill("paid"),
  ...Array<string>(5).fill("open"),
  ...Array<string>(10).fill("paid"),
  ...Array<string>(2).fill("refund"),
  ...Array<string>(3).fill("paid"),
];
const DICT = ["paid", "open", "refund"];
const RUNS = STATUSES.reduce<{ v: string; n: number }[]>((runs, v) => {
  const last = runs[runs.length - 1];
  if (last && last.v === v) last.n += 1;
  else runs.push({ v, n: 1 });
  return runs;
}, []);

const STAGES = [
  {
    title: "Raw text",
    bytes: STATUSES.reduce((n, v) => n + v.length, 0),
    note: `${STATUSES.length} statuses written out as text: the same word, over and over.`,
  },
  {
    title: "Dictionary encoding",
    bytes: DICT.join("").length + Math.ceil((STATUSES.length * 2) / 8),
    note: "Store each distinct value once (paid=0, open=1, refund=2), then write tiny codes: 2 bits each.",
  },
  {
    title: "Run-length encoding",
    bytes: DICT.join("").length + RUNS.length,
    note: "Long runs of the same code become (code, count) pairs. On sorted or clustered data, runs get very long.",
  },
];

export function Compression() {
  const [s, set] = useSceneState<FormatsState>();
  const stage = Math.min(s.encodeStage, STAGES.length - 1);
  const st = STAGES[stage];
  const code = (v: string) => DICT.indexOf(v);
  const tone = ["bg-good/40", "bg-viz-compute/50", "bg-bad/50"];

  return (
    <StepLayout
      eyebrow="Why columns compress better"
      title="Similar values side by side shrink"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted font-mono text-xs">
              status column, {STATUSES.length} rows · stage {stage + 1}/{STAGES.length}
            </p>
            <div className="flex gap-1">
              <NavBtn
                label="Previous"
                onClick={() => set({ encodeStage: Math.max(0, stage - 1) })}
                disabled={stage === 0}
              >
                <ChevronLeft className="size-4" />
              </NavBtn>
              <NavBtn
                label="Next"
                primary
                onClick={() => set({ encodeStage: Math.min(STAGES.length - 1, stage + 1) })}
                disabled={stage === STAGES.length - 1}
              >
                <ChevronRight className="size-4" />
              </NavBtn>
            </div>
          </div>

          <div className="border-line bg-bg/40 min-h-40 rounded-2xl border p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-wrap gap-1.5 font-mono text-xs"
              >
                {stage === 0 &&
                  STATUSES.map((v, i) => (
                    <span key={i} className={cn("rounded px-2 py-1", tone[code(v)])}>
                      {v}
                    </span>
                  ))}
                {stage === 1 && (
                  <>
                    <div className="mb-2 flex w-full gap-2">
                      {DICT.map((d, i) => (
                        <span key={d} className="border-line-strong rounded border px-2 py-1">
                          {i} = {d}
                        </span>
                      ))}
                    </div>
                    {STATUSES.map((v, i) => (
                      <motion.span
                        key={i}
                        layout
                        className={cn("grid size-7 place-items-center rounded", tone[code(v)])}
                      >
                        {code(v)}
                      </motion.span>
                    ))}
                  </>
                )}
                {stage === 2 && (
                  <>
                    <div className="mb-2 flex w-full gap-2">
                      {DICT.map((d, i) => (
                        <span key={d} className="border-line-strong rounded border px-2 py-1">
                          {i} = {d}
                        </span>
                      ))}
                    </div>
                    {RUNS.map((r, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        className={cn("rounded px-2.5 py-1.5", tone[code(r.v)])}
                      >
                        {code(r.v)} × {r.n}
                      </motion.span>
                    ))}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-semibold">{st.title}</p>
              <p className="text-muted text-sm">{st.note}</p>
            </div>
            <div className="text-right">
              <p className="text-muted text-xs">approx. size</p>
              <motion.p
                key={st.bytes}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-semibold tabular-nums"
              >
                {st.bytes} B
              </motion.p>
            </div>
          </div>
          <div className="bg-surface-2 h-2.5 overflow-hidden rounded-full">
            <motion.div
              className="bg-good h-full rounded-full"
              animate={{ width: `${(st.bytes / STAGES[0].bytes) * 100}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
          </div>
          <p className="text-subtle text-xs">
            Parquet then applies a general-purpose codec (such as Snappy or ZSTD) on top. Tiny
            illustrative numbers; real files hold millions of values, where the savings are huge.
          </p>
        </div>
      }
    >
      <p>
        <Term id="compression">Compression</Term> loves repetition. In a columnar file, a column of
        statuses is just &ldquo;paid, paid, paid, open…&rdquo;, perfect material.
      </p>
      <p>
        Step through two tricks Parquet applies before general compression.{" "}
        <Term id="encoding">Encodings</Term> like these are why columnar files are often several
        times smaller than the same data as CSV.
      </p>
      <p className="text-subtle text-xs">
        In a row format, statuses are scattered between names, cities and amounts, so these tricks
        barely work.
      </p>
    </StepLayout>
  );
}

function NavBtn({
  children,
  label,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  label: string;
  onClick(): void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-full transition disabled:opacity-30",
        primary ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

/* 5 ─ Which format fits? --------------------------------------------------- */

export function WhichFormat() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the right format for the job"
      stage={
        <div className="flex flex-1 items-center">
          <SortCheckpoint
            id="which-format"
            prompt="Sort each Brewline situation into the format that fits best."
            categories={[
              { id: "csv", label: "CSV" },
              { id: "json", label: "JSON" },
              { id: "avro", label: "Avro" },
              { id: "parquet", label: "Parquet" },
            ]}
            items={[
              {
                id: "excel",
                label: "A one-off export finance will open in Excel",
                category: "csv",
                why: "Every spreadsheet opens CSV. For a small hand-off to people, simplicity wins.",
              },
              {
                id: "api",
                label: "The mobile app sending an order to the server",
                category: "json",
                why: "APIs speak JSON: readable, nested, and understood by every language.",
              },
              {
                id: "kafka",
                label: "Order events on a Kafka topic, read by several services",
                category: "avro",
                why: "Compact binary rows with a managed schema that can evolve safely: Avro's home turf.",
              },
              {
                id: "lake",
                label: "Three years of orders for revenue dashboards",
                category: "parquet",
                why: "Analytics reads a few columns over many rows: columnar Parquet reads far less.",
              },
              {
                id: "config",
                label: "A settings file engineers edit by hand",
                category: "json",
                why: "People must read and edit it, so a text format with structure fits.",
              },
              {
                id: "ml",
                label: "A training dataset with 200 columns, of which a model uses 12",
                category: "parquet",
                why: "Reading 12 of 200 columns is exactly what columnar storage is for.",
              },
            ]}
            explanation="ORC fits the Parquet cases too: it's the other big columnar format, most common in Hive-based systems."
          />
        </div>
      }
    >
      <p>No format is best at everything. Match each situation to its natural fit.</p>
    </StepLayout>
  );
}

/* 6 ─ Many workers, one file ------------------------------------------------ */

const SPLIT: Record<SplitFormat, { label: string; splittable: boolean; why: string }> = {
  csv: {
    label: "orders.csv",
    splittable: true,
    why: "Plain text: a worker can jump to any byte and start at the next line break.",
  },
  "csv-gz": {
    label: "orders.csv.gz",
    splittable: false,
    why: "Gzip is one continuous compressed stream. You can't start decoding in the middle, so one worker must read it all.",
  },
  jsonl: {
    label: "orders.jsonl",
    splittable: true,
    why: "JSON Lines has one record per line, so it splits like CSV.",
  },
  avro: {
    label: "orders.avro",
    splittable: true,
    why: "Blocks are separated by sync markers, and each block is compressed on its own.",
  },
  parquet: {
    label: "orders.parquet",
    splittable: true,
    why: "Each row group is compressed on its own, so row groups go to different workers.",
  },
};
const WORKERS = 8;

export function Workers() {
  const [s, set] = useSceneState<FormatsState>();
  const f = SPLIT[s.splitFormat];
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const total = f.splittable ? 1 : WORKERS; // time units to finish

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setT((x) => {
        const next = x + 0.05;
        if (next >= total) setRunning(false);
        return Math.min(next, total);
      });
    }, 60);
    return () => clearInterval(id);
  }, [running, total]);

  return (
    <StepLayout
      eyebrow="Splittable?"
      title="Eight workers, one big file"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(SPLIT) as SplitFormat[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  set({ splitFormat: k });
                  setT(0);
                  setRunning(false);
                }}
                className={cn(
                  "h-8 rounded-full border px-3 font-mono text-xs transition-colors",
                  s.splitFormat === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted hover:text-fg",
                )}
              >
                {SPLIT[k].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (t >= total) setT(0);
                setRunning(true);
              }}
              className="bg-accent text-accent-fg inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium"
            >
              {t >= total ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}
              Process 8 GB
            </button>
            <span className="text-muted text-sm">
              elapsed: <span className="text-fg font-mono tabular-nums">{(t * 1).toFixed(1)}</span>{" "}
              units
            </span>
          </div>

          <div className="grid gap-1.5">
            {Array.from({ length: WORKERS }, (_, w) => {
              const busy = f.splittable || w === 0;
              const progress = busy ? Math.min(1, t / total) : 0;
              return (
                <div key={w} className="flex items-center gap-2 text-xs">
                  <span className="text-muted w-16 font-mono">worker {w + 1}</span>
                  <div className="bg-surface-2 relative h-6 flex-1 overflow-hidden rounded-md">
                    <motion.div
                      className={cn(
                        "h-full rounded-md",
                        busy ? "bg-viz-compute/70" : "bg-transparent",
                      )}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.06, ease: "linear" }}
                    />
                    {!busy && (
                      <span className="text-subtle absolute inset-0 grid place-items-center">
                        idle
                      </span>
                    )}
                    {busy && (
                      <span className="text-fg absolute inset-y-0 left-2 flex items-center font-mono text-[10px]">
                        {f.splittable ? "1 GB" : "all 8 GB"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <motion.p
            key={s.splitFormat}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              f.splittable ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            <strong className={f.splittable ? "text-good" : "text-bad"}>
              {f.splittable ? "Splittable." : "Not splittable."}
            </strong>{" "}
            {f.why}
          </motion.p>
        </div>
      }
    >
      <p>
        Big-data engines speed things up by giving pieces of a file to many workers at once. That
        only works if the file is <Term id="splittable">splittable</Term>.
      </p>
      <p>Try each format. Watch the workers.</p>
      <p className="text-subtle text-xs">
        Formats like Parquet, ORC and Avro compress each block separately, so they stay splittable
        however they&apos;re compressed. Splittable isn&apos;t the same as fast, though: ten
        thousand tiny files are still ten thousand small tasks.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint ------------------------------------------------------------- */

export function GzipCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The slow nightly job"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="gzip-split"
            prompt="A vendor drops one 50 GB file, sales.csv.gz, every night. Spark has 100 workers, but the job crawls and most workers sit idle. Why?"
            options={[
              {
                id: "gzip",
                label:
                  "A gzip file can't be split, so one worker has to decompress and read all 50 GB",
                correct: true,
                feedback:
                  "Right. The fix: ask for many smaller files, a splittable format, or convert it once to Parquet.",
              },
              {
                id: "size",
                label: "50 GB is too big for Spark to handle",
                feedback: "Spark handles far bigger data, as long as it can split the work.",
              },
              {
                id: "csv",
                label: "CSV files can never be read in parallel",
                feedback:
                  "Uncompressed CSV splits fine at line breaks. It's the gzip wrapper that stops splitting.",
              },
              {
                id: "workers",
                label: "It needs more workers",
                feedback: "More idle workers won't help. Only one of them can read a gzip stream.",
              },
            ]}
          />
        </div>
      }
    />
  );
}
