"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { IncidentId, TableState } from "./state";

/**
 * Each incident is a timeline of files appearing (and, without a log, being
 * deleted) in orders/date=2026-09-24/, plus the two committed versions of the
 * table: before and after the job. A dashboard reads the partition at time t.
 */

interface FileEvt {
  id: string;
  value: number; // ₹ thousands of revenue in this file
  created: number;
  deleted?: number; // physical deletion without a log
  kind: "old" | "new" | "partial";
}

interface Incident {
  title: string;
  story: string;
  files: FileEvt[];
  commitAt: number; // when the job finishes (and, with a log, commits)
  before: string[]; // file ids in version N
  after: string[]; // file ids in version N+1
  wrongWhy: string;
  logWhy: string;
  events: [number, string][];
}

const MAX_T = 10;

const INCIDENTS: Record<IncidentId, Incident> = {
  "mid-write": {
    title: "The dashboard read mid-write",
    story:
      "The nightly load adds 4 files of new orders, one at a time. The revenue dashboard refreshes whenever it likes.",
    files: [
      { id: "o1", value: 10, created: 0, kind: "old" },
      { id: "o2", value: 10, created: 0, kind: "old" },
      { id: "o3", value: 10, created: 0, kind: "old" },
      { id: "n1", value: 2.5, created: 1.5, kind: "new" },
      { id: "n2", value: 2.5, created: 3, kind: "new" },
      { id: "n3", value: 2.5, created: 4.5, kind: "new" },
      { id: "n4", value: 2.5, created: 6, kind: "new" },
    ],
    commitAt: 6.8,
    before: ["o1", "o2", "o3"],
    after: ["o1", "o2", "o3", "n1", "n2", "n3", "n4"],
    wrongWhy:
      "The dashboard listed the folder while the load was still writing, so it summed only some of the new files. That total never existed.",
    logWhy:
      "New files are invisible until the job commits. Before the commit, readers see the old version; after it, the new one. Never a mix.",
    events: [
      [1.5, "file 1 written"],
      [3, "file 2"],
      [4.5, "file 3"],
      [6, "file 4"],
      [6.8, "job done"],
    ],
  },
  crash: {
    title: "The job crashed half-way",
    story:
      "The load writes 2 of its 4 files, then its machine dies. The scheduler retries the whole job, which writes all 4 files again.",
    files: [
      { id: "o1", value: 10, created: 0, kind: "old" },
      { id: "o2", value: 10, created: 0, kind: "old" },
      { id: "o3", value: 10, created: 0, kind: "old" },
      { id: "p1", value: 2.5, created: 1.2, kind: "partial" },
      { id: "p2", value: 2.5, created: 2.2, kind: "partial" },
      { id: "n1", value: 2.5, created: 5, kind: "new" },
      { id: "n2", value: 2.5, created: 6, kind: "new" },
      { id: "n3", value: 2.5, created: 7, kind: "new" },
      { id: "n4", value: 2.5, created: 8, kind: "new" },
    ],
    commitAt: 8.6,
    before: ["o1", "o2", "o3"],
    after: ["o1", "o2", "o3", "n1", "n2", "n3", "n4"],
    wrongWhy:
      "The crashed attempt's two files were never cleaned up. Every reader now counts those orders twice, forever.",
    logWhy:
      "The crashed attempt never committed, so its files were never part of any version. They're just orphans for clean-up; no reader sees them.",
    events: [
      [1.2, "file 1"],
      [2.2, "file 2"],
      [2.8, "crash!"],
      [5, "retry starts"],
      [8.6, "retry done"],
    ],
  },
  overwrite: {
    title: "An overwrite raced a reader",
    story:
      "Finance found wrong amounts in the day. A job runs INSERT OVERWRITE: it deletes the day's old files, then writes corrected ones.",
    files: [
      { id: "o1", value: 10, created: 0, deleted: 1.2, kind: "old" },
      { id: "o2", value: 10, created: 0, deleted: 2, kind: "old" },
      { id: "o3", value: 10, created: 0, deleted: 2.8, kind: "old" },
      { id: "c1", value: 11, created: 4.2, kind: "new" },
      { id: "c2", value: 11, created: 5.4, kind: "new" },
      { id: "c3", value: 10, created: 6.6, kind: "new" },
    ],
    commitAt: 7.2,
    before: ["o1", "o2", "o3"],
    after: ["c1", "c2", "c3"],
    wrongWhy:
      "Mid-overwrite the folder held some old files, no files, or some new files. A reader can get a partial total, zero, or even fail with “file not found” as files vanish under it.",
    logWhy:
      "The overwrite is one commit that swaps the file list. Old files stay in storage until clean-up, so readers of the old version keep working, and new readers see all the corrections at once.",
    events: [
      [1.2, "delete 1"],
      [2.8, "delete 3"],
      [4.2, "write 1"],
      [7.2, "job done"],
    ],
  },
};

