"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Step-through building blocks: a Stepper (prev / counter / next), the
 * FrameCaption shown under it, and a small Code block for SQL snippets.
 */

function Nav({
  children,
  label,
  onClick,
  disabled,
  primary,
}: {
  children: ReactNode;
  label: string;
  onClick(): void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-full transition disabled:opacity-30",
        primary ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

/** Previous / counter / next, for step-through stages (with FrameCaption below). */
export function Stepper({
  step,
  count,
  onChange,
  label,
}: {
  step: number;
  count: number;
  onChange(step: number): void;
  label?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted min-w-0 truncate text-xs">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <Nav label="Previous" onClick={() => onChange(Math.max(0, step - 1))} disabled={step === 0}>
          <ChevronLeft className="size-4" />
        </Nav>
        <span className="text-muted w-10 text-center font-mono text-xs">
          {step + 1}/{count}
        </span>
        <Nav
          label="Next"
          primary
          onClick={() => onChange(Math.min(count - 1, step + 1))}
          disabled={step === count - 1}
        >
          <ChevronRight className="size-4" />
        </Nav>
      </div>
    </div>
  );
}

/** The caption under a step-through: title + text, animated per frame. */
export function FrameCaption({
  frameKey,
  title,
  children,
  tone,
}: {
  frameKey: string | number;
  title: ReactNode;
  children: ReactNode;
  tone?: "good" | "bad";
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={frameKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={cn(
          "rounded-xl border px-4 py-3",
          tone === "good"
            ? "border-good/40 bg-good/10"
            : tone === "bad"
              ? "border-bad/40 bg-bad/10"
              : "border-line bg-surface",
        )}
      >
        <p className="font-semibold">{title}</p>
        <div className="text-muted mt-1 text-sm">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}

/** A small monospace block for SQL and config snippets. */
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <pre
      className={cn(
        "bg-surface-2 overflow-x-auto rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed",
        className,
      )}
    >
      {children}
    </pre>
  );
}
