"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ALARM_COST, FRAUD, MISS_COST, costThreshold, outcome } from "./model";
import type { ImbState } from "./state";

const inr = (v: number) => `₹${v.toLocaleString("en-IN")}`;

/* 1 ─ A needle in a haystack ---------------------------------------------------------------------- */

export function Needle() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A needle in a haystack"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div
            className="grid grid-cols-25 gap-[2px]"
            style={{ gridTemplateColumns: "repeat(25, minmax(0, 1fr))" }}
          >
            {Array.from({ length: 500 }, (_, i) => (
              <span
                key={i}
                className={cn("h-2 w-2 rounded-[1px]", i === 337 ? "bg-bad" : "bg-surface-2")}
              />
            ))}
          </div>
          <p className="text-muted text-xs">500 transactions. One is fraud.</p>
        </div>
      }
    >
      <p>
        A security guard who waves everyone through is right almost every time: most people
        aren&apos;t thieves. And they&apos;re completely useless.
      </p>
      <p>
        That&apos;s the trap with <Term id="class-imbalance">imbalanced data</Term>: fraud, rare
        diseases, machine failures. When the interesting class is rare, a model can look superb
        while catching nothing. This module fixes a fraud model and separates the fixes that work
        from the popular ones that don&apos;t.
      </p>
    </StepLayout>
  );
}

/* 2 ─ 1 in 500 is fraud ⭐ ------------------------------------------------------------------------ */

