"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CUSTOMERS, MONTHS, REAL, assign, evaluate, type Split } from "./model";
import type { SplitsState } from "./state";

/* 1 ─ A sealed exam ------------------------------------------------------------------------------- */

export function SealedExam() {
  const piles: [string, string, string][] = [
    ["Homework", "Learn from it, as often as you like", "Training set"],
    ["Mock exams", "Check progress and choose how to study", "Validation set"],
    ["The final exam", "Sealed until the end, opened once", "Test set"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="A sealed exam"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {piles.map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-xl border px-4 py-3 text-xs",
                i === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1">{d}</p>
              <p className="text-accent mt-2 font-mono text-[10px]">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        If students see the final exam questions while revising, their marks say nothing about what
        they&apos;ve learned. So teachers keep homework, mock exams and the final exam separate.
      </p>
      <p>
        Models are the same. They learn from a <Term id="training-set">training set</Term>, you
        choose settings using a <Term id="validation-set">validation set</Term>, and you report a{" "}
        <Term id="test-set">test set</Term> score the model never saw. But how you split matters as
        much as whether you split.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Random, time and group splits ⭐ ------------------------------------------------------------ */

const SPLITS: { id: Split; name: string; note: string }[] = [
  { id: "random", name: "Random rows", note: "Shuffle all 60 rows and hold out a quarter." },
  { id: "group", name: "By customer", note: "Hold out two whole customers." },
  {
    id: "time",
    name: "By time",
    note: "Train on months 1–5, test on month 6. Same customers, but only their past: just like real use.",
  },
];

export function ThreeSplits() {
  const [s, set] = useSceneState<SplitsState>();
  const a = assign(s.split);
  const r = evaluate(s.split);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Random, time and group splits"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {SPLITS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.split === x.id}
                onClick={() => set({ split: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.split === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{SPLITS.find((x) => x.id === s.split)?.note}</p>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <div className="grid grid-cols-[5rem_repeat(6,minmax(0,1fr))] gap-1 text-[10px]">
              <span />
              {Array.from({ length: MONTHS }, (_, m) => (
                <span key={m} className="text-subtle text-center">
                  month {m + 1}
                </span>
              ))}
              {Array.from({ length: CUSTOMERS }, (_, c) => (
                <div key={c} className="contents">
                  <span className="text-muted">customer {c + 1}</span>
                  {a[c].map((t, m) => (
                    <motion.span
                      key={`${s.split}-${m}`}
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      className={cn("h-4 rounded-sm", t ? "bg-accent" : "bg-viz-data/40")}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              <span className="bg-viz-data/40 mr-1 inline-block h-2 w-3 rounded-sm" />
              training <span className="bg-accent mr-1 ml-3 inline-block h-2 w-3 rounded-sm" />
              test
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
            {[
              [
                "Test rows whose customer is also in training",
                `${Math.round(r.leakCustomer * 100)}%`,
              ],
              ["Test rows older than some training rows", `${Math.round(r.leakFuture * 100)}%`],
              ["Score you'd report", `${Math.round(r.measured * 100)}%`],
              ["Real score next month", `${Math.round(REAL * 100)}%`],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  i === 2 && r.measured - REAL > 0.05
                    ? "border-bad bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                <p className="text-subtle text-[10px] leading-tight">{k}</p>
                <p className="font-mono">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Illustrative scores.</p>
        </div>
      }
    >
      <p>
        You have six months of records for ten customers and want to predict who will cancel next
        month. Try each way of splitting off a test set, and compare the score you&apos;d report
        with how the model will really do.
      </p>
      <p>
        A random split assumes every row is independent. Here they aren&apos;t: rows come in
        families (the same customer each month) and in time order. The model gets to learn about
        customers it&apos;s tested on, and from months after the ones it&apos;s tested on, so the
        score is too good to be true.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Validation and cross-validation ------------------------------------------------------------- */

export function CrossValidation() {
  const [s, set] = useSceneState<SplitsState>();
  const fold = Math.min(s.fold, s.k - 1);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Validation and cross-validation"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">folds, k</span>
            <input
              type="range"
              min={3}
              max={10}
              value={s.k}
              onChange={(e) => set({ k: Number(e.target.value), fold: 0 })}
              className="accent-accent flex-1"
              aria-label="Folds"
            />
            <span className="w-6 font-mono">{s.k}</span>
          </label>
          <div className="flex flex-col gap-1">
            {Array.from({ length: s.k }, (_, round) => (
              <button
                key={round}
                type="button"
                onClick={() => set({ fold: round })}
                className={cn(
                  "flex items-center gap-1 rounded px-1 py-0.5",
                  round === fold && "bg-accent-soft",
                )}
              >
                <span className="text-subtle w-14 text-left text-[10px]">round {round + 1}</span>
                {Array.from({ length: s.k }, (_, chunk) => (
                  <span
                    key={chunk}
                    className={cn(
                      "h-4 flex-1 rounded-sm",
                      chunk === round ? "bg-viz-compute" : "bg-viz-data/40",
                    )}
                  />
                ))}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">
            Each round trains on {s.k - 1} chunks and validates on the highlighted one. Average the{" "}
            {s.k} scores. The test set stays sealed throughout.
          </p>
          <Code>{`from sklearn.model_selection import cross_val_score, GroupKFold, TimeSeriesSplit
cross_val_score(model, X, y, cv=5)                        # plain k-fold
cross_val_score(model, X, y, cv=GroupKFold(5), groups=customer_id)
cross_val_score(model, X, y, cv=TimeSeriesSplit(5))       # past → future`}</Code>
        </div>
      }
    >
      <p>
        With little data, one validation slice is a noisy judge.{" "}
        <Term id="cross-validation">Cross-validation</Term> rotates it: split the training data into
        k chunks, train k times, and average. Five or ten folds is usual; scikit-learn&apos;s
        default is five.
      </p>
      <p>
        The same rules apply: group-aware folds for families of rows, forward-in-time folds for time
        series. And every time you peek at the test set and tweak, it wears out a little as a fair
        exam.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When splits went wrong ---------------------------------------------------------------------- */

export function RealCases() {
  const items: [string, string][] = [
    [
      "Chest X-rays, 2017",
      "The first preprint of CheXNet split 112,120 X-rays randomly by image, so one patient's scans could land on both sides. A revision 11 days later guaranteed no patient appeared in two splits.",
    ],
    [
      "COVID imaging models, 2021",
      "A review of 62 studies of COVID-19 diagnosis from scans found none of the models ready for clinical use. Among many problems, it asked authors to describe patient-level splits and warned about “Frankenstein” datasets stitched together from overlapping sources.",
    ],
    [
      "Rare classes",
      "If only 2% of rows are fraud, a random split can leave a fold with almost none. Stratify, so every split has its fair share of each class.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When splits went wrong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
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
        </div>
      }
    >
      <p>
        Medical imaging is where grouped data bites hardest: several scans per patient, and models
        that learn to recognise patients or hospitals rather than disease.
      </p>
      <p>
        The fix is simple once you see it: ask what a &ldquo;new case&rdquo; looks like in real use,
        and split so the test set looks like that.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which split? -------------------------------------------------------------------------------- */

export function WhichSplit() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which split?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-split"
            prompt="Which kind of split fits each dataset?"
            categories={[
              { id: "random", label: "Random (stratified)" },
              { id: "group", label: "By group" },
              { id: "time", label: "By time" },
            ]}
            items={[
              {
                id: "sales",
                label: "Daily sales, to forecast next month",
                category: "time",
                why: "Train on the past, test on the future.",
              },
              {
                id: "patients",
                label: "Several X-rays per patient",
                category: "group",
                why: "Keep each patient on one side.",
              },
              {
                id: "survey",
                label: "One independent survey answer per person, 3% positive",
                category: "random",
                why: "Rows are independent; stratify the rare class.",
              },
              {
                id: "stores",
                label: "Weekly records per store, to predict for new stores",
                category: "group",
                why: "New stores means unseen groups.",
              },
              {
                id: "fraud",
                label: "Card transactions, to catch next week's fraud",
                category: "time",
                why: "Fraud patterns change over time.",
              },
            ]}
            explanation="Ask what a new case looks like in real use: a later date, an unseen customer or store, or just another independent row."
          />
        </div>
      }
    >
      <p>Sort the datasets.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Three piles", "Train, validate, test once."],
  ["Split like real use", "Future dates, unseen groups."],
  ["Random splits can lie", "When rows aren't independent."],
  ["Cross-validate small data", "k folds, averaged."],
  ["Stratify rare classes", "So each split has some."],
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
      <p>Next: turning raw columns into features a model can use.</p>
    </StepLayout>
  );
}
