"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  ASSUMPTIONS,
  BATCHES_PER_HOUR,
  cowCosts,
  FILE_MB,
  filesTouched,
  fmtMB,
  morCosts,
  ROW_BYTES,
  sawtooth,
  type Costs,
  type Workload,
} from "./model";
import type { UpdatesState } from "./state";

const fmtCount = (n: number) =>
  n >= 1_000_000
    ? `${+(n / 1_000_000).toFixed(1)}M`
    : n >= 1000
      ? `${+(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`
      : String(Math.round(n));

function workload(s: UpdatesState): Workload {
  return {
    updatesPerHour: Math.round(Math.pow(10, s.updatesExp)),
    readsPerHour: Math.round(Math.pow(10, s.readsExp)),
    spread: s.spread,
    compactEvery: s.compactEvery,
  };
}

/* 4 ─ The trade-off ⭐ ------------------------------------------------------------ */

export function TradeOff() {
  const [s, set] = useSceneState<UpdatesState>();
  const w = workload(s);
  const cow = cowCosts(w);
  const mor = morCosts(w);
  const max = Math.max(cow.total, mor.total, 1);
  const perBatchRows = w.updatesPerHour / BATCHES_PER_HOUR;
  const touched = filesTouched(perBatchRows, w.spread);
  const amplification = cow.perBatchWrite / Math.max((perBatchRows * ROW_BYTES) / 1_000_000, 1e-9);
  const cheaper = cow.total <= mor.total ? "cow" : "mor";

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Watch the costs trade places"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Slider
              label="Rows updated per hour"
              value={s.updatesExp}
              min={1}
              max={6}
              step={0.5}
              display={fmtCount(w.updatesPerHour)}
              onChange={(v) => set({ updatesExp: v })}
            />
            <Slider
              label="Full-table reads per hour"
              value={s.readsExp}
              min={0}
              max={3}
              step={0.5}
              display={fmtCount(w.readsPerHour)}
              onChange={(v) => set({ readsExp: v })}
            />
            <Slider
              label="Merge-on-Read: compact every"
              value={s.compactEvery}
              min={1}
              max={24}
              step={1}
              display={`${s.compactEvery} h`}
              onChange={(v) => set({ compactEvery: v })}
            />
            <div>
              <p className="text-muted mb-1.5 text-xs">Where updated rows sit</p>
              <Segmented
                size="sm"
                value={s.spread}
                options={[
                  ["random", "Spread across the table"],
                  ["clustered", "Clustered together"],
                ]}
                onChange={(v) => set({ spread: v as UpdatesState["spread"] })}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CostCard name="Copy-on-Write" costs={cow} max={max} best={cheaper === "cow"} />
            <CostCard name="Merge-on-Read" costs={mor} max={max} best={cheaper === "mor"} />
          </div>

          <div className="border-line bg-surface grid gap-2 rounded-xl border px-4 py-3 text-sm sm:grid-cols-2">
            <p className="text-muted">
              <span className="text-fg font-medium">Copy-on-Write:</span> each batch changes ~
              {fmtCount(Math.max(1, Math.round(perBatchRows)))} rows in ~
              {Math.max(1, Math.round(touched))} files, so it rewrites {fmtMB(cow.perBatchWrite)}:{" "}
              <strong className="text-fg">
                {amplification >= 10 ? `~${fmtCount(Math.round(amplification))}×` : "a few ×"}
              </strong>{" "}
              the size of the changed rows.
            </p>
            <p className="text-muted">
              <span className="text-fg font-medium">Merge-on-Read:</span> on average each query
              opens {Math.round(mor.pendingFiles)} extra small files and applies{" "}
              {fmtCount(Math.round(mor.pendingRows))} pending changes: about{" "}
              {fmtMB(mor.perQueryExtra)} of extra work per query.
            </p>
          </div>

          <details className="text-subtle text-[11px]">
            <summary className="cursor-pointer">
              How this model works (illustrative, not a benchmark)
            </summary>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
              {ASSUMPTIONS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </details>
        </div>
      }
    >
      <p>
        Here&apos;s the heart of the trade-off. <Term id="copy-on-write">Copy-on-Write</Term> pays
        at write time: to change a few rows, it rewrites whole files. That&apos;s{" "}
        <Term id="write-amplification">write amplification</Term>.
      </p>
      <p>
        <Term id="merge-on-read">Merge-on-Read</Term> writes almost nothing, but every read pays
        until <Term id="compaction">compaction</Term> tidies up. That&apos;s{" "}
        <Term id="read-amplification">read amplification</Term>.
      </p>
      <p>
        Move the sliders. Try many updates with few reads, then few updates with many reads, then
        cluster the updates together.
      </p>
    </StepLayout>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange(v: number): void;
}) {
  return (
    <label className="block">
      <span className="text-muted flex justify-between text-xs">
        {label}
        <span className="text-fg font-mono">{display}</span>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-[var(--accent)]"
      />
    </label>
  );
}

