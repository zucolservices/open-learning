"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import {
  MINUTES,
  STRATEGIES,
  timeline,
  type Strategy,
} from "@/modules/ci-cd/release-strategies/model";

const ORDER: Strategy[] = ["recreate", "rolling", "bluegreen", "canary", "shadow"];

/** A taste of module 13: release a buggy version five ways and compare the damage. */
export function CiCdTaste() {
  const [s, setS] = useState<Strategy>("recreate");
  const t = timeline(s);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setS(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              s === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {STRATEGIES[k].name}
          </button>
        ))}
      </div>
      <div className="flex h-24 items-end gap-[3px]">
        {Array.from({ length: MINUTES }, (_, m) => {
          const v2 = t.v2[m];
          const down = t.down[m];
          return (
            <div key={m} className="flex h-full flex-1 flex-col justify-end">
              <motion.div
                animate={{ height: `${down ? 100 : Math.max(v2 * 100, 3)}%` }}
                className={cn(
                  "relative w-full rounded-t-sm",
                  down ? "bg-bad/70" : v2 > 0 ? "bg-viz-data/40" : "bg-viz-idle/30",
                )}
              >
                {!down && v2 > 0 && (
                  <div className="bg-bad/80 absolute inset-x-0 bottom-0 h-1/5 rounded-t-sm" />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
      <p className="text-muted font-mono text-xs">
        {STRATEGIES[s].name}: {t.failed.toLocaleString("en-IN")} failed requests · back on v1 at{" "}
        {t.backAt} min
      </p>
    </div>
  );
}
