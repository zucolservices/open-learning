"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { TableState } from "./state";

/* 4 ─ Checkpoint ------------------------------------------------------------ */

export function OneThing() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One fix for all three"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="one-fix"
            prompt="What single thing would have prevented all three incidents?"
            options={[
              {
                id: "record",
                label: "An atomic record of exactly which files make up each version of the table",
                correct: true,
                feedback:
                  "Yes. Readers use the record instead of listing the folder, and a job's changes only appear when its single commit lands.",
              },
              {
                id: "careful",
                label: "Writing the jobs more carefully",
                feedback:
                  "Every job in the incidents was correct. The problem is that a folder can't show a change atomically.",
              },
              {
                id: "faster",
                label: "Faster storage, so jobs finish sooner",
                feedback:
                  "A faster job shrinks the window but never closes it. Readers can still land mid-write.",
              },
              {
                id: "lock",
                label: "Locking the whole folder while a job runs",
                feedback:
                  "Object storage has no folder locks. Hive offers optional locks, but only Hive clients respect them; Spark writing files directly doesn't. And blocking readers during every job would stall the platform.",
              },
            ]}
            explanation="That record is exactly what Delta Lake's log, Iceberg's metadata tree and Hudi's timeline provide."
          />
        </div>
      }
    />
  );
}

/* 5 ─ Name the problem -------------------------------------------------------- */

export function NameIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the problem"
      stage={
        <div className="flex flex-1 items-center">
          <SortCheckpoint
            id="name-problem"
            prompt="Sort each symptom of a folder-based table by its root cause."
            categories={[
              { id: "atomic", label: "Atomicity" },
              { id: "isolation", label: "Isolation" },
              { id: "schema", label: "Schema" },
              { id: "perf", label: "Performance" },
            ]}
            items={[
              {
                id: "crash",
                label: "A crashed job's half-written files keep showing up in results",
                category: "atomic",
                why: "The job's change wasn't all-or-nothing: part of it stayed behind.",
              },
              {
                id: "midwrite",
                label: "A dashboard showed a total that was never true",
                category: "isolation",
                why: "The reader saw another job's change while it was still in progress.",
              },
              {
                id: "vanish",
                label: "A query failed with “file not found” during an overwrite",
                category: "isolation",
                why: "Another job deleted files that the running query had already planned to read.",
              },
              {
                id: "text",
                label: "Someone wrote amount as text in new files, and old reports broke",
                category: "schema",
                why: "Nothing checked new files against the table's schema. That's schema-on-read in action.",
              },
              {
                id: "list",
                label: "Planning a query takes minutes because it lists two million files",
                category: "perf",
                why: "Without a file list in metadata, every query must list storage first.",
              },
              {
                id: "open",
                label: "The engine must open every file to learn what's inside",
                category: "perf",
                why: "No central statistics (like min/max per file) exist to skip files in advance.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Every problem with folder-based tables falls into one of four buckets.</p>
    </StepLayout>
  );
}

/* 6 ─ What a table format adds ------------------------------------------------ */

const FIXES: { id: string; problem: string; fix: string; how: string; tone: string }[] = [
  {
    id: "atomic",
    problem: "Half-written and crashed jobs",
    fix: "Atomic commits",
    how: "Data files are written first and stay invisible. One small metadata write (a new log entry, or a pointer swap in the catalog) makes the whole change visible at once, or not at all.",
    tone: "border-viz-add",
  },
  {
    id: "isolation",
    problem: "Readers seeing changes in progress",
    fix: "Snapshot isolation",
    how: "A reader picks a version (snapshot) when it starts and reads exactly that version's files, however long it runs. Old files stay until clean-up, so nothing vanishes under it.",
    tone: "border-viz-meta",
  },
  {
    id: "schema",
    problem: "Files that don't match the schema",
    fix: "Schema in the table, enforced on write",
    how: "The schema lives in the table's own metadata. Writers that don't match are rejected. Changes to it are deliberate and recorded.",
    tone: "border-accent",
  },
  {
    id: "perf",
    problem: "Slow listing and blind reads",
    fix: "File list + statistics in metadata",
    how: "The metadata lists every data file with its size and per-column min/max, so engines never list storage and can skip files before opening them.",
    tone: "border-viz-compute",
  },
  {
    id: "history",
    problem: "No way back after a mistake",
    fix: "Versions and time travel",
    how: "Every commit creates a new version and keeps the old ones, so you can query or restore the table as it was.",
    tone: "border-viz-data",
  },
];

export function WhatFormatsAdd() {
  const [s, set] = useSceneState<TableState>();
  const current = FIXES.find((f) => f.id === s.fix) ?? FIXES[0];
  return (
    <StepLayout
      eyebrow="The solution"
      title="What an open table format adds"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          {/* The layer diagram */}
          <div className="grid gap-2">
            <div className="border-accent/60 bg-accent-soft rounded-xl border px-4 py-2 text-center text-sm">
              <strong>Catalog</strong>{" "}
              <span className="text-muted">· where is table “orders”?</span>
            </div>
            <motion.div
              initial={{ scaleX: 0.8, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              className="border-viz-meta bg-viz-meta/15 rounded-xl border-2 px-4 py-3 text-center text-sm"
            >
              <strong>Table metadata</strong>{" "}
              <span className="text-muted">
                · versions · exact file list · schema · per-file statistics
              </span>
              <p className="text-viz-meta mt-0.5 text-xs font-semibold">← the new layer</p>
            </motion.div>
            <div className="border-viz-data/60 bg-viz-data/10 flex flex-wrap items-center justify-center gap-1 rounded-xl border px-4 py-2 text-sm">
              <strong className="mr-2">The same Parquet files</strong>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="bg-viz-data/40 h-4 w-3 rounded-sm" />
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
            <ul className="grid content-start gap-1.5">
              {FIXES.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => set({ fix: f.id })}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                      s.fix === f.id
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:border-line-strong",
                    )}
                  >
                    <span className="text-bad text-xs">✗ {f.problem}</span>
                    <br />
                    <span className="font-medium">✓ {f.fix}</span>
                  </button>
                </li>
              ))}
            </ul>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("bg-surface rounded-2xl border-l-4 p-5", current.tone)}
            >
              <p className="text-lg font-semibold">{current.fix}</p>
              <p className="text-muted mt-2 text-sm leading-relaxed">{current.how}</p>
            </motion.div>
          </div>
        </div>
      }
    >
      <p>
        An <Term id="table-format">open table format</Term> doesn&apos;t replace Parquet. It adds a
        thin layer of <Term id="metadata">metadata</Term> on top that records, for every version of
        the table, exactly which files belong.
      </p>
      <p>Click each problem to see how that one layer fixes it.</p>
    </StepLayout>
  );
}

