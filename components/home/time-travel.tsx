"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTicker } from "@/lib/use-ticker";
import { cn } from "@/lib/cn";

/**
 * Track-card infographic: a Delta transaction log replaying itself.
 * Each commit adds and removes files; "removed" files stay in storage,
 * which is exactly what makes time travel possible.
 */

const COMMITS = [
  { op: "CREATE TABLE", note: "add 3 files", add: ["a", "b", "c"], remove: [] },
  { op: "INSERT", note: "add 2 files", add: ["d", "e"], remove: [] },
  { op: "UPDATE", note: "rewrite 1 file", add: ["f"], remove: ["b"] },
  { op: "DELETE", note: "drop 1 file", add: [], remove: ["d"] },
  { op: "OPTIMIZE", note: "compact 4 → 1", add: ["g"], remove: ["a", "c", "e", "f"] },
] as const;

const FILES = ["a", "b", "c", "d", "e", "f", "g"];

type FileState = "live" | "added" | "removed" | "tombstone" | "future";

function fileStates(version: number): Record<string, FileState> {
  const out: Record<string, FileState> = Object.fromEntries(FILES.map((f) => [f, "future"]));
  COMMITS.slice(0, version + 1).forEach((c, v) => {
    const latest = v === version;
    c.add.forEach((f) => (out[f] = latest ? "added" : "live"));
    c.remove.forEach((f) => (out[f] = latest ? "removed" : "tombstone"));
  });
  return out;
}

const tileStyle: Record<FileState, string> = {
  live: "border-viz-data/60 bg-viz-data/20 text-fg",
  added: "border-viz-add bg-viz-add/25 text-fg",
  removed: "border-viz-remove border-dashed bg-viz-remove/10 text-viz-remove line-through",
  tombstone: "border-line-strong border-dashed bg-transparent text-subtle line-through",
  future: "border-line border-dashed bg-transparent text-transparent",
};

export function TimeTravel() {
  const { ref, tick } = useTicker<HTMLDivElement>(1700);
  const [pinned, setPinned] = useState<number>();
  const version = pinned ?? tick % COMMITS.length;
  const states = fileStates(version);
  const liveCount = FILES.filter((f) => states[f] === "live" || states[f] === "added").length;

  return (
    <div
      ref={ref}
      onPointerLeave={() => setPinned(undefined)}
      className="border-line bg-bg/60 relative flex flex-col gap-4 rounded-2xl border p-4 font-mono text-xs sm:p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-muted">_delta_log/</span>
        <span className="text-subtle">{pinned === undefined ? "▶ replaying" : "❚❚ paused"}</span>
      </div>

      <ol className="grid gap-1">
        {COMMITS.map((c, v) => (
          <li key={v}>
            <button
              type="button"
              onClick={() => setPinned(v)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors duration-300",
                v === version && "bg-viz-meta/15",
                v > version && "opacity-35",
              )}
            >
              <span className={v <= version ? "text-viz-meta" : "text-subtle"}>
                {String(v).padStart(5, "0")}.json
              </span>
              <span className="text-fg font-sans font-medium">{c.op}</span>
              <span className="text-muted ml-auto hidden font-sans sm:inline">{c.note}</span>
            </button>
          </li>
        ))}
      </ol>

      <div>
        <p className="text-muted mb-2 font-sans">
          Files in storage · <span className="text-fg font-medium">{liveCount} in the table</span>{" "}
          at version {version}
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {FILES.map((f) => (
            <motion.div
              key={f}
              layout
              animate={{ scale: states[f] === "added" ? [0.6, 1.08, 1] : 1 }}
              transition={{ duration: 0.45 }}
              className={cn(
                "grid aspect-[3/4] place-items-center rounded-md border text-[11px] transition-colors duration-500",
                tileStyle[states[f]],
              )}
            >
              {f}
            </motion.div>
          ))}
        </div>
      </div>

      <ul className="text-muted flex flex-wrap gap-x-4 gap-y-1.5 font-sans text-[11px]">
        {(
          [
            ["added", "added by this commit"],
            ["live", "in the table"],
            ["removed", "removed by this commit"],
            ["tombstone", "still in storage for time travel"],
          ] as const
        ).map(([state, label]) => (
          <li key={state} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm border", tileStyle[state])} />
            {label}
          </li>
        ))}
      </ul>

      <p className="border-line text-muted rounded-lg border border-dashed px-3 py-2 font-sans text-[11px] leading-relaxed">
        Removed files are only unlinked from the log, not deleted. That is why{" "}
        <span className="text-fg">VERSION AS OF</span> works, and why{" "}
        <span className="text-fg">VACUUM</span> exists.
      </p>

      <div className="pt-2">
        <div className="relative flex items-center justify-between">
          <div className="bg-line absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2" />
          <motion.div
            className="bg-viz-meta absolute top-1/2 left-1 h-0.5 -translate-y-1/2"
            animate={{ width: `calc(${(version / (COMMITS.length - 1)) * 100}% - 0.5rem)` }}
            transition={{ type: "spring", stiffness: 160, damping: 24 }}
          />
          {COMMITS.map((_, v) => (
            <button
              key={v}
              type="button"
              aria-label={`Travel to version ${v}`}
              onClick={() => setPinned(v)}
              className={cn(
                "relative grid size-6 place-items-center rounded-full border text-[10px] transition-colors",
                v <= version
                  ? "border-viz-meta bg-viz-meta text-bg"
                  : "border-line-strong bg-surface text-subtle",
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={version}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-muted mt-3"
          >
            <span className="text-viz-meta">SELECT</span> *{" "}
            <span className="text-viz-meta">FROM</span> orders{" "}
            <span className="text-viz-meta">VERSION AS OF</span>{" "}
            <span className="text-fg">{version}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
