"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, CircleHelp, CircleX } from "lucide-react";

/**
 * Shared look for every checkpoint. There are no scores: a checkpoint exists so the
 * learner commits to an answer, then sees why the right answer is right.
 */
export function CheckpointFrame({
  prompt,
  children,
  result,
  explanation,
  actions,
}: {
  prompt: ReactNode;
  children: ReactNode;
  /** undefined until revealed. */
  result?: "correct" | "incorrect";
  explanation?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-card border-line bg-surface shadow-card w-full border p-5 sm:p-6">
      <p className="text-accent flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
        <CircleHelp className="size-4" /> Checkpoint
      </p>
      <div className="mt-2 text-lg font-semibold tracking-tight text-balance">{prompt}</div>
      <div className="mt-5">{children}</div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={
                "mt-5 rounded-2xl border p-4 " +
                (result === "correct" ? "border-good/30 bg-good/10" : "border-bad/30 bg-bad/10")
              }
            >
              <p className="flex items-center gap-2 font-medium">
                {result === "correct" ? (
                  <>
                    <CircleCheck className="text-good size-4" /> Exactly right
                  </>
                ) : (
                  <>
                    <CircleX className="text-bad size-4" /> Not quite
                  </>
                )}
              </p>
              {explanation && (
                <div className="text-muted mt-1.5 text-sm leading-relaxed">{explanation}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function CheckpointButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: ReactNode;
  onClick(): void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        variant === "primary"
          ? "bg-fg text-bg h-10 rounded-full px-5 text-sm font-medium transition hover:opacity-90 disabled:opacity-30"
          : "text-muted hover:bg-surface-2 hover:text-fg h-10 rounded-full px-4 text-sm transition"
      }
    >
      {children}
    </button>
  );
}