const sum = (inc: Incident, ids: string[]) =>
  ids.reduce((n, id) => n + (inc.files.find((f) => f.id === id)?.value ?? 0), 0);

function visibleFiles(inc: Incident, t: number, withLog: boolean): string[] {
  if (withLog) return t >= inc.commitAt ? inc.after : inc.before;
  return inc.files
    .filter((f) => f.created <= t && (f.deleted === undefined || f.deleted > t))
    .map((f) => f.id);
}

function inStorage(inc: Incident, f: FileEvt, t: number, withLog: boolean): boolean {
  if (f.created > t) return false;
  if (!withLog && f.deleted !== undefined && f.deleted <= t) return false;
  return true;
}

export function Incidents() {
  const [s, set] = useSceneState<TableState>();
  const inc = INCIDENTS[s.incident];
  const [playing, setPlaying] = useState(false);
  const t = s.time;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (t >= MAX_T) setPlaying(false);
      else set({ time: Math.min(MAX_T, Math.round((t + 0.1) * 10) / 10) });
    }, 60);
    return () => clearInterval(id);
  }, [playing, t, set]);

  const seen = visibleFiles(inc, t, s.withLog);
  const reported = sum(inc, seen);
  const truthBefore = sum(inc, inc.before);
  const truthAfter = sum(inc, inc.after);
  const correct = reported === truthBefore || reported === truthAfter;
  const pending = s.withLog && t < inc.commitAt && t > 0;

  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Three incidents on a plain folder"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={s.incident}
              options={[
                ["mid-write", "1 · Read mid-write"],
                ["crash", "2 · Crashed job"],
                ["overwrite", "3 · Overwrite race"],
              ]}
              onChange={(incident) => {
                setPlaying(false);
                set({ incident, time: 0 });
              }}
            />
            <Segmented
              size="sm"
              value={s.withLog ? "log" : "folder"}
              options={[
                ["folder", "Plain folder"],
                ["log", "With a transaction log"],
              ]}
              onChange={(v) => {
                setPlaying(false);
                set({ withLog: v === "log", time: 0 });
              }}
            />
          </div>
          <p className="text-muted text-sm">{inc.story}</p>

          {/* Timeline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => {
                if (playing) setPlaying(false);
                else {
                  if (t >= MAX_T) set({ time: 0 });
                  setPlaying(true);
                }
              }}
              className="bg-accent text-accent-fg grid size-10 shrink-0 place-items-center rounded-full"
            >
              {playing ? (
                <Pause className="size-4" />
              ) : t >= MAX_T ? (
                <RotateCcw className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </button>
            <div className="relative flex-1 pt-5">
              {inc.events.map(([at, label]) => (
                <span
                  key={label}
                  className={cn(
                    "absolute top-0 -translate-x-1/2 font-mono text-[9px] whitespace-nowrap",
                    t >= at ? "text-fg" : "text-subtle",
                    label.includes("crash") && "text-bad",
                  )}
                  style={{ left: `${(at / MAX_T) * 100}%` }}
                >
                  {label}
                </span>
              ))}
              <input
                type="range"
                min={0}
                max={MAX_T}
                step={0.1}
                value={t}
                onChange={(e) => {
                  setPlaying(false);
                  set({ time: Number(e.target.value) });
                }}
                aria-label="Time"
                className="w-full accent-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
            {/* Storage */}
            <div className="border-line bg-bg/40 rounded-2xl border p-3">
              <p className="text-muted mb-2 font-mono text-[11px]">
                s3://lake/orders/date=2026-09-24/
              </p>
              <div className="flex flex-wrap gap-2">
                {inc.files.map((f) => {
                  const present = inStorage(inc, f, t, s.withLog);
                  const counted = seen.includes(f.id);
                  return (
                    <AnimatePresence key={f.id}>
                      {present && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0, backgroundColor: "var(--viz-remove)" }}
                          className={cn(
                            "grid h-16 w-14 place-items-center rounded-lg border text-center font-mono text-[10px] leading-tight transition-colors duration-300",
                            counted
                              ? f.kind === "partial"
                                ? "border-bad bg-bad/20"
                                : "border-viz-data bg-viz-data/25"
                              : "border-line-strong text-subtle border-dashed",
                          )}
                        >
                          <span>
                            {f.kind === "partial" ? "partial" : f.kind === "old" ? "old" : "new"}
                            <br />₹{f.value}k
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>
              {s.withLog && (
                <p className="text-viz-meta mt-3 font-mono text-[11px]">
                  _delta_log:{" "}
                  {t >= inc.commitAt ? "version N+1 committed ✓" : "latest committed: version N"}
                </p>
              )}
              <p className="text-subtle mt-2 text-[10px]">
                Solid = counted by the dashboard. Dashed = in storage but not part of the table.
              </p>
            </div>

            {/* Dashboard */}
            <div className="grid content-start gap-3">
              <div
                className={cn(
                  "rounded-2xl border p-4 transition-colors",
                  correct ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="text-muted text-xs">Dashboard revenue for the day</p>
                <motion.p
                  key={reported}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "text-3xl font-semibold tabular-nums",
                    correct ? "text-good" : "text-bad",
                  )}
                >
                  ₹{reported}k
                </motion.p>
                <p className="text-muted mt-1 text-xs">
                  Only two answers were ever true: ₹{truthBefore}k (before the job) or ₹{truthAfter}
                  k (after).
                </p>
              </div>
              {pending && (
                <p className="text-viz-meta text-xs">Job running: readers still see version N.</p>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${s.incident}-${s.withLog}-${correct}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                s.withLog
                  ? "border-good/40 bg-good/10"
                  : correct
                    ? "border-line bg-surface"
                    : "border-bad/40 bg-bad/10",
              )}
            >
              {s.withLog ? (
                <>
                  <strong className="text-good">With a log:</strong> {inc.logWhy}
                </>
              ) : correct ? (
                <>
                  Drag the timeline or press play, and watch what the dashboard reports while the
                  job runs.
                </>
              ) : (
                <>
                  <strong className="text-bad">What went wrong:</strong> {inc.wrongWhy}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Brewline&apos;s <code>orders</code> table is a plain folder. Every job below is written
        correctly. It still goes wrong.
      </p>
      <p>
        For each incident, play the timeline on the <strong>plain folder</strong> and watch the
        dashboard. Then switch to <strong>with a transaction log</strong> and replay it.
      </p>
      <p className="text-subtle text-xs">
        Jobs often write a <code>_SUCCESS</code> marker when they finish, but engines don&apos;t
        wait for it before reading; they simply skip files whose names start with an underscore.
        What&apos;s missing is <Term id="atomic">atomic</Term> commits and{" "}
        <Term id="isolation">isolation</Term>.
      </p>
    </StepLayout>
  );
}
