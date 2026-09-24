"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ShowdownState } from "./state";

/* 5 ─ Feature by feature ---------------------------------------------------------- */

const FEATURES: {
  id: string;
  label: string;
  delta: string;
  iceberg: string;
  hudi: string;
  note: string;
}[] = [
  {
    id: "time-travel",
    label: "Time travel",
    delta: "VERSION AS OF / TIMESTAMP AS OF. History lasts until VACUUM removes old files.",
    iceberg:
      "Read any snapshot, plus named branches and tags. History lasts until snapshots are expired.",
    hudi: "Query as of an instant. History lasts until the cleaner removes old file slices; savepoints keep a point.",
    note: "All three: time travel is free until clean-up, then gone. Retention settings decide how far back you can go.",
  },
  {
    id: "schema",
    label: "Schema changes",
    delta: "Add and widen columns easily. Rename and drop need column mapping switched on.",
    iceberg: "Every column has an ID, so add, drop, rename and reorder are all metadata-only.",
    hudi: "Adding columns is routine. Fuller evolution (rename, drop) uses its experimental schema-on-read mode.",
    note: "Iceberg designed for this from day one. The others added ID-style mapping later.",
  },
  {
    id: "layout",
    label: "Partitioning & layout",
    delta: "Fixed partition columns, or liquid clustering, whose keys can change later.",
    iceberg: "Hidden partitioning with transforms; the partition spec can evolve without rewrites.",
    hudi: "Partition paths from the record key setup; clustering and bucket indexes shape files.",
    note: "Changing layout without rewriting old data is now possible in all three, in different ways.",
  },
  {
    id: "changes",
    label: "Updates & deletes",
    delta: "Rewrite files by default; deletion vectors mark rows instead.",
    iceberg: "Rewrite by default; merge-on-read writes delete files (v2) or deletion vectors (v3).",
    hudi: "Chosen per table: Copy-on-Write or Merge-on-Read, with indexes to find keys fast.",
    note: "Hudi treats frequent upserts as its core use case, with the most tuning knobs for it.",
  },
  {
    id: "concurrency",
    label: "Concurrent writers",
    delta: "Optimistic: conflicts detected per operation and file; non-conflicting writes retry.",
    iceberg: "Optimistic: the catalog swaps the pointer atomically; writers validate and retry.",
    hudi: "Optimistic with a lock provider; table services run alongside; non-blocking mode for MoR.",
    note: "All three are optimistic. How often conflicts happen depends on how writes overlap, not the format.",
  },
  {
    id: "streaming",
    label: "Streaming & changes",
    delta: "Spark Structured Streaming source and sink; change data feed for row-level changes.",
    iceberg:
      "Flink is the main streaming writer; incremental reads between snapshots; changelog views.",
    hudi: "Spark and Flink streaming writers, incremental queries and CDC queries built in.",
    note: "Incremental processing is Hudi's original purpose; the others have caught up for common cases.",
  },
  {
    id: "engines",
    label: "Where it runs",
    delta:
      "Native in Databricks and Microsoft Fabric; Spark, Trino, DuckDB; read by Snowflake, BigQuery, Athena.",
    iceberg:
      "Widest support: Spark, Flink, Trino, DuckDB, Snowflake, BigQuery, AWS (S3 Tables, Athena, EMR), Databricks.",
    hudi: "Spark, Flink, Trino, Presto, Hive, StarRocks, Doris; AWS EMR, Glue, Athena, Redshift.",
    note: "Ecosystem is usually the deciding factor. Check what your platform supports natively, especially for writes.",
  },
];

const FORMAT_COLS = [
  { key: "delta" as const, name: "Delta Lake", tone: "border-viz-data/50" },
  { key: "iceberg" as const, name: "Iceberg", tone: "border-viz-meta/50" },
  { key: "hudi" as const, name: "Hudi", tone: "border-viz-add/50" },
];

