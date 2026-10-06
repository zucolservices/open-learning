"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HOUSES, descend, mse, ols, sigmoid } from "./model";
import type { LinearState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;

/* 1 ─ A pricing rule of thumb --------------------------------------------------------------------- */

export function Recipe() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A pricing rule of thumb"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-5 py-4 text-center">
            <p className="text-muted text-[10px]">AN ESTATE AGENT&apos;S RULE</p>
            <p className="mt-1 font-mono text-lg">price ≈ ₹20 lakh + ₹0.9 lakh × m²</p>
          </div>
          <p className="text-muted max-w-xs text-center text-xs">
            A starting amount, plus a fixed amount for every square metre.
          </p>
        </div>
      }
    >
      <p>
        Experienced estate agents carry rules of thumb: a base amount, plus so much per square
        metre, plus a bit for a garden. They learned those numbers from years of sales.
      </p>
      <p>
        A <Term id="linear-model">linear model</Term> is exactly that: add up the features, each
        multiplied by a weight, plus a starting amount. Training means finding the weights from data
        instead of experience.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fit a line, then let gradient descent ⭐ ---------------------------------------------------- */

const X = (x: number) => r1(30 + ((x - 40) / 115) * 260);
const Y = (y: number) => r1(170 - ((y - 40) / 130) * 150);