export function FraudFix() {
  const [s, set] = useSceneState<ImbState>();
  const o = outcome({ rebalance: s.rebalance, costThreshold: s.costThreshold });
  const fixes: [keyof ImbState, string][] = [
    ["rightMetrics", "Report precision, recall and cost instead of accuracy"],
    [
      "costThreshold",
      `Flag above the cost-based threshold (${(costThreshold * 100).toFixed(1)}%) instead of 50%`,
    ],
    ["rebalance", "Rebalance the training data (class weights or SMOTE)"],
  ];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="1 in 500 is fraud"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {fixes.map(([k, l]) => (
              <label
                key={k}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                  s[k] ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s[k] as boolean}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="accent-accent mt-0.5"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="text-subtle text-[10px]">PER 100,000 TRANSACTIONS ({FRAUD} FRAUD)</p>
            <p className="mt-1 text-sm">
              Accuracy <span className="font-mono text-lg">{(o.accuracy * 100).toFixed(2)}%</span>
            </p>
            {s.rightMetrics ? (
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
                {[
                  ["Fraud caught", `${o.caught} of ${FRAUD}`],
                  ["False alarms", o.alarms.toLocaleString("en-IN")],
                  ["Precision", `${(o.precision * 100).toFixed(0)}%`],
                  ["Cost", inr(o.cost)],
                ].map(([k, v]) => (
                  <div key={k} className="border-line rounded-lg border px-2 py-1.5">
                    <p className="text-subtle text-[10px]">{k}</p>
                    <p className="font-mono">{v}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mt-1 text-xs">
                Looks excellent. But what is it actually catching?
              </p>
            )}
            {s.rebalance && (
              <p className="text-viz-compute mt-2 text-[11px]">
                The model&apos;s probabilities are now inflated for fraud: a “30%” no longer means
                30%.
              </p>
            )}
            {s.rebalance && s.costThreshold && (
              <p className="text-bad mt-1 text-[11px]">
                The cost threshold assumes honest probabilities. On inflated ones it flags far too
                much.
              </p>
            )}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative. Missed fraud costs {inr(MISS_COST)}, a false alarm {inr(ALARM_COST)}.
          </p>
        </div>
      }
    >
      <p>
        A fraud model reports 99.81% accuracy. Turn on the fixes one at a time, starting with honest
        metrics, and watch fraud caught, false alarms and cost.
      </p>
      <p>
        The cost-based threshold flags any payment whose fraud probability exceeds the cost of a
        false alarm divided by the total cost of both mistakes. Rebalancing reaches a similar
        trade-off by distorting the probabilities instead, and combining the two double-counts. Try
        it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why 99.8% means nothing --------------------------------------------------------------------- */

export function Accuracy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why 99.8% means nothing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            {[
              ["284,807", "card transactions"],
              ["492", "frauds (0.17%)"],
              ["99.83%", "accuracy of “never fraud”"],
            ].map(([v, k]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-2 py-2">
                <p className="font-mono text-lg">{v}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </div>
            ))}
          </div>
          <Code>{`from sklearn.linear_model import LogisticRegression
LogisticRegression(class_weight="balanced")   # each fraud counts ≈ 289×
# weight = total ÷ (number of classes × class count) = 284,807 ÷ (2 × 492)`}</Code>
        </div>
      }
    >
      <p>
        A widely used public dataset of European card payments over two days in September 2013 has
        492 frauds in 284,807 transactions. A model that never says &ldquo;fraud&rdquo; scores
        99.83% accuracy and catches nothing. Its publishers recommend the area under the
        precision–recall curve instead.
      </p>
      <p>
        Most models output a probability, and 0.5 is a default, not a law. If a missed fraud costs
        100 times a false alarm, flag anything above about 1%.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Rebalancing: what the evidence says --------------------------------------------------------- */

export function Smote() {
  const [s, set] = useSceneState<ImbState>();
  const a: [number, number] = [70, 60];
  const b: [number, number] = [190, 100];
  const p: [number, number] = [a[0] + (b[0] - a[0]) * s.smoteT, a[1] + (b[1] - a[1]) * s.smoteT];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rebalancing: what the evidence says"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 260 140" className="mx-auto w-full max-w-sm">
            {Array.from({ length: 40 }, (_, i) => (
              <circle
                key={i}
                cx={20 + ((i * 53) % 220)}
                cy={20 + ((i * 37) % 110)}
                r={2.2}
                className="fill-good/50"
              />
            ))}
            <line
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              className="stroke-bad"
              strokeDasharray="3 3"
            />
            <circle cx={a[0]} cy={a[1]} r={4} className="fill-bad" />
            <circle cx={b[0]} cy={b[1]} r={4} className="fill-bad" />
            <circle
              cx={Math.round(p[0])}
              cy={Math.round(p[1])}
              r={4}
              className="stroke-bad fill-none"
              strokeWidth={2}
            />
          </svg>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">new point along the line</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={s.smoteT}
              onChange={(e) => set({ smoteT: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="SMOTE position"
            />
          </label>
          {[
            [
              "2022, 73 datasets",
              "Rebalancing gave no gain for XGBoost or CatBoost; when it helped, plain duplication worked as well as SMOTE (a preprint).",
            ],
            [
              "2022, medical risk models",
              "Undersampling, oversampling and SMOTE made logistic regression overestimate risk without ranking cases better; moving the threshold gave the same trade-off.",
            ],
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
        <Term id="smote">SMOTE</Term> (2002) invents extra rare examples by placing points between a
        real rare example and one of its rare neighbours. It became hugely popular, but it was
        tested on the simple models of its time.
      </p>
      <p>
        Today&apos;s evidence suggests: keep the data as it is, use the right metrics, and tune the
        threshold. Rebalancing can still help weak models or systems with a fixed threshold. If you
        do resample, do it only on training data, inside the cross-validation pipeline.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good idea or mistake? ----------------------------------------------------------------------- */

export function GoodOrMistake() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good idea or mistake?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="good-or-mistake"
            prompt="For a rare-event model, is each a good idea or a mistake?"
            categories={[
              { id: "good", label: "Good idea" },
              { id: "bad", label: "Mistake" },
            ]}
            items={[
              {
                id: "acc",
                label: "Headline the model's 99.9% accuracy",
                category: "bad",
                why: "Always-no gets that too.",
              },
              {
                id: "pr",
                label: "Report precision, recall and the PR curve",
                category: "good",
                why: "Measures the rare class.",
              },
              {
                id: "smotetest",
                label: "Apply SMOTE to the whole dataset before splitting",
                category: "bad",
                why: "Synthetic copies leak into the test set.",
              },
              {
                id: "cost",
                label: "Pick the threshold from the real cost of each mistake",
                category: "good",
                why: "Directly targets what matters.",
              },
              {
                id: "probs",
                label: "Read a rebalanced model's scores as true probabilities",
                category: "bad",
                why: "They're inflated unless recalibrated.",
              },
            ]}
            explanation="Measure the rare class honestly, set thresholds from costs, and resample (if at all) only inside training folds."
          />
        </div>
      }
    >
      <p>Sort the practices.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Accuracy hides rare events", "Always-no scores high."],
  ["Measure the rare class", "Precision, recall, PR curve, cost."],
  ["Thresholds from costs", "Flag if p ≥ false-alarm cost ÷ total."],
  ["Rebalancing isn't magic", "Often no gain for strong models."],
  ["Resample inside training only", "And recalibrate probabilities."],
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
      <p>Next: checking whether a model&apos;s probabilities can be trusted.</p>
    </StepLayout>
  );
}
