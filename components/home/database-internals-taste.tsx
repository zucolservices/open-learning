"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  LEVELS,
  SCENARIOS,
  run,
  type Level,
  type Scenario,
} from "@/modules/database-internals/isolation/model";

/** A taste of module 15: two transactions collide at each isolation level. */
export function DatabaseInternalsTaste() {
  const [sc, setSc] = useState<Scenario>("skew");
  const [lv, setLv] = useState<Level>("rr");
  const r = run(sc, lv);
  const chip = (on: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs",
      on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
    );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SCENARIOS) as Scenario[]).map((k) => (
          <button key={k} type="button" onClick={() => setSc(k)} className={chip(sc === k)}>
            {SCENARIOS[k].name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(LEVELS) as Level[]).map((k) => (
          <button key={k} type="button" onClick={() => setLv(k)} className={chip(lv === k)}>
            {LEVELS[k]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10px]">
        {r.lines.map((l, i) => (
          <div
            key={`${sc}-${lv}-${i}`}
            style={{ gridRow: i + 1, gridColumn: l.t }}
            className={cn(
              "rounded border px-1.5 py-0.5",
              l.bad ? "border-bad/60 bg-bad/15" : "border-line bg-surface",
            )}
          >
            T{l.t}: {l.sql}
            {l.out && <span className="text-muted"> → {l.out}</span>}
          </div>
        ))}
      </div>
      <p className={cn("text-xs", r.ok ? "text-good" : "text-bad")}>{r.note}</p>
    </div>
  );
}
