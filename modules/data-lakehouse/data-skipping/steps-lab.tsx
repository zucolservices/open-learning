"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LAYOUTS, matches, N, order, QUERIES, scan, type LayoutId } from "./layout";
import type { SkippingState } from "./state";

/* 2 ─ The layout lab ⭐ ---------------------------------------------------------------------- */

const CELL = 10;
const SIZE = N * CELL;
const FILE_SIZES = [16, 40, 64, 128];

export function LayoutLab() {
  const [s, set] = useSceneState<SkippingState>();
  const q = QUERIES.find((x) => x.id === s.labQuery) ?? QUERIES[0];
  const result = useMemo(
    () => scan(s.labLayout, s.rowsPerFile, q),
    [s.labLayout, s.rowsPerFile, q],
  );
  const path = useMemo(
    () =>
      order(s.labLayout)
        .map(
          (c, i) =>
            `${i === 0 ? "M" : "L"}${c.x * CELL + CELL / 2},${(N - 1 - c.y) * CELL + CELL / 2}`,
        )
        .join(" "),
    [s.labLayout],
  );
  const readSet = new Set(result.read.map((f) => f.index));
  const all = LAYOUTS.map((l) => ({ ...l, r: scan(l.id, s.rowsPerFile, q) }));

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Lay out the table, then query it"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => set({ labLayout: l.id })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  l.id === s.labLayout
                    ? "bg-accent text-accent-fg"
                    : "bg-surface-2 text-muted hover:text-fg",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={q.id}
              options={QUERIES.map((x) => [x.id, x.label] as [string, string])}
              onChange={(v) => set({ labQuery: v })}
            />
            <label className="text-muted flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.showPath}
                onChange={(e) => set({ showPath: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Show write order
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <div>
              <svg
                viewBox={`-14 0 ${SIZE + 14} ${SIZE + 14}`}
                className="w-full"
                role="img"
                aria-label="Table layout"
              >
                {result.files.map((f) =>
                  f.cells.map((c) => {
                    const hit = matches(c, q);
                    const read = readSet.has(f.index);
                    return (
                      <rect
                        key={`${c.x}-${c.y}`}
                        x={c.x * CELL}
                        y={(N - 1 - c.y) * CELL}
                        width={CELL - 1}
                        height={CELL - 1}
                        rx={1.5}
                        className={cn(
                          "transition-colors duration-300",
                          read
                            ? hit
                              ? "fill-viz-compute"
                              : "fill-viz-compute/35"
                            : f.index % 2
                              ? "fill-viz-data/25"
                              : "fill-viz-data/45",
                        )}
                      />
                    );
                  }),
                )}
                {result.read.map((f) => (
                  <rect
                    key={`box-${f.index}`}
                    x={f.minX * CELL - 0.5}
                    y={(N - 1 - f.maxY) * CELL - 0.5}
                    width={(f.maxX - f.minX + 1) * CELL}
                    height={(f.maxY - f.minY + 1) * CELL}
                    fill="none"
                    strokeWidth={0.8}
                    className="stroke-viz-compute"
                    strokeDasharray="2 2"
                  />
                ))}
                <rect
                  x={(q.x ? q.x[0] : 0) * CELL - 1}
                  y={(N - 1 - (q.y ? q.y[1] : N - 1)) * CELL - 1}
                  width={((q.x ? q.x[1] - q.x[0] : N - 1) + 1) * CELL + 1}
                  height={((q.y ? q.y[1] - q.y[0] : N - 1) + 1) * CELL + 1}
                  fill="none"
                  strokeWidth={2}
                  className="stroke-accent"
                />
                {s.showPath && (
                  <path d={path} fill="none" strokeWidth={0.8} className="stroke-fg/60" />
                )}
                <text
                  x={SIZE / 2}
                  y={SIZE + 11}
                  textAnchor="middle"
                  className="fill-subtle text-[8px]"
                >
                  customer →
                </text>
                <text
                  x={-4}
                  y={SIZE / 2}
                  textAnchor="middle"
                  transform={`rotate(-90 -4 ${SIZE / 2})`}
                  className="fill-subtle text-[8px]"
                >
                  order date →
                </text>
              </svg>
              <p className="text-subtle mt-1 text-[10px]">
                Each square is a batch of rows. Shades show files; highlighted files must be read
                (dashed: their min/max boxes).
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Code className="text-[10px] whitespace-pre-wrap">{q.sql}</Code>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Files read" value={`${result.filesRead} / ${result.total}`} accent />
                <Stat
                  label="Rows read per matching row"
                  value={`${(result.rowsRead / Math.max(1, result.rowsMatching)).toFixed(1)}×`}
                />
              </div>
              <div>
                <p className="text-muted mb-1 text-xs">Rows per file</p>
                <Segmented
                  size="sm"
                  value={String(s.rowsPerFile)}
                  options={FILE_SIZES.map((n) => [String(n), String(n)] as [string, string])}
                  onChange={(v) => set({ rowsPerFile: Number(v) })}
                />
              </div>
              <div className="grid gap-1">
                <p className="text-muted text-[11px]">Files read by each layout, this query</p>
                {all.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => set({ labLayout: l.id as LayoutId })}
                    className="group grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-left text-[11px]"
                  >
                    <span
                      className={cn(
                        l.id === s.labLayout
                          ? "text-fg font-semibold"
                          : "text-muted group-hover:text-fg",
                      )}
                    >
                      {l.label}
                    </span>
                    <span className="bg-surface-2 h-2 overflow-hidden rounded-full">
                      <motion.span
                        className={cn(
                          "block h-full rounded-full",
                          l.id === s.labLayout ? "bg-viz-compute" : "bg-line-strong",
                        )}
                        initial={false}
                        animate={{ width: `${(l.r.filesRead / l.r.total) * 100}%` }}
                      />
                    </span>
                    <span className="text-muted text-right font-mono tabular-nums">
                      {l.r.filesRead}/{l.r.total}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-muted text-xs">
                {LAYOUTS.find((l) => l.id === s.labLayout)!.note}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        This table has two columns people filter on: customer and order date. The grid shows every
        combination. How rows are <em>ordered</em> before being cut into files decides how well{" "}
        <Term id="data-skipping">data skipping</Term> works.
      </p>
      <p>
        A single sort is perfect for one column and useless for the other. Try both queries with
        each sort. Then try <Term id="z-order">Z-order</Term> and Hilbert, which keep nearby values
        of <em>both</em> columns in the same files.
      </p>
      <p>
        Tick <strong>Show write order</strong> to see the path each layout takes through the grid.
        Z-order&apos;s path jumps; Hilbert&apos;s never does. At 40 rows per file, that&apos;s why
        Hilbert reads fewer files.
      </p>
      <p className="text-subtle text-xs">
        These counts are computed exactly from each file&apos;s min/max, the same way table formats
        skip files.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border-line bg-surface rounded-xl border px-3 py-2">
      <p className="text-muted text-[10px] leading-tight">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("font-mono text-lg font-semibold tabular-nums", accent && "text-viz-compute")}
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 3 ─ Checkpoint ---------------------------------------------------------------------------------- */

export function LayoutCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the layout"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="pick-layout"
            prompt="Half the dashboards filter orders by customer; the other half by order date. Rarely both. Which layout serves both groups best?"
            options={[
              {
                id: "sort-customer",
                label: "Sort by customer",
                feedback:
                  "Great for the customer dashboards; date filters would read almost every file.",
              },
              {
                id: "sort-date",
                label: "Sort by date",
                feedback:
                  "Great for the date dashboards; customer filters would read almost every file.",
              },
              {
                id: "multi",
                label: "A multi-column layout: Z-order, Hilbert or liquid clustering on both",
                correct: true,
                feedback:
                  "Right. Neither query gets the perfect result of its own sort, but both skip most files.",
              },
              {
                id: "arrival",
                label: "Leave rows in arrival order and rely on statistics",
                feedback:
                  "Statistics can only skip files whose min/max ranges are narrow. In arrival order, every file spans everything.",
              },
            ]}
            explanation="Multi-dimensional layouts trade a little of each single-column best case for good results across several columns. Their benefit fades as you add more columns, so pick the two to four that queries filter on most."
          />
        </div>
      }
    >
      <p>Use what you saw in the lab.</p>
    </StepLayout>
  );
}
