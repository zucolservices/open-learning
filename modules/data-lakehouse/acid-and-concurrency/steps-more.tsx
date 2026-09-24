"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { AcidState } from "./state";

/* 5 ─ Isolation levels ------------------------------------------------------------ */

type Row = { id: number; status: string };
const V0: Row[] = [
  { id: 1041, status: "cancelled" },
  { id: 1042, status: "paid" },
];

interface SkewFrame {
  title: string;
  text: string;
  rows: Row[];
  log: string[];
  tone?: "good" | "bad";
}

function skewFrames(level: AcidState["skewLevel"]): SkewFrame[] {
  const withInsert = [...V0, { id: 1099, status: "cancelled" }];
  const common: SkewFrame[] = [
    {
      title: "Two jobs start from v0",
      text: "Job D will delete every cancelled order. Job I will insert a new order, 1099, which is also cancelled. Both read version 0.",
      rows: V0,
      log: ["v0 · table as shown"],
    },
    {
      title: "Job I commits first: v1",
      text: "The insert is a blind append. Order 1099 is now in the table. Job D, still working from v0, never saw it.",
      rows: withInsert,
      log: ["v0", "v1 · INSERT 1099 (cancelled)"],
    },
  ];
  if (level === "writeserializable") {
    return [
      ...common,
      {
        title: "Job D commits v2 (WriteSerializable)",
        text: "The new rows came from a blind append, so WriteSerializable lets the delete commit. It removes 1041, the only cancelled order it saw.",
        rows: [V0[1], { id: 1099, status: "cancelled" }],
        log: ["v0", "v1 · INSERT 1099 (cancelled)", "v2 · DELETE WHERE status = 'cancelled'"],
      },
      {
        title: "A state no serial order explains",
        text: "The log says the delete of cancelled orders ran after the insert, yet 1099 is still cancelled and present. The result matches “delete, then insert”, the reverse of the log. Writes stayed safe; the history reads oddly.",
        rows: [V0[1], { id: 1099, status: "cancelled" }],
        log: ["v0", "v1 · INSERT 1099 (cancelled)", "v2 · DELETE WHERE status = 'cancelled'"],
        tone: "bad",
      },
    ];
  }
  return [
    ...common,
    {
      title: "Job D is refused (Serializable)",
      text: "D read the table before 1099 existed, and 1099 matches its condition. Under Serializable that's a conflict: ConcurrentAppendException.",
      rows: withInsert,
      log: ["v0", "v1 · INSERT 1099 (cancelled)", "v2 attempt · refused"],
      tone: "bad",
    },
    {
      title: "Job D re-runs from v1 and commits v2",
      text: "The retry sees 1099 and deletes both cancelled orders. The result matches the log exactly: insert, then delete.",
      rows: [V0[1]],
      log: ["v0", "v1 · INSERT 1099 (cancelled)", "v2 · DELETE WHERE status = 'cancelled'"],
      tone: "good",
    },
  ];
}

