"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { VERSIONS } from "@/modules/clean-code/complexity/model";

/** A taste of module 8: flatten a nested function and watch its complexity fall. */
export function CleanCodeTaste() {
  const [i, setI] = useState(0);
  const v = VERSIONS[i];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {VERSIONS.map((x, k) => (
          <button
            key={x.label}
            type="button"
            aria-pressed={i === k}
            onClick={() => setI(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              i === k ? "border-accent bg-accent-soft" : "border-line-strong text-muted",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="border-line bg-surface max-h-56 overflow-auto rounded-lg border px-3 py-2 font-mono text-[10px]">
        {v.code.map((l, k) => (
          <pre key={k} className="whitespace-pre">
            {l || " "}
          </pre>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {(
          [
            ["Cognitive complexity", v.cognitive, 16],
            ["Deepest nesting", v.depth, 5],
          ] as const
        ).map(([l, n, max]) => (
          <div key={l}>
            <div className="flex justify-between">
              <span>{l}</span>
              <span className="font-mono">{n}</span>
            </div>
            <motion.div
              animate={{ width: `${(n / max) * 100}%` }}
              className="bg-accent/60 mt-0.5 h-2 rounded"
            />
          </div>
        ))}
      </div>
      <p className="text-subtle text-[11px]">Same behaviour at every step.</p>
    </div>
  );
}
