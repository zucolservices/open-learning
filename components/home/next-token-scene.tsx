"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { NT, probs, show } from "./next-token";

/**
 * LLM Foundations showcase: the next-token loop, with a real model's real scores. Text becomes
 * tokens, the model reads them all, scores every possible next token, picks one, appends it, and
 * goes round again. Advances on its own; each step can be picked.
 */

const PHASES = [
  "Text is split into tokens.",
  "The model reads every token at once, layer by layer.",
  "It scores every token in its vocabulary as the possible next one.",
  "One is picked, added to the text, and the loop goes round again.",
] as const;

export function NextTokenScene() {
  const [tick, setTick] = useState(0);
  const [auto, setAuto] = useState(true);
  const n = NT.steps.length;
  const step = Math.floor(tick / 4) % n;
  const phase = tick % 4;
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setTick((t) => (t + 1) % (n * 4)), 1300);
    return () => clearInterval(id);
  }, [auto, n]);

  const shown = NT.steps.slice(0, step + (phase === 3 ? 1 : 0)).map((s) => s.top[0][0] as string);
  const { top } = probs(NT.steps[step], 1);
  const bars = top.slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-muted mr-1 text-[11px]">Step</span>
        {NT.steps.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setAuto(false);
              setTick(i * 4 + 3);
            }}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[11px] transition",
              i === step ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {i + 1}
          </button>
        ))}
        {!auto && (
          <button
            type="button"
            onClick={() => setAuto(true)}
            className="text-muted hover:text-fg ml-1 text-[11px] underline"
          >
            play
          </button>
        )}
      </div>

      {/* 1. The text, as tokens */}
      <div className="flex min-h-9 flex-wrap items-center gap-1">
        {NT.promptPieces.map((w, i) => (
          <span
            key={`p${i}`}
            className="border-line bg-surface-2 rounded-md border px-1.5 py-0.5 font-mono text-xs"
          >
            {show(w)}
          </span>
        ))}
        <AnimatePresence>
          {shown.map((w, i) => (
            <motion.span
              key={`g${i}`}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border-accent bg-accent-soft rounded-md border px-1.5 py-0.5 font-mono text-xs"
            >
              {show(w)}
            </motion.span>
          ))}
        </AnimatePresence>
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="border-accent rounded-md border border-dashed px-1.5 py-0.5 font-mono text-xs"
        >
          ?
        </motion.span>
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-[9rem_1fr]">
        {/* 2. The model */}
        <div className="border-line bg-surface-2/60 rounded-xl border p-2.5">
          <p className="text-muted mb-1.5 text-center text-[10px]">model · 24 layers</p>
          <div className="grid gap-1">
            {[0, 1, 2, 3, 4].map((l) => (
              <motion.div
                key={l}
                className="bg-viz-compute h-2.5 rounded"
                animate={{
                  opacity: phase === 1 ? [0.25, 1, 0.25] : 0.3,
                }}
                transition={{
                  duration: 0.9,
                  delay: phase === 1 ? (4 - l) * 0.12 : 0,
                  repeat: phase === 1 ? Infinity : 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* 3. Scores for the next token */}
        <div className="grid gap-1.5">
          {bars.map((b, i) => {
            const on = phase >= 2;
            const win = phase === 3 && i === 0;
            return (
              <div
                key={step + b.word}
                className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2"
              >
                <span
                  className={cn(
                    "truncate font-mono text-xs",
                    win ? "text-accent font-semibold" : "text-muted",
                  )}
                >
                  {JSON.stringify(b.word).slice(1, -1).replace(/^ /, "␣")}
                </span>
                <div className="bg-surface-2 h-3 overflow-hidden rounded">
                  <motion.div
                    className={cn("h-full", win ? "bg-accent" : "bg-accent/40")}
                    initial={false}
                    animate={{ width: on ? `${Math.max(3, (b.p / bars[0].p) * 100)}%` : "0%" }}
                    transition={{ duration: 0.6, delay: on ? i * 0.06 : 0 }}
                  />
                </div>
                <span className="text-muted text-right font-mono text-[11px] tabular-nums">
                  {on ? `${(b.p * 100).toFixed(0)}%` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{phase + 1}.</span> {PHASES[phase]}
        </motion.p>
      </AnimatePresence>
      <p className="text-subtle -mt-2 text-[10px]">
        Real scores from a small open model ({NT.model}). Bars are scaled to the top candidate; ␣
        marks a token that starts with a space.
      </p>
    </div>
  );
}