export function IsolationLevels() {
  const [s, set] = useSceneState<AcidState>();
  const frames = skewFrames(s.skewLevel);
  const step = Math.min(s.skewStep, frames.length - 1);
  const f = frames[step];

  return (
    <StepLayout
      eyebrow="Isolation levels"
      title="How strict should the check be?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.skewLevel}
            options={[
              ["serializable", "Serializable"],
              ["writeserializable", "WriteSerializable"],
            ]}
            onChange={(v) => set({ skewLevel: v as AcidState["skewLevel"], skewStep: 0 })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface overflow-hidden rounded-xl border">
              <p className="text-muted bg-surface-2/60 px-3 py-1.5 text-[11px]">
                orders, latest version
              </p>
              <ul className="font-mono text-xs">
                <AnimatePresence initial={false}>
                  {f.rows.map((r) => (
                    <motion.li
                      key={r.id}
                      layout
                      initial={{ opacity: 0, backgroundColor: "var(--accent-soft)" }}
                      animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                      exit={{ opacity: 0 }}
                      className="border-line flex justify-between border-t px-3 py-1.5"
                    >
                      <span>{r.id}</span>
                      <span className={r.status === "cancelled" ? "text-bad" : "text-muted"}>
                        {r.status}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <div className="border-line bg-bg/40 rounded-xl border p-3">
              <p className="text-muted mb-1.5 text-[11px]">Table history</p>
              <ol className="grid gap-1 font-mono text-[11px]">
                {f.log.map((l) => (
                  <li key={l} className={cn(l.includes("refused") && "text-bad")}>
                    {l}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <Stepper step={step} count={frames.length} onChange={(n) => set({ skewStep: n })} />
          <FrameCaption frameKey={`${s.skewLevel}-${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        The lab showed that the isolation level changes one decision: does a blind append count
        against someone who read the same data?
      </p>
      <p>
        <strong>Serializable</strong> says yes: the result must match some one-at-a-time order of
        the commits. <strong>WriteSerializable</strong> says no, for appends: more jobs succeed
        together, but the history can describe an order that never really happened. Step through
        this example from the Databricks docs under each level.
      </p>
      <p className="text-subtle text-xs">
        Iceberg has the same choice for Spark deletes, updates and merges (
        <code>write.delete.isolation-level</code> etc.): <code>serializable</code> (default) or{" "}
        <code>snapshot</code>, which skips the check for new matching data. Hudi checks for
        overlapping files between writers.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Designing for fewer conflicts ---------------------------------------------- */

const TIPS: [string, string, string?][] = [
  [
    "Filter on the partition column",
    "An UPDATE, DELETE or MERGE that names its partitions only reads those, so it can't clash with writers elsewhere. Without it, it reads the whole table and clashes with everything.",
    "MERGE INTO orders t USING changes c\nON t.order_id = c.order_id AND t.date = '2026-09-24'",
  ],
  [
    "Retry the reader, not the appender",
    "Only operations that read the table can fail. Put retry logic around UPDATE, DELETE and MERGE jobs; blind appends almost never need it.",
  ],
  [
    "Deletion vectors and row-level concurrency",
    "With deletion vectors, OPTIMIZE no longer conflicts with updates on Databricks (unless ZORDER BY is used). Row-level concurrency goes further: two updates only clash if they touch the same row.",
  ],
  [
    "Keep maintenance out of the way",
    "Schedule compaction when heavy update jobs aren't running, and avoid schema changes while writers are busy: a metadata change fails every concurrent writer.",
  ],
];

export function FewerConflicts() {
  return (
    <StepLayout
      eyebrow="In practice"
      title="Designing for fewer conflicts"
      stage={
        <div className="grid flex-1 content-start gap-3 md:grid-cols-2">
          {TIPS.map(([title, body, code], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex flex-col rounded-2xl border p-4"
            >
              <p className="font-semibold">{title}</p>
              <p className="text-muted mt-1 text-xs leading-relaxed">{body}</p>
              {code && <Code className="mt-3 text-[10px] whitespace-pre-wrap">{code}</Code>}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Conflicts aren&apos;t bugs; they&apos;re the system protecting you. But each one costs a
        re-run, so it pays to design jobs that rarely overlap.
      </p>
      <p>
        Every tip follows from the same rule: B fails only if A changed files B read. Make those
        sets small and separate.
      </p>
      <p className="text-subtle text-xs">
        Iceberg retries failed commits automatically (<code>commit.retry.num-retries</code>, default
        4) when the retry is safe.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Who referees the commit? ------------------------------------------------------ */

type Store = AcidState["store"];
type Format = AcidState["format"];

const STORE_NAMES: Record<Store, string> = {
  s3: "Amazon S3",
  adls: "Azure (ADLS)",
  gcs: "Google Cloud Storage",
};

function referee(format: Format, store: Store) {
  if (format === "delta") {
    if (store === "s3")
      return {
        who: "A log store: DynamoDB for multi-cluster writes",
        how: "Open-source Delta for Spark is safe on S3 when all writes go through one Spark driver. For writers on several clusters, configure the S3DynamoDBLogStore: a DynamoDB table decides which writer gets each log version.",
        watch:
          "delta-rs 1.0 uses S3's own conditional writes (If-None-Match) instead. Catalog-managed tables (Delta 4.x with Unity Catalog) let the catalog decide every commit.",
      };
    if (store === "adls")
      return {
        who: "The storage itself",
        how: "Delta's Azure log store writes the commit to a temporary file, then renames it to the next version. On ADLS a rename that refuses to overwrite is atomic, so only one writer gets each version.",
        watch: "No extra service needed for multiple writers.",
      };
    return {
      who: "The storage itself",
      how: "Delta's GCS log store creates the next log file with a precondition that it must not exist yet. GCS rejects the second writer.",
      watch: "No extra service needed for multiple writers.",
    };
  }
  if (format === "iceberg")
    return {
      who: "The catalog, on every store",
      how: "Iceberg's commit is a swap of the table's metadata pointer, and the catalog performs it conditionally: a REST catalog checks the commit's requirements (conflict = HTTP 409), Glue uses optimistic locking on a version ID, JDBC runs a conditional UPDATE, Hive Metastore takes a lock.",
      watch:
        "Avoid file-system (“Hadoop”) catalogs on object storage: they rely on renames, are unsafe there, and are deprecated in the Iceberg spec.",
    };
  return {
    who: "A lock provider",
    how: "A single writer with async table services needs only an in-process lock. For several writers, Hudi's optimistic concurrency needs a lock provider: storage-based (inside .hoodie/, no extra service), ZooKeeper, DynamoDB or Hive Metastore.",
    watch:
      "Hudi still labels multi-writer optimistic concurrency as experimental. Non-blocking concurrency (Merge-on-Read with a bucket index) avoids conflicts by resolving them at read or compaction time.",
  };
}

export function Referee() {
  const [s, set] = useSceneState<AcidState>();
  const r = referee(s.format, s.store);

  return (
    <StepLayout
      eyebrow="Under the hood"
      title="Who referees the commit?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={s.format}
              options={[
                ["delta", "Delta"],
                ["iceberg", "Iceberg"],
                ["hudi", "Hudi"],
              ]}
              onChange={(v) => set({ format: v as Format })}
            />
            <Segmented
              size="sm"
              value={s.store}
              options={(Object.keys(STORE_NAMES) as Store[]).map(
                (k) => [k, STORE_NAMES[k]] as [string, string],
              )}
              onChange={(v) => set({ store: v as Store })}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${s.format}-${s.store}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="border-accent/50 bg-accent-soft rounded-2xl border p-4">
                <p className="text-muted text-xs">The referee</p>
                <p className="mt-0.5 text-xl font-semibold tracking-tight">{r.who}</p>
                <p className="text-muted mt-2 text-sm">{r.how}</p>
              </div>
              <div className="border-line bg-surface rounded-xl border p-3 text-sm">
                <p className="font-semibold">Worth knowing</p>
                <p className="text-muted mt-1">{r.watch}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Everything in this module rests on one atomic step: exactly one writer wins each version.
        That guarantee doesn&apos;t come from the table format itself, but from whatever acts as
        referee.
      </p>
      <p>
        Pick a format and a cloud store to see who referees, and what you&apos;d need to set up.
      </p>
      <p className="text-subtle text-xs">
        S3 has offered conditional writes since August 2024, but open-source Delta for Spark
        hasn&apos;t adopted them; check your engine&apos;s docs rather than assuming.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Checkpoint: which promise? ----------------------------------------------------- */

export function PromiseSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which promise saves you?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-promise"
            prompt="Each line describes something that can go wrong. Which ACID promise protects against it?"
            categories={[
              { id: "A", label: "Atomic" },
              { id: "C", label: "Consistent" },
              { id: "I", label: "Isolated" },
              { id: "D", label: "Durable" },
            ]}
            items={[
              {
                id: "crash",
                label: "A job crashes after writing 3 of its 10 data files",
                category: "A",
                why: "Without a commit, none of the files are part of the table. All or nothing.",
              },
              {
                id: "negative",
                label: "A row arrives with amount = −40, breaking a CHECK (amount >= 0)",
                category: "C",
                why: "The constraint is checked before commit, and the whole write is rejected.",
              },
              {
                id: "half-merge",
                label: "A dashboard query runs while a big MERGE is committing",
                category: "I",
                why: "The dashboard reads one snapshot, before or after the MERGE, never a mix.",
              },
              {
                id: "power",
                label: "The commit is acknowledged, then the whole cluster is lost",
                category: "D",
                why: "The commit lives in object storage, not on the cluster, so it survives.",
              },
              {
                id: "type",
                label: "A job tries to write text into an integer column",
                category: "C",
                why: "Schema enforcement rejects the write before anything is committed.",
              },
              {
                id: "stale-read",
                label: "An UPDATE was based on rows another job changed in the meantime",
                category: "I",
                why: "Conflict detection at commit time catches it, and the UPDATE fails instead of overwriting.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Sort each failure by the promise that prevents it.</p>
    </StepLayout>
  );
}

/* 9 ─ Wrap-up --------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Four promises, four failures",
    "Atomic: crashes. Consistent: broken rules. Isolated: interference. Durable: loss after success.",
  ],
  [
    "One atomic write carries the table",
    "Files are invisible until one small commit, refereed by storage, a catalog or a lock.",
  ],
  [
    "Readers never wait",
    "Every reader pins a snapshot; writers and readers don't block each other.",
  ],
  [
    "Writers check at the end",
    "The second committer fails only if the first changed files it read. Blind appends are never the ones to fail.",
  ],
  [
    "Isolation level is a trade-off",
    "Serializable keeps history exact; WriteSerializable lets more appends through. Open-source Delta uses Serializable.",
  ],
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
        You can now explain how a lakehouse is <Term id="acid">ACID</Term> without a database
        server, predict when two writers will clash, and say who referees the commit on your
        platform.
      </p>
      <p>
        Next, <strong>Updates &amp; deletes</strong> looks closely at the most common source of
        conflicts: changing rows in immutable files.
      </p>
    </StepLayout>
  );
}
