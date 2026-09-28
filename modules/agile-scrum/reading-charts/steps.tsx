"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BURNDOWN, BURNUP, CFD, SCATTER, percentile } from "./data";
import type { ChartsState } from "./state";

const W = 320;
const H = 180;
const L = 34;
const B = 150;
const T = 14;
const R = 310;

function Axes({ xLabel, yLabel }: { xLabel: string; yLabel: string }) {
  return (
    <g>
      <line x1={L} y1={B} x2={R} y2={B} className="stroke-line-strong" />
      <line x1={L} y1={B} x2={L} y2={T} className="stroke-line-strong" />
      <text x={(L + R) / 2} y={B + 22} textAnchor="middle" className="fill-muted text-[8px]">
        {xLabel}
      </text>
      <text
        x={10}
        y={(T + B) / 2}
        textAnchor="middle"
        transform={`rotate(-90 10 ${(T + B) / 2})`}
        className="fill-muted text-[8px]"
      >
        {yLabel}
      </text>
    </g>
  );
}

const sx = (i: number, n: number) => L + (i / (n - 1)) * (R - L);
const sy = (v: number, max: number) => B - (v / max) * (B - T);
const line = (vals: number[], max: number) =>
  vals.map((v, i) => `${i ? "L" : "M"}${sx(i, vals.length)},${sy(v, max)}`).join(" ");

/* 1 ─ Charts tell stories ---------------------------------------------------------------------------- */

const WORM_A = [
  0, 8, 15, 21, 30, 38, 44, 52, 60, 68, 77, 86, 95, 104, 112, 121, 131, 140, 150, 161, 172,
];
const WORM_B = [
  0, 9, 17, 24, 31, 33, 34, 35, 37, 38, 40, 49, 58, 68, 77, 87, 96, 106, 116, 125, 134,
];

export function Worm() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Charts tell stories"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Runs over 20 overs for two teams"
            >
              <Axes xLabel="overs" yLabel="runs" />
              <path d={line(WORM_A, 180)} fill="none" className="stroke-viz-data" strokeWidth={2} />
              <motion.path
                d={line(WORM_B, 180)}
                fill="none"
                className="stroke-accent"
                strokeWidth={2.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6 }}
              />
              <rect
                x={sx(4, 21)}
                y={T}
                width={sx(10, 21) - sx(4, 21)}
                height={B - T}
                className="fill-bad/10"
              />
              <text x={sx(7, 21)} y={T + 12} textAnchor="middle" className="fill-bad text-[8px]">
                flat: wickets falling?
              </text>
            </svg>
          </div>
          <p className="text-muted text-xs">
            A cricket “worm”: runs over the overs for two innings. You can read the story without
            watching the match: one side steady; the other stalled from over 5 to 10, then
            recovered.
          </p>
        </div>
      }
    >
      <p>
        A cricket fan glances at the &ldquo;worm&rdquo; and knows the match: a flat patch, a steady
        climb, a late surge. Nobody needs the ball-by-ball.
      </p>
      <p>
        Agile teams have four charts like that. Each tells a story about how work is flowing, if you
        know how to read it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Four charts, four stories ⭐ ------------------------------------------------------------------- */

interface ChartDef {
  id: string;
  name: string;
  how: string;
  question: string;
  options: { id: string; label: string; right?: boolean; feedback: string }[];
}

