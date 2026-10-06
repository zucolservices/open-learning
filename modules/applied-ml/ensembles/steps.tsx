"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TRAIN, VALID, acc, boostPredict, forestPredict, singlePredict } from "./model";
import type { EnsState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const X = (income: number) => r1(30 + ((income - 2) / 28) * 260);
const Y = (debt: number) => r1(170 - (debt / 80) * 155);
const GX = 36;
const GY = 20;

/* 1 ─ Guessing the weight of an ox ---------------------------------------------------------------- */

export function TheOx() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Guessing the weight of an ox"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-5xl">🐂</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ["787", "usable guesses"],
              ["≈ 1%", "median guess off by"],
              ["≈ 0", "average guess off by"],
            ].map(([v, k]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-mono text-lg">{v}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        At a livestock fair in Plymouth in 1906, about 800 people paid to guess the weight of an ox.
        Francis Galton studied the 787 usable tickets. Individual guesses were all over the place,
        but the typical guess was within about 1% of the true weight, and the average was
        essentially exact.
      </p>
      <p>
        Combining many imperfect guesses works because their errors partly cancel. An{" "}
        <Term id="ensemble">ensemble</Term> does the same with models, and on tables of data
        it&apos;s usually the strongest approach there is.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Vote and boost ⭐ --------------------------------------------------------------------------- */

const METHODS: { id: EnsState["method"]; name: string }[] = [
  { id: "single", name: "One deep tree" },
  { id: "forest", name: "Random forest (vote)" },
  { id: "boost", name: "Boosting (fix mistakes)" },
];

export function VoteAndBoost() {
  const [s, set] = useSceneState<EnsState>();
  const f =
    s.method === "single"
      ? singlePredict
      : s.method === "forest"
        ? (p: Parameters<typeof singlePredict>[0]) => forestPredict(s.n, p)
        : (p: Parameters<typeof singlePredict>[0]) => boostPredict(s.n, p);
  const tr = acc(f, TRAIN);
  const va = acc(f, VALID);
  const cells = Array.from({ length: GX * GY }, (_, i) => {
    const income = 2 + ((i % GX) + 0.5) * (28 / GX);
    const debt = 80 - (Math.floor(i / GX) + 0.5) * (80 / GY);
    return f({ income, debt, bad: false });
  });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Vote and boost"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={s.method === m.id}
                onClick={() => set({ method: m.id, n: m.id === "single" ? 1 : Math.max(s.n, 1) })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.method === m.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
          {s.method !== "single" && (
            <label className="flex items-center gap-2 text-xs">
              <span className="text-muted">
                {s.method === "forest" ? "trees" : "boosting rounds"}
              </span>
              <input
                type="range"
                min={1}
                max={60}
                value={s.n}
                onChange={(e) => set({ n: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Number of models"
              />
              <span className="w-6 font-mono">{s.n}</span>
            </label>
          )}
          <svg viewBox="0 0 300 185" className="mx-auto w-full max-w-lg">
            {cells.map((bad, i) => (
              <rect
                key={i}
                x={r1(30 + (i % GX) * (260 / GX))}
                y={r1(15 + Math.floor(i / GX) * (155 / GY))}
                width={r1(260 / GX + 0.3)}
                height={r1(155 / GY + 0.3)}
                className={bad ? "fill-bad/20" : "fill-good/15"}
              />
            ))}
            {TRAIN.map((p, i) => (
              <circle
                key={i}
                cx={X(p.income)}
                cy={Y(p.debt)}
                r={2.6}
                className={p.bad ? "fill-bad" : "fill-good"}
              />
            ))}
            <text x={290} y={182} textAnchor="end" className="fill-muted font-mono text-[7px]">
              income
            </text>
            <text x={32} y={12} className="fill-muted font-mono text-[7px]">
              debt-to-income %
            </text>
          </svg>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">Training accuracy</p>
              <p className="font-mono">{Math.round(tr * 100)}%</p>
            </div>
            <div className="border-accent bg-accent-soft rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">Validation accuracy</p>
              <p className="font-mono">{Math.round(va * 100)}%</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            The same made-up applicants as the last module. Every model here is trained live.
          </p>
        </div>
      }
    >
      <p>
        Start with one deep tree: jagged boundaries, perfect on training data, worse on new
        applicants. Then try a <Term id="random-forest">random forest</Term>: many trees, each
        trained on a random resample of the data and allowed only random features at each split,
        voting together. Slide up the number of trees.
      </p>
      <p>
        Then try <Term id="boosting">boosting</Term>: tiny one-question trees added one at a time,
        each focusing on the applicants the previous ones got wrong. Watch the boundary sharpen
        round by round.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why many beat one --------------------------------------------------------------------------- */

export function Crowds() {
  const rows: [string, string, string][] = [
    [
      "Bagging",
      "Breiman, 1996",
      "Train many models on resampled copies of the data and average them. Mainly reduces variance: the jitter of depending on one sample.",
    ],
    [
      "Random forest",
      "Breiman, 2001",
      "Bagged trees that may only look at a random handful of features at each split, so they disagree more and average better.",
    ],
    [
      "Boosting",
      "AdaBoost 1995; gradient boosting, Friedman 2001",
      "Models built one after another, each correcting the last. Mainly reduces bias; can overfit without shrinkage and early stopping.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why many beat one"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {rows.map(([t, w, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p>
                <span className="font-semibold">{t}</span>{" "}
                <span className="text-subtle">· {w}</span>
              </p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        <Term id="bagging">Bagging</Term> and boosting attack different weaknesses. A single deep
        tree is jumpy: averaging many trees trained on different samples smooths that out. A single
        shallow tree is too simple: adding trees that fix each other&apos;s mistakes builds up
        detail.
      </p>
      <p>
        <Term id="gradient-boosting">Gradient boosting</Term> generalises the idea: each new tree is
        fitted to whatever the ensemble still gets wrong, scaled down by a learning rate so no
        single tree dominates.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The boosting libraries ---------------------------------------------------------------------- */

export function Libraries() {
  const libs: [string, string, string][] = [
    ["XGBoost", "2014; KDD paper 2016", "Apache 2.0"],
    ["LightGBM", "Microsoft; NIPS 2017", "MIT"],
    ["CatBoost", "Yandex, 2017; built for categorical features", "Apache 2.0"],
    ["HistGradientBoosting", "Built into scikit-learn; handles missing values", "BSD 3"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The boosting libraries"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {libs.map(([n, w, l]) => (
              <div
                key={n}
                className="border-line bg-surface grid grid-cols-[9rem_1fr_5rem] gap-2 rounded-lg border px-3 py-1.5 text-xs"
              >
                <span className="font-semibold">{n}</span>
                <span className="text-muted">{w}</span>
                <span className="text-subtle text-right">{l}</span>
              </div>
            ))}
          </div>
          <Code>{`from xgboost import XGBClassifier
model = XGBClassifier(n_estimators=500, learning_rate=0.05, max_depth=4,
                      early_stopping_rounds=50)
model.fit(X_train, y_train, eval_set=[(X_valid, y_valid)])`}</Code>
        </div>
      }
    >
      <p>
        Gradient-boosted trees are still the standard winning tool for table-shaped data in ML
        competitions: a 2025 review counted XGBoost and LightGBM among winning solutions 14 times
        each, CatBoost 8, often blended with neural networks.
      </p>
      <p>
        They aren&apos;t unbeatable. Tabular foundation models such as TabPFN (2025) do well on
        small datasets, and AutoML tools search over many models. But a tuned boosted-tree model is
        the baseline to beat on business data.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Bagging or boosting? ------------------------------------------------------------------------ */

export function BagOrBoost() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Bagging or boosting?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="bag-or-boost"
            prompt="Does each describe bagging (random forests) or boosting?"
            categories={[
              { id: "bag", label: "Bagging" },
              { id: "boost", label: "Boosting" },
            ]}
            items={[
              {
                id: "parallel",
                label: "Trees can be trained independently, in parallel",
                category: "bag",
                why: "Each tree sees its own resample.",
              },
              {
                id: "sequence",
                label: "Each new tree focuses on the previous trees' mistakes",
                category: "boost",
                why: "Sequential correction.",
              },
              {
                id: "variance",
                label: "Mainly smooths out the jumpiness of deep trees",
                category: "bag",
                why: "Reduces variance.",
              },
              {
                id: "early",
                label: "Needs a learning rate and early stopping to avoid overfitting",
                category: "boost",
                why: "Keeps adding detail.",
              },
              {
                id: "xgb",
                label: "XGBoost, LightGBM and CatBoost",
                category: "boost",
                why: "Gradient boosting libraries.",
              },
            ]}
            explanation="Bagging averages independent models to reduce variance; boosting adds models in sequence to reduce bias."
          />
        </div>
      }
    >
      <p>Sort the statements.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Many beat one", "Errors partly cancel."],
  ["Random forests vote", "Resampled data, random features."],
  ["Boosting corrects", "Each tree fixes the last ones' mistakes."],
  ["Boosted trees rule tables", "XGBoost, LightGBM, CatBoost."],
  ["Not unbeatable", "TabPFN and AutoML compete on small data."],
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
      <p>Next: the balance between memorising and learning.</p>
    </StepLayout>
  );
}
