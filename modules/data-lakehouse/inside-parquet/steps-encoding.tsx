"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ParquetState } from "./state";

/* 5 ─ The right encoding per column ---------------------------------------- */

const ENCODINGS = {
  status: {
    title: "Dictionary + run-length (RLE_DICTIONARY)",
    why: "Few distinct values, repeated a lot. Store each value once, then small codes, and shorten runs of the same code.",
    before: ["paid", "paid", "paid", "open", "paid", "paid", "refund", "paid"],
    after: ["dict: 0=paid 1=open 2=refund", "0×3", "1×1", "0×2", "2×1", "0×1"],
  },
  order_id: {
    title: "Delta encoding (DELTA_BINARY_PACKED)",
    why: "Sorted or increasing integers. Store the first value, then only the small differences, bit-packed.",
    before: ["88213", "88214", "88215", "88217", "88218", "88220", "88221", "88222"],
    after: ["first: 88213", "+1", "+1", "+2", "+1", "+2", "+1", "+1"],
  },
  amount: {
    title: "Plain (then compressed)",
    why: "Many different values with no pattern. The writer tries a dictionary but falls back to plain values when it grows too large; the codec does the shrinking.",
    before: ["240", "150", "90", "480", "160", "250", "310", "95"],
    after: ["240", "150", "90", "480", "160", "250", "310", "95"],
  },
} as const;