const CHARTS: ChartDef[] = [
  {
    id: "burndown",
    name: "Sprint burndown",
    how: "Work remaining (up) against days (across). The dashed ideal line runs from the total on day 1 to zero on the last day. The real line should roughly follow it.",
    question: "What is this burndown telling you?",
    options: [
      {
        id: "batch",
        label: "Work sat unfinished for days, then was closed in a rush at the end",
        right: true,
        feedback:
          "Yes. Atlassian: “plateaus indicate blockers, late drops suggest batch updates or end-loaded work”. Check that the rushed items really met the Definition of Done.",
      },
      {
        id: "lazy",
        label: "The team was lazy for the first week",
        feedback:
          "A burndown shows what got finished, not effort. Work may have been in progress but not Done, or blocked.",
      },
      {
        id: "great",
        label: "A great Sprint: nearly everything got done",
        feedback:
          "The outcome was fine, but the shape says the team couldn't see progress for most of the Sprint. That hides problems until it's too late to act.",
      },
    ],
  },
  {
    id: "burnup",
    name: "Release burnup",
    how: "Two lines against weeks: work completed (rising) and total scope. The release is done where they meet. Unlike a burndown, it shows scope changes separately.",
    question: "The release keeps slipping. Why?",
    options: [
      {
        id: "scope",
        label: "Scope keeps growing; the team's pace is steady",
        right: true,
        feedback:
          "Yes. The completed line climbs steadily; the scope line steps up three times. That's a conversation with the Product Owner about scope, not about working faster.",
      },
      {
        id: "slow",
        label: "The team is slowing down",
        feedback: "The completed line rises at about the same rate every week.",
      },
      {
        id: "fine",
        label: "Nothing's wrong; burnups always look like this",
        feedback:
          "The gap closes only slowly, because every few weeks the target moves. Without a scope conversation, the finish date keeps slipping.",
      },
    ],
  },
  {
    id: "cfd",
    name: "Cumulative flow diagram",
    how: "Each band is a workflow state, stacked. The vertical height of a band is roughly the work in that state; the horizontal gap is roughly the average time items take; the slope of the Done line is throughput.",
    question: "What does this diagram show?",
    options: [
      {
        id: "bottleneck",
        label: "Work piles up in progress while very little reaches Done",
        right: true,
        feedback:
          "Yes. The Develop band keeps widening while Done barely climbs: WIP and cycle time growing, throughput falling. “If one color bulges, it means work is entering that workflow stage but not moving out as fast.”",
      },
      {
        id: "busy",
        label: "The team is very productive: lots of work started",
        feedback: "Starting isn't finishing. Look at the Done line: it's nearly flat.",
      },
      {
        id: "test",
        label: "Test is the bottleneck: work is piling up there",
        feedback:
          "Look at the band sizes: the Test band is thin. Work is piling up in Develop, where too much was started at once.",
      },
    ],
  },
  {
    id: "scatter",
    name: "Cycle-time scatterplot",
    how: "Each dot is a finished item: when it finished (across) and how long it took (up). Percentile lines show the share of items that finished within that many days.",
    question:
      "A stakeholder asks how long a typical item takes. What's the best answer from this chart?",
    options: [
      {
        id: "p85",
        label: "“85% of our items finish within 10 days”",
        right: true,
        feedback:
          "Yes. A percentile gives a range with a confidence, which is useful for a service level expectation. It still can't promise when any one item will finish.",
      },
      {
        id: "avg",
        label: "“On average, 8.4 days”",
        feedback:
          "An average hides the spread: half the items took longer than that. Percentiles tell you how often you'll be late.",
      },
      {
        id: "exact",
        label: "“Exactly 8 days”",
        feedback: "8 days is the median (50th percentile): half the items took longer.",
      },
    ],
  },
];

function BurndownChart({ guide }: { guide: boolean }) {
  const n = BURNDOWN.remaining.length;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Sprint burndown"
    >
      <Axes xLabel="Sprint day" yLabel="points remaining" />
      <path
        d={`M${sx(0, n)},${sy(40, 44)} L${sx(n - 1, n)},${sy(0, 44)}`}
        className="stroke-muted"
        strokeDasharray="4 4"
      />
      <path
        d={line(BURNDOWN.remaining, 44)}
        fill="none"
        className="stroke-accent"
        strokeWidth={2.5}
      />
      {BURNDOWN.remaining.map((v, i) => (
        <circle key={i} cx={sx(i, n)} cy={sy(v, 44)} r={2.2} className="fill-accent" />
      ))}
      {guide && (
        <>
          <text x={sx(3, n)} y={sy(42, 44)} className="fill-bad text-[8px]">
            flat for a week
          </text>
          <text x={sx(10, n)} y={sy(36, 44)} textAnchor="end" className="fill-bad text-[8px]">
            cliff at the end
          </text>
          <text x={sx(4, n)} y={sy(15, 44)} className="fill-muted text-[8px]">
            ideal line
          </text>
        </>
      )}
    </svg>
  );
}

