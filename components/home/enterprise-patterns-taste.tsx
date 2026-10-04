"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  OUTCOMES,
  SITUATIONS,
  STYLES,
  type Style,
} from "@/modules/enterprise-patterns/integration-styles/model";

/** A taste of module 8: connect two systems four ways and test each against the same situations. */
export function EnterprisePatternsTaste() {
  const [style, setStyle] = useState<Style>("file");
  const chip = (on: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs",
      on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
    );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(STYLES) as Style[]).map((k) => (
          <button key={k} type="button" onClick={() => setStyle(k)} className={chip(style === k)}>
            {STYLES[k].name}
          </button>
        ))}
      </div>
      <p className="text-muted text-xs">{STYLES[style].how}</p>
      <div className="flex flex-col gap-1">
        {OUTCOMES[style].map(([v, text], i) => (
          <div
            key={style + i}
            className={cn(
              "rounded border px-2 py-1 text-[11px]",
              v === "good"
                ? "border-good/40 bg-good/5"
                : v === "bad"
                  ? "border-bad/50 bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            <span className="font-semibold">{SITUATIONS[i]}:</span>{" "}
            <span className="text-muted">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
