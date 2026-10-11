"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { StepLayout } from "./step-layout";

/** The standard "What to remember" wrap-up: a column of takeaway cards beside a short narration. */
export function WrapStep({
  points,
  children,
  title = "What to remember",
}: {
  points: [string, string][];
  children: ReactNode;
  title?: string;
}) {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title={title}
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {points.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      {children}
    </StepLayout>
  );
}
