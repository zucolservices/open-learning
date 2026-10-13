"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { APPROACHES, READY, simulate, type Approach } from "@/modules/mobile/background-push/model";

/** A taste of module 11: the order is ready at 12:22. How does the pocketed phone find out? */
export function MobileTaste() {
  const [a, setA] = useState<Approach>("poll");
  const o = simulate(a, false, true);
  const late = o.learned - READY;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {APPROACHES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={a === id}
            onClick={() => setA(id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              a === id ? "border-accent bg-accent-soft" : "border-line-strong text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="bg-surface-2 relative h-2 rounded-full">
        <span
          className="bg-viz-compute absolute -top-1 h-4 w-0.5"
          style={{ left: `${(READY / 45) * 100}%` }}
        />
        <span
          className={cn(
            "absolute -top-0.5 size-3 -translate-x-1/2 rounded-full",
            late ? "bg-bad" : "bg-good",
          )}
          style={{ left: `${(o.learned / 45) * 100}%` }}
        />
      </div>
      <p className={cn("text-xs", late ? "text-bad" : "text-good")}>
        Customer finds out at 12:{o.learned}
        {late ? `, ${late} minutes after the food was ready.` : ", the moment it's ready."}
      </p>
      <p className="text-muted text-xs">{o.story}</p>
    </div>
  );
}
