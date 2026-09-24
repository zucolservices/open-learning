"use client";

import { motion } from "motion/react";
import { Check, RotateCcw, Trash2, TriangleAlert, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import { COMMITS, FILE_IDS, RESTORE_COMMIT, liveFiles } from "./data";
import { FileTile } from "./ui";
import type { DeltaState } from "./state";
import { Term } from "@/toolkit/glossary/term";

const HISTORY = [...COMMITS, RESTORE_COMMIT];
const HEAD = HISTORY.length - 1;
/** The simulated VACUUM runs on day 15 (29 Sep), five days after the incident. */
const TODAY = 15;
const DEFAULT_RETENTION = 7;

/** Day each file stopped being part of the current table (undefined = still live). */
function unreferencedSince(): Record<string, number | undefined> {
  const head = liveFiles(HEAD, HISTORY);
  const out: Record<string, number | undefined> = {};
  for (const f of FILE_IDS) {
    if (head.has(f)) continue;
    const lastRemoval = [...HISTORY].reverse().find((c) => c.remove.includes(f));
    out[f] = lastRemoval?.day;
  }
  return out;
}

const SINCE = unreferencedSince();

function vacuumedFiles(retentionDays: number): Set<string> {
  const cutoff = TODAY - retentionDays;
  return new Set(FILE_IDS.filter((f) => SINCE[f] !== undefined && SINCE[f]! < cutoff));
}

const RETENTIONS: [string, string][] = [
  ["0", "0 hours"],
  ["1", "1 day"],
  ["7", "7 days (default)"],
  ["14", "14 days"],
  ["30", "30 days"],
];

/* 11 ─ VACUUM & retention ---------------------------------------------- */

export function Vacuum() {
  const [s, set] = useSceneState<DeltaState>();
  const deleted = s.vacuumed ? vacuumedFiles(s.retentionDays) : new Set<string>();
  const head = liveFiles(HEAD, HISTORY);
  const cutoff = TODAY - s.retentionDays;
  const unsafe = s.retentionDays < DEFAULT_RETENTION;

  return (
    <StepLayout
      eyebrow="VACUUM & retention"
      title="Time travel isn't forever"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={String(s.retentionDays)}
              options={RETENTIONS}
              onChange={(v) => set({ retentionDays: Number(v), vacuumed: false })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => set({ vacuumed: !s.vacuumed })}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-5 font-mono text-xs font-medium transition",
                s.vacuumed
                  ? "border-line-strong text-muted border"
                  : "bg-bad text-bg hover:brightness-110",
              )}
            >
              {s.vacuumed ? (
                <>
                  <RotateCcw className="size-3.5" /> reset simulation
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" /> VACUUM orders RETAIN {s.retentionDays * 24} HOURS
                </>
              )}
            </button>
            {unsafe && (
              <p className="text-viz-compute flex items-center gap-1.5 text-xs">
                <TriangleAlert className="size-3.5" /> Delta refuses this by default: it&apos;s
                shorter than the table&apos;s 7-day retention. You&apos;d have to disable a safety
                check.
              </p>
            )}
          </div>

          {/* Timeline */}
          <div>
            <div className="relative h-8">
              <div className="bg-line absolute inset-x-0 top-1/2 h-0.5" />
              <motion.div
                className="bg-bad/15 border-bad/40 absolute top-1 bottom-1 left-0 rounded border"
                animate={{ width: `${Math.max(0, cutoff / TODAY) * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
              />
              {HISTORY.filter((c, i, arr) => arr.findIndex((x) => x.day === c.day) === i).map(
                (c) => (
                  <span
                    key={c.day}
                    className="bg-viz-meta absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: `${(c.day / TODAY) * 100}%` }}
                  />
                ),
              )}
              <span className="bg-fg absolute top-0 right-0 bottom-0 w-0.5" />
            </div>
            <div className="text-subtle relative mt-1 h-4 font-mono text-[10px]">
              <span className="absolute left-0">14 Sep · v0</span>
              <span
                className="absolute -translate-x-1/2"
                style={{ left: `${(10 / TODAY) * 100}%` }}
              >
                24 Sep · v4–v6
              </span>
              <span className="text-fg absolute right-0">29 Sep · VACUUM</span>
            </div>
            <p className="text-muted mt-1 text-xs">
              <span className="bg-bad/20 border-bad/40 mr-1 inline-block size-2.5 rounded-sm border align-middle" />
              Files removed from the table in this zone are older than the retention period and will
              be deleted.
            </p>
          </div>

          {/* Files */}
          <div className="flex flex-wrap gap-3">
            {FILE_IDS.map((f) => {
              const isLive = head.has(f);
              const gone = deleted.has(f);
              return (
                <div key={f} className="grid justify-items-center gap-1">
                  <FileTile id={f} state={gone ? "vacuumed" : isLive ? "live" : "storage"} />
                  <span
                    className={cn(
                      "font-mono text-[9px]",
                      gone ? "text-bad font-semibold" : "text-subtle",
                    )}
                  >
                    {gone ? "deleted" : isLive ? "in table" : `removed d${SINCE[f]}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Which versions can still be read? */}
          <div>
            <p className="text-muted mb-2 text-xs">Can you still query VERSION AS OF…</p>
            <div className="flex flex-wrap gap-2">
              {HISTORY.map((c) => {
                const ok = [...liveFiles(c.version, HISTORY)].every((f) => !deleted.has(f));
                return (
                  <motion.div
                    key={c.version}
                    layout
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-500",
                      ok
                        ? "border-good/40 bg-good/10 text-good"
                        : "border-bad/40 bg-bad/10 text-bad",
                    )}
                  >
                    {ok ? <Check className="size-3" /> : <X className="size-3" />}v{c.version}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Removed files pile up.{" "}
        <Term id="vacuum">
          <strong>VACUUM</strong>
        </Term>{" "}
        deletes files that are no longer in the current table <em>and</em> were removed longer ago
        than the retention period.
      </p>
      <p>Choose a retention and run it. Watch which versions survive.</p>
      <p>
        The default retention is <strong>7 days</strong> (
        <code>delta.deletedFileRetentionDuration</code>). It protects time travel, and it protects
        readers that are still in the middle of reading older files.
      </p>
      <p className="text-subtle text-xs">
        VACUUM only deletes data files. The log is trimmed separately, by{" "}
        <code>delta.logRetentionDuration</code>.
      </p>
    </StepLayout>
  );
}

/* 12 ─ Checkpoint: after VACUUM ---------------------------------------- */

export function VacuumCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="After the clean-up"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="after-vacuum"
            prompt={
              <>
                VACUUM ran with the default 7-day retention. A colleague now runs{" "}
                <code className="text-accent">SELECT * FROM orders VERSION AS OF 0</code>. What
                happens?
              </>
            }
            options={[
              {
                id: "works",
                label: "It works. Time travel is always available.",
                feedback: "Time travel only reaches as far back as the files that still exist.",
              },
              {
                id: "current",
                label: "It silently returns the current data instead",
                feedback:
                  "Delta never substitutes another version. It either reads version 0 exactly or fails.",
              },
              {
                id: "fails",
                label: "It fails: the log still describes v0, but its data files were deleted",
                correct: true,
                feedback:
                  "Right. The commit still lists v0's files, but VACUUM deleted them because they left the table more than 7 days ago.",
              },
            ]}
            explanation="Retention is a trade-off you choose: longer retention means more time travel and more storage, shorter means less of both."
          />
        </div>
      }
    />
  );
}
