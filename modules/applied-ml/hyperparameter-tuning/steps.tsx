"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { search, truth, type Method } from "./model";
import type { TuneState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;

/* 1 ─ Learning a new oven ------------------------------------------------------------------------- */

export function Oven() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Learning a new oven"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ["160°C · 40 min", "pale"],
              ["180°C · 35 min", "perfect"],
              ["200°C · 30 min", "burnt edges"],
            ].map(([t, r], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  i === 1 ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <p className="text-2xl">🍞</p>
                <p className="font-mono">{t}</p>
                <p className="text-muted">{r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A new oven means new settings. The recipe is the same, but you try a few temperatures and
        times, judge the results, and keep the best. You can&apos;t try every combination: flour and
        evenings are limited.
      </p>
      <p>
        Models have settings too: tree depth, learning rate, regularisation strength. They&apos;re{" "}
        <Term id="hyperparameter">hyperparameters</Term>, chosen before training rather than learned
        from data. Tuning is trying settings on validation data, on a budget.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Search the knobs on a budget ⭐ ------------------------------------------------------------- */

const METHODS: { id: Method; name: string }[] = [
  { id: "grid", name: "Grid search" },
  { id: "random", name: "Random search" },
  { id: "bayes", name: "Bayesian (learns as it goes)" },
];

export function SearchBudget() {
  const [s, set] = useSceneState<TuneState>();
  const trials = search(s.method, s.budget);
  const best = trials.reduce((a, b) => (b.v > a.v ? b : a));
  const X = (x: number) => r1(30 + ((x + 3) / 3) * 250);
  const Y = (y: number) => r1(170 - ((y - 2) / 10) * 150);
  const cells = Array.from({ length: 30 * 15 }, (_, i) => {
    const x = -3 + ((i % 30) + 0.5) * 0.1;
    const y = 2 + (Math.floor(i / 30) + 0.5) * (10 / 15);
    return { i, x, y, t: (truth(x, y) - 0.8) / 0.082 };
  });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Search the knobs on a budget"
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
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">budget</span>
            <input
              type="range"
              min={9}
              max={36}
              value={s.budget}
              onChange={(e) => set({ budget: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Budget"
            />
            <span className="w-16 font-mono">{s.budget} trials</span>
          </label>
          <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-lg">
            {cells.map((c) => (
              <rect
                key={c.i}
                x={r1(X(c.x) - 250 / 60)}
                y={r1(Y(c.y) - 5)}
                width={r1(250 / 30 + 0.2)}
                height={10.2}
                className="fill-viz-data"
                opacity={r1(0.06 + c.t * 0.6) / 1}
              />
            ))}
            {trials.map((t, i) => (
              <motion.circle
                key={`${s.method}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.015 * i }}
                cx={X(t.x)}
                cy={Y(t.y)}
                r={2.8}
                className="fill-fg"
              />
            ))}
            <circle
              cx={X(best.x)}
              cy={Y(best.y)}
              r={6}
              className="stroke-accent fill-none"
              strokeWidth={2}
            />
            <text x={280} y={186} textAnchor="end" className="fill-muted font-mono text-[7px]">
              learning rate (0.001 → 1, log scale)
            </text>
            <text x={32} y={14} className="fill-muted font-mono text-[7px]">
              max tree depth
            </text>
          </svg>
          <p className="text-xs">
            Best found: learning rate <span className="font-mono">{(10 ** best.x).toFixed(3)}</span>
            , depth <span className="font-mono">{Math.round(best.y)}</span> · validation score{" "}
            <span className="font-mono">{best.v.toFixed(3)}</span>{" "}
            <span className="text-muted">
              (true score there {truth(best.x, best.y).toFixed(3)})
            </span>
          </p>
          <p className="text-subtle text-[10px]">
            A made-up landscape: brighter is better. The learning rate matters far more than depth.
            Searches run live.
          </p>
        </div>
      }
    >
      <p>
        The shading shows how good each pair of settings really is, which you never get to see in
        practice. Each dot is a trial: train, then score on validation data. Compare the three
        strategies at the same budget.
      </p>
      <p>
        A grid tries only a few distinct learning rates, wasting trials on depths that barely
        matter. Random search tries a new learning rate every time, which is why it often wins on
        the same budget (Bergstra and Bengio, 2012).{" "}
        <Term id="bayesian-optimisation">Bayesian optimisation</Term> uses earlier results to pick
        where to look next.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Stop the losers early ----------------------------------------------------------------------- */

export function Halving() {
  const [s, set] = useSceneState<TuneState>();
  const rounds = [
    { n: 27, budget: 1 },
    { n: 9, budget: 3 },
    { n: 3, budget: 9 },
    { n: 1, budget: 27 },
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stop the losers early"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {rounds.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={s.round === i}
                onClick={() => set({ round: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.round === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                Round {i + 1}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {rounds.map((r, i) => (
              <div
                key={i}
                className={cn(
                  "grid grid-cols-[5rem_1fr_6rem] items-center gap-2 text-xs",
                  i > s.round && "opacity-30",
                )}
              >
                <span className="text-muted">round {i + 1}</span>
                <div className="flex flex-wrap gap-0.5">
                  {Array.from({ length: r.n }, (_, j) => (
                    <motion.span
                      key={j}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.01 * j }}
                      className={cn("h-3 rounded-sm", i === 3 ? "bg-accent" : "bg-viz-data/60")}
                      style={{ width: `${Math.min(60, r.budget * 2)}px` }}
                    />
                  ))}
                </div>
                <span className="text-right font-mono">
                  {r.n} × {r.budget} unit{r.budget > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            Each round keeps the best third and gives them three times the training budget.
          </p>
        </div>
      }
    >
      <p>
        Most settings are obviously bad after a little training. Successive halving gives many
        configurations a small budget, keeps the best, and gives the survivors more. Hyperband
        (2017) runs several such brackets to hedge its bets.
      </p>
      <p>
        scikit-learn&apos;s HalvingGridSearchCV and HalvingRandomSearchCV do successive halving;
        they&apos;re still marked experimental. Optuna (from Preferred Networks, MIT licence) prunes
        unpromising trials as they train.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tuning without fooling yourself ------------------------------------------------------------- */

export function Fooling() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tuning without fooling yourself"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Nested cross-validation</p>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded px-1 py-1 text-center text-[10px]",
                    i === 0 ? "bg-accent text-accent-fg" : "bg-viz-data/25",
                  )}
                >
                  {i === 0 ? (
                    "outer test"
                  ) : (
                    <span className="flex gap-0.5">
                      {Array.from({ length: 3 }, (_, j) => (
                        <span
                          key={j}
                          className={cn(
                            "h-3 flex-1 rounded-sm",
                            j === 0 ? "bg-viz-compute/70" : "bg-viz-data/50",
                          )}
                        />
                      ))}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-muted mt-2">
              Inner loop (inside each training chunk): pick the settings. Outer loop: score the
              whole “tune, then train” recipe on data the tuning never saw.
            </p>
          </div>
          <Code>{`import optuna
def objective(trial):
    params = {"learning_rate": trial.suggest_float("learning_rate", 1e-3, 1, log=True),
              "max_depth": trial.suggest_int("max_depth", 2, 12)}
    return cross_val_score(LGBMClassifier(**params), X_train, y_train, cv=5).mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)`}</Code>
        </div>
      }
    >
      <p>
        The best validation score you found is optimistic: you picked it because it was the highest,
        partly by luck. In the simulation, compare the best trial&apos;s validation score with its
        true score. Cawley and Talbot (2010) showed this bias can be as big as the differences
        between algorithms.
      </p>
      <p>
        <Term id="nested-cross-validation">Nested cross-validation</Term> gives an honest estimate,
        and the test set stays untouched until the very end.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Learned or chosen? -------------------------------------------------------------------------- */

export function ParamOrHyper() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Learned or chosen?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="param-or-hyper"
            prompt="Is each a parameter (learned from data) or a hyperparameter (chosen before training)?"
            categories={[
              { id: "param", label: "Parameter" },
              { id: "hyper", label: "Hyperparameter" },
            ]}
            items={[
              {
                id: "weights",
                label: "The weights of a logistic regression",
                category: "param",
                why: "Found by training.",
              },
              {
                id: "depth",
                label: "Maximum depth of a tree",
                category: "hyper",
                why: "Set before training.",
              },
              {
                id: "lr",
                label: "Learning rate of gradient boosting",
                category: "hyper",
                why: "Chosen, then tuned.",
              },
              {
                id: "splits",
                label: "The split thresholds inside a tree",
                category: "param",
                why: "Learned from data.",
              },
              {
                id: "k",
                label: "Number of clusters in k-means",
                category: "hyper",
                why: "You choose k.",
              },
            ]}
            explanation="Training learns parameters. You choose hyperparameters, ideally by searching on validation data."
          />
        </div>
      }
    >
      <p>Sort the settings.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Hyperparameters are chosen", "Parameters are learned."],
  ["Random beats grid, often", "Same budget, more distinct values."],
  ["Bayesian learns as it goes", "Optuna and friends."],
  ["Stop losers early", "Successive halving, Hyperband, pruning."],
  ["Best score is optimistic", "Nested CV; test set last."],
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
      <p>Next: explaining why a model made a prediction.</p>
    </StepLayout>
  );
}
