"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { REAL, SERIES, score, type Method } from "@/modules/data-quality/anomaly-detection/model";

const METHODS: { id: Method; label: string }[] = [
  { id: "fixed", label: "Fixed limits" },
  { id: "rolling", label: "Last 14 days" },
  { id: "seasonal", label: "Same weekday" },
];

/** A taste of module 13: three ways to judge a daily row count, and how many alarms each raises. */
export function DataQualityTaste() {
  const [m, setM] = useState<Method>("fixed");
  const r = score(m, { min: 80, max: 160, k: 3.5 });
  const max = Math.max(...SERIES);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {METHODS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setM(x.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              m === x.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="flex h-20 items-end gap-px">
        {SERIES.map((v, d) => (
          <div
            key={d}
            className={cn(
              "flex-1 rounded-t-sm",
              r.alerts[d]
                ? d in REAL
                  ? "bg-good"
                  : "bg-bad"
                : d in REAL
                  ? "bg-viz-compute"
                  : "bg-viz-data/60",
            )}
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
      <p className="text-muted text-xs">
        Eight weeks of daily orders rows, with quiet weekends and two real problems.{" "}
        <span className="text-fg font-semibold">
          {r.caught} of {r.total} caught, {r.falseAlarms} false alarms.
        </span>{" "}
        Green: caught · amber: missed · red: false alarm.
      </p>
    </div>
  );
}
