"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { MODES, TIMELINES, type Mode } from "@/modules/backend/transactions-app/model";

/** A taste of module 10: two buyers race for the last chai; pick a strategy and see who gets it. */
export function BackendTaste() {
  const [mode, setMode] = useState<Mode>("none");
  const t = TIMELINES[mode];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              mode === m.id ? "border-accent bg-accent-soft" : "border-line-strong text-muted",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="grid gap-1">
        {t.rows.map((r, i) => (
          <div
            key={`${mode}-${i}`}
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[10px] break-all",
              r.who === "Asha"
                ? "border-viz-data bg-viz-data/10 mr-4"
                : "border-viz-meta bg-viz-meta/10 ml-4",
            )}
          >
            <span className="font-sans font-semibold">{r.who}</span> {r.sql}
          </div>
        ))}
      </div>
      <p className={cn("text-xs", t.ok ? "text-good" : "text-bad")}>{t.verdict}</p>
    </div>
  );
}
