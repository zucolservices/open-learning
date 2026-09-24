"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ASSUMPTIONS, fmtGB, fmtN, fmtS, simulate, type Policy } from "./life";
import type { MaintenanceState } from "./state";

/* 1 ─ The phone photo library ------------------------------------------------------------------ */

export function PhotoLibrary() {
  const [s, set] = useSceneState<MaintenanceState>();
  const all = s.phoneView === "all";
  const parts: [string, number, string, string][] = [
    ["Photos you can see", 40, "bg-viz-data", "The live table"],
    [
      "“Recently deleted” (kept 30 days)",
      22,
      "bg-viz-remove/70",
      "Old versions kept for time travel",
    ],
    ["Burst shots and near-duplicates", 18, "bg-viz-compute/70", "Small files"],
    ["Half-downloaded leftovers", 8, "bg-bad", "Orphan files"],
  ];
  const shown = all ? parts : parts.slice(0, 1);
  const used = shown.reduce((n, p) => n + p[1], 0);
  return (
    <StepLayout
      eyebrow="The big idea first"
      title="Why is my phone full?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.phoneView}
            options={[
              ["visible", "What you think is stored"],
              ["all", "What's really stored"],
            ]}
            onChange={(v) => set({ phoneView: v as MaintenanceState["phoneView"] })}
          />
          <div>
            <p className="text-muted mb-1.5 text-xs">
              Photos storage: <strong className="text-fg font-mono">{used} GB</strong> of 128 GB
            </p>
            <div className="bg-surface-2 flex h-8 overflow-hidden rounded-lg">
              {parts.map(([label, gb, cls]) => (
                <motion.div
                  key={label}
                  className={cls}
                  initial={false}
                  animate={{
                    width: shown.some((p) => p[0] === label) ? `${(gb / 128) * 100}%` : "0%",
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                />
              ))}
            </div>
          </div>
          <ul className="grid gap-2">
            {parts.map(([label, gb, cls, lake], i) => (
              <motion.li
                key={label}
                animate={{ opacity: all || i === 0 ? 1 : 0.35 }}
                className="border-line bg-surface grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2"
              >
                <span className={cn("size-3 rounded-sm", cls)} />
                <span className="text-sm">
                  {label}
                  <span className="text-muted block text-[11px]">in a lakehouse: {lake}</span>
                </span>
                <span className="font-mono text-sm">{gb} GB</span>
              </motion.li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        Your phone says storage is full, yet you only have 40 GB of photos. Where did the rest go?
        Recently deleted photos kept for 30 days, burst shots, half-finished downloads.
      </p>
      <p>
        A lakehouse table collects exactly the same clutter. Old versions kept for time travel,
        piles of small files, leftovers from failed jobs. None of it shows up in queries, but all of
        it costs money, and some of it slows every read.
      </p>
      <p>Flip the switch, then let&apos;s watch it happen to a real table.</p>
    </StepLayout>
  );
}

/* 3 ─ Set the maintenance policy ------------------------------------------------------------------- */

export function MaintenancePolicy() {
  const [s, set] = useSceneState<MaintenanceState>();
  const policy: Policy = {
    compact: s.compact,
    retentionDays: s.retention === "never" ? null : Number(s.retention),
    orphans: s.orphans,
  };
  const months = simulate(policy);
  const none = simulate({ compact: false, retentionDays: null, orphans: false });
  const end = months[6];
  const maxGB = Math.max(...none.map((m) => m.storageGB), ...months.map((m) => m.storageGB));
  const maxS = Math.max(...none.map((m) => m.querySeconds), ...months.map((m) => m.querySeconds));
  const W = 300;
  const H = 110;
  const line = (vals: number[], max: number) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${(i / 6) * W},${H - (v / max) * (H - 8)}`).join(" ");

  const warning =
    s.compact && s.retention === "never"
      ? "Compaction without clean-up makes storage worse: every compaction leaves the replaced small files behind as old versions."
      : s.retention !== "never" && !s.compact
        ? "Storage is under control, but queries still open tens of thousands of small files."
        : null;

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Set the maintenance policy"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle
              label="Compaction"
              sub="weekly, into 256 MB files"
              on={s.compact}
              onChange={(v) => set({ compact: v })}
            />
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-sm font-medium">Remove old versions</p>
              <p className="text-muted mb-2 text-[11px]">keep history for…</p>
              <Segmented
                size="sm"
                value={s.retention}
                options={[
                  ["never", "Never"],
                  ["7", "7 d"],
                  ["30", "30 d"],
                  ["90", "90 d"],
                ]}
                onChange={(v) => set({ retention: v as MaintenanceState["retention"] })}
              />
            </div>
            <Toggle
              label="Orphan clean-up"
              sub="files no version uses"
              on={s.orphans}
              onChange={(v) => set({ orphans: v })}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Chart
              title="Storage over six months"
              current={line(
                months.map((m) => m.storageGB),
                maxGB,
              )}
              baseline={line(
                none.map((m) => m.storageGB),
                maxGB,
              )}
              w={W}
              h={H}
            />
            <Chart
              title="A 30-day query"
              current={line(
                months.map((m) => m.querySeconds),
                maxS,
              )}
              baseline={line(
                none.map((m) => m.querySeconds),
                maxS,
              )}
              w={W}
              h={H}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              label="Storage at month 6"
              value={fmtGB(end.storageGB)}
              sub={`live data ${fmtGB(end.liveGB)}`}
            />
            <Stat
              label="Query time"
              value={fmtS(end.querySeconds)}
              sub={`${fmtN(end.queryFiles)} files`}
            />
            <Stat label="Data files" value={fmtN(end.files)} />
            <Stat
              label="Time travel back"
              value={policy.retentionDays === null ? "180 days" : `${policy.retentionDays} days`}
              sub={policy.retentionDays === null ? "everything kept" : "older versions gone"}
            />
          </div>

          {warning && (
            <motion.p
              key={warning}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-viz-compute/40 bg-viz-compute/10 rounded-xl border px-4 py-2.5 text-sm"
            >
              {warning}
            </motion.p>
          )}

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
        You run the table now. Switch on each job and watch storage and query time over six months.
        The dashed lines show the unmaintained table.
      </p>
      <p>
        Each job fixes a different kind of clutter: <Term id="compaction">compaction</Term> fixes
        small files, removing old versions fixes storage growth, orphan clean-up removes debris. Try
        them one at a time before switching all three on.
      </p>
      <p>
        Watch the trade-off in the last tile: the shorter the <Term id="retention">retention</Term>,
        the smaller the bill, and the less history you can time-travel to.
      </p>
    </StepLayout>
  );
}

function Toggle({
  label,
  sub,
  on,
  onChange,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange(v: boolean): void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors",
        on ? "border-good/50 bg-good/10" : "border-line bg-surface hover:bg-surface-2",
      )}
    >
      <p className="flex items-center justify-between text-sm font-medium">
        {label}
        <span
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            on ? "bg-good" : "bg-surface-2 ring-line ring-1",
          )}
        >
          <motion.span
            className="bg-bg absolute top-0.5 size-4 rounded-full"
            initial={false}
            animate={{ left: on ? 18 : 2 }}
          />
        </span>
      </p>
      <p className="text-muted text-[11px]">{sub}</p>
    </button>
  );
}

function Chart({
  title,
  current,
  baseline,
  w,
  h,
}: {
  title: string;
  current: string;
  baseline: string;
  w: number;
  h: number;
}) {
  return (
    <div className="border-line bg-bg/40 rounded-xl border p-3">
      <p className="text-muted mb-1 text-[11px]">{title}</p>
      <svg viewBox={`0 0 ${w} ${h + 14}`} className="w-full" role="img" aria-label={title}>
        <line x1={0} y1={h} x2={w} y2={h} className="stroke-line" />
        <path
          d={baseline}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          className="stroke-bad/60"
        />
        <motion.path
          d={current}
          fill="none"
          strokeWidth={2.5}
          className="stroke-viz-compute"
          initial={false}
          animate={{ d: current }}
        />
        {[0, 2, 4, 6].map((m) => (
          <text
            key={m}
            x={(m / 6) * w}
            y={h + 11}
            className="fill-subtle text-[9px]"
            textAnchor={m === 0 ? "start" : m === 6 ? "end" : "middle"}
          >
            month {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border-line bg-surface rounded-xl border px-3 py-2">
      <p className="text-muted text-[10px] leading-tight">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-lg font-semibold tabular-nums"
      >
        {value}
      </motion.p>
      {sub && <p className="text-subtle text-[10px]">{sub}</p>}
    </div>
  );
}