export function FeatureMatrix() {
  const [s, set] = useSceneState<ShowdownState>();
  const f = FEATURES.find((x) => x.id === s.feature) ?? FEATURES[0];

  return (
    <StepLayout
      eyebrow="Compare"
      title="Feature by feature"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {FEATURES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ feature: x.id })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  x.id === f.id
                    ? "bg-accent text-accent-fg"
                    : "bg-surface-2 text-muted hover:text-fg",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {FORMAT_COLS.map((c, i) => (
              <AnimatePresence mode="wait" key={c.key}>
                <motion.div
                  key={`${f.id}-${c.key}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className={cn("bg-surface rounded-2xl border-2 p-4", c.tone)}
                >
                  <p className="text-muted text-xs">{c.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed">{f[c.key]}</p>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={f.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-line bg-bg/40 rounded-xl border px-4 py-3"
            >
              <p className="text-xs font-semibold">The nuance</p>
              <p className="text-muted mt-1 text-sm">{f.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Pick a capability and compare how each format handles it. You&apos;ll notice there&apos;s
        rarely a “can’t”: the differences are in approach, defaults and maturity.
      </p>
      <p>
        That&apos;s why there&apos;s no scoreboard here. A feature table can&apos;t choose for you;
        your platform and workload can.
      </p>
      <p className="text-subtle text-xs">
        Support changes quickly. This reflects the formats as of September 2026; check current docs
        before relying on a detail.
      </p>
    </StepLayout>
  );
}

/* 6 ─ One copy, many formats ------------------------------------------------------ */

const INTEROP = {
  uniform: {
    title: "Delta UniForm",
    writer: "Delta writer (Databricks, Spark)",
    produces: ["_delta_log/  (Delta)", "metadata/  (Iceberg)"],
    readers: ["Delta readers: read and write", "Iceberg readers: read only"],
    how: "Turn it on as a table property. Each Delta commit also produces Iceberg metadata for the same Parquet files; since Delta 4.3 it's written together with the commit itself. Hudi metadata is available in preview.",
    limits: [
      "Needs column mapping switched on",
      "Non-Delta clients may only read: an outside writer could corrupt the Delta table",
      "Deletion vectors need Iceberg v3 compatibility (IcebergCompatV3); the older V2 mode can't use them",
    ],
  },
  xtable: {
    title: "Apache XTable",
    writer: "Any format's writer",
    produces: [
      "source metadata (e.g. .hoodie/)",
      "+ target metadata (e.g. _delta_log/, metadata/)",
    ],
    readers: ["Readers of every synced format"],
    how: "A separate sync job, run on a schedule or after writes. It reads one format's metadata and writes the others', incrementally or in full, and can register the result in catalogs such as Glue or Hive Metastore.",
    limits: [
      "Still incubating at Apache",
      "Syncs Copy-on-Write or read-optimized views only: Hudi log files and deletion vectors aren't translated",
      "Another job to schedule and monitor",
    ],
  },
};

export function OneCopy() {
  const [s, set] = useSceneState<ShowdownState>();
  const x = INTEROP[s.interop];

  return (
    <StepLayout
      eyebrow="Interoperability"
      title="One copy of data, many formats"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.interop}
            options={[
              ["uniform", "Delta UniForm"],
              ["xtable", "Apache XTable"],
            ]}
            onChange={(v) => set({ interop: v as ShowdownState["interop"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.interop}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="border-line bg-bg/40 flex flex-col items-center gap-2 rounded-2xl border p-4 text-center">
                <span className="border-viz-compute/60 bg-viz-compute/15 rounded-lg border px-3 py-1.5 text-sm">
                  {x.writer}
                </span>
                <ArrowDown className="text-subtle size-4" />
                <div className="flex flex-wrap justify-center gap-2">
                  {x.produces.map((p) => (
                    <span
                      key={p}
                      className="border-viz-meta/60 bg-viz-meta/15 rounded-lg border px-2.5 py-1 font-mono text-[11px]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span
                      key={i}
                      className="border-viz-data/60 bg-viz-data/15 h-7 w-5 rounded border"
                    />
                  ))}
                </div>
                <p className="text-subtle text-[11px]">the same Parquet data files, never copied</p>
                <ArrowDown className="text-subtle size-4" />
                <div className="flex flex-wrap justify-center gap-2">
                  {x.readers.map((r) => (
                    <span key={r} className="bg-surface-2 rounded-full px-3 py-1 text-xs">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-muted text-sm">{x.how}</p>
              <ul className="grid gap-1.5">
                {x.limits.map((l) => (
                  <li key={l} className="text-muted flex gap-2 text-xs">
                    <ArrowRight className="text-viz-compute mt-0.5 size-3 shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        The data files are Parquet in every format, so going from one format to another only means
        writing different <strong>metadata</strong> over the same files. No data is copied.
      </p>
      <p>Two tools do this. Compare where each runs and what it can&apos;t translate yet.</p>
      <p className="text-subtle text-xs">
        Platforms do this too: Microsoft Fabric&apos;s OneLake can present Delta tables as Iceberg
        and Iceberg tables as Delta through metadata virtualization.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint ----------------------------------------------------------------- */

export function InteropCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Delta writers, Iceberg readers"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="interop"
            prompt="Your data engineers write Delta tables in Databricks. A partner team wants to query them from an engine that reads Iceberg only. What's the least-effort option?"
            options={[
              {
                id: "copy",
                label: "Run a nightly job copying the tables into new Iceberg tables",
                feedback:
                  "It works, but doubles storage and leaves the copy up to a day stale. Only metadata needs translating.",
              },
              {
                id: "uniform",
                label: "Enable UniForm on the Delta tables so Iceberg metadata is written too",
                correct: true,
                feedback:
                  "Right. One copy of the data; the partner reads it as Iceberg, read-only.",
              },
              {
                id: "migrate",
                label: "Migrate everything to Iceberg and retrain the data engineers",
                feedback:
                  "Far more work than needed when a metadata layer solves the reading problem.",
              },
              {
                id: "writes",
                label: "Let the partner team write to the tables with their Iceberg engine",
                feedback:
                  "UniForm's Iceberg side is read-only: outside writers could corrupt the Delta table.",
              },
            ]}
            explanation="If they weren't on a platform with UniForm, a scheduled XTable sync would be the next option, with its copy-on-write limitations."
          />
        </div>
      }
    >
      <p>Think about what actually needs to change for another engine to read the table.</p>
    </StepLayout>
  );
}

/* 8 ─ Catalogs ------------------------------------------------------------------- */

const CATALOGS: [string, string][] = [
  [
    "Unity Catalog",
    "Databricks' catalog, open-sourced in 2024. Governs Delta and Iceberg tables and serves Iceberg tables over the REST API.",
  ],
  [
    "Apache Polaris",
    "An Iceberg REST catalog started at Snowflake; an Apache top-level project since 2026. Snowflake Open Catalog is the managed version.",
  ],
  [
    "AWS Glue & S3 Tables",
    "Glue Data Catalog for Iceberg, Delta and Hudi on AWS; S3 Tables are Iceberg tables managed by S3 itself.",
  ],
  [
    "Others",
    "Project Nessie (Git-like branches), Lakekeeper, Apache Gravitino, and the long-lived Hive Metastore.",
  ],
];

export function Catalogs() {
  return (
    <StepLayout
      eyebrow="Catalogs"
      title="Where the formats meet"
      stage={
        <div className="grid flex-1 content-start gap-4">
          <div className="border-accent/50 bg-accent-soft rounded-2xl border p-4">
            <p className="font-semibold">What a catalog does for a table</p>
            <ul className="text-muted mt-2 grid gap-1 text-sm sm:grid-cols-3">
              <li>Finds tables by name</li>
              <li>Tracks the current version and commits new ones</li>
              <li>Decides who may read and write</li>
            </ul>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {CATALOGS.map(([name, body], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-2xl border p-4"
              >
                <p className="font-semibold">{name}</p>
                <p className="text-muted mt-1 text-xs leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Engines rarely open a table by its storage path. They ask a{" "}
        <Term id="catalog">catalog</Term> for it by name, and increasingly, the catalog also commits
        changes and enforces access.
      </p>
      <p>
        The Iceberg REST catalog API has become a common language: an engine that speaks it can use
        any catalog that does. That&apos;s why your catalog choice now matters as much as your
        format choice.
      </p>
      <p className="text-subtle text-xs">
        Catalogs get a full module later in the track: <em>Catalogs: the source of truth</em>.
      </p>
    </StepLayout>
  );
}
