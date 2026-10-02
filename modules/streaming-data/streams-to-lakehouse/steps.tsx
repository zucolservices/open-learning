"use client";

import { motion } from "motion/react";
import { Archive } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INTERVALS, MBPS, TARGET_MB, files, fmtMB } from "./model";
import type { LakeState } from "./state";

/* 1 ─ Filing receipts -------------------------------------------------------------------------- */

export function Receipts() {
  const rows: [string, string, string][] = [
    [
      "File every receipt the moment it's printed",
      "The cabinet is always up to date, but it fills with thousands of thin folders. Finding anything means opening all of them.",
      "Fresh, slow to search",
    ],
    [
      "File once a day",
      "A few thick, tidy folders, but today's sales aren't in the cabinet until tonight.",
      "Tidy, stale",
    ],
    [
      "File often, and merge folders at night",
      "Fresh during the day; a clerk combines the thin folders into thick ones while the shop is quiet.",
      "Both, at the cost of the clerk",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Filing receipts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d, v], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex gap-3 rounded-xl border px-4 py-3",
                i === 2 ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <Archive
                className={cn("mt-0.5 size-5 shrink-0", i === 2 ? "text-good" : "text-muted")}
              />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
                <p className="mt-1 text-xs font-semibold">{v}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Streams often end in a lakehouse <Term id="table-format">table</Term> (Iceberg, Delta or
        Hudi) so analysts can query them with SQL. But a table is a set of files plus a{" "}
        <Term id="snapshot">snapshot</Term> that lists them, and every write is a commit that adds
        files.
      </p>
      <p>
        So a streaming writer faces the receipt clerk&apos;s choice: commit often and leave{" "}
        <Term id="small-files">small files</Term>, or commit rarely and be stale. The usual answer
        is the third row: <Term id="compaction">compaction</Term> behind the stream.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tune the commit interval ⭐ ----------------------------------------------------------------- */

function Count({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "bad";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2",
        tone === "bad"
          ? "border-bad/60 bg-bad/10"
          : tone === "good"
            ? "border-good/50 bg-good/10"
            : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <p className="font-mono text-lg font-semibold">{value}</p>
      {sub && <p className="text-subtle text-[10px]">{sub}</p>}
    </div>
  );
}

export function Interval() {
  const [s, set] = useSceneState<LakeState>();
  const f = files(s.interval, s.writers, s.partitions, s.shuffle, s.compact);
  const fileMB = s.compact ? f.keptMB : f.avgMB;
  const small = fileMB < 64;
  const fresh = INTERVALS.find(([k]) => k === s.interval)?.[1] ?? "";
  const dots = Math.min(400, Math.round(Math.sqrt(f.kept) * 2));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Tune the commit interval"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-muted">
              Commit every (Flink checkpoint, Spark trigger, connector interval)
            </span>
            <Segmented
              size="sm"
              value={String(s.interval)}
              options={INTERVALS.map(([k, l]) => [String(k), l])}
              onChange={(v) => set({ interval: Number(v) })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs">
              <span className="flex justify-between">
                <span className="text-muted">Parallel writers</span>
                <span className="font-mono">{s.writers}</span>
              </span>
              <input
                type="range"
                min={1}
                max={20}
                value={s.writers}
                onChange={(e) => set({ writers: Number(e.target.value) })}
                className="accent-accent"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="flex justify-between">
                <span className="text-muted">Table partitions written (e.g. hours)</span>
                <span className="font-mono">{s.partitions}</span>
              </span>
              <input
                type="range"
                min={1}
                max={48}
                value={s.partitions}
                onChange={(e) => set({ partitions: Number(e.target.value) })}
                className="accent-accent"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.shuffle}
                onChange={(e) => set({ shuffle: e.target.checked })}
                className="accent-accent"
              />
              Route each partition to one writer (hash distribution)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.compact}
                onChange={(e) => set({ compact: e.target.checked })}
                className="accent-accent"
              />
              Compact to {TARGET_MB} MB files
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Count
              label="Freshness"
              value={`~${fresh}`}
              tone={s.interval <= 60 ? "good" : s.interval >= 3600 ? "bad" : undefined}
            />
            <Count
              label="Files per day"
              value={f.kept.toLocaleString("en-US")}
              sub={
                s.compact
                  ? `${f.written.toLocaleString("en-US")} written`
                  : `${f.perCommit.toLocaleString("en-US")} per commit`
              }
              tone={f.kept > 20_000 ? "bad" : undefined}
            />
            <Count label="Average file" value={fmtMB(fileMB)} tone={small ? "bad" : "good"} />
          </div>
          <div className="flex flex-wrap gap-px">
            {Array.from({ length: dots }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-[1px]",
                  small ? "bg-viz-data/70 size-1.5" : "bg-viz-data size-3",
                )}
              />
            ))}
          </div>
          <p className="text-sm">
            {small
              ? "Lots of tiny files: every query has to plan, open and read each one, and the table's metadata grows with every commit."
              : "Files near the target size: fast to query. Check what freshness you gave up."}
          </p>
        </div>
      }
    >
      <p>
        A stream of {MBPS} MB/s lands in an Iceberg table. With Flink, data files are committed when
        each <Term id="checkpoint">checkpoint</Term> completes, so the checkpoint interval sets both
        freshness and how often new files appear. Spark commits a snapshot per micro-batch.
      </p>
      <p>
        Each writer opens a file for every partition it sees, so files per commit can be writers ×
        partitions. Routing each partition to one writer divides that by the number of writers.
        Iceberg recommends Spark triggers of at least a minute; files are aimed at {TARGET_MB} MB by
        default.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Updates leave a trail ------------------------------------------------------------------- */

