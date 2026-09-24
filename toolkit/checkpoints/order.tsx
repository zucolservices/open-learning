"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Reorder } from "motion/react";
import { GripVertical } from "lucide-react";
import { useCheckpoint } from "@/lib/module-sdk";
import { cn } from "@/lib/cn";
import { CheckpointButton, CheckpointFrame } from "./checkpoint-frame";

export interface OrderItem {
  id: string;
  label: ReactNode;
}

/** Drag items into the right sequence (steps of a process, layers of a stack…). */
export function OrderCheckpoint({
  id,
  prompt,
  items,
  explanation,
}: {
  id: string;
  prompt: ReactNode;
  /** In the correct order; they are shown shuffled. */
  items: OrderItem[];
  explanation: ReactNode;
}) {
  const cp = useCheckpoint(id);
  const shuffled = useMemo(() => rotateShuffle(items.map((i) => i.id)), [items]);
  const [order, setOrder] = useState(shuffled);
  const [revealed, setRevealed] = useState(cp.answered);
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));

  return (
    <CheckpointFrame
      prompt={prompt}
      result={revealed ? (cp.correct ? "correct" : "incorrect") : undefined}
      explanation={
        <>
          {explanation}
          {!cp.correct && (
            <ol className="mt-3 grid gap-1">
              {items.map((item, i) => (
                <li key={item.id} className="flex gap-2">
                  <span className="text-good font-mono text-xs">{i + 1}</span>
                  <span className="text-fg">{item.label}</span>
                </li>
              ))}
            </ol>
          )}
        </>
      }
      actions={
        revealed ? (
          !cp.correct && (
            <CheckpointButton variant="ghost" onClick={() => setRevealed(false)}>
              Try again
            </CheckpointButton>
          )
        ) : (
          <CheckpointButton
            onClick={() => {
              cp.answer(order.every((itemId, i) => itemId === items[i].id));
              setRevealed(true);
            }}
          >
            Check order
          </CheckpointButton>
        )
      }
    >
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={revealed ? () => {} : setOrder}
        className="grid gap-2"
      >
        {order.map((itemId, i) => (
          <Reorder.Item
            key={itemId}
            value={itemId}
            dragListener={!revealed}
            className={cn(
              "border-line bg-surface-2/40 flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm select-none",
              !revealed && "cursor-grab active:cursor-grabbing",
              revealed &&
                (items[i].id === itemId ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10"),
            )}
          >
            <GripVertical className="text-subtle size-4 shrink-0" />
            <span className="text-subtle font-mono text-xs">{i + 1}</span>
            {byId[itemId].label}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </CheckpointFrame>
  );
}

/** Deterministic shuffle (same on every render and device) that never returns the answer. */
function rotateShuffle(ids: string[]): string[] {
  const out = ids
    .filter((_, i) => i % 2 === 1)
    .concat(ids.filter((_, i) => i % 2 === 0))
    .reverse();
  return out.every((v, i) => v === ids[i]) ? [...ids].reverse() : out;
}
