"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { view, type ScdType } from "@/modules/data-modelling/scd/model";

/** A taste of module 11: a customer moves city; see what each SCD type does to last year's report. */
export function DataModellingTaste() {
  const [t, setT] = useState<ScdType>(2);
  const v = view(t, true);
  const max = Math.max(...v.report.map(([, n]) => n), 1);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {([0, 1, 2, 3] as ScdType[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setT(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              t === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            Type {k}
          </button>
        ))}
      </div>
      <p className="text-muted text-xs">
        Asha moved from Pune to Mumbai on 1 July. Her 2026 purchases by city:
      </p>
      <div className="flex flex-col gap-1">
        {v.report.map(([c, n]) => (
          <div key={c} className="grid grid-cols-[7rem_1fr_4rem] items-center gap-2 text-xs">
            <span>{c}</span>
            <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
              <div
                className="bg-viz-data h-full"
                style={{ width: `${Math.round((n / max) * 100)}%` }}
              />
            </div>
            <span className="text-right font-mono">₹{n.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <p className="text-muted text-[11px]">{v.verdict}</p>
    </div>
  );
}
