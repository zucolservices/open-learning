"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, Wrench } from "lucide-react";
import { useCheckpoint, useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { cn } from "@/lib/cn";
import {
  COMMITS,
  FILE_IDS,
  RESTORE_COMMIT,
  fileStates,
  liveFiles,
  rowsAt,
  shortLog,
  type Commit,
} from "./data";
import { FileLegend, FileTile, RowsTable, fileTag } from "./ui";
import type { DeltaState } from "./state";
import { Term } from "@/toolkit/glossary/term";

const LAST = COMMITS.length - 1;

/* Shared: the log with each commit's add/remove chips ------------------ */

function LogList({
  commits,
  version,
  onPick,
}: {
  commits: Commit[];
  version: number;
  onPick?: (v: number) => void;
}) {
  return (
    <ol className="grid gap-1">
      {commits.map((c) => {
        const current = c.version === version;
        const past = c.version <= version;
        return (
          <li key={c.version}>
            <button
              type="button"
              disabled={!onPick}
              onClick={() => onPick?.(c.version)}
              className={cn(
                "w-full rounded-lg px-2.5 py-1.5 text-left transition-colors duration-300",
                current && "bg-viz-meta/15 ring-viz-meta/40 ring-1",
                !past && "opacity-35",
                onPick && "hover:bg-surface-2",
              )}
            >
              <div className="flex items-baseline gap-2 font-mono text-[11px]">
                <span
                  className={cn(
                    "shrink-0 whitespace-nowrap",
                    past ? "text-viz-meta" : "text-subtle",
                  )}
                >
                  {shortLog(c.version)}
                </span>
                <span className="text-fg font-sans text-xs font-medium">{c.operation}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1 font-mono text-[10px]">
                {c.remove.map((f) => (
                  <span key={`r${f}`} className="bg-viz-remove/15 text-viz-remove rounded px-1">
                    −{fileTag(f)}
                  </span>
                ))}
                {c.add.map((f) => (
                  <span key={`a${f}`} className="bg-viz-add/15 text-viz-add rounded px-1">
                    +{fileTag(f)}
                  </span>
                ))}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StorageGrid({ version, commits }: { version: number; commits: Commit[] }) {
  const states = fileStates(version, commits);
  const inTable = FILE_IDS.filter((f) => states[f] === "live" || states[f] === "added").length;
  const inStorage = FILE_IDS.filter((f) => states[f] !== "future").length;
  return (
    <div>
      <p className="text-muted mb-2 text-xs">
        Storage: <span className="text-fg font-medium tabular-nums">{inStorage}</span> files · table
        uses <span className="text-fg font-medium tabular-nums">{inTable}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {FILE_IDS.map((f) => (
          <FileTile key={f} id={f} state={states[f]} />
        ))}
      </div>
    </div>
  );
}

/* 5 ─ Replay the log ⭐ ----------------------------------------------- */

export function TimeTravel() {
  const [s, set] = useSceneState<DeltaState>();
  const [playing, setPlaying] = useState(false);
  const v = s.version;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (v >= LAST) setPlaying(false);
      else set({ version: v + 1 });
    }, 1400);
    return () => clearTimeout(id);
  }, [playing, v, set]);

  const commit = COMMITS[v];

  return (
    <StepLayout
      eyebrow="Replay the log"
      title="Every version is still there"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          {/* Version scrubber */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (playing) setPlaying(false);
                else {
                  if (v >= LAST) set({ version: 0 });
                  setPlaying(true);
                }
              }}
              aria-label={playing ? "Pause replay" : "Replay the log"}
              className="bg-viz-meta text-bg grid size-10 shrink-0 place-items-center rounded-full"
            >
              {playing ? (
                <Pause className="size-4" />
              ) : v >= LAST ? (
                <RotateCcw className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </button>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={LAST}
                value={v}
                onChange={(e) => {
                  setPlaying(false);
                  set({ version: Number(e.target.value) });
                }}
                aria-label="Table version"
                className="w-full accent-[var(--viz-meta)]"
              />
              <div className="text-subtle flex justify-between px-0.5 font-mono text-[10px]">
                {COMMITS.map((c) => (
                  <span
                    key={c.version}
                    className={c.version === v ? "text-viz-meta font-semibold" : ""}
                  >
                    v{c.version}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-2/60 rounded-xl px-4 py-2.5 font-mono text-xs">
            <span className="text-viz-meta">SELECT</span> *{" "}
            <span className="text-viz-meta">FROM</span> orders{" "}
            <span className="text-viz-meta">VERSION AS OF</span>{" "}
            <span className="text-fg font-semibold">{v}</span>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
            <div>
              <p className="text-muted mb-2 font-mono text-xs">_delta_log/</p>
              <LogList
                commits={COMMITS}
                version={v}
                onPick={(p) => {
                  setPlaying(false);
                  set({ version: p });
                }}
              />
            </div>
            <div className="grid content-start gap-5">
              <StorageGrid version={v} commits={COMMITS} />
              <div>
                <p className="text-muted mb-2 text-xs">
                  orders @ v{v} · {rowsAt(v).length} rows
                </p>
                <RowsTable rows={rowsAt(v)} compact />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={v}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="border-viz-meta/30 bg-viz-meta/10 rounded-xl border px-4 py-3 text-sm"
            >
              <span className="text-viz-meta font-mono text-xs font-semibold">
                v{v} · {commit.operation}
              </span>
              <br />
              {commit.story}
            </motion.p>
          </AnimatePresence>
          <FileLegend states={["added", "live", "removed", "storage"]} />
        </div>
      }
    >
      <p>
        To read{" "}
        <Term id="snapshot">
          <strong>version n</strong>
        </Term>
        , an engine replays commits 0 through n: every{" "}
        <span className="text-viz-add font-medium">add</span> puts a file into the set, every{" "}
        <span className="text-viz-remove font-medium">remove</span> takes one out. The files left
        are the table.
      </p>
      <p>
        Press play, or drag the slider. Watch three things move together: the log, the files, and
        the rows.
      </p>
      <p>
        Notice that <strong>removed files never disappear</strong>. They drop out of the table but
        stay in storage. That is the whole secret of time travel.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Predict: storage vs table --------------------------------------- */

export function PredictStorage() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="What does time travel cost?"
      stage={
        <div className="flex flex-1 items-center">
          <PredictCheckpoint
            id="files-in-storage"
            prompt={`At version ${LAST} the table is made of ${liveFiles(LAST).size} file. How many Parquet files are sitting in the folder?`}
            min={1}
            max={12}
            answer={FILE_IDS.length}
            tolerance={0}
            explanation={
              <>
                All {FILE_IDS.length}: every file any commit ever added. Versions don&apos;t copy
                data. They point at files that already exist. The price is storage: it keeps growing
                until you clean up old files with <strong>VACUUM</strong>, which you&apos;ll meet
                shortly.
              </>
            }
          />
        </div>
      }
    >
      <p>
        Nothing is deleted when a commit removes a file. So think about how many files have ever
        been written to this table.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Fix the incident ------------------------------------------------- */

const wrongRestore: Record<number, string> = {
  0: "That's the very first version. You'd lose the appended orders, the status fix and the deletion. The data would be too old.",
  1: "Close, but that undoes two legitimate changes: order 1003's status fix and the deletion of order 1002.",
  2: "That brings back order 1002, which someone deliberately deleted in version 3.",
  4: "Version 4 is the bad UPDATE itself. Every amount is still 0.",
  5: "Version 5 is OPTIMIZE running on the already-broken data. Compaction doesn't change values, so the amounts are still 0.",
};

export function Restore() {
  const [s, set] = useSceneState<DeltaState>();
  const cp = useCheckpoint("restore-target");
  const [tried, setTried] = useState<number>();
  const target = s.restoreTarget;
  const restored = s.restored && target === 3;
  const commits = restored ? [...COMMITS, RESTORE_COMMIT] : COMMITS;
  const head = commits.length - 1;
  const previewVersion = restored ? head : (target ?? LAST);
  const revenue = rowsAt(previewVersion, commits).reduce((sum, r) => sum + r.amount, 0);

  function restore() {
    if (target === undefined) return;
    if (target === 3) {
      set({ restored: true });
      cp.answer(true);
    } else {
      setTried(target);
    }
  }

  return (
    <StepLayout
      eyebrow="Fix the incident"
      title="Pick the version to restore"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="border-line overflow-x-auto rounded-xl border">
            <p className="bg-surface-2/60 text-muted border-line border-b px-3 py-2 font-mono text-xs">
              <span className="text-viz-meta">DESCRIBE HISTORY</span> orders
            </p>
            <table className="w-full min-w-[34rem] font-mono text-xs">
              <thead className="text-subtle">
                <tr>
                  {["version", "timestamp", "userName", "operation", "parameters"].map((h) => (
                    <th key={h} className="px-3 py-1.5 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {[...commits].reverse().map((c) => {
                    const picked = !restored && target === c.version;
                    const isRestore = c.operation === "RESTORE";
                    return (
                      <motion.tr
                        key={c.version}
                        layout
                        initial={{ opacity: 0, backgroundColor: "var(--viz-add)" }}
                        animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                        onClick={() =>
                          !restored &&
                          !isRestore &&
                          set({ restoreTarget: c.version, restored: false })
                        }
                        className={cn(
                          "border-line border-t transition-colors",
                          !restored && "hover:bg-surface-2 cursor-pointer",
                          picked && "bg-accent-soft",
                          isRestore && "text-viz-add",
                        )}
                      >
                        <td className="px-3 py-1.5">{c.version}</td>
                        <td className="text-muted px-3">{c.at.slice(5, 16).replace("T", " ")}</td>
                        <td className="px-3">{c.user}</td>
                        <td className={cn("px-3", c.version === 4 && "text-bad")}>{c.operation}</td>
                        <td className="text-muted px-3">{c.params}</td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
            <div>
              <p className="text-muted mb-2 text-xs">
                {restored ? (
                  <>orders (current, v{head})</>
                ) : (
                  <>
                    Preview: orders{" "}
                    <span className="text-viz-meta">VERSION AS OF {previewVersion}</span>
                  </>
                )}
                {" · "}revenue{" "}
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    revenue === 0 ? "text-bad" : "text-good",
                  )}
                >
                  ₹{revenue.toLocaleString("en-IN")}
                </span>
              </p>
              <RowsTable rows={rowsAt(previewVersion, commits)} compact />
            </div>
            <div className="grid content-start gap-3">
              <button
                type="button"
                onClick={restore}
                disabled={target === undefined || restored}
                className="bg-accent text-accent-fg inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition hover:brightness-110 disabled:opacity-40"
              >
                <Wrench className="size-4" />
                {restored ? "Restored" : `RESTORE TO VERSION ${target ?? "…"}`}
              </button>
              <AnimatePresence mode="wait">
                {restored ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs leading-relaxed"
                  >
                    <p className="text-good font-semibold">Incident fixed.</p>
                    <p className="text-muted mt-1">
                      Version 3 was the last good state, after the legitimate update and delete and
                      before the bad UPDATE. RESTORE didn&apos;t rewrite history. It appended{" "}
                      <strong className="text-fg">v6</strong>, which re-adds three old files that
                      were still in storage.
                    </p>
                  </motion.div>
                ) : tried !== undefined && tried === target ? (
                  <motion.p
                    key={`hint-${target}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted text-xs leading-relaxed"
                  >
                    {wrongRestore[target]}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {restored && (
            <div>
              <StorageGrid version={head} commits={commits} />
            </div>
          )}
        </div>
      }
    >
      <p>
        Every commit records who did what, and when. <code>DESCRIBE HISTORY</code> shows it.
      </p>
      <p>
        Click a row to preview the table at that version. When you&apos;ve found the{" "}
        <strong>last good version</strong>, restore it.
      </p>
      <p className="text-subtle text-xs">
        Careful: &ldquo;good&rdquo; means before the damage, but after every legitimate change.
      </p>
    </StepLayout>
  );
}