export function FitLine() {
  const [s, set] = useSceneState<LinearState>();
  const path = descend(s.steps, s.lr);
  const cur =
    s.mode === "hand"
      ? { slope: s.slope, intercept: s.intercept, loss: mse(s.slope, s.intercept) }
      : path[path.length - 1];
  const best = ols();
  const bestLoss = mse(best.slope, best.intercept);
  const diverged = !Number.isFinite(cur.loss) || cur.loss > 1e5;
  const lineY = (x: number) => cur.intercept + cur.slope * x;
  const maxLoss = Math.max(...path.map((p) => Math.min(p.loss, 1e5)), 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Fit a line, then let gradient descent"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(
              [
                ["hand", "Fit it by hand"],
                ["gd", "Gradient descent"],
              ] as const
            ).map(([m, l]) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.mode === m}
                onClick={() => set({ mode: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.mode === m ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 300 185" className="mx-auto w-full max-w-lg">
            <line x1={30} y1={170} x2={295} y2={170} className="stroke-line-strong" />
            <line x1={30} y1={15} x2={30} y2={170} className="stroke-line-strong" />
            <text x={292} y={182} textAnchor="end" className="fill-muted font-mono text-[7px]">
              size (m²)
            </text>
            <text x={34} y={14} className="fill-muted font-mono text-[7px]">
              price (₹ lakh)
            </text>
            {!diverged &&
              HOUSES.map(([x, y]) => (
                <line
                  key={`r${x}`}
                  x1={X(x)}
                  y1={Y(y)}
                  x2={X(x)}
                  y2={Math.max(10, Math.min(175, Y(lineY(x))))}
                  className="stroke-bad/60"
                  strokeDasharray="2 2"
                />
              ))}
            {HOUSES.map(([x, y]) => (
              <circle key={x} cx={X(x)} cy={Y(y)} r={3} className="fill-viz-data" />
            ))}
            {!diverged && (
              <line
                x1={X(40)}
                y1={Math.max(5, Math.min(180, Y(lineY(40))))}
                x2={X(155)}
                y2={Math.max(5, Math.min(180, Y(lineY(155))))}
                className="stroke-accent"
                strokeWidth={2}
              />
            )}
          </svg>
          {s.mode === "hand" ? (
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <label className="flex items-center gap-2">
                <span className="text-muted w-20">per m²</span>
                <input
                  type="range"
                  min={0}
                  max={1.6}
                  step={0.02}
                  value={s.slope}
                  onChange={(e) => set({ slope: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Slope"
                />
                <span className="w-10 font-mono">{s.slope.toFixed(2)}</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="text-muted w-20">base amount</span>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={1}
                  value={s.intercept}
                  onChange={(e) => set({ intercept: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Intercept"
                />
                <span className="w-10 font-mono">{s.intercept}</span>
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted">learning rate</span>
                {[0.01, 0.1, 0.5, 1.05].map((lr) => (
                  <button
                    key={lr}
                    type="button"
                    aria-pressed={s.lr === lr}
                    onClick={() => set({ lr })}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 font-mono",
                      s.lr === lr ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {lr}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2">
                <span className="text-muted w-20">steps</span>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={s.steps}
                  onChange={(e) => set({ steps: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Descent steps"
                />
                <span className="w-10 font-mono">{s.steps}</span>
              </label>
              <svg viewBox="0 0 300 50" className="mx-auto w-full max-w-lg">
                <polyline
                  fill="none"
                  className="stroke-viz-compute"
                  strokeWidth={1.5}
                  points={path
                    .map(
                      (p, i) =>
                        `${r1(5 + (i / 60) * 290)},${r1(45 - (Math.min(p.loss, 1e5) / maxLoss) * 40)}`,
                    )
                    .join(" ")}
                />
                <text x={6} y={10} className="fill-muted font-mono text-[7px]">
                  error over steps
                </text>
              </svg>
            </div>
          )}
          <p className={cn("text-xs", diverged && "text-bad")}>
            {diverged ? (
              "The steps are too big: each one overshoots further, and the error explodes."
            ) : (
              <>
                Line: price = {cur.intercept.toFixed(1)} + {cur.slope.toFixed(2)} × size · mean
                squared error <span className="font-mono">{cur.loss.toFixed(0)}</span> (best
                possible {bestLoss.toFixed(0)})
              </>
            )}
          </p>
          <p className="text-subtle text-[10px]">
            Made-up sales; the fit and the descent are computed live.
          </p>
        </div>
      }
    >
      <p>
        First, drag the line to fit twelve house sales. The dashed red lines are the misses; the{" "}
        <Term id="loss-function">error</Term> adds up their squares. Least squares, published by
        Legendre in 1805, finds the line with the smallest total.
      </p>
      <p>
        Then let <Term id="gradient-descent">gradient descent</Term> do it: start anywhere, take a
        small step downhill, repeat. Try different <Term id="learning-rate">learning rates</Term>:
        too small and it crawls; too large and it overshoots and blows up.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Logistic regression for yes or no ----------------------------------------------------------- */

export function Logistic() {
  const [s, set] = useSceneState<LinearState>();
  const pts = Array.from({ length: 61 }, (_, d) => d);
  const PX = (d: number) => r1(30 + (d / 60) * 260);
  const PY = (p: number) => r1(150 - p * 130);
  const cross = s.w > 0 ? -s.b / s.w : null;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Logistic regression for yes or no"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 300 170" className="mx-auto w-full max-w-lg">
            <line x1={30} y1={150} x2={295} y2={150} className="stroke-line-strong" />
            <line x1={30} y1={20} x2={30} y2={150} className="stroke-line-strong" />
            <line
              x1={30}
              y1={PY(0.5)}
              x2={295}
              y2={PY(0.5)}
              className="stroke-line"
              strokeDasharray="3 3"
            />
            <polyline
              fill="none"
              className="stroke-accent"
              strokeWidth={2}
              points={pts.map((d) => `${PX(d)},${PY(sigmoid(s.w * d + s.b))}`).join(" ")}
            />
            {cross !== null && cross >= 0 && cross <= 60 && (
              <circle cx={PX(cross)} cy={PY(0.5)} r={4} className="fill-viz-compute" />
            )}
            <text x={292} y={163} textAnchor="end" className="fill-muted font-mono text-[7px]">
              days since last login
            </text>
            <text x={34} y={16} className="fill-muted font-mono text-[7px]">
              probability of cancelling
            </text>
          </svg>
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <span className="text-muted w-14">weight</span>
              <input
                type="range"
                min={0}
                max={0.4}
                step={0.01}
                value={s.w}
                onChange={(e) => set({ w: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Weight"
              />
              <span className="w-10 font-mono">{s.w.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted w-14">bias</span>
              <input
                type="range"
                min={-8}
                max={2}
                step={0.1}
                value={s.b}
                onChange={(e) => set({ b: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Bias"
              />
              <span className="w-10 font-mono">{s.b.toFixed(1)}</span>
            </label>
          </div>
          <p className="text-xs">
            {cross !== null && cross >= 0 && cross <= 60
              ? `Crosses 50% at ${cross.toFixed(0)} days. `
              : ""}
            Each extra day multiplies the odds of cancelling by{" "}
            <span className="font-mono">{Math.exp(s.w).toFixed(2)}</span>.
          </p>
        </div>
      }
    >
      <p>
        For yes/no questions, <Term id="logistic-regression">logistic regression</Term> takes the
        same weighted sum and squeezes it through an S-shaped curve, the sigmoid, so the output is a
        probability between 0 and 1.
      </p>
      <p>
        The S-curve comes from Verhulst&apos;s 1838 population model; Berkson coined
        &ldquo;logit&rdquo; in 1944. Move the weight and bias: the weight sets how steep the curve
        is, the bias where it sits.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reading the weights ------------------------------------------------------------------------- */

export function Coefficients() {
  const rows: [string, number][] = [
    ["days since last login (per day)", 0.12],
    ["support tickets last month", 0.35],
    ["on annual plan", -1.1],
    ["months as a customer", -0.04],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading the weights"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border">
            <div className="text-muted grid grid-cols-[1fr_4rem_5rem] px-3 py-1.5 text-[10px]">
              <span>feature</span>
              <span className="text-right">weight</span>
              <span className="text-right">odds × per unit</span>
            </div>
            {rows.map(([f, w]) => (
              <div
                key={f}
                className="border-line grid grid-cols-[1fr_4rem_5rem] border-t px-3 py-1.5 text-xs"
              >
                <span>{f}</span>
                <span className={cn("text-right font-mono", w > 0 ? "text-bad" : "text-good")}>
                  {w > 0 ? "+" : ""}
                  {w.toFixed(2)}
                </span>
                <span className="text-right font-mono">{Math.exp(w).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Code>{`from sklearn.linear_model import LogisticRegression
model = make_pipeline(StandardScaler(), LogisticRegression(C=1.0))  # L2 by default
model.fit(X_train, y_train)
# scikit-learn 1.8+: choose L1/L2 with l1_ratio; the old penalty= argument is deprecated`}</Code>
          <p className="text-subtle text-[10px]">Illustrative churn model.</p>
        </div>
      }
    >
      <p>
        Linear models are popular because you can read them. Each weight says how the score changes
        for one more unit of a feature, holding the others fixed. In logistic regression, e to the
        power of the weight is an <Term id="odds-ratio">odds ratio</Term>: an annual plan multiplies
        the odds of cancelling by about 0.33.
      </p>
      <p>
        Two cautions: compare weight sizes only after scaling features, and odds aren&apos;t
        probabilities. scikit-learn shrinks logistic weights a little by default (L2 regularisation,
        C=1.0), which module 10 explains.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Linear or logistic? ------------------------------------------------------------------------- */

export function WhichModel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Linear or logistic?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="linear-or-logistic"
            prompt="Which model fits each question?"
            categories={[
              { id: "lin", label: "Linear regression" },
              { id: "log", label: "Logistic regression" },
            ]}
            items={[
              { id: "rent", label: "Monthly rent of a flat", category: "lin", why: "A number." },
              {
                id: "default",
                label: "Will this borrower default? (probability)",
                category: "log",
                why: "Yes/no, as a probability.",
              },
              {
                id: "minutes",
                label: "Minutes until a delivery arrives",
                category: "lin",
                why: "A number.",
              },
              {
                id: "click",
                label: "Will the customer click the offer?",
                category: "log",
                why: "Yes/no.",
              },
              {
                id: "spend",
                label: "Next month's spend in rupees",
                category: "lin",
                why: "A number.",
              },
            ]}
            explanation="Predicting a number: linear regression. Predicting the probability of yes or no: logistic regression."
          />
        </div>
      }
    >
      <p>Sort the questions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Weighted sums", "Base amount plus weight × feature."],
  ["Least squares", "Minimise the squared misses."],
  ["Gradient descent", "Small steps downhill; mind the step size."],
  ["Logistic for yes/no", "A sigmoid turns the sum into a probability."],
  ["Readable weights", "Scale first; odds aren't probabilities."],
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
      <p>Next: models that decide by asking questions.</p>
    </StepLayout>
  );
}
