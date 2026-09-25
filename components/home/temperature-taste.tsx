"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { NT, probs, show } from "./next-token";

/** Draw one word from the distribution (a click handler, not render). */
function draw(top: { word: string; p: number }[]) {
  let r = Math.random();
  for (const x of top) if ((r -= x.p) < 0) return x.word;
  return "(something rarer)";
}

/** A taste of the sampling module: turn the temperature on a real next-token distribution. */
export function TemperatureTaste() {
  const [t, setT] = useState(1);
  const [pick, setPick] = useState<string | null>(null);
  const K = 3; // "…breakfast is a simple but ___"
  const step = NT.steps[K];
  const before = NT.steps.slice(0, K).map((x) => show(x.top[0][0] as string));
  const { top, rest } = probs(step, t);
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs">
        <span className="text-muted">{[...NT.promptPieces.map(show), ...before].join(" ")}</span>{" "}
        <span
          className={cn(
            "rounded border px-1",
            pick ? "border-accent bg-accent-soft" : "border-accent border-dashed",
          )}
        >
          {pick ? show(pick) : "___"}
        </span>
      </p>
      <div className="grid gap-1">
        {[...top, { word: "everything else", p: rest }].map((x) => (
          <div key={x.word} className="grid grid-cols-[6.5rem_1fr_2.75rem] items-center gap-2">
            <span
              className={cn(
                "truncate text-xs",
                x.word === "everything else" ? "text-subtle italic" : "font-mono",
              )}
            >
              {x.word === "everything else" ? x.word : show(x.word)}
            </span>
            <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
              <motion.div
                className={cn("h-full", x.word === "everything else" ? "bg-viz-idle" : "bg-accent")}
                animate={{ width: `${x.p * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              />
            </div>
            <span className="text-muted text-right font-mono text-[11px] tabular-nums">
              {(x.p * 100).toFixed(x.p < 0.1 ? 1 : 0)}%
            </span>
          </div>
        ))}
      </div>
      <label className="flex items-center gap-3 text-xs">
        <span className="text-muted w-24">Temperature {t.toFixed(1)}</span>
        <input
          type="range"
          min={0.1}
          max={2}
          step={0.1}
          value={t}
          onChange={(e) => {
            setT(Number(e.target.value));
            setPick(null);
          }}
          className="flex-1 accent-[var(--accent)]"
          aria-label="Temperature"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPick(draw(top))}
          className="bg-accent text-accent-fg rounded-full px-3.5 py-1 text-xs font-medium"
        >
          Pick a word
        </button>
        <span className="text-muted text-xs">
          {t < 0.5
            ? "Cold: the favourite almost always wins."
            : t > 1.4
              ? "Hot: rare words get a real chance."
              : "Around 1: the model's own odds."}
        </span>
      </div>
    </div>
  );
}
