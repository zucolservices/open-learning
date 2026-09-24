"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "@/toolkit/controls/stepper";
import type { IcebergState } from "./state";

/* 12 ─ Row-level deletes ------------------------------------------------------- */

const ROWS = [1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044];
const TARGET = 5; // position of order 1042 in f8.parquet

type DeleteMode = IcebergState["deleteMode"];

const MODES: Record<
  DeleteMode,
  {
    label: string;
    version: string;
    writes: string;
    artifact: string;
    reader: string;
    write: number;
    read: number;
  }
> = {
  cow: {
    label: "Copy-on-write",
    version: "any version",
    writes: "a new copy of f8 without the row",
    artifact: "f8-v2.parquet  (7 rows, all copied)",
    reader:
      "Nothing extra. The new snapshot simply lists the new file instead of f8. The price was paid at write time: a whole file rewritten to remove one row.",
    write: 5,
    read: 0,
  },
  position: {
    label: "Position delete",
    version: "format v2",
    writes: "a small delete file naming the file and row position",
    artifact: '{ file_path: "…/f8.parquet", pos: 5 }',
    reader:
      "Loads the positions for f8 and skips row 5 while reading. The writer first had to find where the row was. In v3 tables, new position delete files are no longer allowed: deletion vectors replace them.",
    write: 2,
    read: 2,
  },
  equality: {
    label: "Equality delete",
    version: "format v2",
    writes: "a small delete file with the key values to remove",
    artifact: "{ order_id: 1042 }",
    reader:
      "Must check every row of every older data file it applies to against the deleted keys. Cheapest to write (no need to find the row), most expensive to read until the table is compacted.",
    write: 1,
    read: 4,
  },
  dv: {
    label: "Deletion vector",
    version: "format v3",
    writes: "a compact bitmap for f8, stored in a Puffin file",
    artifact: "f8 → bitmap 00000100",
    reader:
      "Loads f8's bitmap and skips the marked rows. Very fast. A data file has at most one deletion vector; later deletes merge into it.",
    write: 2,
    read: 1,
  },
};

