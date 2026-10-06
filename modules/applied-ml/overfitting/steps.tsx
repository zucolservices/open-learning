"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TRAIN, VALID, errors, evalPoly } from "./model";
import type { OverfitState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const LAMBDAS = [0, 0.001, 0.01, 0.1, 1];

/* 1 ─ The student who memorised the answers ------------------------------------------------------- */

export function Memoriser() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The student who memorised the answers"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Memorised last year's paper",
              "100% on last year's questions",
              "52% on this year's",
              "border-bad bg-bad/10",
            ],
            [
              "Learned the ideas",
              "88% on last year's questions",
              "85% on this year's",
              "border-good bg-good/10",
            ],
          ].map(([t, a, b, c]) => (
            <div key={t} className={cn("rounded-xl border px-4 py-3 text-xs", c)}>
              <p className="text-sm font-semibold">{t}</p>
              <p className="mt-2">{a}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        One student memorises every answer in last year&apos;s exam and aces it. Another learns the
        ideas and scores a bit lower. This year, with new questions, the memoriser falls apart.
      </p>
      <p>
        Flexible models can memorise too, noise and all: that&apos;s{" "}
        <Term id="overfitting">overfitting</Term>. A model that&apos;s too simple to capture the
        real pattern is <Term id="underfitting">underfitting</Term>. The skill is landing between
        them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Train versus validation error ⭐ ------------------------------------------------------------ */

export function TrainVsValid() {
  const [s, set] = useSceneState<OverfitState>();
  const lambda = LAMBDAS[s.lambdaIdx];
  const cur = errors(s.degree, lambda);
  const all = Array.from({ length: 12 }, (_, i) => errors(i + 1, lambda));
  const X = (x: number) => r1(30 + ((x + 1) / 2) * 260);
  const Y = (y: number) => r1(95 - y * 55);
  const curve = Array.from({ length: 121 }, (_, i) => -1 + i / 60);
  const EX = (d: number) => r1(30 + ((d - 1) / 11) * 260);
  const EY = (e: number) => r1(75 - Math.min(e, 0.28) * 240);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Train versus validation error"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <span className="text-muted w-24">model flexibility</span>
              <input
                type="range"
                min={1}
                max={12}
                value={s.degree}
                onChange={(e) => set({ degree: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Model flexibility"
              />
              <span className="w-16 font-mono">degree {s.degree}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted w-24">regularisation</span>
              <input
                type="range"
                min={0}
                max={4}
                value={s.lambdaIdx}
                onChange={(e) => set({ lambdaIdx: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Regularisation"
              />
              <span className="w-16 font-mono">λ {lambda}</span>
            </label>
          </div>
          <svg viewBox="0 0 300 170" className="mx-auto w-full max-w-lg">
            <rect x={30} y={10} width={260} height={150} className="stroke-line fill-none" />
            {VALID.map(([x, y], i) => (
              <circle key={`v${i}`} cx={X(x)} cy={Y(y)} r={1.8} className="fill-muted/50" />
            ))}
            <polyline
              fill="none"
              className="stroke-accent"
              strokeWidth={2}
              points={curve
                .map((x) => `${X(x)},${Math.max(5, Math.min(165, Y(evalPoly(cur.w, x))))}`)
                .join(" ")}
            />
            {TRAIN.map(([x, y], i) => (
              <circle key={i} cx={X(x)} cy={Y(y)} r={3} className="fill-viz-data" />
            ))}
          </svg>
          <svg viewBox="0 0 300 95" className="mx-auto w-full max-w-lg">
            <line x1={30} y1={75} x2={290} y2={75} className="stroke-line-strong" />
            <polyline
              fill="none"
              className="stroke-viz-data"
              strokeWidth={1.5}
              points={all.map((e, i) => `${EX(i + 1)},${EY(e.train)}`).join(" ")}
            />
            <polyline
              fill="none"
              className="stroke-viz-compute"
              strokeWidth={1.5}
              points={all.map((e, i) => `${EX(i + 1)},${EY(e.valid)}`).join(" ")}
            />
            <line
              x1={EX(s.degree)}
              y1={5}
              x2={EX(s.degree)}
              y2={75}
              className="stroke-accent"
              strokeDasharray="3 3"
            />
            <text x={32} y={88} className="fill-muted font-mono text-[7px]">
              simple
            </text>
            <text x={288} y={88} textAnchor="end" className="fill-muted font-mono text-[7px]">
              flexible
            </text>
            <text x={34} y={12} className="fill-viz-data font-mono text-[7px]">
              training error
            </text>
            <text x={110} y={12} className="fill-viz-compute font-mono text-[7px]">
              validation error
            </text>
          </svg>
          <p className="text-xs">
            Training error <span className="font-mono">{cur.train.toFixed(3)}</span> · validation
            error{" "}
            <span className={cn("font-mono", cur.valid > 0.1 && "text-bad")}>
              {cur.valid.toFixed(3)}
            </span>{" "}
            —{" "}
            {s.degree <= 2
              ? "too simple: underfitting."
              : cur.valid - cur.train > 0.06
                ? "memorising the noise: overfitting."
                : "about right."}
          </p>
          <p className="text-subtle text-[10px]">
            Made-up data: blue dots train the curve, grey dots are held out. Fits computed live.
          </p>
        </div>
      }
    >
      <p>
        Fit a curve to fourteen noisy points, then make the model more flexible. Training error
        keeps falling, but the error on held-out points falls, then rises: the classic U.
      </p>
      <p>
        That&apos;s the <Term id="bias-variance-tradeoff">bias–variance trade-off</Term>. Simple
        models are consistently off; flexible ones swing with every quirk of the sample. Now set
        flexibility to 12 and add <Term id="regularisation">regularisation</Term>, a penalty on
        large weights: the wiggles calm down.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Learning curves ----------------------------------------------------------------------------- */

export function LearningCurves() {
  const [s, set] = useSceneState<OverfitState>();
  const ns = Array.from({ length: 20 }, (_, i) => (i + 1) * 50);
  const train = (n: number) =>
    s.complex ? 0.02 + 0.05 * (1 - Math.exp(-n / 400)) : 0.18 + 0.03 * Math.exp(-n / 200) * -1;
  const valid = (n: number) =>
    s.complex ? 0.09 + 0.35 * Math.exp(-n / 220) : 0.2 + 0.1 * Math.exp(-n / 150);
  const X = (n: number) => r1(30 + ((n - 50) / 950) * 260);
  const Y = (e: number) => r1(130 - e * 260);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Learning curves"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[true, false].map((c) => (
              <button
                key={String(c)}
                type="button"
                aria-pressed={s.complex === c}
                onClick={() => set({ complex: c })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.complex === c ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {c ? "Flexible model" : "Very simple model"}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 300 150" className="mx-auto w-full max-w-lg">
            <line x1={30} y1={130} x2={290} y2={130} className="stroke-line-strong" />
            <polyline
              fill="none"
              className="stroke-viz-data"
              strokeWidth={2}
              points={ns.map((n) => `${X(n)},${Y(train(n))}`).join(" ")}
            />
            <polyline
              fill="none"
              className="stroke-viz-compute"
              strokeWidth={2}
              points={ns.map((n) => `${X(n)},${Y(valid(n))}`).join(" ")}
            />
            <text x={288} y={143} textAnchor="end" className="fill-muted font-mono text-[7px]">
              training examples →
            </text>
            <text x={34} y={14} className="fill-muted font-mono text-[7px]">
              error
            </text>
          </svg>
          <p className="text-muted text-xs">
            {s.complex
              ? "A big gap that narrows with more data: overfitting, and more data helps."
              : "Both curves high and close together: underfitting. More data won't help; a richer model or better features will."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative curves.</p>
        </div>
      }
    >
      <p>
        A <Term id="learning-curve">learning curve</Term> plots training and validation error as you
        give the model more examples. It tells you what to do next.
      </p>
      <p>
        A large gap means the model is overfitting: get more data, simplify, or regularise. Two high
        curves close together mean it&apos;s underfitting: add features or use a more flexible
        model.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reining models in --------------------------------------------------------------------------- */

export function Remedies() {
  const items: [string, string][] = [
    [
      "Ridge (L2), 1970",
      "Adds a penalty on the squared size of the weights, shrinking them all a little.",
    ],
    [
      "Lasso (L1), 1996",
      "Penalises the absolute size of the weights; some shrink to exactly zero, dropping those features.",
    ],
    [
      "Early stopping",
      "In gradient boosting, stop adding trees once validation error hasn't improved for a set number of rounds.",
    ],
    [
      "Prune or limit trees",
      "Maximum depth, minimum samples per leaf, or cost-complexity pruning.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reining models in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
          <blockquote className="border-accent border-l-2 pl-3 text-xs italic">
            &ldquo;With four parameters I can fit an elephant, and with five I can make him wiggle
            his trunk.&rdquo;
            <span className="text-muted not-italic">
              {" "}
              John von Neumann, as quoted by Enrico Fermi (told by Freeman Dyson)
            </span>
          </blockquote>
        </div>
      }
    >
      <p>
        Every remedy does the same thing: limit how much a model can bend to fit noise. You choose
        how much with validation data, never the test set.
      </p>
      <p>
        An advanced aside: very large models sometimes improve again after fitting the training data
        perfectly (&ldquo;double descent&rdquo;, 2019). Researchers still debate how general that
        is, and it doesn&apos;t remove the need to validate.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Overfitting or underfitting? ---------------------------------------------------------------- */

export function WhichProblem() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Overfitting or underfitting?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="over-or-under"
            prompt="Which problem does each symptom point to?"
            categories={[
              { id: "over", label: "Overfitting" },
              { id: "under", label: "Underfitting" },
            ]}
            items={[
              {
                id: "gap",
                label: "99% training accuracy, 70% validation accuracy",
                category: "over",
                why: "A big gap.",
              },
              {
                id: "both",
                label: "62% training accuracy, 61% validation accuracy, baseline 60%",
                category: "under",
                why: "Barely learns anything.",
              },
              {
                id: "deep",
                label: "A tree with one leaf per training example",
                category: "over",
                why: "Memorised.",
              },
              {
                id: "line",
                label: "A straight line fitted to a clearly curved pattern",
                category: "under",
                why: "Too simple.",
              },
              {
                id: "trees",
                label: "Validation error rises as you add more boosting rounds",
                category: "over",
                why: "Time for early stopping.",
              },
            ]}
            explanation="A big train–validation gap means overfitting; both scores poor and close together means underfitting."
          />
        </div>
      }
    >
      <p>Sort the symptoms.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Judge on unseen data", "Training scores flatter."],
  ["The U-shaped curve", "Validation error falls, then rises."],
  ["Bias versus variance", "Too simple versus too jumpy."],
  ["Learning curves guide", "More data, or a richer model?"],
  ["Regularise and stop early", "Limit how much a model can bend."],
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
      <p>Next: finding structure when there are no labels at all.</p>
    </StepLayout>
  );
}
