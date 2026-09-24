"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ParquetState } from "./state";

/* 3 ─ Skip what you don't need --------------------------------------------- */

const COLS = ["order_id", "customer", "city", "amount", "status"];
const MAX_AMOUNT = 520;

/** min/max of amount per row group, for unsorted and sorted-by-amount files. */
const STATS = {
  unsorted: [
    [40, 498],
    [55, 512],
    [48, 470],
    [62, 505],
    [45, 490],
    [58, 515],
    [50, 480],
    [41, 509],
  ],
  sorted: Array.from({ length: 8 }, (_, i) => [i * 65, i * 65 + 64]),
} as const;

export function Skipping() {
  const [s, set] = useSceneState<ParquetState>();
  const stats = s.sorted ? STATS.sorted : STATS.unsorted;
  const keep = stats.map(([, max]) => max > s.threshold);
  const kept = keep.filter(Boolean).length;
  const cols = new Set([...s.columns, "amount"]); // the filter column is always read
  const readCells = kept * cols.size;
  const share = readCells / (stats.length * COLS.length);

  function toggleCol(c: string) {
    if (c === "amount") return;
    set({ columns: s.columns.includes(c) ? s.columns.filter((x) => x !== c) : [...s.columns, c] });
  }

  return (
    <StepLayout
      eyebrow="Try it"
      title="Skip row groups, skip columns"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.sorted ? "sorted" : "unsorted"}
              options={[
                ["unsorted", "Rows in arrival order"],
                ["sorted", "Sorted by amount"],
              ]}
              onChange={(v) => set({ sorted: v === "sorted" })}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
            <span className="font-mono text-xs">
              WHERE amount &gt;{" "}
              <strong className="text-viz-compute tabular-nums">{s.threshold}</strong>
            </span>
            <input
              type="range"
              min={0}
              max={MAX_AMOUNT}
              step={10}
              value={s.threshold}
              onChange={(e) => set({ threshold: Number(e.target.value) })}
              aria-label="Filter threshold"
              className="accent-[var(--viz-compute)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted mr-1 font-mono text-xs">SELECT</span>
            {COLS.map((c) => {
              const on = cols.has(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCol(c)}
                  disabled={c === "amount"}
                  className={cn(
                    "h-7 rounded-full border px-2.5 font-mono text-[11px] transition-colors",
                    on ? "border-accent bg-accent-soft text-fg" : "border-line-strong text-subtle",
                    c === "amount" && "cursor-default",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="border-line bg-bg/40 overflow-x-auto rounded-2xl border p-3">
            <table className="w-full min-w-[36rem] border-separate border-spacing-1 text-[10px]">
              <thead>
                <tr className="text-subtle font-mono">
                  <th className="text-left font-medium">row group</th>
                  <th className="text-left font-medium">footer: amount min–max</th>
                  {COLS.map((c) => (
                    <th key={c} className="text-left font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map(([min, max], i) => (
                  <tr key={i}>
                    <td className="font-mono">RG {i + 1}</td>
                    <td className="w-44">
                      <div className="bg-surface-2 relative h-4 rounded">
                        <motion.div
                          className={cn(
                            "absolute top-0 bottom-0 rounded",
                            keep[i] ? "bg-viz-meta/60" : "bg-viz-idle/40",
                          )}
                          animate={{
                            left: `${(min / MAX_AMOUNT) * 100}%`,
                            width: `${((max - min) / MAX_AMOUNT) * 100}%`,
                          }}
                          transition={{ type: "spring", stiffness: 160, damping: 22 }}
                        />
                        <motion.div
                          className="bg-viz-compute absolute -top-0.5 -bottom-0.5 w-0.5"
                          animate={{ left: `${(s.threshold / MAX_AMOUNT) * 100}%` }}
                        />
                      </div>
                    </td>
                    {COLS.map((c) => {
                      const read = keep[i] && cols.has(c);
                      return (
                        <td key={c}>
                          <motion.div
                            animate={{ opacity: read ? 1 : 0.25, scale: read ? 1 : 0.92 }}
                            className={cn(
                              "h-5 rounded",
                              read ? "bg-viz-compute/70" : "bg-viz-data/25",
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Row groups read"
              value={`${kept} / ${stats.length}`}
              good={kept < stats.length}
            />
            <Stat
              label="Columns read"
              value={`${cols.size} / ${COLS.length}`}
              good={cols.size < COLS.length}
            />
            <Stat
              label="Share of file read"
              value={`${Math.round(share * 100)}%`}
              good={share < 0.3}
            />
          </div>
        </div>
      }
    >
      <p>
        Two kinds of skipping work together. <Term id="predicate-pushdown">Predicate pushdown</Term>{" "}
        skips whole row groups whose min/max can&apos;t match the filter.{" "}
        <Term id="projection-pruning">Projection pruning</Term> skips columns you didn&apos;t ask
        for.
      </p>
      <p>
        Drag the filter and pick columns. Then flip the file to <strong>sorted by amount</strong>{" "}
        and try the same filter again.
      </p>
      <p className="text-subtle text-xs">
        In arrival order, every row group holds a mix of small and large amounts, so every min/max
        range covers almost everything.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-3">
      <p className="text-muted text-[11px]">{label}</p>
      <p
        className={cn("mt-0.5 text-xl font-semibold tabular-nums", good ? "text-good" : "text-fg")}
      >
        {value}
      </p>
    </div>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------ */

export function SortingCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why did sorting change everything?"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="why-sorting"
            prompt="With rows in arrival order, WHERE amount > 400 read every row group. Sorted by amount, it read only two. Why?"
            options={[
              {
                id: "ranges",
                label:
                  "Sorting makes each row group's min–max range narrow, so most ranges can't contain amount > 400",
                correct: true,
                feedback:
                  "Exactly. Statistics only help when similar values sit together. Sorting (or clustering) on the filter column makes that happen.",
              },
              {
                id: "smaller",
                label: "Sorted files are smaller",
                feedback:
                  "Sorting can help compression a bit, but that's not why row groups got skipped.",
              },
              {
                id: "index",
                label: "Sorting adds an index to the file",
                feedback:
                  "No new structure was added. The same min/max statistics simply became useful.",
              },
              {
                id: "faster",
                label: "The engine reads sorted data faster",
                feedback: "Read speed per byte didn't change. Far fewer bytes were read.",
              },
            ]}
            explanation="Naturally ordered data (like timestamps for events that arrive in time order) gets this for free. For other columns, table formats offer sorting, Z-ordering and clustering, all covered later in the track."
          />
        </div>
      }
    />
  );
}
