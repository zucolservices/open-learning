"use client";

import { useState, type ReactNode } from "react";
import { useCheckpoint } from "@/lib/module-sdk";
import { cn } from "@/lib/cn";
import { CheckpointButton, CheckpointFrame } from "./checkpoint-frame";

export interface ChoiceOption {
  id: string;
  label: ReactNode;
  correct?: boolean;
  /** Why this option is right or wrong; shown after checking. */
  feedback?: ReactNode;
}

/** Pick one answer, check it, and see the reasoning. */
export function ChoiceCheckpoint({
  id,
  prompt,
  options,
  explanation,
}: {
  id: string;
  prompt: ReactNode;
  options: ChoiceOption[];
  /** Shown with every result, after any option-specific feedback. */
  explanation?: ReactNode;
}) {
  const cp = useCheckpoint(id);
  const [selected, setSelected] = useState<string>();
  const [revealed, setRevealed] = useState(cp.answered);
  const correctOption = options.find((o) => o.correct);
  const picked = options.find((o) => o.id === selected);
  const result = revealed ? (cp.correct ? "correct" : "incorrect") : undefined;

  function check() {
    if (!picked) return;
    cp.answer(Boolean(picked.correct));
    setRevealed(true);
  }

  return (
    <CheckpointFrame
      prompt={prompt}
      result={result}
      explanation={
        <>
          {picked?.feedback && <p>{picked.feedback}</p>}
          {explanation && <p className={picked?.feedback ? "mt-2" : ""}>{explanation}</p>}
        </>
      }
      actions={
        revealed ? (
          !cp.correct && (
            <CheckpointButton
              variant="ghost"
              onClick={() => {
                setRevealed(false);
                setSelected(undefined);
              }}
            >
              Try again
            </CheckpointButton>
          )
        ) : (
          <CheckpointButton onClick={check} disabled={!picked}>
            Check answer
          </CheckpointButton>
        )
      }
    >
      <div role="radiogroup" className="grid gap-2">
        {options.map((o) => {
          const isSelected = o.id === selected;
          const showCorrect = revealed && cp.correct && o.id === correctOption?.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={revealed}
              onClick={() => setSelected(o.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition",
                "border-line bg-surface-2/40 hover:border-line-strong",
                isSelected && "border-accent bg-accent-soft",
                revealed && isSelected && !o.correct && "border-bad/50 bg-bad/10",
                showCorrect && "border-good/50 bg-good/10",
                revealed && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "border-line-strong grid size-4 shrink-0 place-items-center rounded-full border",
                  isSelected && "border-accent",
                )}
              >
                {isSelected && <span className="bg-accent size-2 rounded-full" />}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </CheckpointFrame>
  );
}
