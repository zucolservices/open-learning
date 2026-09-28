"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { CADENCES, simulate } from "@/modules/agile-scrum/why-plans-break/model";

/** A taste of module 1: how often users see a working version decides when surprises are found. */
export function CadenceTaste() {
  const [every, setEvery] = useState(52);
  const p = simulate(every, true);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1">
        {CADENCES.map(([w, l]) => (
          <button
            key={w}
            type="button"
            onClick={() => setEvery(w)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] transition",
              w === every ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid gap-1.5">
        {p.found.map((f) => (
          <div key={f.feature.id} className="grid grid-cols-[7rem_1fr] items-center gap-2 text-xs">
            <span className="text-muted truncate">{f.feature.label}</span>
            <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
              <motion.div
                className={cn("h-full", f.afterLaunch ? "bg-bad" : "bg-accent")}
                animate={{ width: `${Math.min(100, (f.lag / 48) * 100)}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-muted text-xs">
        Bars: how long each hidden mistake sits in the product before users reveal it.{" "}
        <span className="text-fg font-medium">
          {p.afterLaunch > 0
            ? `${p.afterLaunch} of 6 surprises land after launch.`
            : `All found early; about ${Math.round(p.rework)} weeks of rework in total.`}
        </span>
      </p>
    </div>
  );
}
