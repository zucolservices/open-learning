"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { TECHS, simulate, type Tech } from "@/modules/building-for-government/surge-scale/model";

/** A taste of module 17: results go live at 10 a.m.; switch techniques on and watch the errors fall. */
export function GovTaste() {
  const [t, setT] = useState<Tech>({ cache: false, light: false, queue: false, sms: false });
  const r = simulate(t);
  const failed = Math.round(r.failedShare * 100);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TECHS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={t[k]}
            onClick={() => setT({ ...t, [k]: !t[k] })}
            className={cn(
              "rounded-full border px-3 py-1 text-left text-xs",
              t[k] ? "border-accent bg-accent-soft" : "border-line-strong text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex h-16 items-end gap-1">
        {r.buckets.map((b) => (
          <div key={b.minute} className="relative flex h-full flex-1 flex-col justify-end">
            <div
              className="bg-bad/40 absolute inset-x-0 bottom-0 rounded-t-sm"
              style={{ height: `${Math.round((b.demand / 3_200_000) * 100)}%` }}
            />
            <div
              className="bg-good/80 relative rounded-t-sm"
              style={{ height: `${Math.round((b.served / 3_200_000) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <p className={cn("text-xs", failed > 5 ? "text-bad" : "text-good")}>
        {failed}% of visits see an error
        {t.queue ? `; the longest wait is ${r.maxWait} minutes.` : "."}
      </p>
    </div>
  );
}
