"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { COMMENTS, LABELS, type Label } from "@/modules/code-review/severity/model";

/** A taste of module 10: label review comments so the author knows what must change. */
export function CodeReviewTaste() {
  const [labels, setLabels] = useState<Record<string, Label>>({});
  const shown = COMMENTS.slice(0, 4);
  const blocking = shown.filter((c) => LABELS.find((l) => l.id === labels[c.id])?.blocking).length;
  const done = shown.every((c) => labels[c.id]);
  return (
    <div className="flex flex-col gap-2">
      {shown.map((c) => {
        const l = labels[c.id];
        return (
          <div key={c.id} className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs">
            <p>{c.text}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {LABELS.filter((x) => x.id !== "praise").map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={l === x.id}
                  onClick={() => setLabels({ ...labels, [c.id]: x.id })}
                  className={cn(
                    "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                    l === x.id
                      ? x.id === c.answer
                        ? "border-good bg-good/20"
                        : "border-bad bg-bad/15"
                      : "border-line text-muted",
                  )}
                >
                  {x.id}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-subtle text-[11px]">
        {done
          ? `The author sees ${blocking} to fix before merging and ${shown.length - blocking} they can choose about.`
          : "Label each comment so the author knows what must change."}
      </p>
    </div>
  );
}
