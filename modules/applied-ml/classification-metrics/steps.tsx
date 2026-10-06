"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { THRESHOLDS, TX, at, auc, cost } from "./model";
import type { MetricsState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const inr = (v: number) => `₹${v.toLocaleString("en-IN")}`;

/* 1 ─ The smoke alarm ----------------------------------------------------------------------------- */

export function SmokeAlarm() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The smoke alarm"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Too sensitive</p>
            <p className="text-muted mt-1">
              Goes off every time you make toast. Soon everyone ignores it.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Not sensitive enough</p>
            <p className="text-muted mt-1">
              Stays quiet through a real fire. Never annoying, and useless.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A smoke alarm makes two kinds of mistake: false alarms and missed fires. Turning the
        sensitivity up trades one for the other. No setting avoids both; you choose based on which
        costs more.
      </p>
      <p>
        Classifiers are the same. They give each case a score, and a{" "}
        <Term id="decision-threshold">threshold</Term> turns that score into yes or no. To judge
        them you count each kind of mistake, because accuracy alone hides the ones that matter.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Move the fraud threshold ⭐ ----------------------------------------------------------------- */

export function Threshold() {
  const [s, set] = useSceneState<MetricsState>();
  const m = at(s.t);
  const costs = THRESHOLDS.map((t) => cost(t, s.missCost, s.alarmCost));
  const bestIdx = costs.indexOf(Math.min(...costs));
  const cells: [string, number, string][] = [
    ["Fraud caught", m.tp, "bg-good/25"],
    ["Fraud missed", m.fn, "bg-bad/25"],
    ["False alarms", m.fp, "bg-viz-compute/25"],
    ["Genuine, left alone", m.tn, "bg-good/10"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Move the fraud threshold"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 300 60" className="mx-auto w-full max-w-lg">
            {TX.map((x, i) => (
              <circle
                key={i}
                cx={r1(10 + x.score * 280)}
                cy={x.fraud ? r1(14 + (i % 4) * 4) : r1(34 + (i % 6) * 4)}
                r={x.fraud ? 2.6 : 1.8}
                className={x.fraud ? "fill-bad" : "fill-good/60"}
              />
            ))}
            <line
              x1={r1(10 + s.t * 280)}
              y1={2}
              x2={r1(10 + s.t * 280)}
              y2={58}
              className="stroke-accent"
              strokeWidth={1.5}
            />
          </svg>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">flag if score ≥</span>
            <input
              type="range"
              min={0.05}
              max={0.95}
              step={0.01}
              value={s.t}
              onChange={(e) => set({ t: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Threshold"
            />
            <span className="w-10 font-mono">{s.t.toFixed(2)}</span>
          </label>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-1 text-xs">
            <span />
            <span className="text-muted text-center text-[10px]">flagged</span>
            <span className="text-muted text-center text-[10px]">not flagged</span>
            <span className="text-muted self-center text-[10px]">fraud</span>
            {[cells[0], cells[1]].map(([k, v, c]) => (
              <div key={k} className={cn("rounded-lg px-2 py-1.5 text-center", c)}>
                <p className="font-mono text-base">{v}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </div>
            ))}
            <span className="text-muted self-center text-[10px]">genuine</span>
            {[cells[2], cells[3]].map(([k, v, c]) => (
              <div key={k} className={cn("rounded-lg px-2 py-1.5 text-center", c)}>
                <p className="font-mono text-base">{v}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {[
              ["Accuracy", pct(m.accuracy)],
              ["Precision", pct(m.precision)],
              ["Recall", pct(m.recall)],
              ["F1", m.f1.toFixed(2)],
            ].map(([k, v]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-subtle text-[10px]">{k}</p>
                <p className="font-mono">{v}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p>
              Cost here: <span className="font-mono">{inr(costs[Math.round(s.t * 100)])}</span>,
              with a missed fraud costing{" "}
              <select
                value={s.missCost}
                onChange={(e) => set({ missCost: Number(e.target.value) })}
                className="bg-surface-2 rounded px-1"
                aria-label="Cost of a missed fraud"
              >
                {[1000, 5000, 20000].map((v) => (
                  <option key={v} value={v}>
                    {inr(v)}
                  </option>
                ))}
              </select>{" "}
              and a false alarm{" "}
              <select
                value={s.alarmCost}
                onChange={(e) => set({ alarmCost: Number(e.target.value) })}
                className="bg-surface-2 rounded px-1"
                aria-label="Cost of a false alarm"
              >
                {[100, 300, 1000].map((v) => (
                  <option key={v} value={v}>
                    {inr(v)}
                  </option>
                ))}
              </select>
              .
            </p>
            <p className="text-muted mt-1">
              Cheapest threshold: <span className="font-mono">{(bestIdx / 100).toFixed(2)}</span> (
              {inr(costs[bestIdx])}).
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            200 made-up transactions, 20 of them fraud. Metrics computed live.
          </p>
        </div>
      }
    >
      <p>
        A model has scored 200 card payments; red dots are real fraud. Slide the threshold and watch
        the <Term id="confusion-matrix">confusion matrix</Term> change. Notice that flagging nothing
        at all would still be 90% accurate: accuracy hides the mistakes that matter.
      </p>
      <p>
        <Term id="precision">Precision</Term> asks: when we flag, how often is it fraud?{" "}
        <Term id="recall">Recall</Term> asks: of all the fraud, how much did we catch? F1 combines
        them. Then set the costs of each mistake and find the cheapest threshold: it&apos;s rarely
        0.5.
      </p>
    </StepLayout>
  );
}

/* 3 ─ ROC and precision–recall curves ------------------------------------------------------------- */

export function Curves() {
  const [s, set] = useSceneState<MetricsState>();
  const pts = THRESHOLDS.map(at);
  const m = at(s.t);
  const X = (v: number) => r1(30 + v * 240);
  const Y = (v: number) => r1(160 - v * 140);
  const isRoc = s.curve === "roc";
  const line = pts
    .map((p) => (isRoc ? `${X(p.fpr)},${Y(p.recall)}` : `${X(p.recall)},${Y(p.precision)}`))
    .join(" ");
  const base = TX.filter((x) => x.fraud).length / TX.length;
  return (
    <StepLayout
      eyebrow="Explore"
      title="ROC and precision–recall curves"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(
              [
                ["roc", "ROC curve"],
                ["pr", "Precision–recall"],
              ] as const
            ).map(([c, l]) => (
              <button
                key={c}
                type="button"
                aria-pressed={s.curve === c}
                onClick={() => set({ curve: c })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.curve === c ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 290 180" className="mx-auto w-full max-w-md">
            <rect x={30} y={20} width={240} height={140} className="stroke-line fill-none" />
            {isRoc ? (
              <line
                x1={X(0)}
                y1={Y(0)}
                x2={X(1)}
                y2={Y(1)}
                className="stroke-muted"
                strokeDasharray="3 3"
              />
            ) : (
              <line
                x1={X(0)}
                y1={Y(base)}
                x2={X(1)}
                y2={Y(base)}
                className="stroke-muted"
                strokeDasharray="3 3"
              />
            )}
            <polyline fill="none" className="stroke-accent" strokeWidth={2} points={line} />
            <circle
              cx={isRoc ? X(m.fpr) : X(m.recall)}
              cy={isRoc ? Y(m.recall) : Y(m.precision)}
              r={4}
              className="fill-viz-compute"
            />
            <text x={270} y={174} textAnchor="end" className="fill-muted font-mono text-[7px]">
              {isRoc ? "false positive rate" : "recall"}
            </text>
            <text x={32} y={14} className="fill-muted font-mono text-[7px]">
              {isRoc ? "true positive rate (recall)" : "precision"}
            </text>
          </svg>
          <p className="text-xs">
            {isRoc ? (
              <>
                Area under the curve: <span className="font-mono">{auc().toFixed(2)}</span>. The
                dashed diagonal is a coin flip (0.5).
              </>
            ) : (
              <>
                The dashed line is random guessing: precision {pct(base)}, the share of fraud, not
                50%.
              </>
            )}{" "}
            The dot is your threshold from the last step ({s.t.toFixed(2)}).
          </p>
        </div>
      }
    >
      <p>
        Instead of one threshold, curves show every threshold at once. The{" "}
        <Term id="roc-curve">ROC curve</Term> plots fraud caught against false alarms among genuine
        payments; its area, the <Term id="auc">AUC</Term>, is the chance a random fraud scores
        higher than a random genuine payment.
      </p>
      <p>
        The precision–recall curve focuses on the rare class. On very imbalanced data a ROC curve
        can look reassuring while precision is poor, so many teams check both: they answer different
        questions. ROC curves began in 1940s radar and signal-detection research.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choosing the threshold ---------------------------------------------------------------------- */

export function ChooseThreshold() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing the threshold"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`from sklearn.model_selection import TunedThresholdClassifierCV
from sklearn.metrics import make_scorer

def money_saved(y, y_pred):            # your own business metric
    ...

tuned = TunedThresholdClassifierCV(model, scoring=make_scorer(money_saved), cv=5)
tuned.fit(X_train, y_train)             # threshold chosen by cross-validation
tuned.best_threshold_`}</Code>
          {[
            [
              "Use validation data",
              "Choose the threshold on validation folds, never on the test set.",
            ],
            ["Use real costs", "A missed fraud and a blocked genuine payment don't cost the same."],
            ["Revisit it", "When fraud patterns or costs change, the best threshold moves."],
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
        scikit-learn&apos;s classifiers predict &ldquo;yes&rdquo; above 0.5 by default. That&apos;s
        rarely the best choice. Since version 1.5 (2024), TunedThresholdClassifierCV picks the
        threshold by cross-validation against a metric you choose; by default it uses balanced
        accuracy.
      </p>
      <p>
        Module 14 goes further with very rare events, and module 15 checks whether the scores
        themselves can be trusted as probabilities.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Precision or recall? ------------------------------------------------------------------------ */

export function PrecisionOrRecall() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Precision or recall?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="precision-or-recall"
            prompt="Which matters more in each case?"
            categories={[
              { id: "p", label: "Precision" },
              { id: "r", label: "Recall" },
            ]}
            items={[
              {
                id: "screen",
                label: "First-round screening for a serious disease, with follow-up tests",
                category: "r",
                why: "Missing a case is far worse than a follow-up test.",
              },
              {
                id: "delete",
                label: "A filter that permanently deletes suspected spam",
                category: "p",
                why: "Deleting real mail is costly.",
              },
              {
                id: "review",
                label: "Flagging transactions for a human analyst to review",
                category: "r",
                why: "Reviews are cheap; missed fraud isn't.",
              },
              {
                id: "block",
                label: "Automatically freezing customers' accounts",
                category: "p",
                why: "Wrongly freezing accounts hurts customers.",
              },
              {
                id: "recall",
                label: "Finding every faulty part in a product recall",
                category: "r",
                why: "Each missed part is a risk.",
              },
            ]}
            explanation="If false alarms are cheap and misses are costly, favour recall. If acting on a false alarm is costly, favour precision."
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
  ["Count each mistake", "The confusion matrix."],
  ["Precision and recall", "Right when flagged; caught of all."],
  ["Thresholds trade them", "Choose from real costs."],
  ["ROC and PR curves", "Every threshold at once."],
  ["Accuracy can lie", "Especially when one class is rare."],
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
      <p>Next: measuring errors when you predict numbers.</p>
    </StepLayout>
  );
}
