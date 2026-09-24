"use client";

import { LayoutGroup, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ORDERS } from "./data";
import type { FormatsState } from "./state";

/* 1 ─ Flattening a table ------------------------------------------------- */

const COLS = ["order_id", "city", "amount", "status"] as const;
const ROWS = ORDERS.slice(0, 4);

/** One colour per column, so you can follow where each column's values go. */
export const colTone: Record<string, string> = {
  order_id: "bg-viz-idle/40 text-fg",
  city: "bg-viz-meta/35 text-fg",
  amount: "bg-viz-data/40 text-fg",
  status: "bg-viz-compute/35 text-fg",
};

export function Flatten() {
  const [s, set] = useSceneState<FormatsState>();
  const cells =
    s.flatten === "row"
      ? ROWS.flatMap((r, ri) =>
          COLS.map((c) => ({ key: `${ri}-${c}`, col: c, value: String(r[c]) })),
        )
      : COLS.flatMap((c) =>
          ROWS.map((r, ri) => ({ key: `${ri}-${c}`, col: c, value: String(r[c]) })),
        );

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A file is one long line of bytes"
      stage={
        <LayoutGroup>
          <div className="flex flex-1 flex-col gap-6">
            <Segmented
              size="sm"
              value={s.flatten}
              options={[
                ["row", "Row by row"],
                ["column", "Column by column"],
              ]}
              onChange={(flatten) => set({ flatten })}
            />

            <div>
              <p className="text-muted mb-2 text-xs">The table, as you picture it</p>
              <div className="border-line bg-surface inline-grid grid-cols-4 gap-1 rounded-xl border p-2 font-mono text-xs">
                {COLS.map((c) => (
                  <span key={c} className="text-subtle px-2 py-1">
                    {c}
                  </span>
                ))}
                {ROWS.map((r, ri) =>
                  COLS.map((c) => (
                    <span key={`${ri}-${c}`} className={cn("rounded px-2 py-1", colTone[c])}>
                      {String(r[c])}
                    </span>
                  )),
                )}
              </div>
            </div>

            <div>
              <p className="text-muted mb-2 text-xs">
                The file, as the disk stores it (start → end)
              </p>
              <div className="border-line bg-bg/40 flex flex-wrap gap-1 rounded-xl border p-2 font-mono text-[11px]">
                {cells.map((cell) => (
                  <motion.span
                    key={cell.key}
                    layout
                    transition={{ type: "spring", stiffness: 220, damping: 28 }}
                    className={cn("rounded px-1.5 py-1", colTone[cell.col])}
                  >
                    {cell.value}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.p
              key={s.flatten}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {s.flatten === "row" ? (
                <>
                  <strong>Row by row:</strong> each order&apos;s values sit together. Great for
                  reading or writing one whole order. But to total the amounts, you must read past
                  every city and status too.
                </>
              ) : (
                <>
                  <strong>Column by column:</strong> all amounts sit together, then all statuses. To
                  total the amounts, read one stretch and skip the rest. Similar values side by side
                  also compress much better.
                </>
              )}
            </motion.p>
          </div>
        </LayoutGroup>
      }
    >
      <p>
        On screen a table has rows <em>and</em> columns. A disk only has one dimension: bytes, one
        after another.
      </p>
      <p>
        So every file format must decide how to flatten the table. That&apos;s called{" "}
        <Term id="serialization">serialization</Term>. Toggle between the two basic choices and
        follow the colours.
      </p>
      <p>
        That single decision, <strong>rows or columns</strong>, explains most of what makes file
        formats fast or slow for a given job.
      </p>
    </StepLayout>
  );
}
