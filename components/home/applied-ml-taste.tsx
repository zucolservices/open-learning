"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { BUGS, N, flipped, stats, type Bug } from "@/modules/applied-ml/model-serving/model";

/** A taste of module 19: break the live feature pipeline and watch the same model give different answers. */
export function AppliedMlTaste() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const off = stats(bugs, false, false);
  const on = stats(bugs, false, true);
  const flips = flipped(bugs, false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {BUGS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() =>
              setBugs(bugs.includes(b.id) ? bugs.filter((x) => x !== b.id) : [...bugs, b.id])
            }
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              bugs.includes(b.id) ? "border-bad bg-bad/10" : "border-line hover:bg-surface-2",
            )}
          >
            {b.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="border-line bg-surface rounded-lg border px-3 py-2">
          <p className="text-muted text-[10px] uppercase">Offline</p>
          <p className="font-mono text-xl">{off.approved}%</p>
          <p className="text-muted text-[11px]">approved</p>
        </div>
        <div
          className={cn(
            "rounded-lg border px-3 py-2",
            flips ? "border-bad bg-bad/10" : "border-good bg-good/10",
          )}
        >
          <p className="text-muted text-[10px] uppercase">Live</p>
          <p className="font-mono text-xl">{on.approved}%</p>
          <p className="text-muted text-[11px]">approved</p>
        </div>
      </div>
      <p className="text-muted text-xs">
        <span className={flips ? "text-bad" : "text-good"}>{flips}</span> of {N} applicants get a
        different decision live, with no error message anywhere.
      </p>
    </div>
  );
}
