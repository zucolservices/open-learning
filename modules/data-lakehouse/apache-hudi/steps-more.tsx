"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import type { HudiState } from "./state";

/* 9 ─ Table services ------------------------------------------------------------ */

const SERVICES = [
  {
    title: "Cleaning",
    action: "clean",
    text: "Deletes old file slices no longer needed. By default it keeps the files for the last N commits, which is exactly how far back time travel and incremental reads can go. A savepoint protects a point in time from the cleaner.",
    code: "hoodie.clean.commits.retained = 10",
  },
  {
    title: "Compaction",
    action: "compaction → commit",
    text: "Merge-on-Read only. Merges each file group's log files into a new base file, so reads stay fast. Scheduled first, then executed; runs asynchronously by default.",
    code: "hoodie.compact.inline = true   # or run it async",
  },
  {
    title: "Clustering",
    action: "clustering → replacecommit",
    text: "Rewrites data into better files: merges small files and sorts rows so queries can skip more. The new file groups replace the old ones in one commit.",
    code: "hoodie.clustering.inline = true",
  },
  {
    title: "Archiving",
    action: "timeline history",
    text: "Moves old completed instants out of the active timeline into a compact history (an LSM-style store in 1.x), so the active timeline stays small and fast to read.",
    code: "hoodie.keep.max.commits = 30",
  },
];

export function TableServices() {
  return (
    <StepLayout
      eyebrow="Table services"
      title="The crew that keeps a table healthy"
      stage={
        <div className="grid flex-1 content-start gap-3 md:grid-cols-2">
          {SERVICES.map((sv, i) => (
            <motion.div
              key={sv.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex flex-col rounded-2xl border p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold tracking-tight">{sv.title}</p>
                <span className="bg-viz-meta/15 text-viz-meta rounded-full px-2 py-0.5 font-mono text-[10px]">
                  {sv.action}
                </span>
              </div>
              <p className="text-muted mt-1.5 flex-1 text-xs leading-relaxed">{sv.text}</p>
              <Code className="mt-3 text-[10px]">{sv.code}</Code>
            </motion.div>
          ))}
          <div className="border-line bg-bg/40 rounded-2xl border p-4 md:col-span-2">
            <p className="text-sm font-semibold">Three ways to run them</p>
            <ul className="text-muted mt-2 grid gap-1.5 text-xs sm:grid-cols-3">
              <li>
                <strong className="text-fg">Inline:</strong> right after a write, in the same job.
                Simple, but writes take longer.
              </li>
              <li>
                <strong className="text-fg">Async:</strong> in the background of a long-running
                writer, such as a streaming job.
              </li>
              <li>
                <strong className="text-fg">Standalone:</strong> a separate job on its own schedule
                and its own cluster.
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Hudi ships more than a file layout. It comes with <strong>table services</strong>: jobs that
        tidy the table as it changes. Each one records its work as an instant on the timeline, like
        any write.
      </p>
      <p>
        You met compaction and cleaning in the simulation. Together with clustering and archiving,
        they&apos;re what let a table take a stream of upserts all day without slowing down.
      </p>
      <p className="text-subtle text-xs">
        Delta and Iceberg have equivalents (OPTIMIZE, VACUUM, expire_snapshots), usually run as
        separate commands. Hudi builds them into its writers. More in{" "}
        <em>Keeping tables healthy</em>.
      </p>
    </StepLayout>
  );
}

/* 10 ─ Indexes ------------------------------------------------------------------ */

type IndexType = HudiState["indexType"];

const INDEXES: Record<
  IndexType,
  { label: string; config: string; how: string[]; good: string; watch: string; lookup: number }
> = {
  simple: {
    label: "Simple",
    config: "hoodie.index.type = SIMPLE   # default for Spark",
    how: [
      "Read the record keys stored in the partition's files",
      "Join them with the incoming keys",
      "Matches are updates; the rest are inserts",
    ],
    good: "Updates spread randomly across a table. Predictable, no extra storage.",
    watch: "Cost grows with the size of the partitions being updated.",
    lookup: 3,
  },
  bloom: {
    label: "Bloom",
    config: "hoodie.index.type = BLOOM",
    how: [
      "Each base file stores a bloom filter of its keys (and their min/max)",
      "Skip files whose filter says “definitely not here”",
      "Check the few remaining files for the actual key",
    ],
    good: "Keys that arrive roughly in order, such as time-based IDs, where updates hit recent files.",
    watch: "Random keys defeat the min/max ranges; false positives mean extra reads.",
    lookup: 2,
  },
  bucket: {
    label: "Bucket",
    config: "hoodie.index.type = BUCKET\nhoodie.bucket.index.num.buckets = 16",
    how: [
      "hash(record key) mod number-of-buckets",
      "That number is the file group. No lookup at all",
    ],
    good: "Very high write rates. Also needed for non-blocking concurrent writers.",
    watch:
      "Pick the bucket count up front. A consistent-hashing variant (Merge-on-Read only) can resize.",
    lookup: 0.5,
  },
  record: {
    label: "Record-level",
    config: "hoodie.index.type = RECORD_LEVEL_INDEX",
    how: ["The metadata table stores every key → file group", "Look the incoming keys up directly"],
    good: "Huge tables with random updates: lookups stay fast as the table grows.",
    watch: "Extra storage and work to keep it up to date on every write.",
    lookup: 1,
  },
};

export function Indexes() {
  const [s, set] = useSceneState<HudiState>();
  const ix = INDEXES[s.indexType];

  return (
    <StepLayout
      eyebrow="Indexes"
      title="Four ways to find a key"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.indexType}
            options={(Object.keys(INDEXES) as IndexType[]).map(
              (k) => [k, INDEXES[k].label] as [string, string],
            )}
            onChange={(v) => set({ indexType: v as IndexType })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.indexType}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="border-line bg-bg/40 rounded-2xl border p-4">
                <p className="text-muted mb-2 text-xs">
                  Where does <code>t-4821</code> live?
                </p>
                <ol className="grid gap-2">
                  {ix.how.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 * i }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="bg-viz-meta/15 text-viz-meta grid size-6 shrink-0 place-items-center rounded-full font-mono text-[11px]">
                        {i + 1}
                      </span>
                      {h}
                    </motion.li>
                  ))}
                </ol>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs">
                  <p className="text-fg font-semibold">Good for</p>
                  <p className="text-muted mt-1">{ix.good}</p>
                </div>
                <div className="border-line bg-surface rounded-xl border p-3 text-xs">
                  <p className="text-fg font-semibold">Watch out</p>
                  <p className="text-muted mt-1">{ix.watch}</p>
                </div>
              </div>
              <div>
                <p className="text-muted mb-1 text-[11px]">Lookup work per batch (relative)</p>
                <div className="bg-surface-2 h-2 overflow-hidden rounded-full">
                  <motion.div
                    className="bg-viz-compute h-full rounded-full"
                    initial={false}
                    animate={{ width: `${ix.lookup * 30}%` }}
                  />
                </div>
              </div>
              <Code className="text-[10px]">{ix.config}</Code>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Every upsert starts with the same question: which file group holds this key? The{" "}
        <Term id="hudi-index">index</Term> answers it, and there&apos;s more than one way to build
        one.
      </p>
      <p>Compare four common index types. None is best for everything.</p>
      <p className="text-subtle text-xs">
        Most indexes are per partition. <em>Global</em> variants make a key unique across the whole
        table, at a higher lookup cost. Flink writers keep their own index in Flink state by
        default.
      </p>
    </StepLayout>
  );
}

