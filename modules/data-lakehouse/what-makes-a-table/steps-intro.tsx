"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Database, FileText, Folder, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { TableState } from "./state";

/* 1 ─ A folder isn't a table ------------------------------------------------ */

const QUESTIONS: { q: string; folder: string; table: string; folderOk: boolean }[] = [
  {
    q: "What are the columns and their types?",
    folder: "Open a file and hope the others match.",
    table: "The table's schema says so, and it's enforced.",
    folderOk: false,
  },
  {
    q: "Which files are part of the table right now?",
    folder: "Whatever happens to be in the folder when you look, including half-written files.",
    table: "An exact list, changed only by complete commits.",
    folderOk: false,
  },
  {
    q: "What did the table look like yesterday?",
    folder: "Unknown. Files were overwritten and deleted.",
    table: "Every version is recorded and can be read again.",
    folderOk: false,
  },
  {
    q: "Can I read it while someone else writes?",
    folder: "Maybe. You might see part of their change.",
    table: "Yes. You see the last complete version, never a half-change.",
    folderOk: false,
  },
];

export function FolderVsTable() {
  const [s, set] = useSceneState<TableState>();
  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A folder of files isn't a table"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <Segmented
            size="sm"
            value={s.asTable ? "table" : "folder"}
            options={[
              ["folder", "Just a folder of Parquet files"],
              ["table", "A real table"],
            ]}
            onChange={(v) => set({ asTable: v === "table" })}
          />
          <div className="border-line bg-bg/40 flex items-center gap-3 rounded-2xl border p-4">
            {s.asTable ? (
              <Database className="text-viz-meta size-6" />
            ) : (
              <Folder className="text-viz-compute size-6" />
            )}
            <div className="font-mono text-xs">
              <p className="text-fg">SELECT SUM(amount) FROM orders</p>
              <p className="text-muted mt-0.5">
                {s.asTable
                  ? "orders: a table with a schema, a file list and a history"
                  : "orders/: a folder containing *.parquet"}
              </p>
            </div>
          </div>
          <ul className="grid gap-2">
            {QUESTIONS.map((item, i) => {
              const ok = s.asTable || item.folderOk;
              return (
                <motion.li
                  key={item.q}
                  layout
                  className={cn(
                    "rounded-2xl border p-4 transition-colors duration-500",
                    ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                        ok ? "bg-good text-bg" : "bg-bad text-bg",
                      )}
                    >
                      {ok ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : (
                        <X className="size-3.5" strokeWidth={3} />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{item.q}</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${s.asTable}-${i}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-muted mt-0.5 text-sm"
                        >
                          {s.asTable ? item.table : item.folder}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      }
    >
      <p>
        You met Parquet files in Chapter 1. Put a thousand of them in a folder called{" "}
        <code>orders/</code>. Is that a table?
      </p>
      <p>
        A table is really a <strong>promise</strong>: a known schema, and one consistent set of rows
        at any moment, even while people read and write. Flip the switch and see how many of those
        promises a plain folder keeps.
      </p>
      <p>This whole chapter is about closing that gap.</p>
    </StepLayout>
  );
}

/* 2 ─ How Hive tables work ------------------------------------------------- */

const FILES: Record<string, string[]> = {
  "date=2026-09-23": ["part-0.parquet", "part-1.parquet"],
  "date=2026-09-24": ["part-0.parquet", "part-1.parquet", "part-2.parquet"],
  "date=2026-09-25": ["part-0.parquet"],
};
const TARGET = "date=2026-09-24";

const HIVE_FRAMES = [
  {
    title: "A query arrives",
    text: "SELECT SUM(amount) FROM orders WHERE date = '2026-09-24'",
    focus: "none",
  },
  {
    title: "1. Ask the metastore",
    text: "The Hive Metastore knows the table's name, schema, folder (s3://lake/orders/) and its list of partitions. It knows nothing about individual files, so the table's state lives in two places that can drift apart.",
    focus: "metastore",
  },
  {
    title: "2. Prune partitions by folder name",
    text: "Only the folder date=2026-09-24/ can match, so the others are skipped. This is partitioning, and it works well.",
    focus: "partition",
  },
  {
    title: "3. List the folder",
    text: "LIST s3://lake/orders/date=2026-09-24/ returns whatever files exist at this very moment. Remember module 2: listing is slow at scale, and it has no idea which files are finished.",
    focus: "list",
  },
  {
    title: "4. Read every file found",
    text: "The engine reads all of them and trusts that they belong. The “table” is simply whatever the listing returned.",
    focus: "read",
  },
];

export function HiveTables() {
  const [s, set] = useSceneState<TableState>();
  const step = Math.min(s.hiveStep, HIVE_FRAMES.length - 1);
  const f = HIVE_FRAMES[step];

  return (
    <StepLayout
      eyebrow="How it worked for a decade"
      title="Hive-style tables: a catalog entry plus a folder"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-muted font-mono text-xs">
              {step + 1}/{HIVE_FRAMES.length}
            </span>
            <div className="flex gap-1">
              <NavButton
                label="Previous"
                onClick={() => set({ hiveStep: Math.max(0, step - 1) })}
                disabled={step === 0}
              >
                <ChevronLeft className="size-4" />
              </NavButton>
              <NavButton
                label="Next"
                primary
                onClick={() => set({ hiveStep: Math.min(HIVE_FRAMES.length - 1, step + 1) })}
                disabled={step === HIVE_FRAMES.length - 1}
              >
                <ChevronRight className="size-4" />
              </NavButton>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <motion.div
              animate={{ scale: f.focus === "metastore" ? 1.03 : 1 }}
              className={cn(
                "rounded-2xl border p-4 font-mono text-[11px] transition-colors",
                f.focus === "metastore" ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="flex items-center gap-2 font-sans text-sm font-semibold">
                <Database className="text-accent size-4" /> Hive Metastore
              </p>
              <dl className="mt-3 grid gap-1.5">
                <div>
                  <dt className="text-subtle">table</dt>
                  <dd>orders</dd>
                </div>
                <div>
                  <dt className="text-subtle">location</dt>
                  <dd>s3://lake/orders/</dd>
                </div>
                <div>
                  <dt className="text-subtle">schema</dt>
                  <dd>order_id bigint, amount int, …</dd>
                </div>
                <div>
                  <dt className="text-subtle">partitioned by</dt>
                  <dd>date</dd>
                </div>
                <div>
                  <dt className="text-subtle">files</dt>
                  <dd className="text-bad">not tracked</dd>
                </div>
              </dl>
            </motion.div>

            <div className="border-line bg-bg/40 rounded-2xl border p-4 font-mono text-xs">
              <p className="flex items-center gap-1.5">
                <Folder className="text-viz-compute size-4" /> s3://lake/orders/
              </p>
              <ul className="border-line mt-2 ml-2 grid gap-2 border-l pl-3">
                {Object.entries(FILES).map(([dir, files]) => {
                  const pruned = step >= 2 && dir !== TARGET;
                  const target = dir === TARGET;
                  return (
                    <li key={dir}>
                      <motion.p
                        animate={{ opacity: pruned ? 0.3 : 1 }}
                        className={cn(
                          "flex items-center gap-1.5",
                          target && step >= 2 && "text-accent",
                        )}
                      >
                        <Folder className="size-3.5" /> {dir}/
                        {pruned && <span className="text-subtle ml-2 text-[10px]">skipped</span>}
                      </motion.p>
                      <ul className="mt-1 ml-5 grid gap-1">
                        {files.map((file) => {
                          const listed = target && step >= 3;
                          const read = target && step >= 4;
                          return (
                            <motion.li
                              key={file}
                              animate={{ opacity: pruned ? 0.3 : 1, x: listed ? 4 : 0 }}
                              className={cn(
                                "flex items-center gap-1.5 rounded px-1.5 py-0.5",
                                read ? "bg-viz-compute/30" : listed ? "bg-viz-data/20" : "",
                              )}
                            >
                              <FileText className="size-3.5" /> {file}
                              {listed && !read && (
                                <span className="text-viz-data ml-2 text-[10px]">listed</span>
                              )}
                              {read && (
                                <span className="text-viz-compute ml-2 text-[10px]">read</span>
                              )}
                            </motion.li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{f.title}</p>
              <p className={cn("text-muted mt-1 text-sm", step === 0 && "font-mono text-xs")}>
                {f.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        For about a decade, big-data tables were <Term id="hive-table">Hive-style tables</Term>: an
        entry in the <Term id="hive-metastore">Hive Metastore</Term> plus a folder, with one
        sub-folder per <Term id="partition">partition</Term>.
      </p>
      <p>Step through how an engine answers a query on one.</p>
      <p className="text-subtle text-xs">
        Spark, Trino and others still support this style, and you&apos;ll meet it in older systems.
        Hive later added transactional (ACID) tables, but they&apos;re tied to Hive and the ORC
        format, and other engines rarely use them.
      </p>
    </StepLayout>
  );
}

export function NavButton({
  children,
  label,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  label: string;
  onClick(): void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-full transition disabled:opacity-30",
        primary ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