const FRAMES = [
  {
    title: "Insert",
    text: "Order 42 arrives as 'placed'. The commit adds a data file containing the row.",
    files: [["data", "42 placed"]],
  },
  {
    title: "Update",
    text: "Order 42 becomes 'paid'. Rewriting the old file every few seconds would be far too slow, so Flink's upsert mode adds an equality delete (\"remove rows where id = 42\") plus a new data file.",
    files: [
      ["data", "42 placed"],
      ["del", "id = 42"],
      ["data", "42 paid"],
    ],
  },
  {
    title: "Read",
    text: "Every reader must now check each data file against the delete files and merge. A few deletes are cheap; thousands pile up per day and slow every query.",
    files: [
      ["data", "42 placed"],
      ["del", "id = 42"],
      ["data", "42 paid"],
      ["del", "id = 17"],
      ["del", "id = 99"],
    ],
  },
  {
    title: "Compact",
    text: "Compaction rewrites the data with deletes applied: one clean file again. On Iceberg v3 tables, deletion vectors (one small bitmap per data file) are cheaper to read, and Iceberg 1.12 can convert equality deletes into them.",
    files: [["data", "42 paid · 17 … · 99 …"]],
  },
] as const;

export function Upserts() {
  const [s, set] = useSceneState<LakeState>();
  const fr = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Updates leave a trail"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex min-h-24 flex-wrap content-start gap-2">
            {fr.files.map(([k, l], i) => (
              <motion.div
                key={`${s.frame}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className={cn(
                  "rounded-lg border px-3 py-2 font-mono text-xs",
                  k === "del"
                    ? "border-viz-remove bg-viz-remove/15"
                    : "border-viz-data bg-viz-data/15",
                )}
              >
                <p className="text-muted font-sans text-[10px]">
                  {k === "del" ? "equality delete" : "data file"}
                </p>
                {l}
              </motion.div>
            ))}
          </div>
          <FrameCaption
            frameKey={s.frame}
            title={fr.title}
            tone={s.frame === 3 ? "good" : s.frame === 2 ? "bad" : undefined}
          >
            {fr.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Appends are easy. Change data (from <Term id="cdc">CDC</Term>, module 8) is harder: each
        update must hide an older row without rewriting its file.
      </p>
      <p>
        Streaming writers do it with <Term id="equality-delete">equality deletes</Term>, which push
        the cost onto readers until compaction. The format is moving away from them: Iceberg&apos;s
        draft v4 spec no longer allows writing new ones.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Kafka to table, ready-made ------------------------------------------------------------------ */

const TOOLS: [string, string, string][] = [
  [
    "Flink + Iceberg sink",
    "Every checkpoint",
    "Exactly-once. Iceberg 1.12's sink can also compact and expire snapshots after commits (experimental). Dynamic sink since 1.10.",
  ],
  [
    "Spark Structured Streaming",
    "Every micro-batch",
    "Iceberg, Delta or Hudi. Delta's optimized writes and auto compaction (open source since 3.1) tidy as they go.",
  ],
  [
    "Iceberg Kafka Connect sink",
    "5 min default",
    "From Tabular, now in Apache Iceberg; a coordinator makes commits exactly-once. Appends only in the Apache version.",
  ],
  [
    "Confluent Tableflow",
    "About 5 min",
    "Turns a topic into an Iceberg table (GA March 2025) or Delta table (October 2025), with maintenance handled.",
  ],
  [
    "Redpanda Iceberg Topics",
    "1 min target lag",
    "The broker itself writes the table (GA in Redpanda 25.1, April 2025).",
  ],
  [
    "Amazon Data Firehose",
    "0–900 s buffer (default 300 s)",
    "Delivers to Iceberg tables, including S3 Tables, which compact automatically. On self-managed tables, compaction is yours.",
  ],
  [
    "Azure Event Hubs Capture",
    "1–15 min or 10–500 MB",
    "Whichever comes first; writes Avro files to storage, not a table format.",
  ],
  [
    "Snowflake, BigQuery, Databricks",
    "Seconds to minutes",
    "Snowpipe Streaming (as low as ~5 s, Iceberg v2/v3), BigQuery's Apache Iceberg managed tables, Databricks Lakeflow pipelines.",
  ],
  [
    "Apache Paimon and Fluss",
    "Streaming-first",
    "Table formats built for streaming updates (LSM trees); Fluss became a top-level Apache project in August 2026.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Kafka to table, ready-made"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {TOOLS.map(([t, c, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-accent shrink-0 font-mono text-[10px]">{c}</p>
              </div>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You rarely write this plumbing yourself. Each tool picks a default commit interval, which is
        its freshness, and either handles compaction or leaves it to you. Ask both questions before
        choosing.
      </p>
      <p>
        On plain Iceberg, the maintenance jobs are rewrite_data_files (compaction),
        expire_snapshots, rewrite_manifests and remove_orphan_files. Schedule them, or pick a
        catalogue that runs them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Tune or tidy? -------------------------------------------------------------------------- */

export function TuneOrTidy() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Tune or tidy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tune-or-tidy"
            prompt="What's the best first move for each situation?"
            categories={[
              { id: "faster", label: "Commit more often" },
              { id: "slower", label: "Commit less often" },
              { id: "maintain", label: "Run maintenance" },
            ]}
            items={[
              {
                id: "dash",
                label:
                  "The ops dashboard must show payments within a minute; commits are every 15 minutes",
                category: "faster",
                why: "Freshness is the commit interval. Compact behind it.",
              },
              {
                id: "report",
                label: "A table only feeds a nightly report, but it gets 300,000 files a day",
                category: "slower",
                why: "Nobody needs minute-fresh data here; commit every 15–60 minutes.",
              },
              {
                id: "slowq",
                label: "Queries on yesterday's partition crawl through thousands of 2 MB files",
                category: "maintain",
                why: "Compact it (rewrite_data_files) to files near the target size.",
              },
              {
                id: "meta",
                label: "The table has 400,000 snapshots and its metadata keeps growing",
                category: "maintain",
                why: "expire_snapshots (then remove_orphan_files) trims history you no longer need.",
              },
              {
                id: "deletes",
                label: "A CDC table's reads slow down as equality deletes pile up",
                category: "maintain",
                why: "Compaction applies the deletes; on v3, convert them to deletion vectors.",
              },
            ]}
            explanation="Set the commit interval from how fresh the data must be, then let maintenance fix what frequent commits leave behind."
          />
        </div>
      }
    >
      <p>Five tables in trouble. What would you do first?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Commit interval = freshness", "A Flink checkpoint, a Spark trigger or a connector's interval."],
  [
    "Frequent commits make small files",
    "Up to writers × partitions per commit; route partitions to cut it.",
  ],
  [
    "Compaction tidies behind the stream",
    "Plus snapshot expiry and orphan cleanup, scheduled or managed.",
  ],
  ["Updates leave delete files", "Readers pay until compaction; deletion vectors make it cheaper."],
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
      <p>Next: real-time analytics stores, databases built for events seconds old.</p>
    </StepLayout>
  );
}
