"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/** Shared by the cloud-platform modules: sliders in, monthly line items out. */

export interface CostInput {
  id: string;
  label: string;
  values: number[];
  format(v: number): string;
}

export interface CostLine {
  label: string;
  usd: number;
  note: string;
}

const COLORS = [
  "bg-viz-data",
  "bg-viz-meta",
  "bg-viz-compute",
  "bg-viz-add",
  "bg-tier-gold",
  "bg-viz-remove",
];

export function fmtUsd(v: number) {
  if (v >= 1000) return `$${Math.round(v).toLocaleString("en-US")}`;
  if (v >= 1) return `$${v.toFixed(0)}`;
  return v > 0 ? `$${v.toFixed(2)}` : "$0";
}

export function CostEstimator({
  inputs,
  idx,
  onChange,
  lines,
  toggles,
  assumptions,
}: {
  inputs: CostInput[];
  idx: Record<string, number>;
  onChange(id: string, i: number): void;
  lines: CostLine[];
  toggles?: ReactNode;
  assumptions: ReactNode;
}) {
  const total = lines.reduce((a, l) => a + l.usd, 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3">
        {inputs.map((inp) => {
          const i = idx[inp.id] ?? 0;
          return (
            <label key={inp.id} className="grid gap-1">
              <span className="flex justify-between text-xs">
                <span className="text-muted">{inp.label}</span>
                <span className="font-mono">{inp.format(inp.values[i])}</span>
              </span>
              <input
                type="range"
                min={0}
                max={inp.values.length - 1}
                step={1}
                value={i}
                aria-label={inp.label}
                onChange={(e) => onChange(inp.id, Number(e.target.value))}
                className="accent-[var(--accent)]"
              />
            </label>
          );
        })}
        {toggles}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-muted text-xs">Estimated monthly bill</p>
          <motion.p
            key={Math.round(total)}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="font-mono text-2xl"
          >
            {fmtUsd(total)}
          </motion.p>
        </div>
        <div className="bg-surface-2 mt-2 flex h-4 overflow-hidden rounded-full">
          {lines.map((l, i) => (
            <motion.div
              key={l.label}
              initial={false}
              animate={{ width: `${total > 0 ? (l.usd / total) * 100 : 0}%` }}
              className={cn("h-full", COLORS[i % COLORS.length])}
              title={l.label}
            />
          ))}
        </div>
        <div className="mt-3 grid gap-1">
          {lines.map((l, i) => (
            <div
              key={l.label}
              className="grid grid-cols-[0.75rem_minmax(0,1fr)_auto] items-start gap-2 text-xs"
            >
              <span className={cn("mt-1 size-2.5 rounded-sm", COLORS[i % COLORS.length])} />
              <span>
                {l.label}
                <span className="text-subtle block text-[10px]">{l.note}</span>
              </span>
              <span className="font-mono">{fmtUsd(l.usd)}</span>
            </div>
          ))}
        </div>
      </div>

      <details className="text-muted text-xs">
        <summary className="cursor-pointer">How this estimate works</summary>
        <div className="mt-2 grid gap-1">{assumptions}</div>
      </details>
    </div>
  );
}
