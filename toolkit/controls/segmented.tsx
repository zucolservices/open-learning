"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/** Pill toggle between a few options, with a sliding highlight. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = "md",
}: {
  value: T;
  options: [T, string][];
  onChange(v: T): void;
  size?: "sm" | "md";
}) {
  const pill = useId();
  return (
    <div className="border-line bg-surface inline-flex rounded-full border p-1">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          aria-pressed={v === value}
          onClick={() => onChange(v)}
          className={cn(
            "relative rounded-full transition-colors",
            size === "md" ? "h-8 px-4 text-sm" : "h-7 px-3 text-xs",
            v === value ? "text-accent-fg" : "text-muted hover:text-fg",
          )}
        >
          {v === value && (
            <motion.span layoutId={pill} className="bg-accent absolute inset-0 rounded-full" />
          )}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}