/* 11 ─ Checkpoint: CoW or MoR? --------------------------------------------------- */

export function TableTypeSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Copy-on-Write or Merge-on-Read?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="cow-or-mor"
            prompt="Which table type fits each workload best?"
            categories={[
              { id: "cow", label: "Copy-on-Write" },
              { id: "mor", label: "Merge-on-Read" },
            ]}
            items={[
              {
                id: "dashboard",
                label: "Loaded once a night, queried all day by dashboards",
                category: "cow",
                why: "Rare writes, constant reads: pay once at write time so every read is plain Parquet.",
              },
              {
                id: "cdc",
                label: "Changes copied from an app database every minute",
                category: "mor",
                why: "Frequent small updates: cheap log appends keep up, compaction tidies later.",
              },
              {
                id: "simple-readers",
                label: "Must be readable by engines that only understand plain Parquet",
                category: "cow",
                why: "Copy-on-Write has no log files to merge, so every reader sees the full, latest data.",
              },
              {
                id: "streaming",
                label: "A streaming job upserts millions of rows an hour, and freshness matters",
                category: "mor",
                why: "Rewriting whole base files on every micro-batch would never keep up.",
              },
              {
                id: "append",
                label: "Mostly appends, occasional corrections, simple to operate",
                category: "cow",
                why: "Little write amplification to worry about, and no compaction to schedule.",
              },
            ]}
            explanation="The rule of thumb: Copy-on-Write when reads dominate and writes are occasional; Merge-on-Read when updates are frequent and write latency matters."
          />
        </div>
      }
    >
      <p>
        You&apos;ve seen both table types in action. Sort each workload by where you&apos;d rather
        pay: at write time, or at read time.
      </p>
    </StepLayout>
  );
}

/* 12 ─ Concurrency and the metadata table ----------------------------------------- */

const CONCURRENCY: [string, string][] = [
  [
    "One writer + table services",
    "The common setup. One job writes; compaction, cleaning and clustering run beside it without blocking it, because each works on its own file slices (multi-version concurrency).",
  ],
  [
    "Several writers: optimistic",
    "Writers take a lock only at commit time, then check for overlapping file groups. If two touched the same file group, one fails and retries. Locks can come from storage itself, ZooKeeper, DynamoDB or the Hive Metastore.",
  ],
  [
    "Several writers: non-blocking (1.0+)",
    "For Merge-on-Read tables with a bucket index, writers never fail each other. Both append logs; the conflict is resolved when reading or compacting, using completion time and ordering fields.",
  ],
];

