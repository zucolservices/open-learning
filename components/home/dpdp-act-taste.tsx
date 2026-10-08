"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  BAD_DESIGN,
  QUALITIES,
  SWITCHES,
  assess,
  type Design,
} from "@/modules/dpdp-act/consent/model";

/** A taste of module 6: switch off a sign-up screen's bad habits and watch consent become valid. */
export function DpdpActTaste() {
  const [d, setD] = useState<Design>(BAD_DESIGN);
  const broken = new Set(assess(d).map((f) => f.quality));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {SWITCHES.map((sw) => (
          <button
            key={sw.id}
            type="button"
            aria-pressed={!d[sw.id]}
            onClick={() => setD({ ...d, [sw.id]: !d[sw.id] })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              d[sw.id] ? "border-bad/60 bg-bad/10" : "border-accent bg-accent-soft",
            )}
          >
            {d[sw.id] ? sw.on : sw.off}
          </button>
        ))}
      </div>
      <div className="grid gap-1 sm:grid-cols-2">
        {QUALITIES.map((q) => {
          const ok = !broken.has(q.id);
          return (
            <div
              key={q.id}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs",
                ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {ok ? <Check className="text-good size-3.5" /> : <X className="text-bad size-3.5" />}
              {q.label}
            </div>
          );
        })}
      </div>
      <p className="text-subtle text-[11px]">
        {broken.size === 0
          ? "Valid consent under section 6."
          : `${broken.size} qualities still broken. Click the red pills.`}
      </p>
    </div>
  );
}
