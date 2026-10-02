"use client";

import { motion } from "motion/react";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import { BAD, outcome, type Status } from "./model";
import type { ErrorKind, Strategy } from "./state";

/** The one-bad-event panel: shared by module 18 and the track showcase. */

const STRATS: [Strategy, string][] = [
  ["forever", "Retry until it works"],
  ["skip", "Log and skip"],
  ["retryDlq", "Retry 3×, then dead-letter"],
  ["retryTopics", "Retry topics, then dead-letter"],
];

const ERRORS: [ErrorKind, string][] = [
  ["permanent", "Malformed JSON (permanent)"],
  ["transient", "Database timeout (transient)"],
];

const STATUS: Record<Status, { cls: string; label: string }> = {
  done: { cls: "border-good/50 bg-good/15", label: "processed" },
  stuck: { cls: "border-bad bg-bad/30", label: "failing" },
  waiting: { cls: "border-line border-dashed", label: "blocked" },
  skipped: { cls: "border-bad/60 bg-bad/10 line-through", label: "skipped" },
  dlq: { cls: "border-viz-meta bg-viz-meta/20", label: "dead-lettered" },
  late: { cls: "border-viz-compute bg-viz-compute/20", label: "processed late" },
};

export function PoisonPanel({
  strategy,
  error,
  onStrategy,
  onError,
}: {
  strategy: Strategy;
  error: ErrorKind;
  onStrategy(s: Strategy): void;
  onError(e: ErrorKind): void;
}) {
  const o = outcome(strategy, error);
  const processed = o.statuses.filter((x) => x === "done" || x === "late").length;
  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <Segmented size="sm" value={error} options={ERRORS} onChange={(v) => onError(v)} />
      <div className="flex flex-wrap gap-1.5">
        {STRATS.map(([k, n]) => (
          <button
            key={k}
            type="button"
            onClick={() => onStrategy(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              strategy === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div>
        <p className="text-muted mb-1 text-[10px]">Partition 0 · payments #1–#12</p>
        <div className="grid grid-cols-12 gap-1">
          {o.statuses.map((st, i) => (
            <motion.div
              key={`${i}-${st}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.03 * i }}
              className={cn(
                "rounded border py-2 text-center font-mono text-[10px]",
                STATUS[st].cls,
              )}
              title={STATUS[st].label}
            >
              #{i + 1}
            </motion.div>
          ))}
        </div>
        <div className="text-muted mt-1 flex flex-wrap gap-2 text-[9px]">
          {(Object.keys(STATUS) as Status[]).map((k) => (
            <span key={k} className="flex items-center gap-1">
              <span className={cn("size-2 rounded-sm border", STATUS[k].cls)} /> {STATUS[k].label}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="border-line bg-surface rounded-lg border px-3 py-2">
          <p className="text-muted text-[10px]">Processed</p>
          <p className="font-mono text-lg font-semibold">{processed} / 12</p>
        </div>
        <div className="border-line bg-surface rounded-lg border px-3 py-2">
          <p className="text-muted text-[10px]">Dead-letter topic</p>
          <p className="font-mono text-sm">
            {o.dlq.length ? `#${BAD + 1} + error headers` : "empty"}
          </p>
        </div>
      </div>
      <motion.p
        key={`${strategy}-${error}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl border px-4 py-3 text-sm",
          o.verdict === "good"
            ? "border-good/50 bg-good/10"
            : o.verdict === "bad"
              ? "border-bad/50 bg-bad/10"
              : "border-accent/50 bg-accent-soft",
        )}
      >
        {o.text}
      </motion.p>
    </div>
  );
}
