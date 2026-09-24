"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { FormatsState } from "./state";

/* 8 ─ The cheat sheet -------------------------------------------------------- */

type Tone = "good" | "mid" | "bad";

const PROPS: { id: string; label: string; explain: string }[] = [
  {
    id: "layout",
    label: "Layout",
    explain:
      "Rows suit writing and reading whole records; columns suit analytics over a few columns.",
  },
  {
    id: "schema",
    label: "Schema & types",
    explain:
      "Does the file itself say what the columns are and their types, or must the reader guess?",
  },
  {
    id: "readable",
    label: "Human-readable",
    explain: "Can a person open it in a text editor and understand it?",
  },
  { id: "split", label: "Splittable", explain: "Can many workers read one big file in parallel?" },
  {
    id: "compress",
    label: "Compression",
    explain: "How well does it shrink, and does compression keep it splittable?",
  },
  { id: "best", label: "Best for", explain: "Where you'll usually meet it." },
];

const FORMATS: { name: string; cells: Record<string, [string, Tone]> }[] = [
  {
    name: "CSV",
    cells: {
      layout: ["Rows, text", "mid"],
      schema: ["None: all text", "bad"],
      readable: ["Yes", "good"],
      split: ["Yes, unless gzipped", "mid"],
      compress: ["Whole-file only (gzip stops splitting)", "bad"],
      best: ["Hand-offs, spreadsheets", "mid"],
    },
  },
  {
    name: "JSON / JSON Lines",
    cells: {
      layout: ["Rows, text, nested", "mid"],
      schema: ["Implicit; field names repeated", "mid"],
      readable: ["Yes", "good"],
      split: ["JSON Lines: yes", "mid"],
      compress: ["Whole-file only", "bad"],
      best: ["APIs, events, logs, config", "mid"],
    },
  },
  {
    name: "Avro",
    cells: {
      layout: ["Rows, binary", "mid"],
      schema: ["Yes, with evolution rules", "good"],
      readable: ["No", "bad"],
      split: ["Yes (sync markers)", "good"],
      compress: ["Per block", "good"],
      best: ["Streaming (Kafka), data exchange", "good"],
    },
  },
  {
    name: "ORC",
    cells: {
      layout: ["Columns, binary", "good"],
      schema: ["Yes", "good"],
      readable: ["No", "bad"],
      split: ["Yes (stripes)", "good"],
      compress: ["Strong, per stream", "good"],
      best: ["Hive-based analytics", "good"],
    },
  },
  {
    name: "Parquet",
    cells: {
      layout: ["Columns, binary", "good"],
      schema: ["Yes, plus min/max stats", "good"],
      readable: ["No", "bad"],
      split: ["Yes (row groups)", "good"],
      compress: ["Strong, per page", "good"],
      best: ["Lakehouse tables, analytics, ML", "good"],
    },
  },
];

const toneCls: Record<Tone, string> = {
  good: "bg-good/10 text-fg",
  mid: "bg-viz-compute/10 text-fg",
  bad: "bg-bad/10 text-fg",
};

export function CheatSheet() {
  const [s, set] = useSceneState<FormatsState>();
  const focus = PROPS.find((p) => p.id === s.matrixFocus) ?? PROPS[0];
  return (
    <StepLayout
      eyebrow="Cheat sheet"
      title="Five formats at a glance"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {PROPS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => set({ matrixFocus: p.id })}
                className={cn(
                  "h-8 rounded-full border px-3 text-xs transition-colors",
                  s.matrixFocus === p.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted hover:text-fg",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <motion.p
            key={focus.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-sm"
          >
            {focus.explain}
          </motion.p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th />
                  {PROPS.map((p) => (
                    <th
                      key={p.id}
                      className={cn(
                        "px-2 py-1 text-left font-medium",
                        p.id === focus.id ? "text-accent" : "text-subtle",
                      )}
                    >
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FORMATS.map((f) => (
                  <tr key={f.name}>
                    <th className="pr-2 text-left font-semibold whitespace-nowrap">{f.name}</th>
                    {PROPS.map((p) => {
                      const [text, tone] = f.cells[p.id];
                      return (
                        <td
                          key={p.id}
                          className={cn(
                            "rounded-lg px-2 py-2 transition-all duration-300",
                            toneCls[tone],
                            p.id === focus.id ? "ring-accent/60 ring-2" : "opacity-60",
                          )}
                        >
                          {text}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <p>Everything from this module in one table. Click a property to focus on it.</p>
      <p className="text-subtle text-xs">
        CSV has no formal specification. RFC 4180 describes common practice, including quoting
        fields that contain commas and doubling any quote inside a field.
      </p>
    </StepLayout>
  );
}

/* 9 ─ Takeaways ----------------------------------------------------------- */

const INSIDE: { fmt: string; parts: [string, string][] }[] = [
  {
    fmt: "Delta Lake",
    parts: [
      ["data", "Parquet"],
      ["log", "JSON"],
      ["checkpoints", "Parquet (newer tables: JSON too)"],
    ],
  },
  {
    fmt: "Apache Iceberg",
    parts: [
      ["data", "Parquet, ORC or Avro"],
      ["manifests", "Avro"],
      ["table metadata", "JSON"],
    ],
  },
  {
    fmt: "Apache Hudi",
    parts: [
      ["base files", "Parquet (usually)"],
      ["change logs", "Avro (by default)"],
    ],
  },
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-5">
          {[
            [
              "Rows or columns is the big choice",
              "Rows suit writing and whole records; columns suit analytics over a few columns.",
            ],
            [
              "Columns compress far better",
              "Similar values sit together, so dictionary and run-length encoding shine.",
            ],
            [
              "Schema matters",
              "CSV makes every reader guess. Avro, ORC and Parquet carry their own schema.",
            ],
            ["Splittable means parallel", "A single gzipped file can stall a hundred workers."],
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
          <div className="border-line bg-surface rounded-2xl border p-4">
            <p className="text-muted mb-3 text-xs">
              Formats inside the table formats you&apos;ll meet next
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {INSIDE.map((t) => (
                <div key={t.fmt}>
                  <p className="text-sm font-semibold">{t.fmt}</p>
                  <ul className="mt-1 grid gap-0.5 text-xs">
                    {t.parts.map(([k, v]) => (
                      <li key={k}>
                        <span className="text-muted">{k}:</span> {v}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/tracks/data-lakehouse/inside-parquet"
            className="text-accent inline-flex items-center gap-1 text-sm hover:underline"
          >
            Next: open up a Parquet file, layer by layer <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      }
    >
      <p>
        Lakehouse tables store their data in Parquet, but they also use JSON and Avro for their
        metadata. Every format you met today reappears in the next chapter.
      </p>
      <p className="text-subtle text-xs">
        In memory, engines often use <Term id="arrow">Apache Arrow</Term>, a columnar layout for
        data being processed rather than stored. It&apos;s Parquet&apos;s partner, not its rival.
      </p>
    </StepLayout>
  );
}