function CostCard({
  name,
  costs,
  max,
  best,
}: {
  name: string;
  costs: Costs;
  max: number;
  best: boolean;
}) {
  const parts: [string, number, string][] = [
    ["Writing changes", costs.write, "bg-viz-meta"],
    ["Compaction", costs.compaction, "bg-viz-add"],
    ["Extra read work", costs.readExtra, "bg-viz-compute"],
  ];
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-colors",
        best ? "border-good/50 bg-good/5" : "border-line bg-surface",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">{name}</p>
        <p className="font-mono text-sm tabular-nums">{fmtMB(costs.total)}/h</p>
      </div>
      <div className="bg-surface-2 mt-3 flex h-3 overflow-hidden rounded-full">
        {parts.map(([label, v, cls]) => (
          <motion.div
            key={label}
            className={cls}
            initial={false}
            animate={{ width: `${(v / max) * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        ))}
      </div>
      <ul className="mt-3 grid gap-1 text-xs">
        {parts.map(([label, v, cls]) => (
          <li key={label} className="text-muted flex items-center gap-2">
            <span className={cn("size-2 rounded-full", cls)} />
            {label}
            <span className="text-fg ml-auto font-mono tabular-nums">{fmtMB(v)}/h</span>
          </li>
        ))}
      </ul>
      {best && (
        <p className="text-good mt-2 text-xs font-medium">Less total work for this workload</p>
      )}
    </div>
  );
}

/* 5 ─ Checkpoint: write amplification ------------------------------------------------ */

export function AmplificationCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How much does one small UPDATE write?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="cow-write-mb"
            prompt={`A Copy-on-Write table has data files of ${FILE_MB} MB. An UPDATE changes one row in each of 10 different files. Roughly how many MB does it write?`}
            min={0}
            max={2000}
            step={10}
            unit=" MB"
            answer={10 * FILE_MB}
            tolerance={160}
            explanation={`About ${10 * FILE_MB} MB: each of the 10 files is rewritten in full, around 1.3 GB to change 10 rows of a few hundred bytes. Merge-on-Read would write 10 tiny deletion vectors plus a small file with the 10 new rows.`}
          />
        </div>
      }
    >
      <p>Remember: Copy-on-Write never edits a file; it replaces it.</p>
    </StepLayout>
  );
}

/* 6 ─ When to compact ------------------------------------------------------------------ */

export function WhenToCompact() {
  const [s, set] = useSceneState<UpdatesState>();
  const w: Workload = { ...workload(s), compactEvery: s.sawCompact };
  const points = sawtooth(w);
  const peak = Math.max(...points.map((p) => p.extra), 1);
  const avg = points.reduce((n, p) => n + p.extra, 0) / points.length;
  const compactionsPerDay = Math.floor(24 / s.sawCompact);
  const rewritePerCompaction = filesTouched(w.updatesPerHour * s.sawCompact, w.spread) * FILE_MB;
  const W = 600;
  const H = 180;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(p.t / 24) * W},${H - (p.extra / peak) * (H - 10)}`)
    .join(" ");

  return (
    <StepLayout
      eyebrow="Compaction"
      title="Read debt builds up, compaction pays it off"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Slider
            label="Compact every"
            value={s.sawCompact}
            min={1}
            max={24}
            step={1}
            display={`${s.sawCompact} h`}
            onChange={(v) => set({ sawCompact: v })}
          />
          <div className="border-line bg-bg/40 rounded-2xl border p-3">
            <p className="text-muted mb-2 text-[11px]">
              Extra work per query over one day ({fmtCount(w.updatesPerHour)} rows updated per hour)
            </p>
            <svg
              viewBox={`0 0 ${W} ${H + 20}`}
              className="w-full"
              role="img"
              aria-label="Read debt over a day"
            >
              <line x1={0} y1={H} x2={W} y2={H} className="stroke-line" />
              <motion.path
                d={path}
                fill="none"
                className="stroke-viz-compute"
                strokeWidth={2}
                initial={false}
                animate={{ d: path }}
                transition={{ duration: 0.4 }}
              />
              {Array.from({ length: compactionsPerDay }, (_, i) => {
                const x = (((i + 1) * s.sawCompact) / 24) * W;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={0}
                      x2={x}
                      y2={H}
                      className="stroke-viz-add"
                      strokeDasharray="3 3"
                    />
                  </g>
                );
              })}
              {[0, 6, 12, 18, 24].map((h) => (
                <text
                  key={h}
                  x={(h / 24) * W}
                  y={H + 15}
                  className="fill-subtle text-[10px]"
                  textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"}
                >
                  {String(h).padStart(2, "0")}:00
                </text>
              ))}
            </svg>
            <p className="text-subtle mt-1 text-[10px]">
              <span className="text-viz-add">┆</span> compaction runs
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Average extra per query" value={fmtMB(avg)} tone="text-viz-compute" />
            <Stat
              label="Peak, just before compaction"
              value={fmtMB(peak)}
              tone="text-viz-compute"
            />
            <Stat
              label="Compaction rewrites per day"
              value={fmtMB(rewritePerCompaction * compactionsPerDay)}
              tone="text-viz-add"
            />
          </div>
        </div>
      }
    >
      <p>
        With Merge-on-Read, every batch of changes adds a little <strong>read debt</strong>: another
        small file to open, more changes to apply. Compaction rewrites the affected files cleanly
        and resets the debt to zero.
      </p>
      <p>
        Compact too rarely and queries slow down before each compaction. Compact too often and you
        rewrite the same files again and again: you&apos;re back to paying Copy-on-Write&apos;s
        price. Find the interval that balances the two for this workload.
      </p>
      <p className="text-subtle text-xs">
        The update rate comes from the simulator on the previous step. Many platforms can schedule
        compaction automatically.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="border-line bg-surface rounded-xl border px-3 py-2">
      <p className="text-muted text-[10px] leading-tight">{label}</p>
      <p className={cn("font-mono text-lg font-semibold tabular-nums", tone)}>{value}</p>
    </div>
  );
}
