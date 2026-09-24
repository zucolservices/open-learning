"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { IngestionState } from "./state";

/* 5 ─ Exactly once, even after a crash --------------------------------------------------------------- */

function frames(safe: boolean) {
  const common = [
    {
      title: "Batch 42 starts",
      text: "The job reads Kafka offsets 1,000 to 1,999: a thousand new events.",
      rows: 50_000,
      log: [] as string[],
    },
    {
      title: "Write the files",
      text: "The batch's rows are written as Parquet files.",
      rows: 50_000,
      log: [],
    },
    {
      title: "Commit to the table",
      text: safe
        ? "The commit adds the files and records a transaction ID with it: (app = orders-stream, version = 42)."
        : "The commit adds the files to the table.",
      rows: 51_000,
      log: safe ? ["txn(orders-stream, 42)"] : [],
    },
    {
      title: "💥 Crash",
      text: "The machine dies before the job saves “batch 42 done” in its checkpoint. The table has the rows; the checkpoint doesn't know.",
      rows: 51_000,
      log: safe ? ["txn(orders-stream, 42)"] : [],
    },
    {
      title: "Restart and replay",
      text: "The checkpoint says the last finished batch was 41, so the job re-reads offsets 1,000 to 1,999 and runs batch 42 again. Kafka still has them.",
      rows: 51_000,
      log: safe ? ["txn(orders-stream, 42)"] : [],
    },
  ];
  return [
    ...common,
    safe
      ? {
          title: "Commit is skipped: exactly once",
          text: "Before committing, the table checks: has (orders-stream, 42) been committed already? Yes, so the retry is ignored. 51,000 rows, no duplicates.",
          rows: 51_000,
          log: ["txn(orders-stream, 42) already seen → skip"],
          tone: "good" as const,
        }
      : {
          title: "Committed twice: 1,000 duplicates",
          text: "Nothing tells the table this batch was already applied. The same 1,000 rows are added again: 52,000 rows, 1,000 of them duplicates.",
          rows: 52_000,
          log: [],
          tone: "bad" as const,
        },
  ];
}

