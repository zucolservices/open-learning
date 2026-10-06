"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  DAYS,
  METHODS,
  REMAINDER,
  SEASON,
  SERIES,
  TREND,
  forecast,
  mae,
  rollingMae,
} from "./model";
import type { ForecastState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;

function path(
  vals: (number | null)[],
  X: (i: number) => number,
  Y: (v: number) => number,
  offset = 0,
) {
  return vals
    .map((v, i) =>
      v === null
        ? ""
        : `${i === 0 || vals[i - 1] === null ? "M" : "L"}${X(i + offset)},${r1(Y(v))}`,
    )
    .join(" ");
}

/* 1 ─ How much milk for next week? ---------------------------------------------------------------- */

export function Milk() {
  const last = SERIES.slice(DAYS - 28);
  const X = (i: number) => r1(10 + i * 10);
  const Y = (v: number) => 110 - v;
  return (
    <StepLayout
      eyebrow="Story"
      title="How much milk for next week?"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <svg viewBox="0 0 300 120" className="w-full max-w-lg">
            {last.map((v, i) => (
              <motion.rect
                key={i}
                initial={{ height: 0, y: 110 }}
                animate={{ height: v - 20, y: Y(v) + 20 }}
                transition={{ delay: 0.02 * i }}
                x={X(i)}
                width={7}
                rx={1}
                className={i % 7 === 5 ? "fill-accent" : "fill-viz-data/70"}
              />
            ))}
            <text x={290} y={12} textAnchor="end" className="fill-muted text-[8px]">
              litres sold per day, last four weeks
            </text>
          </svg>
          <p className="text-subtle text-[10px]">Made-up sales. Saturdays highlighted.</p>
        </div>
      }
    >
      <p>
        A café owner orders milk every Sunday for the week ahead. Order too little and the lattes
        stop on Saturday; order too much and it goes sour. Looking at past weeks, they notice
        Saturdays are always busiest and that sales are creeping up.
      </p>
      <p>
        That is forecasting: predicting the next values of a{" "}
        <Term id="time-series">time series</Term> from its past. It is different from the rest of
        this track because the order of the data matters, and the future is never in your training
        set.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Race the forecasters ⭐ --------------------------------------------------------------------- */

export function Forecasters() {
  const [s, set] = useSceneState<ForecastState>();
  const f = forecast(s.method);
  const shown = SERIES.slice(DAYS - 42);
  const X = (i: number) => r1(14 + i * 6.6);
  const Y = (v: number) => 150 - (v - 20) * 1.4;
  const scores = METHODS.map((m) => ({ ...m, mae: mae(forecast(m.id)) }));
  const worst = Math.max(...scores.map((m) => m.mae));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Race the forecasters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={s.method === m.id}
                onClick={() => set({ method: m.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.method === m.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{METHODS.find((m) => m.id === s.method)?.how}</p>
          <svg viewBox="0 0 300 160" className="mx-auto w-full max-w-lg">
            <rect
              x={X(28) - 3}
              y={4}
              width={X(41) - X(28) + 6}
              height={150}
              className="fill-surface-2"
            />
            <text x={X(28)} y={14} className="fill-muted text-[7px]">
              held out: the next two weeks
            </text>
            <path d={path(shown, X, Y)} className="stroke-viz-data fill-none" strokeWidth={1.5} />
            <motion.path
              key={s.method}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              d={path(f, X, Y, 28)}
              className="stroke-accent fill-none"
              strokeWidth={2}
            />
          </svg>
          <div className="flex flex-col gap-1">
            {scores.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-xs",
                  m.id === s.method && "font-semibold",
                )}
              >
                <span className="text-muted">{m.name}</span>
                <div className="bg-surface-2 h-2.5 rounded">
                  <div
                    className={cn(
                      "h-2.5 rounded",
                      m.id === s.method ? "bg-accent" : "bg-viz-data/60",
                    )}
                    style={{ width: `${(m.mae / worst) * 100}%` }}
                  />
                </div>
                <span className="text-right font-mono">{m.mae}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Mean absolute error on the held-out two weeks, in litres a day (lower is better).
            Computed live on made-up data.
          </p>
        </div>
      }
    >
      <p>
        Blue is what happened; the bright line is each method&apos;s forecast for the two weeks it
        never saw. Try all four. A flat forecast misses Saturday entirely. Seasonal naïve, “same as
        the same weekday last week”, is a surprisingly strong <Term id="baseline">baseline</Term>:
        in the 2020 M5 forecasting competition about two-thirds of teams failed to beat it.
      </p>
      <p>
        <Term id="exponential-smoothing">Exponential smoothing</Term> (late 1950s; Holt added trend,
        Winters added seasons) follows both the weekly shape and the slow rise. ARIMA (Box and
        Jenkins, 1970) is the other classic family.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Trend, season and noise --------------------------------------------------------------------- */

export function Decompose() {
  const X = (i: number) => r1(10 + (i / (DAYS - 1)) * 280);
  const rows: { name: string; vals: (number | null)[]; lo: number; hi: number }[] = [
    { name: "Sales", vals: SERIES, lo: 20, hi: 110 },
    { name: "Trend (zoomed in)", vals: TREND, lo: 60, hi: 90 },
    { name: "Weekly pattern", vals: SEASON, lo: -20, hi: 30 },
    { name: "Leftover", vals: REMAINDER, lo: -20, hi: 30 },
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Trend, season and noise"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map((r, k) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 * k }}
            >
              <p className="text-muted text-[10px] uppercase">{r.name}</p>
              <svg viewBox="0 0 300 44" className="w-full">
                <path
                  d={path(r.vals, X, (v) => 40 - ((v - r.lo) / (r.hi - r.lo)) * 36)}
                  className={cn(
                    "fill-none",
                    k === 0 ? "stroke-viz-data" : k === 3 ? "stroke-muted" : "stroke-accent",
                  )}
                  strokeWidth={1.2}
                />
              </svg>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            A classical decomposition (7-day moving average, then weekday averages), computed live
            on the made-up sales.
          </p>
        </div>
      }
    >
      <p>
        Most series are a slow trend, a repeating pattern (<Term id="seasonality">seasonality</Term>
        ) and leftover noise added together. Pulling them apart shows what a forecaster has to
        capture, and how much is plain luck it never will.
      </p>
      <p>
        STL (1990) is the standard, more robust way to do this split. Real series often have several
        seasons at once (daily and yearly) and holidays, which need extra handling.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Test it like time runs forwards ------------------------------------------------------------- */

export function Backtest() {
  const [s, set] = useSceneState<ForecastState>();
  const weeks = 10;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Test it like time runs forwards"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(["random", "rolling"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.split === m}
                onClick={() => set({ split: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.split === m ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m === "random" ? "Random split" : "Rolling origin"}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {(s.split === "random" ? [0] : [0, 1, 2, 3]).map((k) => (
              <motion.div
                key={`${s.split}-${k}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * k }}
                className="flex gap-0.5"
              >
                {Array.from({ length: weeks }, (_, w) => {
                  const kind =
                    s.split === "random"
                      ? [2, 5, 7].includes(w)
                        ? "test"
                        : "train"
                      : w < 5 + k
                        ? "train"
                        : w === 5 + k
                          ? "test"
                          : "unused";
                  return (
                    <span
                      key={w}
                      className={cn(
                        "h-4 flex-1 rounded-sm",
                        kind === "train"
                          ? "bg-viz-data/60"
                          : kind === "test"
                            ? "bg-accent"
                            : "bg-surface-2",
                      )}
                    />
                  );
                })}
              </motion.div>
            ))}
          </div>
          <p className={cn("text-xs", s.split === "random" ? "text-bad" : "text-good")}>
            {s.split === "random"
              ? "Test weeks sit between training weeks, so the model learns from the future it's tested on."
              : "Train up to a date, forecast the next week, slide forward, repeat. Always the past predicting the future."}
          </p>
          <div className="text-muted grid grid-cols-2 gap-1 text-[11px]">
            {METHODS.map((m) => (
              <span key={m.id}>
                {m.name}: <span className="font-mono">{rollingMae(m.id)}</span>
              </span>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Average error over six rolling one-week forecasts, computed live. Weeks shown as blocks:
            blue train, accent test.
          </p>
        </div>
      }
    >
      <p>
        Never shuffle a time series into random train and test rows: that lets the model peek at the
        future, a form of <Term id="data-leakage">data leakage</Term>. Instead,{" "}
        <Term id="rolling-origin">roll the origin</Term> forward and average the errors.
      </p>
      <p>
        Which method wins? In the M4 competition (2018, 100,000 series) combinations did best, and
        the winner blended exponential smoothing with a neural network. In M5 (2020, Walmart sales)
        the winner averaged many LightGBM gradient-boosted models, though third place was a neural
        network. Pretrained forecasters such as Amazon&apos;s Chronos and Google&apos;s TimesFM
        (both 2024, with newer versions since) forecast without training; check them against
        baselines on your data. Prophet (2017) is easy but rarely beats simpler methods, and is now
        in maintenance mode.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Fair test or peeking? ----------------------------------------------------------------------- */

export function FairTest() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fair test or peeking?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fair-test"
            prompt="Is each a fair way to test a forecaster, or does it peek at the future?"
            categories={[
              { id: "fair", label: "Fair test" },
              { id: "peek", label: "Peeks" },
            ]}
            items={[
              {
                id: "kfold",
                label: "Random 5-fold cross-validation over all days",
                category: "peek",
                why: "Test days sit between training days.",
              },
              {
                id: "rolling",
                label: "Train to March, forecast April; train to April, forecast May…",
                category: "fair",
                why: "Rolling origin.",
              },
              {
                id: "future-feature",
                label: "Using next week's actual weather as a feature",
                category: "peek",
                why: "Not known at forecast time; use the weather forecast instead.",
              },
              {
                id: "baseline",
                label: "Comparing against seasonal naïve on the same held-out weeks",
                category: "fair",
                why: "A fair, simple baseline.",
              },
              {
                id: "smooth",
                label: "Smoothing the whole series, held-out weeks included, before training",
                category: "peek",
                why: "The smoothing used future values.",
              },
            ]}
            explanation="A fair test only uses what you would have known on the day you made the forecast."
          />
        </div>
      }
    >
      <p>Sort the test set-ups.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Trend + season + noise", "Decompose before you model."],
  ["Beat seasonal naïve first", "Many teams in M5 didn't."],
  ["Exponential smoothing, ARIMA", "Classic, quick, strong."],
  ["Roll the origin", "Never shuffle time."],
  ["No single winner", "Combinations, boosted trees, neural nets, pretrained models."],
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
      <p>Next: putting a trained model to work behind an app.</p>
    </StepLayout>
  );
}