export function Encodings() {
  const [s, set] = useSceneState<ParquetState>();
  const e = ENCODINGS[s.encodeColumn];
  return (
    <StepLayout
      eyebrow="Encodings"
      title="Each column gets the encoding that suits it"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <Segmented
            size="sm"
            value={s.encodeColumn}
            options={[
              ["status", "status"],
              ["order_id", "order_id"],
              ["amount", "amount"],
            ]}
            onChange={(encodeColumn) => set({ encodeColumn })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.encodeColumn}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              <div>
                <p className="text-muted mb-2 text-xs">Values as written</p>
                <div className="flex flex-wrap gap-1 font-mono text-xs">
                  {e.before.map((v, i) => (
                    <span key={i} className="bg-viz-data/20 rounded px-2 py-1">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-subtle text-center text-lg">↓</p>
              <div>
                <p className="text-muted mb-2 text-xs">Encoded</p>
                <div className="flex flex-wrap gap-1 font-mono text-xs">
                  {e.after.map((v, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "rounded px-2 py-1",
                        i === 0 && s.encodeColumn !== "amount"
                          ? "bg-viz-meta/30"
                          : "bg-viz-compute/25",
                      )}
                    >
                      {v}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="border-line bg-surface rounded-xl border p-4">
                <p className="font-semibold">{e.title}</p>
                <p className="text-muted mt-1 text-sm">{e.why}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Parquet also has encodings for strings (DELTA_BYTE_ARRAY) and floating-point numbers
            (BYTE_STREAM_SPLIT). Writers choose automatically; you rarely set them by hand.
          </p>
        </div>
      }
    >
      <p>
        Because each column chunk holds one kind of value, Parquet can pick an{" "}
        <Term id="encoding">encoding</Term> per column. Look at three columns of Brewline&apos;s
        orders.
      </p>
      <p>Notice the pattern: the more regular the data, the smaller it gets.</p>
    </StepLayout>
  );
}

/* 6 ─ Codecs: speed vs size ------------------------------------------------- */

const CODECS = {
  none: {
    label: "Uncompressed",
    x: 0.94,
    y: 0.06,
    note: "No work, biggest files. Rarely the right choice.",
    defaults: "parquet-java (the Java library's own default)",
  },
  lz4: {
    label: "LZ4_RAW",
    x: 0.9,
    y: 0.3,
    note: "Very fast, moderate shrinking. Good when CPU is the bottleneck.",
    defaults: "",
  },
  snappy: {
    label: "Snappy",
    x: 0.72,
    y: 0.47,
    note: "Very fast, moderate shrinking. The long-time favourite.",
    defaults: "Spark, PyArrow, DuckDB",
  },
  zstd: {
    label: "ZSTD",
    x: 0.58,
    y: 0.78,
    note: "Much better shrinking at good speed, with tunable levels. Increasingly the modern pick.",
    defaults: "Polars",
  },
  gzip: {
    label: "GZIP",
    x: 0.26,
    y: 0.72,
    note: "Good shrinking but slow to write and read. Mostly legacy now.",
    defaults: "",
  },
} as const;

export function Codecs() {
  const [s, set] = useSceneState<ParquetState>();
  const current = CODECS[s.codec];
  return (
    <StepLayout
      eyebrow="Compression codecs"
      title="Faster or smaller? Pick your trade-off"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-line bg-bg/40 relative aspect-[16/9] rounded-2xl border">
            <span className="text-subtle absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px]">
              slower ← read & write speed → faster
            </span>
            <span className="text-subtle absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-[11px] whitespace-nowrap">
              smaller files ↑
            </span>
            {(Object.keys(CODECS) as (keyof typeof CODECS)[]).map((k) => {
              const cd = CODECS[k];
              const on = s.codec === k;
              return (
                <motion.button
                  key={k}
                  type="button"
                  onClick={() => set({ codec: k })}
                  animate={{ scale: on ? 1.12 : 1 }}
                  className={cn(
                    "absolute -translate-x-1/2 translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors",
                    on
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong bg-surface hover:border-accent",
                  )}
                  style={{ left: `${cd.x * 88 + 6}%`, bottom: `${cd.y * 78 + 10}%` }}
                >
                  {cd.label}
                </motion.button>
              );
            })}
          </div>
          <motion.div
            key={s.codec}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4"
          >
            <p className="font-semibold">{current.label}</p>
            <p className="text-muted mt-1 text-sm">{current.note}</p>
            {current.defaults && (
              <p className="mt-2 text-xs">
                <span className="text-muted">Default when writing Parquet in:</span>{" "}
                {current.defaults}
              </p>
            )}
          </motion.div>
          <p className="text-subtle text-[11px]">
            Positions are relative, not a benchmark: real results depend on your data.
          </p>
        </div>
      }
    >
      <p>
        After encoding, each page is compressed with a <Term id="compression">codec</Term>. The
        choice is a trade-off between CPU time and file size.
      </p>
      <p>
        Click each one. Notice that there is no single &ldquo;Parquet default&rdquo;: each tool that
        writes Parquet picks its own.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Deep dive: nested data ---------------------------------------------- */

const NESTED_ROWS = [
  { sku: "CHAI", order: "A", r: 0, d: 1 },
  { sku: "SAMOSA", order: "A", r: 1, d: 1 },
  { sku: "(null)", order: "B", r: 0, d: 0 },
  { sku: "KULFI", order: "C", r: 0, d: 1 },
];

const NESTED_FRAMES = [
  "Three orders. A has two items, B has none, C has one. How can a columnar file store a list inside each row?",
  "Parquet stores the nested column items.sku as one flat list of values: CHAI, SAMOSA, a placeholder, KULFI.",
  "The repetition level (r) says where each list starts: r=0 means “a new order starts here”, r=1 means “same order, next item”.",
  "The definition level (d) says whether a value is really there: d=1 means “an item exists”, d=0 means “this order's list is empty”.",
];

export function Nested() {
  const [s, set] = useSceneState<ParquetState>();
  const step = Math.min(s.nestedStep, NESTED_FRAMES.length - 1);
  return (
    <StepLayout
      eyebrow="Deep dive · optional"
      title="How does a list fit in a column?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-muted font-mono text-xs">
              {step + 1}/{NESTED_FRAMES.length}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Previous"
                disabled={step === 0}
                onClick={() => set({ nestedStep: step - 1 })}
                className="text-muted hover:bg-surface-2 grid size-8 place-items-center rounded-full disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next"
                disabled={step === NESTED_FRAMES.length - 1}
                onClick={() => set({ nestedStep: step + 1 })}
                className="bg-accent text-accent-fg grid size-8 place-items-center rounded-full disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <pre className="border-line bg-bg/60 rounded-xl border p-3 font-mono text-[11px] leading-relaxed">
              {`order A: items [CHAI, SAMOSA]
order B: items []
order C: items [KULFI]`}
            </pre>
            <div className="border-line bg-bg/60 rounded-xl border p-3">
              <p className="text-muted mb-2 font-mono text-[11px]">column items.sku</p>
              <table className="w-full font-mono text-xs">
                <thead className="text-subtle">
                  <tr>
                    <th className="text-left font-medium">value</th>
                    <th className={cn("font-medium", step >= 2 ? "text-viz-compute" : "opacity-0")}>
                      r
                    </th>
                    <th className={cn("font-medium", step >= 3 ? "text-viz-meta" : "opacity-0")}>
                      d
                    </th>
                    <th className="text-subtle text-right font-medium">order</th>
                  </tr>
                </thead>
                <tbody>
                  {NESTED_ROWS.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={false}
                      animate={{ opacity: step >= 1 ? 1 : 0 }}
                      className="border-line border-t"
                    >
                      <td className="py-1">{row.sku}</td>
                      <td className="text-center">
                        <motion.span
                          animate={{ opacity: step >= 2 ? 1 : 0 }}
                          className="text-viz-compute font-semibold"
                        >
                          {row.r}
                        </motion.span>
                      </td>
                      <td className="text-center">
                        <motion.span
                          animate={{ opacity: step >= 3 ? 1 : 0 }}
                          className="text-viz-meta font-semibold"
                        >
                          {row.d}
                        </motion.span>
                      </td>
                      <td className="text-subtle text-right">{row.order}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {NESTED_FRAMES[step]}
            </motion.p>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Schema: <code>repeated group items {"{ required binary sku }"}</code>, so the maximum r
            and d are both 1. Deeper nesting just means higher levels. The idea comes from
            Google&apos;s Dremel paper.
          </p>
        </div>
      }
    >
      <p>
        Real data is often nested: an order has a <em>list</em> of items. Parquet still stores it
        column by column, using two tiny numbers per value:{" "}
        <Term id="rep-def-levels">repetition and definition levels</Term>.
      </p>
      <p>
        This is a deeper topic. Step through it once; you don&apos;t need to memorise it. Engines
        handle it for you.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Checkpoint: reading order ------------------------------------------- */

export function ReadOrderCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Read a Parquet file like an engine"
      stage={
        <div className="flex flex-1 items-center">
          <OrderCheckpoint
            id="read-order"
            prompt="Put the steps of answering SELECT SUM(amount) WHERE amount > 400 in order."
            items={[
              { id: "tail", label: "Read the last 8 bytes: footer length + PAR1" },
              { id: "footer", label: "Read the footer: schema, locations, min/max" },
              { id: "skip", label: "Use the statistics to rule out row groups" },
              {
                id: "fetch",
                label: "Fetch only the amount column chunks of the remaining row groups",
              },
              { id: "decode", label: "Decompress and decode their pages, then add up" },
            ]}
            explanation="Footer first, decisions second, data last. Everything a lakehouse does to be fast builds on this reading pattern."
          />
        </div>
      }
    />
  );
}

/* 9 ─ Takeaways --------------------------------------------------------------- */

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-5">
          {[
            [
              "File → row groups → column chunks → pages",
              "Plus a footer at the end that maps it all.",
            ],
            [
              "Readers start at the footer",
              "Then skip row groups (predicate pushdown) and columns (projection pruning).",
            ],
            [
              "Statistics need organised data",
              "Min/max skipping works when data is sorted, clustered or naturally ordered.",
            ],
            [
              "Encode, then compress",
              "Dictionary, run-length and delta encodings, then a codec such as Snappy or ZSTD.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-data/20 grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{b}</p>
              </div>
            </motion.div>
          ))}
          <div className="border-line bg-surface rounded-2xl border p-4 text-sm">
            <p className="font-semibold">Knobs you&apos;ll meet in real projects</p>
            <ul className="text-muted mt-2 grid gap-1.5">
              <li>
                <strong className="text-fg">Row group size:</strong> parquet-java defaults to 128
                MB; other writers count rows instead. Bigger groups mean fewer, larger reads.
              </li>
              <li>
                <strong className="text-fg">Sort or cluster</strong> on columns people filter by, so
                statistics can skip.
              </li>
              <li>
                <strong className="text-fg">Optional extras:</strong> a{" "}
                <Term id="page-index">page index</Term> and{" "}
                <Term id="bloom-filter">Bloom filters</Term> help selective lookups, but many
                writers leave them off by default.
              </li>
            </ul>
          </div>
          <Link
            href="/tracks/data-lakehouse/what-makes-a-table"
            className="text-accent inline-flex items-center gap-1 text-sm hover:underline"
          >
            Next chapter: why a folder of Parquet files still isn&apos;t a table{" "}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      }
    >
      <p>
        You now know what an engine sees when it opens a lakehouse data file, and why the fastest
        byte is the one it never reads.
      </p>
    </StepLayout>
  );
}
