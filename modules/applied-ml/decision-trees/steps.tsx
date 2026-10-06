"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  TRAIN,
  VALID,
  accuracy,
  boxes,
  describeRoot,
  entropy,
  gini,
  grow,
  leaves,
  rules,
} from "./model";
import type { TreeState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const X = (income: number) => r1(30 + ((income - 2) / 28) * 260);
const Y = (debt: number) => r1(170 - (debt / 80) * 155);

/* 1 ─ Twenty questions ---------------------------------------------------------------------------- */

export function TwentyQuestions() {
  const qs = [
    "Is it alive?",
    "Is it an animal?",
    "Does it live in water?",
    "Is it bigger than a cat?",
    "Is it a dolphin?",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Twenty questions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {qs.map((q, i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm"
              style={{ marginLeft: `${i * 0.75}rem` }}
            >
              <span>{q}</span>
              <span className="text-good text-xs">yes</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In twenty questions, good players ask questions that split the possibilities in half:
        &ldquo;Is it alive?&rdquo; beats &ldquo;Is it a giraffe?&rdquo;. Each answer narrows things
        down until there&apos;s one guess left.
      </p>
      <p>
        A <Term id="decision-tree">decision tree</Term> plays the same game with data. At each step
        it picks the yes/no question about a feature that best separates the outcomes, then repeats
        inside each group.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Grow a loan-approval tree ⭐ ---------------------------------------------------------------- */

export function GrowTree() {
  const [s, set] = useSceneState<TreeState>();
  const tree = grow(TRAIN, s.depth);
  const tr = accuracy(tree, TRAIN);
  const va = accuracy(tree, VALID);
  const bx = boxes(tree);
  const rs = rules(tree);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Grow a loan-approval tree"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">maximum depth</span>
            <input
              type="range"
              min={1}
              max={9}
              value={s.depth}
              onChange={(e) => set({ depth: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Maximum depth"
            />
            <span className="w-6 font-mono">{s.depth}</span>
          </label>
          <svg viewBox="0 0 300 185" className="mx-auto w-full max-w-lg">
            {bx.map((b, i) => (
              <rect
                key={i}
                x={X(b.x0)}
                y={Y(b.y1)}
                width={r1(X(b.x1) - X(b.x0))}
                height={r1(Y(b.y0) - Y(b.y1))}
                className={b.bad ? "fill-bad/15 stroke-bad/40" : "fill-good/15 stroke-good/40"}
                strokeWidth={0.5}
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
              income (₹ lakh a year)
            </text>
            <text x={32} y={12} className="fill-muted font-mono text-[7px]">
              debt-to-income %
            </text>
          </svg>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              ["Leaves", String(leaves(tree)), false],
              ["Training accuracy", `${Math.round(tr * 100)}%`, false],
              ["Validation accuracy", `${Math.round(va * 100)}%`, tr - va > 0.2],
            ].map(([k, v, warn]) => (
              <div
                key={k as string}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  warn ? "border-bad bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="text-subtle text-[10px]">{k}</p>
                <p className="font-mono">{v}</p>
              </div>
            ))}
          </div>
          {rs.length <= 4 ? (
            <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10px]">
              {rs.map((r) => (
                <p key={r}>{r}</p>
              ))}
            </div>
          ) : (
            <p className="text-muted text-xs">
              {rs.length} rules: too many to read, and many describe just one or two applicants.
            </p>
          )}
          <p className="text-subtle text-[10px]">
            Made-up applicants (green repaid, red defaulted). The tree is grown live with Gini
            impurity.
          </p>
        </div>
      }
    >
      <p>
        Each dot is a past applicant: green repaid, red defaulted. Grow the tree one level at a time
        and watch it carve the chart into rectangles, each predicting approve or decline.
      </p>
      <p>
        At depth 1 or 2 you get rules a loan officer could read. Keep going and training accuracy
        heads for 100% while validation accuracy falls: the tree is memorising individual
        applicants. That&apos;s <Term id="overfitting">overfitting</Term>, and scikit-learn&apos;s
        default tree has no depth limit.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Choosing the best question ------------------------------------------------------------------ */

export function Impurity() {
  const [s, set] = useSceneState<TreeState>();
  const pts = Array.from({ length: 51 }, (_, i) => i / 50);
  const PX = (p: number) => r1(30 + p * 250);
  const PY = (v: number) => r1(130 - v * 110);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing the best question"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 300 150" className="mx-auto w-full max-w-md">
            <line x1={30} y1={130} x2={285} y2={130} className="stroke-line-strong" />
            <polyline
              fill="none"
              className="stroke-viz-data"
              strokeWidth={2}
              points={pts.map((p) => `${PX(p)},${PY(gini(p))}`).join(" ")}
            />
            <polyline
              fill="none"
              className="stroke-viz-meta"
              strokeWidth={2}
              points={pts.map((p) => `${PX(p)},${PY(entropy(p))}`).join(" ")}
            />
            <line
              x1={PX(s.p)}
              y1={15}
              x2={PX(s.p)}
              y2={130}
              className="stroke-accent"
              strokeDasharray="3 3"
            />
            <text x={34} y={143} className="fill-muted font-mono text-[7px]">
              0% defaulted
            </text>
            <text x={282} y={143} textAnchor="end" className="fill-muted font-mono text-[7px]">
              100%
            </text>
          </svg>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-28">share defaulted</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={s.p}
              onChange={(e) => set({ p: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Share defaulted"
            />
            <span className="w-10 font-mono">{Math.round(s.p * 100)}%</span>
          </label>
          <p className="text-xs">
            <span className="text-viz-data">Gini {gini(s.p).toFixed(2)}</span> ·{" "}
            <span className="text-viz-meta">entropy {entropy(s.p).toFixed(2)} bits</span>
          </p>
        </div>
      }
    >
      <p>
        How does a tree decide which question is best? It measures how mixed each group is. A pure
        group (all repaid, or all defaulted) scores 0; a 50/50 mix scores highest.{" "}
        <Term id="gini-impurity">Gini impurity</Term> and entropy are two ways to score it, and they
        usually pick similar splits.
      </p>
      <p>
        The best question is the one that leaves the two groups purest, weighted by their sizes; for
        entropy, that drop is called information gain. CART (1984) used Gini; Quinlan&apos;s ID3
        (1986) and C4.5 (1993) used entropy-based measures.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Easy to read, easy to upset ----------------------------------------------------------------- */

export function Unstable() {
  const [s, set] = useSceneState<TreeState>();
  const drop = new Set(
    Array.from({ length: 6 }, (_, i) =>
      Math.floor(
        Math.abs(Math.sin((s.dropSeed + 1) * (i + 3) * 12.9898) * 43758.5453) % TRAIN.length,
      ),
    ),
  );
  const sub = s.dropSeed === 0 ? TRAIN : TRAIN.filter((_, i) => !drop.has(i));
  const t = grow(sub, 2);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Easy to read, easy to upset"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set({ dropSeed: s.dropSeed + 1 })}
              className="border-accent rounded-full border px-3 py-1 text-xs"
            >
              Remove a few applicants at random
            </button>
            <button
              type="button"
              onClick={() => set({ dropSeed: 0 })}
              className="text-muted text-xs underline"
            >
              Use all
            </button>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted font-sans text-[10px]">
              DEPTH-2 TREE FROM {sub.length} APPLICANTS · FIRST QUESTION: {describeRoot(t)}
            </p>
            {rules(t).map((r) => (
              <motion.p
                key={`${s.dropSeed}-${r}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {r}
              </motion.p>
            ))}
          </div>
          <p className="text-muted text-xs">
            Tiny changes to the data can change the questions, especially lower down. Multiplying
            incomes by 1,000 would change nothing.
          </p>
        </div>
      }
    >
      <p>
        Trees have handy properties: they need no feature scaling, handle mixtures of feature types,
        and read like a flowchart. Since version 1.3, scikit-learn&apos;s trees also handle missing
        values.
      </p>
      <p>
        Their weakness is instability: remove a few rows and you can get a noticeably different
        tree. They also can&apos;t predict beyond the range they were trained on. The fix for
        instability is to average many trees, which is the next module.
      </p>
    </StepLayout>
  );
}

/* 5 ─ True of trees? ------------------------------------------------------------------------------ */

export function TreeFacts() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="True of trees?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tree-facts"
            prompt="Is each statement about decision trees true or false?"
            categories={[
              { id: "t", label: "True" },
              { id: "f", label: "False" },
            ]}
            items={[
              {
                id: "scale",
                label: "You must scale features before training a tree",
                category: "f",
                why: "Trees only compare values to thresholds.",
              },
              {
                id: "deep",
                label: "A very deep tree tends to overfit",
                category: "t",
                why: "It memorises individual rows.",
              },
              {
                id: "greedy",
                label: "Trees pick the best question one step at a time",
                category: "t",
                why: "Greedy, not globally optimal.",
              },
              {
                id: "default",
                label: "scikit-learn's default tree stops at depth 5",
                category: "f",
                why: "max_depth=None: it grows until leaves are pure.",
              },
              {
                id: "stable",
                label: "Small changes in the data never change the tree",
                category: "f",
                why: "Trees are unstable.",
              },
            ]}
            explanation="Trees are greedy, scale-free and readable, but unstable and prone to overfitting unless limited or pruned."
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
  ["A flowchart of questions", "Each leaf gives a prediction."],
  ["Greedy splits", "The purest split at each step."],
  ["Gini or entropy", "Two scores for mixed groups."],
  ["Limit or prune", "Deep trees memorise."],
  ["Unstable alone", "Many trees together fix that."],
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
      <p>Next: why hundreds of trees beat one.</p>
    </StepLayout>
  );
}
