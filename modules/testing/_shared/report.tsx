"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Outcome } from "./runner";

/** A test runner's report: one line per test, failures with their message, and a summary. */
export function TestReport({
  outcomes,
  className,
  empty = "No tests yet.",
}: {
  outcomes: Outcome[];
  className?: string;
  empty?: string;
}) {
  const failed = outcomes.filter((o) => !o.ok).length;
  return (
    <div
      className={cn(
        "border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[11px]",
        className,
      )}
    >
      {outcomes.length === 0 && <p className="text-muted">{empty}</p>}
      {outcomes.map((o, i) => (
        <motion.div
          key={`${o.name}-${i}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 * i }}
        >
          <p className="flex items-start gap-1.5">
            {o.ok ? (
              <Check className="text-good mt-0.5 size-3 shrink-0" />
            ) : (
              <X className="text-bad mt-0.5 size-3 shrink-0" />
            )}
            <span className={o.ok ? "" : "text-bad"}>{o.name}</span>
          </p>
          {o.message && <p className="text-muted pl-[18px] text-[10px]">{o.message}</p>}
        </motion.div>
      ))}
      {outcomes.length > 0 && (
        <p className={cn("border-line mt-1.5 border-t pt-1.5", failed ? "text-bad" : "text-good")}>
          {failed ? `${failed} failed, ` : ""}
          {outcomes.length - failed} passed
        </p>
      )}
    </div>
  );
}
