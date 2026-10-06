"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { KINDS, evaluate, type Kind } from "./model";
import type { CalState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;

/* 1 ─ "70% chance of rain" ------------------------------------------------------------------------ */

export function Forecaster() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“70% chance of rain”"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="text-2xl"
              >
                {i < 7 ? "🌧️" : "☀️"}
              </motion.span>
            ))}
          </div>
          <p className="text-muted text-xs">Ten days forecast at 70%. It rained on seven.</p>
        </div>
      }
    >
      <p>
        When a weather forecaster says &ldquo;70% chance of rain&rdquo;, it should rain on about
        seven of every ten such days. Studies of US weather forecasts in the 1970s and 80s found
        exactly that kind of reliability.
      </p>
      <p>
        A model is <Term id="calibration">calibrated</Term> when its probabilities work the same
        way. Many models aren&apos;t: their scores rank cases well but don&apos;t mean what they
        say. That matters whenever someone uses the number itself.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Does 70% mean 70%? ⭐ ----------------------------------------------------------------------- */

export function Reliability() {
  const [s, set] = useSceneState<CalState>();
  const r = evaluate(s.kind, s.recal);
  const raw = evaluate(s.kind, false);
  const X = (v: number) => r1(30 + v * 220);
  const Y = (v: number) => r1(240 - v * 220);
  const maxN = Math.max(...r.bins.map((b) => b.n), 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Does 70% mean 70%?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={s.kind === k.id}
                onClick={() => set({ kind: k.id as Kind })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.kind === k.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {k.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.recal}
              onChange={(e) => set({ recal: e.target.checked })}
              className="accent-accent"
            />
            Recalibrate with Platt scaling, fitted on held-out data
          </label>
          <svg viewBox="0 0 270 275" className="mx-auto w-full max-w-xs">
            <rect x={30} y={20} width={220} height={220} className="stroke-line fill-none" />
            <line
              x1={X(0)}
              y1={Y(0)}
              x2={X(1)}
              y2={Y(1)}
              className="stroke-muted"
              strokeDasharray="3 3"
            />
            {r.bins.map((b, i) => (
              <rect
                key={`h${i}`}
                x={X(i / 10) + 2}
                y={r1(270 - (b.n / maxN) * 22)}
                width={18}
                height={r1((b.n / maxN) * 22)}
                className="fill-viz-data/30"
              />
            ))}
            <polyline
              fill="none"
              className="stroke-accent"
              strokeWidth={2}
              points={r.bins
                .filter((b) => b.n > 5)
                .map((b) => `${X(b.mean)},${Y(b.freq)}`)
                .join(" ")}
            />
            {r.bins
              .filter((b) => b.n > 5)
              .map((b, i) => (
                <circle key={i} cx={X(b.mean)} cy={Y(b.freq)} r={3} className="fill-accent" />
              ))}
            <text x={250} y={252} textAnchor="end" className="fill-muted font-mono text-[7px]">
              predicted probability
            </text>
            <text x={32} y={14} className="fill-muted font-mono text-[7px]">
              how often it happened
            </text>
          </svg>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">Brier score (lower is better)</p>
              <p className="font-mono">
                {r.brier.toFixed(3)}
                {s.recal && <span className="text-muted"> (was {raw.brier.toFixed(3)})</span>}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">Calibration error (ECE)</p>
              <p className="font-mono">
                {(r.ece * 100).toFixed(1)} pts
                {s.recal && <span className="text-muted"> (was {(raw.ece * 100).toFixed(1)})</span>}
              </p>
            </div>
          </div>
          <p className="text-muted text-xs">{KINDS.find((k) => k.id === s.kind)?.note}</p>
          <p className="text-subtle text-[10px]">
            1,500 made-up predictions; bars underneath show how many fall in each bin. Computed
            live.
          </p>
        </div>
      }
    >
      <p>
        A <Term id="reliability-diagram">reliability diagram</Term> groups predictions by their
        probability and checks how often each group actually happened. Perfect calibration follows
        the dashed diagonal.
      </p>
      <p>
        Try the three kinds of model. Hedging models (boosted trees and SVMs, in a classic 2005
        study) keep scores away from 0 and 1; overconfident ones push them to the extremes, as
        modern deep networks often do. Then recalibrate: the ranking of cases stays the same, but
        the probabilities become honest.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Scoring probabilities ----------------------------------------------------------------------- */

export function Brier() {
  const [s, set] = useSceneState<CalState>();
  const f = s.rainy / 10;
  const brier = (7 * (1 - f) ** 2 + 3 * f ** 2) / 10;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Scoring probabilities"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center rounded text-lg",
                  i < 7 ? "bg-viz-data/25" : "bg-surface-2",
                )}
              >
                {i < 7 ? "🌧️" : "☀️"}
              </span>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-32">your forecast each day</span>
            <input
              type="range"
              min={0}
              max={10}
              value={s.rainy}
              onChange={(e) => set({ rainy: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Forecast"
            />
            <span className="w-10 font-mono">{s.rainy * 10}%</span>
          </label>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-xs">
            <p>Brier = average of (forecast − outcome)²</p>
            <p className="mt-1">
              = (7 × {(1 - f).toFixed(1)}² + 3 × {f.toFixed(1)}²) ÷ 10 ={" "}
              <span className="text-accent text-base">{brier.toFixed(3)}</span>
            </p>
          </div>
          <p className="text-muted text-xs">
            {s.rainy === 7
              ? "Lowest possible: forecasting the true rate, 70%, scores best."
              : "Try other forecasts: the score is lowest when you forecast the true rate, 70%."}
          </p>
        </div>
      }
    >
      <p>
        The <Term id="brier-score">Brier score</Term>, from weather scientist Glenn Brier (1950), is
        the average squared gap between each forecast probability and what happened (1 for rain, 0
        for none). Lower is better. It rains on 7 of these 10 days: find the forecast that scores
        best.
      </p>
      <p>
        Because honesty scores best, the Brier score can&apos;t be gamed by hedging or exaggerating.
        Expected calibration error (2015) summarises the reliability diagram in one number, but its
        value depends on how many bins you use.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When calibration matters -------------------------------------------------------------------- */

export function WhenItMatters() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When calibration matters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`from sklearn.calibration import CalibratedClassifierCV, CalibrationDisplay
from sklearn.frozen import FrozenEstimator

calibrated = CalibratedClassifierCV(FrozenEstimator(trained_model), method="sigmoid")
calibrated.fit(X_calib, y_calib)           # held-out data, never the training set
CalibrationDisplay.from_estimator(calibrated, X_test, y_test, n_bins=10)`}</Code>
          {[
            ["Sigmoid (Platt scaling)", "An S-curve fitted to the scores. Works with little data."],
            [
              "Isotonic regression",
              "Any upward staircase. More flexible; needs roughly a thousand or more samples.",
            ],
            ["Temperature", "One number that softens or sharpens scores (scikit-learn 1.8+)."],
          ].map(([t, d]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        If you only rank cases (call the top 200), calibration barely matters. It matters when the
        number itself is used: pricing risk, computing expected costs, choosing a cost-based
        threshold, or combining scores from different models.
      </p>
      <p>
        Fix it after training, on data the model hasn&apos;t seen. Calibration doesn&apos;t make a
        model more accurate or change its ranking much; it makes its probabilities mean what they
        say.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Probability or ranking? --------------------------------------------------------------------- */

export function MattersOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Probability or ranking?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="matters-or-not"
            prompt="Does each use need calibrated probabilities, or is a good ranking enough?"
            categories={[
              { id: "cal", label: "Needs calibration" },
              { id: "rank", label: "Ranking is enough" },
            ]}
            items={[
              {
                id: "price",
                label: "Set an insurance premium from the predicted chance of a claim",
                category: "cal",
                why: "The number becomes money.",
              },
              {
                id: "top",
                label: "Call the 200 customers most likely to leave",
                category: "rank",
                why: "Only the order matters.",
              },
              {
                id: "expected",
                label: "Estimate how many loans will default next quarter",
                category: "cal",
                why: "Sums of probabilities must be honest.",
              },
              {
                id: "feed",
                label: "Order products in a recommendation feed",
                category: "rank",
                why: "Relative order is what counts.",
              },
              {
                id: "show",
                label: "Show a patient “12% risk” on screen",
                category: "cal",
                why: "People read the number literally.",
              },
            ]}
            explanation="If anyone uses the probability as a number, it must be calibrated. If you only sort, ranking quality is what matters."
          />
        </div>
      }
    >
      <p>Sort the uses.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Calibrated means honest", "Its 70% happens 70% of the time."],
  ["Reliability diagrams show it", "Compare with the diagonal."],
  ["Brier score measures it", "Lower is better."],
  ["Fix after training", "Sigmoid, isotonic or temperature, on held-out data."],
  ["Matters when numbers are used", "Prices, expected counts, thresholds."],
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
      <p>Next: tuning a model&apos;s settings without fooling yourself.</p>
    </StepLayout>
  );
}
