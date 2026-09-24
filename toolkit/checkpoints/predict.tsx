"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useCheckpoint } from "@/lib/module-sdk";
import { CheckpointButton, CheckpointFrame } from "./checkpoint-frame";

/** Commit to a numeric guess on a slider, then see the real value animate in. */
export function PredictCheckpoint({
  id,
  prompt,
  min,
  max,
  step = 1,
  unit = "",
  answer,
  tolerance,
  explanation,
}: {
  id: string;
  prompt: ReactNode;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  answer: number;
  /** A guess within ±tolerance of the answer counts as right. */
  tolerance: number;
  explanation: ReactNode;
}) {
  const cp = useCheckpoint(id);
  const [guess, setGuess] = useState(Math.round((min + max) / 2 / step) * step);
  const [revealed, setRevealed] = useState(cp.answered);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <CheckpointFrame
      prompt={prompt}
      result={revealed ? (cp.correct ? "correct" : "incorrect") : undefined}
      explanation={explanation}
      actions={
        revealed ? (
          !cp.correct && (
            <CheckpointButton variant="ghost" onClick={() => setRevealed(false)}>
              Try again
            </CheckpointButton>
          )
        ) : (
          <CheckpointButton
            onClick={() => {
              cp.answer(Math.abs(guess - answer) <= tolerance);
              setRevealed(true);
            }}
          >
            Lock in my guess
          </CheckpointButton>
        )
      }
    >
      <div className="relative pt-9 pb-8">
        <div
          className="bg-fg text-bg absolute top-0 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-sm font-semibold tabular-nums"
          style={{ left: `${pct(guess)}%` }}
        >
          {guess}
          {unit}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={guess}
          disabled={revealed}
          onChange={(e) => setGuess(Number(e.target.value))}
          aria-label="Your prediction"
          className="w-full accent-[var(--accent)]"
        />
        {revealed && (
          <motion.div
            initial={{ left: `${pct(guess)}%`, opacity: 0 }}
            animate={{ left: `${pct(answer)}%`, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="absolute bottom-0 -translate-x-1/2 text-center"
          >
            <div className="bg-good mx-auto h-3 w-0.5" />
            <span className="text-good text-xs font-semibold whitespace-nowrap tabular-nums">
              actual {answer}
              {unit}
            </span>
          </motion.div>
        )}
        <div className="text-subtle mt-1 flex justify-between text-xs tabular-nums">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </CheckpointFrame>
  );
}