function BurnupChart({ guide }: { guide: boolean }) {
  const n = BURNUP.done.length;
  const stepPath = BURNUP.scope
    .map((v, i) => `${i ? "H" + sx(i, n) + " V" : "M" + sx(i, n) + ","}${sy(v, 150)}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Release burnup"
    >
      <Axes xLabel="week" yLabel="points" />
      <path d={stepPath} fill="none" className="stroke-viz-meta" strokeWidth={2} />
      <path d={line(BURNUP.done, 150)} fill="none" className="stroke-accent" strokeWidth={2.5} />
      {guide && (
        <>
          <text x={sx(9, n)} y={sy(146, 150)} className="fill-viz-meta text-[8px]">
            total scope
          </text>
          <text x={sx(7, n)} y={sy(40, 150)} className="fill-accent text-[8px]">
            completed
          </text>
          {[4, 7, 10].map((w) => (
            <text
              key={w}
              x={sx(w, n)}
              y={sy(BURNUP.scope[w] + 6, 150)}
              textAnchor="middle"
              className="fill-bad text-[9px]"
            >
              +
            </text>
          ))}
        </>
      )}
    </svg>
  );
}

function CfdChart({ guide }: { guide: boolean }) {
  const n = CFD.arrived.length;
  const max = CFD.arrived[n - 1] + 2;
  const band = (top: number[], bottom: number[]) =>
    top.map((v, i) => `${i ? "L" : "M"}${sx(i, n)},${sy(v, max)}`).join(" ") +
    " " +
    bottom
      .map((v, i) => [v, i] as const)
      .reverse()
      .map(([v, i]) => `L${sx(i, n)},${sy(v, max)}`)
      .join(" ") +
    " Z";
  const zero = CFD.arrived.map(() => 0);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Cumulative flow diagram"
    >
      <Axes xLabel="day" yLabel="items (cumulative)" />
      <path d={band(CFD.arrived, CFD.started)} className="fill-viz-idle/40" />
      <path d={band(CFD.started, CFD.tested)} className="fill-viz-data/50" />
      <path d={band(CFD.tested, CFD.done)} className="fill-viz-compute/50" />
      <path d={band(CFD.done, zero)} className="fill-good/50" />
      {guide && (
        <>
          <text x={sx(45, n)} y={sy(CFD.started[45] - 12, max)} className="fill-fg text-[8px]">
            Develop: widening
          </text>
          <text x={sx(40, n)} y={sy(CFD.done[40] / 2, max)} className="fill-fg text-[8px]">
            Done: nearly flat
          </text>
        </>
      )}
    </svg>
  );
}

function ScatterChart({ guide }: { guide: boolean }) {
  const cycles = SCATTER.map((d) => d.cycle);
  const p50 = percentile(cycles, 50);
  const p85 = percentile(cycles, 85);
  const max = Math.max(...cycles) + 3;
  const x = (d: number) => L + (d / 60) * (R - L);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Cycle-time scatterplot"
    >
      <Axes xLabel="day finished" yLabel="cycle time (days)" />
      {[
        [p50, "50%"],
        [p85, "85%"],
      ].map(([v, l]) => (
        <g key={l as string}>
          <line
            x1={L}
            x2={R}
            y1={sy(v as number, max)}
            y2={sy(v as number, max)}
            className="stroke-viz-meta"
            strokeDasharray="4 3"
          />
          <text
            x={R}
            y={sy(v as number, max) - 3}
            textAnchor="end"
            className="fill-viz-meta text-[8px]"
          >
            {l} ({v} days)
          </text>
        </g>
      ))}
      {SCATTER.map((d, i) => (
        <circle key={i} cx={x(d.day)} cy={sy(d.cycle, max)} r={2.6} className="fill-accent/70" />
      ))}
      {guide && (
        <text x={L + 6} y={T + 8} className="fill-muted text-[8px]">
          each dot: one finished item
        </text>
      )}
    </svg>
  );
}

export function FourCharts() {
  const [s, set] = useSceneState<ChartsState>();
  const c = CHARTS[Math.min(s.chart, CHARTS.length - 1)];
  const picked = c.options.find((o) => o.id === s.dx[c.id]);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Four charts, four stories"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CHARTS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ chart: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  x.id === c.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {x.name}
              </button>
            ))}
            <label className="text-muted ml-auto flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.guide}
                onChange={(e) => set({ guide: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Show reading guide
            </label>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <div className="border-line bg-surface rounded-xl border p-3">
                {c.id === "burndown" && <BurndownChart guide={s.guide} />}
                {c.id === "burnup" && <BurnupChart guide={s.guide} />}
                {c.id === "cfd" && <CfdChart guide={s.guide} />}
                {c.id === "scatter" && <ScatterChart guide={s.guide} />}
              </div>
              <p className="text-muted text-xs">
                <span className="text-fg font-medium">How to read it: </span>
                {c.how}
              </p>
              <p className="text-sm font-semibold">{c.question}</p>
              <div className="grid gap-1.5">
                {c.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={picked?.id === o.id}
                    onClick={() => set({ dx: { ...s.dx, [c.id]: o.id } })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-xs",
                      picked?.id === o.id
                        ? o.right
                          ? "border-good bg-good/10"
                          : "border-bad bg-bad/10"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {picked && (
                <p className="flex gap-1.5 text-xs">
                  {picked.right ? (
                    <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>{picked.feedback}</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            The burndown and burnup are illustrative. The flow diagram and scatterplot are real
            output of the board simulation in the previous module (no limits; and Develop 5, Test
            2).
          </p>
        </div>
      }
    >
      <p>
        Four charts teams use most: a <Term id="burndown">burndown</Term>, a{" "}
        <Term id="burnup">burnup</Term>, a <Term id="cfd">cumulative flow diagram</Term> and a
        cycle-time scatterplot. For each, read it, then say what it&apos;s telling you.
      </p>
      <p className="text-muted text-sm">
        The Scrum Guide lists &ldquo;burn-downs, burn-ups, or cumulative flows&rdquo; as useful
        forecasting practices that &ldquo;do not replace the importance of empiricism.&rdquo;
        Burndowns were once required (in 2010); they&apos;re optional now.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reading or misreading? ------------------------------------------------------------------------ */

export function ChartMyths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Reading or misreading?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="chart-myths"
            prompt="Sort each statement about these charts."
            categories={[
              { id: "right", label: "A fair reading" },
              { id: "wrong", label: "A misreading" },
            ]}
            items={[
              {
                id: "productivity",
                label: "A burndown above the ideal line shows the team is lazy",
                category: "wrong",
                why: "It shows unfinished work, which has many causes: blockers, big items, unclear stories.",
              },
              {
                id: "scope",
                label: "A burnup can show that scope grew, not that the team slowed",
                category: "right",
                why: "That's its advantage: two lines, completed and total scope.",
              },
              {
                id: "exact",
                label: "The horizontal gap on a flow diagram is exactly each item's cycle time",
                category: "wrong",
                why: "It's an approximate average, and only when flow is stable.",
              },
              {
                id: "flat",
                label: "A flat Done line on a flow diagram means nothing is finishing",
                category: "right",
                why: "No slope, no throughput.",
              },
              {
                id: "age",
                label: "A cycle-time scatterplot shows items that are stuck right now",
                category: "wrong",
                why: "It shows only finished items. Stuck items show up on a Work Item Age chart.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Charts inform judgement; they don&apos;t replace it.</p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Burndown", "Remaining work in a Sprint. Watch for plateaus and late cliffs."],
  ["Burnup", "Done vs total scope: separates “slow” from “the target moved”."],
  ["Cumulative flow", "Widening bands mean work is piling up; the Done slope is throughput."],
  ["Scatterplot", "Percentiles, not averages: “85% finish within N days”."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        To answer &ldquo;when will it be done?&rdquo; for many items, teams use Monte Carlo
        forecasts built from past throughput (Daniel Vacanti; Troy Magennis). The Estimation track
        covers them.
      </p>
      <p>Next: choosing between Scrum, Kanban, or both.</p>
    </StepLayout>
  );
}
