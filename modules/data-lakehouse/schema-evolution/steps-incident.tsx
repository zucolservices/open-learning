"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, FileSearch } from "lucide-react";
import { useCheckpoint, useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { SchemaState } from "./state";

/* 3 ─ The Monday incident ⭐ ----------------------------------------------------------- */

const DAYS = [
  { day: "Tue", lakh: 4.2, afterRename: false },
  { day: "Wed", lakh: 3.9, afterRename: false },
  { day: "Thu", lakh: 4.5, afterRename: false },
  { day: "Fri", lakh: 4.8, afterRename: false },
  { day: "Sat", lakh: 5.1, afterRename: true },
  { day: "Sun", lakh: 4.6, afterRename: true },
];

const CLUES: { id: string; title: string; body: string }[] = [
  {
    id: "query",
    title: "The dashboard's query",
    body: "SELECT date, SUM(order_total) AS revenue\nFROM orders\nGROUP BY date;",
  },
  {
    id: "history",
    title: "Table change log (metastore)",
    body: "Fri 17:40  ALTER TABLE orders\n           CHANGE COLUMN amount order_total INT;\n-- by data-eng: “clearer name for finance”",
  },
  {
    id: "old-file",
    title: "An old Parquet file (Thursday)",
    body: "schema stored in the file footer:\n  order_id  INT64\n  amount    INT32\n  status    BINARY (string)",
  },
  {
    id: "new-file",
    title: "A new Parquet file (Saturday)",
    body: "schema stored in the file footer:\n  order_id     INT64\n  order_total  INT32\n  status       BINARY (string)",
  },
];

export function MondayIncident() {
  const [s, set] = useSceneState<SchemaState>();
  const diagnosed = useCheckpoint("diagnose").correct;
  const opened = new Set(s.clues ?? []);
  const byId = diagnosed && s.replay === "ids";
  const max = Math.max(...DAYS.map((d) => d.lakh));

  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The Monday incident"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-bad/40 bg-bad/10 flex items-start gap-3 rounded-xl border px-4 py-3">
            <AlertTriangle className="text-bad mt-0.5 size-4 shrink-0" />
            <p className="text-sm">
              <strong>Monday, 09:05.</strong> Finance reports the revenue dashboard shows ₹0 for
              every day before Saturday. Nobody touched the dashboard.
            </p>
          </div>

          <div className="border-line bg-bg/40 rounded-2xl border p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-muted text-[11px]">Revenue per day (₹ lakh)</p>
              {diagnosed && (
                <Segmented
                  size="sm"
                  value={s.replay}
                  options={[
                    ["hive", "Hive-style table"],
                    ["ids", "Table format with column IDs"],
                  ]}
                  onChange={(v) => set({ replay: v as SchemaState["replay"] })}
                />
              )}
            </div>
            <div className="mt-3 flex h-32 items-end gap-2">
              {DAYS.map((d) => {
                const value = byId || d.afterRename ? d.lakh : 0;
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                    <span className="font-mono text-[10px] tabular-nums">
                      {value ? value.toFixed(1) : "0"}
                    </span>
                    <motion.div
                      className={cn("w-full rounded-t", value ? "bg-viz-compute" : "bg-bad/40")}
                      initial={false}
                      animate={{ height: value ? `${(value / max) * 90}px` : "3px" }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                    <span className="text-muted text-[10px]">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-subtle mt-1 text-center text-[10px]">
              rename ran on Friday at 17:40
            </p>
          </div>

          <div>
            <p className="text-muted mb-2 flex items-center gap-1.5 text-xs">
              <FileSearch className="size-3.5" /> Clues: open them in any order
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {CLUES.map((c) => {
                const open = opened.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      set({
                        clues: open ? [...opened].filter((x) => x !== c.id) : [...opened, c.id],
                      })
                    }
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left transition-colors",
                      open
                        ? "border-accent/50 bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <p className="text-sm font-medium">{c.title}</p>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <Code className="mt-2 text-[10px] whitespace-pre-wrap">{c.body}</Code>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>

          <ChoiceCheckpoint
            id="diagnose"
            prompt="What went wrong?"
            options={[
              {
                id: "corrupt",
                label: "The rename corrupted the old Parquet files",
                feedback:
                  "A metastore rename never touches files. The old files are exactly as they were.",
              },
              {
                id: "by-name",
                label:
                  "Old files have no column named order_total, and the engine matches columns by name, so it reads null",
                correct: true,
                feedback:
                  "Right. The rename changed only the table's metadata. Files written before Friday still call the column amount, and SUM of nulls is null (shown as 0).",
              },
              {
                id: "cache",
                label: "The dashboard is showing stale cached results",
                feedback:
                  "Saturday and Sunday are correct, so the dashboard is reading fresh data.",
              },
              {
                id: "deleted",
                label: "The rename deleted the old amount values",
                feedback:
                  "Nothing was deleted. The values are still in the old files, under their old name.",
              },
            ]}
            explanation="Now use the toggle on the chart: replay the same rename on a table format that matches columns by ID."
          />
        </div>
      }
    >
      <p>
        Time to play on-call engineer. A harmless-looking change on Friday has broken a dashboard.
        Open the clues, then diagnose it.
      </p>
      <p>
        Remember: in a data lake, files are written once and never edited. Each Parquet file stores
        its own column names, in the <Term id="parquet-footer">footer</Term>, from the day it was
        written.
      </p>
      <p className="text-subtle text-xs">
        The quick fixes all have catches. Renaming back breaks the files written since Friday.
        Rewriting every old file with the new name works, but rewrites the whole table. The lasting
        fix is a table whose columns have permanent IDs, next.
      </p>
    </StepLayout>
  );
}
