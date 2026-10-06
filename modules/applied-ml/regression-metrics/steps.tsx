"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  ORDERS,
  SKEWED,
  maeOf,
  meanOf,
  median,
  metrics,
  mseOf,
  residuals,
  type Pattern,
} from "./model";
import type { RegMetState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;

/* 1 ─ How good is the weather forecast? ----------------------------------------------------------- */

export function Darts() {
  const days: [string, number, number][] = [
    ["Mon", 31, 30],
    ["Tue", 28, 33],
    ["Wed", 34, 32],
    ["Thu", 29, 29],
    ["Fri", 33, 41],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="How good is the weather forecast?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {days.map(([d, f, a]) => (
            <div
              key={d}
              className="border-line bg-surface grid grid-cols-[3rem_1fr_1fr_4rem] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="text-muted">{d}</span>
              <span>forecast {f}°</span>
              <span>actual {a}°</span>
              <span
                className={cn(
                  "text-right font-mono",
                  Math.abs(f - a) > 5 ? "text-bad" : "text-muted",
                )}
              >
                {f - a > 0 ? "+" : ""}
                {f - a}°
              </span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        A forecaster was off by 1, 5, 2, 0 and 8 degrees this week. Was that good? It depends what
        you care about: the typical miss, or that one bad day when nobody packed for the heat.
      </p>
      <p>
        When a model predicts numbers, every metric starts from the miss, or{" "}
        <Term id="residual">residual</Term>, and summarises it differently. Choosing a metric is
        choosing what &ldquo;good&rdquo; means.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One huge miss, three metrics ⭐ ------------------------------------------------------------- */

export function HugeMiss() {
  const [s, set] = useSceneState<RegMetState>();
  const pairs: [number, number][] = ORDERS.map(([y, p], i) => (i === 5 ? [y, p + s.miss] : [y, p]));
  if (s.zero) pairs.push([0, 6]);
  const m = metrics(pairs);
  const maxE = Math.max(...m.err.map(Math.abs), 10);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One huge miss, three metrics"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-36">extra miss on order 6</span>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={s.miss}
              onChange={(e) => set({ miss: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Extra miss"
            />
            <span className="w-14 font-mono">+{s.miss} min</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.zero}
              onChange={(e) => set({ zero: e.target.checked })}
              className="accent-accent"
            />
            Add a cancelled order logged as 0 minutes (predicted 6)
          </label>
          <div className="border-line bg-surface flex flex-col gap-0.5 rounded-lg border px-3 py-2">
            {pairs.map(([y, p], i) => {
              const e = p - y;
              return (
                <div
                  key={i}
                  className="grid grid-cols-[5rem_1fr_3rem] items-center gap-2 text-[10px]"
                >
                  <span className="text-muted font-mono">
                    {y}→{p} min
                  </span>
                  <div className="relative h-2.5">
                    <span className="bg-line absolute top-0 bottom-0 left-1/2 w-px" />
                    <motion.span
                      className={cn(
                        "absolute top-0 bottom-0 rounded",
                        e >= 0 ? "bg-viz-compute" : "bg-viz-data",
                      )}
                      animate={{
                        left: e >= 0 ? "50%" : `${50 - (Math.abs(e) / maxE) * 50}%`,
                        width: `${(Math.abs(e) / maxE) * 50}%`,
                      }}
                    />
                  </div>
                  <span className="text-right font-mono">
                    {e > 0 ? "+" : ""}
                    {e}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {[
              ["MAE", `${m.mae.toFixed(1)} min`],
              ["RMSE", `${m.rmse.toFixed(1)} min`],
              ["MAPE", Number.isFinite(m.mape) ? `${(m.mape * 100).toFixed(0)}%` : "∞ (÷ 0)"],
              ["R²", m.r2.toFixed(2)],
            ].map(([k, v]) => (
              <div
                key={k}
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  v.includes("∞") || (k === "R²" && m.r2 < 0)
                    ? "border-bad bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                <p className="text-subtle text-[10px]">{k}</p>
                <p className="font-mono">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Made-up delivery times (actual → predicted). Metrics computed live.
          </p>
        </div>
      }
    >
      <p>
        A model predicts delivery times. Give one order a growing miss and watch the metrics.{" "}
        <Term id="mae">MAE</Term>, the average miss, rises gently. <Term id="rmse">RMSE</Term>{" "}
        squares misses before averaging, so the big one dominates. R² can even go negative: worse
        than always guessing the average.
      </p>
      <p>
        Then add an order with a true value of zero. <Term id="mape">MAPE</Term>, the miss as a
        percentage of the truth, divides by zero and breaks. It also punishes over-forecasts more
        than under-forecasts.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Your metric picks your target --------------------------------------------------------------- */

export function MeanMedian() {
  const [s, set] = useSceneState<RegMetState>();
  const med = median(SKEWED);
  const mean = meanOf(SKEWED);
  const cs = Array.from({ length: 51 }, (_, i) => 10 + i);
  const maxMae = Math.max(...cs.map((c) => maeOf(SKEWED, c)));
  const maxMse = Math.max(...cs.map((c) => mseOf(SKEWED, c)));
  const X = (c: number) => r1(20 + ((c - 10) / 50) * 260);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Your metric picks your target"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 300 130" className="mx-auto w-full max-w-lg">
            {SKEWED.map((v, i) => (
              <circle key={i} cx={X(v)} cy={118} r={3} className="fill-viz-data" />
            ))}
            <polyline
              fill="none"
              className="stroke-viz-meta"
              strokeWidth={1.5}
              points={cs
                .map((c) => `${X(c)},${r1(105 - (maeOf(SKEWED, c) / maxMae) * 90)}`)
                .join(" ")}
            />
            <polyline
              fill="none"
              className="stroke-viz-compute"
              strokeWidth={1.5}
              points={cs
                .map((c) => `${X(c)},${r1(105 - (mseOf(SKEWED, c) / maxMse) * 90)}`)
                .join(" ")}
            />
            <line
              x1={X(s.c)}
              y1={5}
              x2={X(s.c)}
              y2={125}
              className="stroke-accent"
              strokeDasharray="3 3"
            />
            <line
              x1={X(med)}
              y1={110}
              x2={X(med)}
              y2={124}
              className="stroke-viz-meta"
              strokeWidth={1.5}
            />
            <line
              x1={X(mean)}
              y1={12}
              x2={X(mean)}
              y2={26}
              className="stroke-viz-compute"
              strokeWidth={1.5}
            />
            <text
              x={X(med)}
              y={128}
              textAnchor="middle"
              className="fill-viz-meta font-mono text-[6px]"
            >
              median
            </text>
            <text
              x={X(mean)}
              y={10}
              textAnchor="middle"
              className="fill-viz-compute font-mono text-[6px]"
            >
              mean
            </text>
          </svg>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-28">one guess for all</span>
            <input
              type="range"
              min={10}
              max={60}
              value={s.c}
              onChange={(e) => set({ c: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Constant guess"
            />
            <span className="w-12 font-mono">{s.c} min</span>
          </label>
          <p className="text-xs">
            <span className="text-viz-meta">MAE {maeOf(SKEWED, s.c).toFixed(1)}</span> (lowest at
            the median, {med}) ·{" "}
            <span className="text-viz-compute">MSE {mseOf(SKEWED, s.c).toFixed(0)}</span> (lowest at
            the mean, {mean.toFixed(1)})
          </p>
        </div>
      }
    >
      <p>
        Twelve delivery times, one very slow. If you could guess only one number for all of them,
        which would you pick? It depends on the metric: absolute error is smallest at the median;
        squared error is smallest at the mean, which the slow order drags upwards.
      </p>
      <p>
        So when you train a model to minimise a metric, you&apos;re quietly choosing whether it aims
        for typical cases or averages that include the outliers.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reading residuals --------------------------------------------------------------------------- */

const PATTERNS: { id: Pattern; name: string; note: string }[] = [
  { id: "random", name: "Random scatter", note: "No pattern: the model has captured what it can." },
  {
    id: "funnel",
    name: "Funnel",
    note: "Errors grow with the prediction: try predicting the log, or report percentage errors.",
  },
  {
    id: "curve",
    name: "Curve",
    note: "A systematic bend: the model is missing a non-linear effect. Add a feature or a more flexible model.",
  },
];

export function Residuals() {
  const [s, set] = useSceneState<RegMetState>();
  const pts = residuals(s.pattern);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading residuals"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={s.pattern === p.id}
                onClick={() => set({ pattern: p.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.pattern === p.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 300 120" className="mx-auto w-full max-w-lg">
            <line
              x1={20}
              y1={60}
              x2={290}
              y2={60}
              className="stroke-line-strong"
              strokeDasharray="3 3"
            />
            {pts.map(([x, r], i) => (
              <circle
                key={i}
                cx={r1(20 + x * 270)}
                cy={r1(60 - r * 18)}
                r={2.4}
                className="fill-viz-data"
              />
            ))}
            <text x={288} y={114} textAnchor="end" className="fill-muted font-mono text-[7px]">
              predicted value →
            </text>
            <text x={22} y={10} className="fill-muted font-mono text-[7px]">
              residual
            </text>
          </svg>
          <p className="text-muted text-xs">{PATTERNS.find((p) => p.id === s.pattern)?.note}</p>
          <Code>{`from sklearn.metrics import (mean_absolute_error, root_mean_squared_error,
                             mean_absolute_percentage_error, r2_score)
mean_absolute_percentage_error(y, p)   # returns 0.27 for 27%`}</Code>
        </div>
      }
    >
      <p>
        One number can&apos;t tell you where a model goes wrong. Plot each residual against the
        prediction: random scatter around zero is what you want; a funnel or a curve points to a
        specific fix.
      </p>
      <p>
        For forecasts, MASE compares your errors with a naive &ldquo;same as last time&rdquo;
        forecast: below 1 means you beat it. Module 18 uses it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which metric? ------------------------------------------------------------------------------- */

export function WhichMetric() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which metric?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-metric"
            prompt="Which metric fits each situation best?"
            categories={[
              { id: "mae", label: "MAE" },
              { id: "rmse", label: "RMSE" },
              { id: "mape", label: "Percentage error" },
            ]}
            items={[
              {
                id: "typical",
                label: "Report the typical miss in minutes to the operations team",
                category: "mae",
                why: "Plain units, robust to outliers.",
              },
              {
                id: "big",
                label: "Big misses are much worse than small ones (e.g. power-grid load)",
                category: "rmse",
                why: "Squaring punishes large errors.",
              },
              {
                id: "compare",
                label: "Compare accuracy across products selling 10 vs 10,000 a day",
                category: "mape",
                why: "Scale-free (if no zeros).",
              },
              {
                id: "outliers",
                label: "Data has rare data-entry glitches you don't want to dominate",
                category: "mae",
                why: "Less sensitive to outliers.",
              },
            ]}
            explanation="MAE for the typical miss, RMSE when big misses matter most, percentage errors to compare across scales (never with zeros)."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Start from the residual", "Actual minus predicted."],
  ["MAE: typical miss", "Aims for the median."],
  ["RMSE: big misses count more", "Aims for the mean."],
  ["MAPE breaks at zero", "And favours under-forecasting."],
  ["Plot the residuals", "Patterns point to fixes."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: when the thing you&apos;re predicting almost never happens.</p>
    </StepLayout>
  );
}
