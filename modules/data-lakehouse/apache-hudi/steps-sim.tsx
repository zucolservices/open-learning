"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eraser, Layers, RotateCcw, Send } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  BATCHES,
  BASE_MB,
  canRun,
  FILE_GROUPS,
  LOG_MB,
  simulate,
  snapshotFiles,
  TRIPS,
  type SimAction,
  type SimResult,
  type TableType,
} from "./data";
import { Rail } from "./ui";
import type { HudiState } from "./state";

/* 5 ─ Stream upserts: the simulation ⭐ ---------------------------------------- */

export function StreamUpserts() {
  const [s, set] = useSceneState<HudiState>();
  const r = simulate(s.simType, s.simLog);
  const run = (a: SimAction) => set({ simLog: [...s.simLog, a] });
  const last = r.instants.at(-1)!;
  const changed = new Set(
    r.upserts > 0 && last.action !== "clean" && !last.label.startsWith("compaction")
      ? Object.keys(BATCHES[r.upserts - 1].changes)
      : [],
  );

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Stream upserts into a Hudi table"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              size="sm"
              value={s.simType}
              options={[
                ["cow", "Copy-on-Write"],
                ["mor", "Merge-on-Read"],
              ]}
              onChange={(v) => set({ simType: v as TableType })}
            />
            <div className="flex flex-wrap gap-1.5">
              <SimButton
                primary
                icon={<Send className="size-3.5" />}
                disabled={!canRun(s.simType, s.simLog, "upsert")}
                onClick={() => run("upsert")}
              >
                Upsert batch {Math.min(r.upserts + 1, BATCHES.length)}/{BATCHES.length}
              </SimButton>
              {s.simType === "mor" && (
                <SimButton
                  icon={<Layers className="size-3.5" />}
                  disabled={!canRun(s.simType, s.simLog, "compact")}
                  onClick={() => run("compact")}
                >
                  Compact
                </SimButton>
              )}
              <SimButton
                icon={<Eraser className="size-3.5" />}
                disabled={!canRun(s.simType, s.simLog, "clean")}
                onClick={() => run("clean")}
              >
                Clean
              </SimButton>
              <SimButton
                icon={<RotateCcw className="size-3.5" />}
                disabled={s.simLog.length === 0}
                onClick={() => set({ simLog: [] })}
                label="Reset"
              />
            </div>
          </div>

          <Rail
            instants={r.instants.map((i) => ({
              time: i.time,
              action: i.action,
              note: i.label,
              state: "completed",
            }))}
          />

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {FILE_GROUPS.map((fg) => (
              <div key={fg} className="border-line bg-bg/40 rounded-xl border p-2 sm:p-3">
                <p className="text-muted mb-2 font-mono text-[10px] sm:text-[11px]">
                  file group {fg}
                </p>
                <div className="flex flex-col gap-1.5">
                  <AnimatePresence initial={false}>
                    {r.slices[fg].map((slice) => (
                      <motion.div
                        key={slice.base}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: slice.cleaned ? 0.45 : 1, y: 0 }}
                        className={cn(
                          "flex flex-wrap items-center gap-1 rounded-lg border p-1",
                          slice.cleaned ? "border-viz-remove/60 border-dashed" : "border-line",
                        )}
                      >
                        <span
                          className={cn(
                            "rounded px-1.5 py-1 font-mono text-[9px] sm:text-[10px]",
                            slice.cleaned
                              ? "text-viz-remove line-through"
                              : "bg-viz-data/25 border-viz-data/60 border",
                          )}
                        >
                          base {slice.base}
                        </span>
                        {slice.logs.map((l) => (
                          <motion.span
                            key={l}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                              "rounded px-1 py-1 font-mono text-[9px] sm:text-[10px]",
                              slice.cleaned
                                ? "text-viz-remove line-through"
                                : "bg-viz-add/20 border-viz-add/60 border",
                            )}
                          >
                            log {l}
                          </motion.span>
                        ))}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <ul className="border-line mt-2 grid gap-0.5 border-t pt-2 font-mono text-[9px] sm:text-[10px]">
                  {TRIPS.filter((t) => t.fg === fg).map((t) => (
                    <li
                      key={t.id}
                      className={cn(
                        "flex justify-between rounded px-1",
                        changed.has(t.id) && "bg-viz-compute/20 text-viz-compute",
                      )}
                    >
                      <span>{t.id}</span>
                      <span className="tabular-nums">₹{r.fares[t.id]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Metric label="Data written by changes" value={`${r.mbWritten} MB`} />
            <Metric label="Files a fresh read must open" value={String(snapshotFiles(r))} />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.simType}-${s.simLog.length}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface text-muted rounded-xl border px-4 py-3 text-sm"
            >
              {explain(s.simType, s.simLog, r)}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Time to run a Hudi table. Send batches of updates to the trips table and watch the{" "}
        <Term id="hudi-timeline">timeline</Term> and the files underneath.
      </p>
      <p>
        With <Term id="copy-on-write">Copy-on-Write</Term>, changing one row rewrites its whole file
        group&apos;s base file. With <Term id="merge-on-read">Merge-on-Read</Term>, the change goes
        into a small log file, and <Term id="compaction">compaction</Term> folds logs into a new
        base file later.
      </p>
      <p>
        Try the same four batches in both modes and compare the two numbers. Then{" "}
        <strong>Clean</strong> to see old versions go.
      </p>
      <p className="text-subtle text-xs">
        Sizes are illustrative: {BASE_MB} MB per base file, about {LOG_MB} MB per log file.
      </p>
    </StepLayout>
  );
}

function explain(type: TableType, log: SimAction[], r: SimResult) {
  const actions = type === "cow" ? log.filter((a) => a !== "compact") : log;
  const last = actions.at(-1);
  if (!last)
    return "The table starts with one bulk-insert commit: one base file per file group. Send the first batch.";
  const instant = r.instants.at(-1)!;
  if (last === "upsert") {
    const batch = BATCHES[r.upserts - 1];
    const n = Object.keys(batch.changes).length;
    return type === "cow"
      ? `Commit at ${instant.time} (${batch.why}): to change ${n} rows, Hudi rewrote ${n} whole base files, ${n * BASE_MB} MB. Readers just read the newest base files, nothing to merge.`
      : `Delta commit at ${instant.time} (${batch.why}): ${n} small log files, about ${n * LOG_MB} MB. Cheap to write, but every fresh read now merges those logs with their base files.`;
  }
  if (last === "compact")
    return `Compaction at ${instant.time}: each file group's base file and logs were merged into a new base file. On the timeline, a finished compaction shows up as a commit. Reads are simple again; the write cost was paid now, in one go.`;
  return `Clean at ${instant.time}: older file slices were deleted from storage. They were only needed to read older versions, so time travel before them is no longer possible.`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line bg-surface rounded-xl border px-3 py-2">
      <p className="text-muted text-[11px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-lg font-semibold tabular-nums"
      >
        {value}
      </motion.p>
    </div>
  );
}

function SimButton({
  children,
  icon,
  onClick,
  disabled,
  primary,
  label,
}: {
  children?: React.ReactNode;
  icon: React.ReactNode;
  onClick(): void;
  disabled?: boolean;
  primary?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-35",
        primary
          ? "bg-accent text-accent-fg enabled:hover:brightness-110"
          : "bg-surface-2 text-fg enabled:hover:brightness-110",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