export function ConcurrencyAndMetadata() {
  return (
    <StepLayout
      eyebrow="Under the hood"
      title="Many writers, and a table about the table"
      stage={
        <div className="grid flex-1 content-start gap-4">
          <div className="grid gap-2.5">
            {CONCURRENCY.map(([title, body], i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-2xl border p-4"
              >
                <p className="font-semibold">{title}</p>
                <p className="text-muted mt-1 text-sm">{body}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-viz-meta/40 bg-viz-meta/10 rounded-2xl border p-4">
            <p className="font-semibold">
              The metadata table{" "}
              <span className="text-muted font-mono text-xs">.hoodie/metadata/</span>
            </p>
            <p className="text-muted mt-1 text-sm">
              An internal Merge-on-Read table, kept in step with every commit. Engines read it
              instead of listing folders or opening file footers.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "files",
                "column_stats",
                "partition_stats",
                "bloom_filters",
                "record_index",
                "secondary indexes",
                "expression indexes",
              ].map((p) => (
                <span
                  key={p}
                  className="bg-surface text-muted rounded-full px-2.5 py-1 font-mono text-[10px]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Two more pieces complete the picture. First, what happens when more than one job writes to a
        table: Hudi offers three levels of{" "}
        <Term id="optimistic-concurrency">concurrency control</Term>.
      </p>
      <p>
        Second, the <Term id="hudi-metadata-table">metadata table</Term>. Listing millions of files
        in object storage is slow (module 2), so Hudi keeps file lists and statistics in a table of
        its own.
      </p>
    </StepLayout>
  );
}

/* 13 ─ Wrap-up -------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Built for changing rows", "Upserts by record key, and incremental reads of just what changed."],
  [
    "The timeline is the truth",
    "Every action is an instant: requested → inflight → completed. Readers trust only completed instants.",
  ],
  [
    "Keys live in file groups",
    "An index maps each key to its file group, so an update touches only that group.",
  ],
  [
    "Two table types, one trade-off",
    "Copy-on-Write rewrites base files (cheap reads). Merge-on-Read appends logs (cheap writes) and compacts later.",
  ],
  [
    "Services come built in",
    "Cleaning, compaction, clustering and archiving run inline, async or standalone.",
  ],
];

const COMPARE: [string, string, string, string][] = [
  [
    "Core structure",
    "Ordered log of commits",
    "Tree of metadata files",
    "Timeline of instants + file groups",
  ],
  [
    "Designed first for",
    "Reliable batch + streaming on Spark",
    "Huge analytic tables, many engines",
    "Frequent upserts, incremental pipelines",
  ],
  [
    "Row-level changes",
    "Rewrite, or deletion vectors",
    "Rewrite, delete files, deletion vectors",
    "Copy-on-Write or Merge-on-Read by table",
  ],
  ["Housekeeping", "OPTIMIZE, VACUUM", "Maintenance procedures", "Built-in table services"],
];

const ENGINES = [
  "Apache Spark",
  "Apache Flink",
  "Trino · Presto · Hive",
  "StarRocks · Doris",
  "AWS EMR · Glue · Athena · Redshift",
  "Onehouse",
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-5">
          <div className="grid gap-2.5">
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
          <div className="border-line bg-surface overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[34rem] text-xs">
              <thead className="bg-surface-2/60 text-muted">
                <tr>
                  <th className="px-3 py-2 text-left font-medium" />
                  <th className="px-3 py-2 text-left font-medium">Delta Lake</th>
                  <th className="px-3 py-2 text-left font-medium">Iceberg</th>
                  <th className="px-3 py-2 text-left font-medium">Hudi</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([k, d, i, h]) => (
                  <tr key={k} className="border-line border-t align-top">
                    <td className="px-3 py-2 font-medium">{k}</td>
                    <td className="text-muted px-3 py-2">{d}</td>
                    <td className="text-muted px-3 py-2">{i}</td>
                    <td className="text-muted px-3 py-2">{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="text-muted mb-2 text-xs">Where you&apos;ll meet Hudi tables</p>
            <div className="flex flex-wrap gap-1.5">
              {ENGINES.map((e) => (
                <span key={e} className="bg-surface-2 text-muted rounded-full px-2.5 py-1 text-xs">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        You streamed upserts into a table, watched Copy-on-Write and Merge-on-Read pay their costs
        in different places, and read the same table three different ways.
      </p>
      <p>
        That completes the three formats. Next, <strong>Delta vs Iceberg vs Hudi</strong> puts them
        side by side, including tools such as Apache XTable that translate one format&apos;s
        metadata into another&apos;s.
      </p>
    </StepLayout>
  );
}