export function ExactlyOnce() {
  const [s, set] = useSceneState<IngestionState>();
  const fs = frames(s.onceSafe);
  const step = Math.min(s.onceStep, fs.length - 1);
  const f = fs[step] as (typeof fs)[number] & { tone?: "good" | "bad" };
  return (
    <StepLayout
      eyebrow="Reliability"
      title="Exactly once, even after a crash"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.onceSafe ? "safe" : "naive"}
            options={[
              ["naive", "Plain append"],
              ["safe", "Checkpoint + idempotent commit"],
            ]}
            onChange={(v) => set({ onceSafe: v === "safe", onceStep: 0 })}
          />
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                f.rows > 51_000 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Rows in bronze.orders</p>
              <motion.p
                key={f.rows}
                initial={{ opacity: 0.4, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-lg font-semibold tabular-nums"
              >
                {f.rows.toLocaleString("en-IN")}
              </motion.p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Recorded with the commit</p>
              <p className="font-mono text-[11px]">{f.log.length ? f.log.join(", ") : "–"}</p>
            </div>
          </div>
          <Stepper step={step} count={fs.length} onChange={(n) => set({ onceStep: n })} />
          <FrameCaption frameKey={`${s.onceSafe}-${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Crashes are normal in a long-running stream. What matters is what happens when the job
        restarts in the middle of a batch.
      </p>
      <p>
        “<Term id="exactly-once">Exactly once</Term>” is really <em>at least once</em> plus
        de-duplication: a replayable source (Kafka keeps the events), a checkpoint of progress, and
        an <Term id="idempotent">idempotent</Term> sink that ignores a batch it has already applied.
        Like a cashier who checks the receipt number before ringing it up again.
      </p>
      <p className="text-subtle text-xs">
        Delta records the (app ID, version) pair with each streaming commit; Iceberg&apos;s Flink
        and Kafka Connect sinks tie commits to Flink checkpoints and Kafka transactions.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint --------------------------------------------------------------------------------------- */

export function CheckpointTrap() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The deleted checkpoint"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="deleted-checkpoint"
            prompt="A job writes to Delta with foreachBatch, using txnAppId = 'orders-stream' and txnVersion = batch ID. Someone deletes the job's checkpoint and restarts it with the same txnAppId. Batch IDs start again from 0. What happens?"
            options={[
              {
                id: "dupes",
                label: "Everything is written again, creating duplicates",
                feedback: "The opposite: Delta has already seen versions 0, 1, 2… for this app ID.",
              },
              {
                id: "skip",
                label:
                  "Delta silently skips the new batches, because it has already seen those versions for this app ID",
                correct: true,
                feedback:
                  "Right. New data is dropped without an error. The Delta docs warn: after deleting a checkpoint, use a new txnAppId.",
              },
              {
                id: "error",
                label: "The job fails with a conflict error",
                feedback: "No error is raised. The writes are treated as already applied.",
              },
              {
                id: "fine",
                label: "Nothing unusual: the checkpoint doesn't matter to Delta",
                feedback:
                  "The batch IDs come from the checkpoint, and Delta uses them to de-duplicate.",
              },
            ]}
            explanation="Exactly-once machinery only works if its identifiers stay consistent. Treat checkpoints as part of the table's state."
          />
        </div>
      }
    >
      <p>Idempotence cuts both ways. Think about what Delta remembers.</p>
    </StepLayout>
  );
}

/* 7 ─ The tools ---------------------------------------------------------------------------------------- */

const TOOLS: { group: string; items: [string, string][] }[] = [
  {
    group: "Engines you run",
    items: [
      [
        "Spark Structured Streaming",
        "Micro-batches with checkpoints; writes Delta, Iceberg or Hudi.",
      ],
      [
        "Apache Flink",
        "Record-at-a-time; its Iceberg sink commits on each Flink checkpoint, exactly once.",
      ],
      [
        "Kafka Connect + Iceberg sink",
        "Part of Apache Iceberg; commits about every 5 minutes by default, exactly once.",
      ],
      [
        "Hudi Streamer",
        "Hudi's ingestion tool: from Kafka or files, upserts by default, can run continuously.",
      ],
    ],
  },
  {
    group: "Managed services",
    items: [
      [
        "Databricks Auto Loader",
        "Picks up new files in cloud storage incrementally, with schema evolution.",
      ],
      [
        "Amazon Data Firehose",
        "Buffers streams (5 MB / 5 min by default) into S3 or Iceberg tables, including S3 Tables.",
      ],
      [
        "Google Datastream & Pub/Sub",
        "Datastream copies database changes into BigQuery (and Iceberg, append-only); Pub/Sub can write straight into BigQuery, at least once.",
      ],
      [
        "Airbyte & Fivetran",
        "Hundreds of source connectors; both can land data as Iceberg (Fivetran also Delta).",
      ],
    ],
  },
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="In practice"
      title="The ingestion toolbox"
      stage={
        <div className="grid flex-1 content-start gap-4">
          {TOOLS.map((g) => (
            <div key={g.group}>
              <p className="text-muted mb-2 text-xs font-medium">{g.group}</p>
              <div className="grid gap-2 md:grid-cols-2">
                {g.items.map(([name, body], i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="border-line bg-surface rounded-xl border p-3"
                  >
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-muted mt-0.5 text-xs">{body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          <Code className="text-[10px] whitespace-pre-wrap">
            {
              '# Spark: a micro-batch every minute, into a Delta table\n(events.writeStream.format("delta")\n   .option("checkpointLocation", "s3://lake/_chk/app_events")\n   .trigger(processingTime="1 minute")\n   .toTable("bronze.app_events"))'
            }
          </Code>
        </div>
      }
    >
      <p>
        You can run ingestion yourself or let a service do it. The trade-off is the usual one:
        control versus convenience.
      </p>
      <p>
        Read the guarantees closely before choosing. Several managed paths are append-only or
        at-least-once, which is fine for event logs but not for tables that must never double count.
      </p>
      <p className="text-subtle text-xs">
        Copying <em>changes</em> from databases is its own topic: next module, CDC and MERGE.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap-up ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Three rhythms", "Batch, micro-batch and continuous; most lakehouses use all three."],
  ["Commits set freshness", "Data is visible only once committed, whatever the engine's speed."],
  ["Freshness costs files", "Shorter intervals mean more, smaller files, and more compaction."],
  [
    "Exactly once = replay + de-duplicate",
    "Replayable sources, checkpoints and idempotent commits.",
  ],
  ["Check the guarantees", "Managed tools differ: some are append-only or at-least-once."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-2.5">
          {TAKEAWAYS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You can now follow data from the moment it&apos;s created to the moment it&apos;s queryable,
        and tune how fast it gets there.
      </p>
      <p>
        Next, <strong>CDC, MERGE &amp; slowly changing dimensions</strong>: keeping lakehouse tables
        in sync with databases that change.
      </p>
    </StepLayout>
  );
}