export function RowDeletes() {
  const [s, set] = useSceneState<IcebergState>();
  const m = MODES[s.deleteMode];
  const cow = s.deleteMode === "cow";

  return (
    <StepLayout
      eyebrow="Row-level changes"
      title="One DELETE, four ways to record it"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Code>{"DELETE FROM orders WHERE order_id = 1042;"}</Code>
          <Segmented
            size="sm"
            value={s.deleteMode}
            options={(Object.keys(MODES) as DeleteMode[]).map(
              (k) => [k, MODES[k].label] as [string, string],
            )}
            onChange={(v) => set({ deleteMode: v as DeleteMode })}
          />

          <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex gap-3">
              <FileColumn title="f8.parquet" crossed={cow} highlight={cow ? undefined : TARGET} />
              <AnimatePresence>
                {cow && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <FileColumn title="f8-v2" rows={ROWS.filter((_, i) => i !== TARGET)} fresh />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={s.deleteMode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="border-line bg-surface rounded-xl border p-3">
                  <p className="text-muted text-xs">
                    Writes <span className="text-subtle">({m.version})</span>: {m.writes}
                  </p>
                  <p
                    className={cn(
                      "mt-2 rounded-md px-2 py-1.5 font-mono text-[11px]",
                      cow ? "bg-viz-data/15" : "bg-viz-remove/10 text-viz-remove",
                    )}
                  >
                    {m.artifact}
                  </p>
                </div>
                <p className="text-muted text-sm">{m.reader}</p>
                <div className="grid gap-2">
                  <Meter label="Work when deleting" value={m.write} tone="bg-viz-meta" />
                  <Meter label="Extra work on every read" value={m.read} tone="bg-viz-compute" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-subtle text-[11px]">Meters are relative, for comparison only.</p>
        </div>
      }
    >
      <p>
        Data files never change, so how do you delete one row? One way is{" "}
        <Term id="copy-on-write">copy-on-write</Term>: rewrite the file without it. The other is{" "}
        <Term id="merge-on-read">merge-on-read</Term>: write down what&apos;s deleted, and let
        readers skip it.
      </p>
      <p>
        Iceberg supports both, and has three ways of writing things down. Try each one and compare
        who pays: the writer, or every reader afterwards.
      </p>
      <p className="text-subtle text-xs">
        Delete files are tracked in their own manifests, so the tree tells readers which deletes
        apply to which data files. Compaction later folds them back into clean files. The full
        comparison is in <em>Updates &amp; deletes</em>.
      </p>
    </StepLayout>
  );
}

function FileColumn({
  title,
  rows = ROWS,
  highlight,
  crossed,
  fresh,
}: {
  title: string;
  rows?: number[];
  highlight?: number;
  crossed?: boolean;
  fresh?: boolean;
}) {
  return (
    <div className="w-24">
      <p
        className={cn(
          "mb-1 font-mono text-[10px]",
          crossed ? "text-viz-remove line-through" : fresh ? "text-viz-add" : "text-muted",
        )}
      >
        {title}
      </p>
      <ul
        className={cn(
          "grid gap-0.5 rounded-lg border p-1 font-mono text-[10px]",
          crossed
            ? "border-viz-remove/60 border-dashed opacity-60"
            : fresh
              ? "border-viz-add bg-viz-add/10"
              : "border-viz-data/60 bg-viz-data/10",
        )}
      >
        {rows.map((r, i) => (
          <li
            key={r}
            className={cn(
              "flex justify-between rounded px-1.5 py-0.5",
              i === highlight && "bg-viz-remove/25 text-viz-remove line-through",
            )}
          >
            <span className="text-subtle">{i}</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <p className="text-muted mb-1 text-[11px]">{label}</p>
      <div className="bg-surface-2 h-2 overflow-hidden rounded-full">
        <motion.div
          className={cn("h-full rounded-full", tone)}
          initial={false}
          animate={{ width: `${Math.max(3, value * 20)}%` }}
        />
      </div>
    </div>
  );
}

/* 13 ─ Checkpoint: which delete? ------------------------------------------------ */

export function DeleteCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the delete"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="which-delete"
            prompt="A streaming job receives thousands of “order cancelled” events per second, each with just an order_id. It must record the deletes immediately, without reading any data files. Which kind of delete fits?"
            options={[
              {
                id: "cow",
                label: "Copy-on-write",
                feedback:
                  "It would have to read and rewrite every file containing a cancelled order, over and over.",
              },
              {
                id: "position",
                label: "Position deletes",
                feedback:
                  "Positions require knowing which file and row each order is in, which means reading data first.",
              },
              {
                id: "equality",
                label: "Equality deletes",
                correct: true,
                feedback:
                  "Right. “Delete where order_id = 1042” can be written knowing only the key. It's what streaming writers such as Flink use for upserts.",
              },
              {
                id: "dv",
                label: "Deletion vectors",
                feedback:
                  "Deletion vectors mark row positions too, so the writer still has to find the rows.",
              },
            ]}
            explanation="The catch: readers pay until a maintenance job compacts the equality deletes away. Fast writes today, a clean-up job tomorrow."
          />
        </div>
      }
    >
      <p>Think about what each kind of delete needs to know when it&apos;s written.</p>
    </StepLayout>
  );
}

/* 14 ─ Keeping it healthy, and where it runs ------------------------------------ */

const MAINTENANCE = [
  {
    title: "Expire old snapshots",
    code: "CALL system.expire_snapshots(\n  table => 'orders',\n  older_than => TIMESTAMP '2026-09-17 00:00:00');",
    text: "Removes old snapshots from the metadata and deletes files only they used. Time travel can't go back past this point. Snapshots with a tag or branch are kept.",
  },
  {
    title: "Remove orphan files",
    code: "CALL system.remove_orphan_files(table => 'orders');",
    text: "Deletes files that nothing in the tree points to, such as leftovers from failed writes. By default it only touches files older than a few days, so in-progress writes are safe.",
  },
  {
    title: "Compact data files",
    code: "CALL system.rewrite_data_files(table => 'orders');",
    text: "Merges small files into bigger ones and folds delete files back in. Readers get faster; the old files leave the table in a normal commit.",
  },
  {
    title: "Tidy manifests",
    code: "CALL system.rewrite_manifests('orders');",
    text: "Regroups many small manifests so query planning stays quick.",
  },
];

const RUNS_ON = [
  ["Catalogs", "REST catalog (e.g. Apache Polaris, Nessie) · AWS Glue · Hive Metastore · JDBC"],
  ["Open-source engines", "Spark · Flink · Trino · Presto · DuckDB · PyIceberg"],
  ["AWS", "Athena · EMR · Glue · Redshift · S3 Tables"],
  ["Google Cloud", "BigQuery · BigLake · Dataproc"],
  ["Also", "Snowflake · Databricks · Dremio · Microsoft Fabric"],
];

export function Healthy() {
  return (
    <StepLayout
      eyebrow="In practice"
      title="Keeping the tree healthy"
      stage={
        <div className="grid flex-1 content-start gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            {MAINTENANCE.map((m) => (
              <div key={m.title} className="border-line bg-surface rounded-2xl border p-4">
                <p className="font-semibold tracking-tight">{m.title}</p>
                <p className="text-muted mt-1 text-xs leading-relaxed">{m.text}</p>
                <Code className="mt-3 text-[10px]">{m.code}</Code>
              </div>
            ))}
          </div>
          <div className="border-line bg-bg/40 rounded-2xl border p-4">
            <p className="text-muted mb-2 text-xs">Where you&apos;ll meet Iceberg tables</p>
            <dl className="grid gap-1.5 text-xs">
              {RUNS_ON.map(([k, v]) => (
                <div key={k} className="grid gap-x-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
                  <dt className="font-medium">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      }
    >
      <p>
        Every commit leaves the old tree behind: that&apos;s what makes time travel work. Left
        alone, snapshots, small files and delete files pile up.
      </p>
      <p>
        So Iceberg tables need regular housekeeping. Engines such as Spark ship these as procedures,
        and many managed services run them for you.
      </p>
      <p className="text-subtle text-xs">
        Iceberg is one of the most widely supported table formats. Platforms and catalogs each get
        their own modules later in the track.
      </p>
    </StepLayout>
  );
}

/* 15 ─ Wrap-up ------------------------------------------------------------------ */

const COMPARE: [string, string, string][] = [
  [
    "The table's truth",
    "An ordered log of commits in _delta_log/",
    "A tree: metadata file → manifest list → manifests",
  ],
  [
    "Find the current table",
    "Replay the log from the last checkpoint",
    "Ask the catalog for one pointer",
  ],
  [
    "A commit is",
    "Creating the next log file, only if it doesn't exist",
    "Swapping the catalog pointer, only if unchanged",
  ],
  [
    "Skipping files",
    "Per-file stats in the log",
    "Partition summaries per manifest, then per-file stats",
  ],
  ["Partitioning", "Partition columns, or liquid clustering", "Hidden transforms that can evolve"],
];

const TAKEAWAYS: [string, string][] = [
  [
    "A tree over immutable files",
    "Catalog → metadata file → manifest list → manifests → data files. Each level summarises the one below.",
  ],
  [
    "Reads walk down and skip",
    "Partition summaries skip manifests; column stats skip files. No folder is ever listed.",
  ],
  [
    "Writes build a new top",
    "New files first, then new metadata above them, then one atomic pointer swap. Unchanged branches are reused.",
  ],
  [
    "IDs and transforms make change cheap",
    "Field IDs keep renames and drops safe; hidden partitioning can evolve without rewriting data.",
  ],
  [
    "History is a list of snapshots",
    "Time travel, branches and tags all point into it. Expire snapshots to reclaim storage.",
  ],
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
            <table className="w-full text-xs">
              <thead className="bg-surface-2/60 text-muted">
                <tr>
                  <th className="px-3 py-2 text-left font-medium" />
                  <th className="px-3 py-2 text-left font-medium">Delta Lake</th>
                  <th className="px-3 py-2 text-left font-medium">Iceberg</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([k, d, i]) => (
                  <tr key={k} className="border-line border-t align-top">
                    <td className="px-3 py-2 font-medium">{k}</td>
                    <td className="text-muted px-3 py-2">{d}</td>
                    <td className="text-muted px-3 py-2">{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <p>
        You followed a query down the tree, built a commit from the bottom up, and changed a
        table&apos;s shape without rewriting a single data file.
      </p>
      <p>
        Next, <strong>Apache Hudi</strong> takes a third path: a timeline of actions built for
        frequent upserts and incremental processing.
      </p>
    </StepLayout>
  );
}
