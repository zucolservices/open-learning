"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import type { DeltaState } from "./state";

/* 13 ─ Modern Delta ----------------------------------------------------- */

const GRID = 64; // rows drawn in the file illustration
const DELETED_ROW = 27;

function DeletionVectors() {
  const [s, set] = useSceneState<DeltaState>();
  const dv = s.dvMode === "dv";
  return (
    <div className="border-line bg-surface rounded-2xl border p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold tracking-tight">Deletion vectors</p>
          <p className="text-muted text-xs">DELETE one row from a 128 MB Parquet file</p>
        </div>
        <Segmented
          size="sm"
          value={s.dvMode}
          options={[
            ["cow", "Rewrite the file"],
            ["dv", "Deletion vector"],
          ]}
          onChange={(v) => set({ dvMode: v })}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <FileBlock label="part-…1a2b.parquet" removed={!dv} dvRow={dv ? DELETED_ROW : undefined} />
        <motion.span
          key={`arrow-${s.dvMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-subtle text-lg"
        >
          →
        </motion.span>
        {dv ? (
          <motion.div
            key="dv"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="border-viz-meta bg-viz-meta/15 grid h-16 w-20 content-center justify-items-center rounded-lg border font-mono text-[10px]"
          >
            <span className="text-viz-meta font-semibold">DV bitmap</span>
            <span className="text-muted">row 27 ✗</span>
          </motion.div>
        ) : (
          <FileBlock key="new" label="part-…9c0d.parquet" fresh skipRow={DELETED_ROW} />
        )}
      </div>

      <div className="mt-4 grid gap-1.5 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-muted w-24">bytes written</span>
          <div className="bg-surface-2 h-2.5 flex-1 overflow-hidden rounded-full">
            <motion.div
              className={cn("h-full rounded-full", dv ? "bg-viz-add" : "bg-viz-remove")}
              animate={{ width: dv ? "1.5%" : "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <span className="w-20 text-right">{dv ? "a few bytes" : "~128 MB"}</span>
        </div>
      </div>
      <p className="text-muted mt-3 text-xs leading-relaxed">
        {dv ? (
          <>
            The file stays. The commit re-adds it with a <code>deletionVector</code> that marks row
            27 as deleted, and readers skip marked rows. The rows are physically removed later;{" "}
            <code>REORG TABLE … APPLY (PURGE)</code> guarantees it. Enable with{" "}
            <code>delta.enableDeletionVectors</code>.
          </>
        ) : (
          <>
            Copy-on-write: to drop one row, Delta rewrites every other row into a new file and
            removes the old one. Reads stay simple, but small changes are expensive.
          </>
        )}
      </p>
    </div>
  );
}

function FileBlock({
  label,
  removed,
  fresh,
  dvRow,
  skipRow,
}: {
  label: string;
  removed?: boolean;
  fresh?: boolean;
  dvRow?: number;
  skipRow?: number;
}) {
  return (
    <motion.div
      initial={fresh ? { scale: 0.6, opacity: 0 } : false}
      animate={{ scale: 1, opacity: removed ? 0.45 : 1 }}
      className={cn(
        "rounded-lg border p-1.5",
        removed
          ? "border-viz-remove border-dashed"
          : fresh
            ? "border-viz-add"
            : "border-viz-data/60",
      )}
    >
      <div className="grid grid-cols-8 gap-0.5">
        {Array.from({ length: GRID }, (_, i) => (
          <span
            key={i}
            className={cn(
              "size-2 rounded-[2px]",
              i === dvRow
                ? "bg-viz-remove"
                : i === skipRow
                  ? "bg-transparent"
                  : fresh
                    ? "bg-viz-add/60"
                    : "bg-viz-data/50",
            )}
          />
        ))}
      </div>
      <p className="text-muted mt-1 font-mono text-[9px]">{label}</p>
    </motion.div>
  );
}

function FeatureCard({
  title,
  code,
  children,
}: {
  title: string;
  code?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-4">
      <p className="font-semibold tracking-tight">{title}</p>
      <div className="text-muted mt-1 text-xs leading-relaxed">{children}</div>
      {code && (
        <pre className="bg-surface-2 mt-3 overflow-x-auto rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed">
          {code}
        </pre>
      )}
    </div>
  );
}

export function ModernDelta() {
  return (
    <StepLayout
      eyebrow="Modern Delta"
      title="Same log, sharper tools"
      stage={
        <div className="grid flex-1 content-start gap-4">
          <DeletionVectors />
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              title="Change data feed"
              code={
                "ALTER TABLE orders SET TBLPROPERTIES\n  (delta.enableChangeDataFeed = true);\nSELECT * FROM table_changes('orders', 2, 3);"
              }
            >
              Read row-level changes between versions, tagged <code>insert</code>,{" "}
              <code>update_preimage</code>, <code>update_postimage</code> or <code>delete</code>.
              Ideal for feeding downstream tables incrementally.
            </FeatureCard>
            <FeatureCard
              title="Liquid clustering"
              code={"CREATE TABLE orders (…) CLUSTER BY (customer);"}
            >
              Clusters data by chosen columns for data skipping. It&apos;s recommended over
              partitioning and Z-order for new tables, and the keys can change later without
              rewriting everything. It can&apos;t be combined with partitioning or Z-order.
            </FeatureCard>
            <FeatureCard title="Protocol & table features">
              The <code>protocol</code> action lists the reader and writer versions a table needs.
              Modern tables (reader 3 / writer 7) list named <em>features</em> such as{" "}
              <code>deletionVectors</code> or <code>columnMapping</code>. An engine that
              doesn&apos;t support one must refuse the table rather than misread it.
            </FeatureCard>
            <FeatureCard title="UniForm & catalog-managed tables">
              <strong className="text-fg">UniForm</strong> also generates Iceberg metadata, so
              Iceberg readers can query the same files (with some requirements). Newer{" "}
              <strong className="text-fg">catalog-managed</strong> tables let a catalog approve each
              commit, so readers ask the catalog for the latest version.
            </FeatureCard>
          </div>
        </div>
      }
    >
      <p>
        Everything you&apos;ve learned still holds. Newer Delta features are new kinds of actions
        and properties on the same log.
      </p>
      <p>
        Try the deletion vector toggle. It shows why DELETE, UPDATE and MERGE on large tables got
        dramatically cheaper.
      </p>
    </StepLayout>
  );
}

/* 14 ─ Wrap-up ----------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "The log is the table",
    "A folder of immutable Parquet files, plus _delta_log/. Replaying add and remove actions gives any version.",
  ],
  [
    "Changes never edit files",
    "UPDATE, DELETE and OPTIMIZE write new files and remove old ones from the table, not from storage.",
  ],
  [
    "Time travel is free until VACUUM",
    "Old versions share existing files. Retention decides how far back you can go.",
  ],
  [
    "One writer wins each version",
    "Atomic creation of the next log file plus optimistic concurrency: appends retry, conflicts fail cleanly.",
  ],
  [
    "Checkpoints keep reads fast",
    "Readers start from the latest checkpoint and replay only the commits after it.",
  ],
];

const ENGINES = [
  "Apache Spark (delta-spark)",
  "Databricks",
  "delta-rs · Python deltalake",
  "DuckDB delta extension",
  "Trino · Presto · Flink",
  "Microsoft Fabric OneLake",
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
          <div>
            <p className="text-muted mb-2 text-xs">Where you&apos;ll meet Delta tables</p>
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
        You fixed a production incident with one statement, and you know exactly why it worked: the
        old files were still in storage, and the log remembered them.
      </p>
      <p>
        Next in the track, <strong>Apache Iceberg</strong> solves the same problem with a different
        design: a tree of metadata instead of a linear log.
      </p>
    </StepLayout>
  );
}
