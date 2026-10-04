"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { evaluate, predict } from "./model";
import type { MlState } from "./state";

/* 1 ─ Learning from a bad recipe book ------------------------------------------------------------- */

export function Recipe() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Learning from a bad recipe book"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            [
              "Typos in the book",
              "“1 cup of salt” where it meant teaspoon. You learn it faithfully.",
            ],
            ["A new kitchen", "Your oven runs hot. The recipes were right, for a different oven."],
            [
              "Tastes change",
              "Guests now want less sugar. Same ingredients, different idea of “good”.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A cook who learns from a recipe book with typos makes the mistakes confidently. Move to a
        hotter oven, or cook for guests whose tastes have changed, and even correct recipes start
        failing.
      </p>
      <p>
        Machine learning models are the same. They learn whatever is in their training data,
        mistakes included, and they degrade when the world shifts:{" "}
        <Term id="data-drift">data drift</Term> when the inputs change,{" "}
        <Term id="concept-drift">concept drift</Term> when what counts as the right answer changes.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Train, then drift ⭐ ------------------------------------------------------------------------ */

const XMAX = 1.5;

export function Train() {
  const [s, set] = useSceneState<MlState>();
  const r = evaluate(s.noise, s.data, s.concept);
  const W = 300;
  const H = 200;
  const px = (x: number) => (x / XMAX) * W;
  const py = (y: number) => H - y * H;
  const cells: { x: number; y: number; c: number }[] = [];
  for (let i = 0; i < 30; i++)
    for (let j = 0; j < 20; j++)
      cells.push({
        x: (i + 0.5) / 20,
        y: (j + 0.5) / 20,
        c: predict(r.train, (i + 0.5) / 20, (j + 0.5) / 20),
      });
  const sliders: [keyof MlState, string, number, number, (v: number) => string][] = [
    ["noise", "wrong labels in training data", 0, 40, (v) => `${v}%`],
    ["data", "inputs shift (more long-distance orders)", 0, 0.5, (v) => `+${v.toFixed(2)}`],
    ["concept", "the rule changes (a new courier)", 0, 0.3, (v) => `${v.toFixed(2)}`],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Train, then drift"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid items-center gap-3 lg:grid-cols-[1.3fr_1fr]">
            <div className="border-line bg-surface rounded-xl border p-2">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full"
                role="img"
                aria-label="Training points, the model's decision regions and production inputs"
              >
                {cells.map((c, i) => (
                  <rect
                    key={i}
                    x={px(c.x - 0.025)}
                    y={py(c.y + 0.025)}
                    width={px(0.05) + 0.5}
                    height={H * 0.05 + 0.5}
                    className={c.c ? "fill-accent/15" : "fill-viz-data/10"}
                  />
                ))}
                <rect
                  x={px(s.data)}
                  y={0}
                  width={px(1)}
                  height={H}
                  className="stroke-muted fill-none"
                  strokeDasharray="3 3"
                />
                <line
                  x1={px(0)}
                  y1={py(0.75 + s.concept * -1)}
                  x2={px(XMAX)}
                  y2={py(0.75 - 0.5 * XMAX - s.concept)}
                  className="stroke-fg"
                  strokeWidth={1}
                  strokeDasharray="5 3"
                />
                {r.train.map((p, i) => (
                  <circle
                    key={i}
                    cx={px(p.x)}
                    cy={py(p.y)}
                    r={3}
                    className={cn(
                      p.label ? "fill-accent" : "fill-viz-data",
                      p.flipped && "stroke-bad",
                    )}
                    strokeWidth={p.flipped ? 1.6 : 0}
                  />
                ))}
              </svg>
              <p className="text-subtle px-1 text-[9px]">
                Dots: training orders (late = accent), red ring = wrong label. Shading: the
                model&apos;s answer. Dashed line: today&apos;s true rule. Dashed box: where
                production orders now fall.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {sliders.map(([k, label, min, max, fmt]) => (
                <label key={k} className="flex flex-col gap-1 text-xs">
                  <span className="text-muted flex justify-between">
                    {label} <span className="text-fg font-mono">{fmt(s[k] as number)}</span>
                  </span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={k === "noise" ? 5 : 0.05}
                    value={s[k] as number}
                    onChange={(e) => set({ [k]: Number(e.target.value) })}
                    className="accent-accent"
                    aria-label={label}
                  />
                </label>
              ))}
              <div
                className={cn(
                  "rounded-lg border px-3 py-2",
                  r.accuracy > 0.9 ? "border-good bg-good/10" : "border-bad bg-bad/10",
                )}
              >
                <p className="font-mono text-lg font-semibold">{(r.accuracy * 100).toFixed(0)}%</p>
                <p className="text-muted text-[11px]">accuracy on this week&apos;s orders</p>
              </div>
              <div
                className={cn(
                  "rounded-lg border px-3 py-2 text-[11px]",
                  r.driftAlert ? "border-viz-compute bg-viz-compute/10" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">
                  Input drift monitor: {r.driftAlert ? "alert" : "quiet"}
                </p>
                <p className="text-muted">
                  Distance has moved {r.shiftSd.toFixed(1)} std devs from training.
                  {s.concept > 0 &&
                    !r.driftAlert &&
                    " It can't see a changed rule: the inputs look the same."}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A model predicts which orders will arrive late from delivery distance and basket size. Add
        wrong labels to its training data, then shift production inputs, then change the rule
        itself.
      </p>
      <p>
        An input monitor spots data drift without waiting for outcomes. Concept drift is sneakier:
        the inputs look normal while the answers go wrong, so you only see it once true outcomes
        (labels) arrive.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checking ML data ---------------------------------------------------------------------------- */

export function Skew() {
  const items: [string, string][] = [
    [
      "Label errors are common",
      "Researchers estimated at least 3.3% wrong labels on average across 10 popular benchmark test sets, and at least 6% in the ImageNet validation set (Northcutt et al., 2021).",
    ],
    [
      "Training-serving skew",
      "Production sees different data from training, often because two code paths compute the same feature. Fixing missing features in Google Play once raised app installs by 2%.",
    ],
    [
      "Validate every batch",
      "Google's TFX data validator checks each batch against a schema; TensorFlow Data Validation is its open-source descendant. Evidently is another open-source option.",
    ],
    [
      "Quality before drift",
      "A broken pipeline (nulls, a unit change) looks just like drift. Check data quality first.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Checking ML data"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Google engineers warned in 2015 that in machine learning systems, data dependencies cost
        more than code dependencies. Everything earlier in this track applies; ML adds a few
        specific hazards.
      </p>
      <p>
        <Term id="training-serving-skew">Training-serving skew</Term> is a mismatch between training
        and production; drift is change over time in production. Andrew Ng&apos;s
        &ldquo;data-centric AI&rdquo; (2021) puts it simply: hold the model fixed and systematically
        improve the data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Data for AI applications -------------------------------------------------------------------- */

export function ForAI() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Data for AI applications"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Stale documents", "Last year's refund policy is retrieved and quoted confidently."],
            ["Duplicates", "Three copies of one page crowd out other useful sources."],
            ["Broken extraction", "A table parsed as jumbled text gives wrong numbers."],
            ["No owner", "Nobody knows which version is current, so nobody removes the old one."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Retrieval-augmented generation (RAG) answers questions from your documents, so their quality
        becomes the answers&apos; quality. Problems start at ingestion and flow downstream, just
        like in a data pipeline.
      </p>
      <p>
        The same tools apply: freshness checks, deduplication, validation of parsed output,
        ownership and lineage from document to answer. The RAG Systems track builds on this.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which problem is it? ------------------------------------------------------------------------ */

export function WhichProblem() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which problem is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ml-problem"
            prompt="Name the problem in each case."
            categories={[
              { id: "labels", label: "Label errors" },
              { id: "data", label: "Data drift" },
              { id: "concept", label: "Concept drift" },
              { id: "skew", label: "Training-serving skew" },
            ]}
            items={[
              {
                id: "cats",
                label: "Some training photos of cats are tagged 'dog'",
                category: "labels",
                why: "The answers it learned from are wrong.",
              },
              {
                id: "mobile",
                label: "Most traffic now comes from a new mobile app, unlike the training data",
                category: "data",
                why: "The inputs changed.",
              },
              {
                id: "fraud",
                label: "Fraudsters change tactics, so old patterns no longer mean fraud",
                category: "concept",
                why: "The input-answer relationship changed.",
              },
              {
                id: "units",
                label: "Training computed distance in km; the live service sends miles",
                category: "skew",
                why: "Two code paths disagree.",
              },
            ]}
            explanation="Label errors are wrong answers in training data; data drift is changing inputs; concept drift is a changing rule; skew is training and production computing data differently."
          />
        </div>
      }
    >
      <p>Sort the cases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Models learn mistakes", "Wrong labels become confident wrong answers."],
  ["Data drift", "Inputs change; monitors can see it."],
  ["Concept drift", "The rule changes; needs outcomes to see."],
  ["Skew", "Train and serve must compute data the same way."],
  ["AI apps too", "Stale and duplicate documents become bad answers."],
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
      <p>Next: a map of the data quality tools on the market, and which job each one does.</p>
    </StepLayout>
  );
}
