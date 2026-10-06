"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { RULES, TEST, learn, results, ruleFlags, score } from "./model";
import type { WhatState } from "./state";

/* 2 ─ Rules versus a learned filter ⭐ ------------------------------------------------------------ */

export function RulesVsLearned() {
  const [s, set] = useSceneState<WhatState>();
  const weight = learn(s.n);
  const flags = TEST.map((e) =>
    s.mode === "rules" ? ruleFlags(e, s.rules) : score(e, weight) > 0,
  );
  const r = results(flags);
  const top = [...weight.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 8);
  const toggle = (id: string) =>
    set({ rules: s.rules.includes(id) ? s.rules.filter((x) => x !== id) : [...s.rules, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Rules versus a learned filter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(
              [
                ["rules", "Write rules by hand"],
                ["learned", "Learn from labelled emails"],
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
          {s.mode === "rules" ? (
            <div className="grid gap-1 sm:grid-cols-2">
              {RULES.map((rule) => (
                <label key={rule.id} className="flex items-center gap-2 text-[11px]">
                  <input
                    type="checkbox"
                    checked={s.rules.includes(rule.id)}
                    onChange={() => toggle(rule.id)}
                    className="accent-accent"
                  />
                  Flag as spam if it {rule.label}
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs">
                <span className="text-muted">training emails</span>
                <input
                  type="range"
                  min={4}
                  max={20}
                  step={2}
                  value={s.n}
                  onChange={(e) => set({ n: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Training emails"
                />
                <span className="w-6 font-mono">{s.n}</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {top.map(([w, v]) => (
                  <span
                    key={w}
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px]",
                      v > 0 ? "bg-bad/20" : "bg-good/20",
                    )}
                  >
                    {w} {v > 0 ? "+" : ""}
                    {v.toFixed(1)}
                  </span>
                ))}
              </div>
              <p className="text-subtle text-[10px]">
                Learned word weights: positive pushes towards spam, negative towards real mail.
              </p>
            </div>
          )}
          <div className="border-line bg-surface flex flex-col rounded-lg border">
            <p className="text-subtle border-line border-b px-3 py-1 text-[10px]">
              10 NEW EMAILS THE FILTER HAS NEVER SEEN
            </p>
            {TEST.map((e, i) => {
              const ok = flags[i] === e.spam;
              return (
                <div
                  key={e.text}
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-1 text-[11px]",
                    !ok && "bg-bad/10",
                  )}
                >
                  <span>{e.text}</span>
                  <span className={cn("shrink-0 text-[10px]", ok ? "text-good" : "text-bad")}>
                    {flags[i] ? "spam" : "inbox"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">Spam caught</p>
              <p className="font-mono">
                {r.caught} of {r.spam}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2.5 py-1.5",
                r.blocked ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-subtle text-[10px]">Real mail wrongly blocked</p>
              <p className="font-mono">
                {r.blocked} of {r.good}
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            A tiny made-up example; the weights are computed live.
          </p>
        </div>
      }
    >
      <p>
        First, write spam rules by hand and try to catch all five spams without blocking the five
        real emails. Notice how every rule you add catches some spam and blocks some real mail.
      </p>
      <p>
        Then let the filter learn word weights from labelled examples. Each example has{" "}
        <Term id="feature">features</Term> (here, its words) and a <Term id="label">label</Term>{" "}
        (spam or not). Slide the number of training emails down and watch it get worse: learned
        rules are only as good as the examples.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three ways to learn ------------------------------------------------------------------------- */

const KINDS = {
  supervised: {
    name: "Supervised",
    how: "Learns from examples with the right answer attached.",
    eg: [
      "Spam or not, from labelled emails",
      "House price, from past sales",
      "Will this customer leave? from past customers",
    ],
  },
  unsupervised: {
    name: "Unsupervised",
    how: "Finds structure in data with no answers attached.",
    eg: [
      "Group customers into segments",
      "Spot unusual transactions",
      "Squash 50 columns into 2 for a chart",
    ],
  },
  reinforcement: {
    name: "Reinforcement",
    how: "Learns which actions earn rewards, by trial and error.",
    eg: ["Game-playing programs", "Robot control", "Tuning a recommendation over time"],
  },
} as const;

export function ThreeKinds() {
  const [s, set] = useSceneState<WhatState>();
  const k = KINDS[s.kind];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to learn"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(KINDS) as (keyof typeof KINDS)[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={s.kind === id}
                onClick={() => set({ kind: id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.kind === id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {KINDS[id].name}
              </button>
            ))}
          </div>
          <motion.div
            key={s.kind}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-sm"
          >
            <p className="font-semibold">{k.name} learning</p>
            <p className="text-muted mt-1 text-xs">{k.how}</p>
            <ul className="mt-2 list-disc pl-4 text-xs">
              {k.eg.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      }
    >
      <p>
        Most business machine learning is <Term id="supervised-learning">supervised</Term>: you have
        past examples with known outcomes and want to predict outcomes for new ones.{" "}
        <Term id="unsupervised-learning">Unsupervised</Term> learning finds patterns without labels.{" "}
        <Term id="reinforcement-learning">Reinforcement learning</Term> learns from rewards.
      </p>
      <p>
        Tom Mitchell&apos;s 1997 definition covers all three: a program learns if its performance at
        a task improves with experience.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where classic ML still wins ----------------------------------------------------------------- */

export function WhereItWins() {
  const rings: [string, string][] = [
    [
      "Artificial intelligence",
      "Any technique that makes computers act intelligently, including hand-written rules",
    ],
    ["Machine learning", "Learning patterns from data"],
    [
      "Deep learning",
      "Machine learning with large neural networks, behind today's language and image models",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where classic ML still wins"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {rings.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
                style={{ marginLeft: `${i * 1.25}rem` }}
              >
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
            {["Fraud checks", "Credit and pricing", "Demand forecasts", "Churn and retention"].map(
              (u) => (
                <span key={u} className="bg-viz-data/15 rounded-lg px-2 py-1.5 text-center">
                  {u}
                </span>
              ),
            )}
          </div>
          <p className="text-muted text-[11px]">
            On spreadsheet-style data, careful 2021–2022 studies found tree-based models such as
            XGBoost beat deep networks. Newer tabular foundation models (TabPFN, 2025) now match
            them on many small tables.
          </p>
        </div>
      }
    >
      <p>
        Language models get the headlines, but a huge amount of everyday business runs on classic
        machine learning over <Term id="tabular-data">tables of data</Term>: rows of customers,
        transactions or shipments, with columns of facts about each.
      </p>
      <p>
        That&apos;s this track: simple, fast, explainable models such as regression and boosted
        trees, and the discipline of evaluating and running them well. In Kaggle&apos;s last big
        survey (2022), scikit-learn was the most used ML framework.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of learning? --------------------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of learning?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-learning"
            prompt="Which kind of learning fits each problem?"
            categories={[
              { id: "sup", label: "Supervised" },
              { id: "unsup", label: "Unsupervised" },
              { id: "rl", label: "Reinforcement" },
            ]}
            items={[
              {
                id: "price",
                label: "Predict a flat's rent from past listings with known rents",
                category: "sup",
                why: "Labelled examples.",
              },
              {
                id: "segments",
                label: "Group shoppers by behaviour, with no categories given",
                category: "unsup",
                why: "No labels: find structure.",
              },
              {
                id: "game",
                label: "A program improves at a game by being rewarded for wins",
                category: "rl",
                why: "Learning from rewards.",
              },
              {
                id: "fraud",
                label: "Flag fraud using past transactions marked fraud or genuine",
                category: "sup",
                why: "Labelled outcomes.",
              },
              {
                id: "odd",
                label: "Spot unusual sensor readings with no examples of faults",
                category: "unsup",
                why: "Anomalies without labels.",
              },
            ]}
            explanation="With known answers to learn from: supervised. Without: unsupervised. Learning from rewards for actions: reinforcement."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Learn rules from examples", "Instead of writing them by hand."],
  ["Features and labels", "What you know, and what you want to predict."],
  ["Only as good as the examples", "More and better data, better model."],
  ["Three kinds", "Supervised, unsupervised, reinforcement."],
  ["Classic ML runs business", "Especially on tables of data."],
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
      <p>Next: how a real ML project unfolds, from question to production.</p>
    </StepLayout>
  );
}
