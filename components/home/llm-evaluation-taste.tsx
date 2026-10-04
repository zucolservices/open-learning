"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { N, judge, type Fixes } from "@/modules/llm-evaluation/llm-judge/model";

const FIXES: [keyof Fixes, string][] = [
  ["swap", "Judge both orders"],
  ["rubric", "Ignore length"],
  ["otherFamily", "Different model family"],
  ["reference", "Give a reference"],
  ["reason", "Reason first"],
];

/** A taste of module 6: switch on fixes and watch a biased LLM judge start agreeing with experts. */
export function LlmEvaluationTaste() {
  const [f, setF] = useState<Fixes>({
    swap: false,
    rubric: false,
    otherFamily: false,
    reference: false,
    reason: false,
  });
  const v = judge(f);
  const agree = v.filter((x) => x === "agree").length;
  const dis = v.filter((x) => x === "disagree").length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {FIXES.map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setF({ ...f, [k]: !f[k] })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              f[k] ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-10 gap-1">
        {v.map((x, i) => (
          <span
            key={i}
            className={cn(
              "h-4 rounded-sm",
              x === "agree" ? "bg-good/60" : x === "disagree" ? "bg-bad" : "bg-muted/40",
            )}
          />
        ))}
      </div>
      <p className="text-muted text-xs">
        <span className="text-good">{agree}</span> of {N} verdicts agree with experts ·{" "}
        <span className="text-bad">{dis}</span> disagree · {N - agree - dis} ties
      </p>
    </div>
  );
}
