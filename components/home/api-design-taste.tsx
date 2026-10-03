"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  CHANGES,
  PAGE1,
  page2,
  skipped,
  type Change,
  type Mode,
} from "@/modules/api-design/pagination/model";

/** A taste of module 7: page through a changing list with offsets and with cursors. */
export function ApiDesignTaste() {
  const [mode, setMode] = useState<Mode>("offset");
  const [change, setChange] = useState<Change>("insert");
  const p2 = page2(mode, change);
  const dups = p2.filter((n) => PAGE1.includes(n));
  const gaps = skipped(mode, change);
  const chip = (on: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs",
      on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
    );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {(["offset", "cursor"] as Mode[]).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={chip(mode === m)}>
            {m === "offset" ? "Offset" : "Cursor"}
          </button>
        ))}
        <span className="text-line">|</span>
        {(["insert", "delete"] as Change[]).map((c) => (
          <button key={c} type="button" onClick={() => setChange(c)} className={chip(change === c)}>
            {CHANGES[c].label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          ["page 1", PAGE1],
          ["page 2", p2],
        ].map(([l, row]) => (
          <div key={l as string} className="flex flex-wrap items-center gap-1">
            <span className="text-muted w-12 font-mono text-[10px]">{l as string}</span>
            {(row as number[]).map((n) => (
              <span
                key={n}
                className={cn(
                  "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                  l === "page 2" && dups.includes(n)
                    ? "border-bad/60 bg-bad/15"
                    : "border-line bg-surface",
                )}
              >
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="text-muted font-mono text-xs">
        {dups.length
          ? `shown twice: ${dups.join(", ")}`
          : gaps.length
            ? `never shown: ${gaps.join(", ")}`
            : "exactly the next five"}
      </p>
    </div>
  );
}