/* 7 ─ Three answers --------------------------------------------------------- */

const ANSWERS = [
  {
    name: "Delta Lake",
    idea: "An ordered log of commits",
    detail:
      "Each commit is a JSON file listing files added and removed. Replay the log to get any version.",
    href: "/tracks/data-lakehouse/delta-lake",
    live: true,
    tone: "border-viz-meta",
  },
  {
    name: "Apache Iceberg",
    idea: "A tree of metadata",
    detail:
      "A catalog points to the current metadata file, which leads down through manifests to data files.",
    href: "/tracks/data-lakehouse/apache-iceberg",
    live: false,
    tone: "border-accent",
  },
  {
    name: "Apache Hudi",
    idea: "A timeline of actions",
    detail: "Built for constant updates: a timeline of instants, with files grouped by record key.",
    href: "/tracks/data-lakehouse/apache-hudi",
    live: false,
    tone: "border-viz-compute",
  },
];

export function ThreeAnswers() {
  return (
    <StepLayout
      eyebrow="Three answers"
      title="Same problem, three designs"
      stage={
        <div className="grid flex-1 content-center gap-3">
          {ANSWERS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={a.href}
                className={cn(
                  "group bg-surface block rounded-2xl border-l-4 p-5 transition hover:brightness-110",
                  a.tone,
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold">{a.name}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px]",
                      a.live ? "bg-accent text-accent-fg" : "bg-surface-2 text-subtle",
                    )}
                  >
                    {a.live ? "Live" : "Coming next"}
                  </span>
                </div>
                <p className="text-accent text-sm">{a.idea}</p>
                <p className="text-muted mt-1 text-sm">{a.detail}</p>
                <p className="text-muted group-hover:text-fg mt-2 flex items-center gap-1 text-xs">
                  Open module <ArrowUpRight className="size-3.5" />
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Uber, Netflix and Databricks each hit these problems at scale and built an answer.
        Databricks later reported that in 2014–2016, around half of its support escalations came
        from exactly these cloud-storage problems.
      </p>
      <p>
        All three keep data in Parquet and add a metadata layer; they differ in how that layer is
        shaped. The next modules take each one apart.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Takeaways ---------------------------------------------------------------- */

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-3">
          {[
            [
              "A table is a promise",
              "A schema and one consistent set of rows at every moment, even during writes.",
            ],
            [
              "Hive-style tables are catalog entry + folder",
              "The data is whatever the folder listing returns at that instant.",
            ],
            [
              "Folders break the promise",
              "Mid-write reads, crash leftovers, overwrite races, schema drift and slow listing.",
            ],
            [
              "Table formats add a metadata layer",
              "An atomic, versioned record of exactly which files form the table.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/20 grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{b}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every feature you&apos;ll meet in Delta, Iceberg and Hudi traces back to the incidents you
        just replayed.
      </p>
    </StepLayout>
  );
}
