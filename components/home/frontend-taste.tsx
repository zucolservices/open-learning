"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { BASE, FIXES, T } from "@/modules/frontend/web-vitals/model";

/** A taste of module 15: fix a slow, jumpy page and watch its Core Web Vitals turn good. */
export function FrontendTaste() {
  const [fixed, setFixed] = useState<string[]>([]);
  const v = { ...BASE };
  for (const f of FIXES) if (fixed.includes(f.id)) v[f.metric] += f.delta;
  const show = (m: keyof typeof T) =>
    m === "cls"
      ? v.cls.toFixed(2)
      : m === "lcp"
        ? `${v.lcp.toFixed(1)}s`
        : `${Math.round(v.inp)}ms`;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {(["lcp", "inp", "cls"] as const).map((m) => {
          const good = v[m] <= T[m].good;
          return (
            <div
              key={m}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-center text-xs",
                good ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px] uppercase">{m}</p>
              <p className="font-mono font-semibold">{show(m)}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-1">
        {FIXES.map((f) => {
          const on = fixed.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFixed(on ? fixed.filter((x) => x !== f.id) : [...fixed, f.id])}
              className={cn(
                "rounded-lg border px-3 py-1 text-left text-xs",
                on ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              {on ? f.fix : f.problem}
            </button>
          );
        })}
      </div>
      <p className="text-subtle text-[11px]">Illustrative numbers for one made-up page.</p>
    </div>
  );
}
