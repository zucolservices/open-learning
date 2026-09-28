"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useCheckpoint } from "@/lib/module-sdk";
import { cn } from "@/lib/cn";
import { CheckpointButton, CheckpointFrame } from "./checkpoint-frame";

export interface SortItem {
  id: string;
  label: ReactNode;
  category: string;
  /** Why it belongs where it does; shown after checking. */
  why: ReactNode;
}

/** Put each item in the right bucket; every item then explains itself. */
export function SortCheckpoint({
  id,
  prompt,
  categories,
  items,
  explanation,
}: {
  id: string;
  prompt: ReactNode;
  categories: { id: string; label: string }[];
  items: SortItem[];
  explanation?: ReactNode;
}) {
  const cp = useCheckpoint(id);
  const [picks, setPicks] = useState<Record<string, string>>(() =>
    cp.answered ? Object.fromEntries(items.map((i) => [i.id, i.category])) : {},
  );
  const [revealed, setRevealed] = useState(cp.answered);
  const complete = items.every((i) => picks[i.id]);
  const allRight = items.every((i) => picks[i.id] === i.category);

  return (
    <CheckpointFrame
      prompt={prompt}
      result={revealed ? (allRight ? "correct" : "incorrect") : undefined}
      explanation={explanation}
      actions={
        revealed ? (
          !allRight && (
            <CheckpointButton
              variant="ghost"
              onClick={() => {
                setPicks((p) =>
                  Object.fromEntries(
                    Object.entries(p).filter(
                      ([k, v]) => items.find((i) => i.id === k)?.category === v,
                    ),
                  ),
                );
                setRevealed(false);
              }}
            >
              Fix the wrong ones
            </CheckpointButton>
          )
        ) : (
          <CheckpointButton
            disabled={!complete}
            onClick={() => {
              cp.answer(allRight);
              setRevealed(true);
            }}
          >
            {complete ? "Check" : `Sort all ${items.length}`}
          </CheckpointButton>
        )
      }
    >
      <ul className="grid gap-2">
        {items.map((item) => {
          const pick = picks[item.id];
          const right = pick === item.category;
          return (
            <li
              key={item.id}
              className={cn(
                "rounded-2xl border px-4 py-3 transition-colors",
                !revealed && "border-line bg-surface-2/40",
                revealed && (right ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10"),
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="min-w-0 flex-1 basis-48 text-sm">{item.label}</span>
                <div className="flex gap-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      disabled={revealed}
                      aria-pressed={pick === c.id}
                      onClick={() => setPicks((p) => ({ ...p, [item.id]: c.id }))}
                      className={cn(
                        "h-8 rounded-full border px-3 text-xs transition-colors",
                        pick === c.id
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line-strong text-muted hover:text-fg",
                        revealed && "cursor-default",
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {revealed &&
                  (right ? (
                    <Check className="text-good size-4" />
                  ) : (
                    <X className="text-bad size-4" />
                  ))}
              </div>
              {revealed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-muted mt-1.5 text-xs"
                >
                  {item.why}
                </motion.p>
              )}
            </li>
          );
        })}
      </ul>
    </CheckpointFrame>
  );
}
