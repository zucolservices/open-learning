"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEATS, REAL, lostSignal, measured } from "./model";
import type { LeakState } from "./state";

/* 1 ─ The horse that could count ------------------------------------------------------------------ */

export function CleverHans() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The horse that could count"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-5xl">🐴</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <motion.span
                key={n}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 * n }}
                className="bg-surface-2 rounded px-2 py-1 font-mono text-xs"
              >
                tap
              </motion.span>
            ))}
          </div>
          <p className="text-muted max-w-xs text-center text-xs">
            “What is 2 + 2?” Four taps. But only when the questioner knew the answer and stood in
            view.
          </p>
        </div>
      }
    >
      <p>
        In the early 1900s a horse called Clever Hans seemed to do arithmetic, tapping out answers
        with a hoof. A psychologist showed it was reading tiny cues from the questioner&apos;s face.
        With the questioner out of sight, the genius vanished.
      </p>
      <p>
        Models do this too. If training data contains a clue to the answer that won&apos;t exist in
        real use, the model learns the clue. That&apos;s <Term id="data-leakage">data leakage</Term>
        : brilliant test scores, then failure in production.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the leak ⭐ ---------------------------------------------------------------------------- */

export function FindLeak() {
  const [s, set] = useSceneState<LeakState>();
  const m = measured(s.removed, s.prepInside);
  const lost = lostSignal(s.removed);
  const pick = FEATS.find((f) => f.id === s.pick);
  const toggle = (id: string) =>
    set({
      removed: s.removed.includes(id) ? s.removed.filter((x) => x !== id) : [...s.removed, id],
      pick: id,
    });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find the leak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex flex-col gap-1 rounded-lg border px-3 py-2">
            <p className="text-subtle text-[10px]">
              FEATURE IMPORTANCE · CLICK A FEATURE TO INSPECT, TICK TO REMOVE
            </p>
            {FEATS.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-[1.25rem_11rem_1fr] items-center gap-2 text-xs"
              >
                <input
                  type="checkbox"
                  checked={s.removed.includes(f.id)}
                  onChange={() => toggle(f.id)}
                  className="accent-accent"
                  aria-label={`Remove ${f.name}`}
                />
                <button
                  type="button"
                  onClick={() => set({ pick: f.id })}
                  className={cn(
                    "truncate text-left font-mono text-[11px]",
                    s.removed.includes(f.id) && "text-subtle line-through",
                    s.pick === f.id && "text-accent",
                  )}
                >
                  {f.name}
                </button>
                <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: s.removed.includes(f.id) ? "0%" : `${f.importance * 200}%` }}
                    className="bg-viz-data h-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="border-line bg-surface min-h-12 rounded-lg border px-3 py-2 text-xs">
            {pick ? (
              <>
                <span className="font-mono">{pick.name}</span>: {pick.when}
              </>
            ) : (
              "Ask of each feature: could I really know this on the 1st of the month, when the prediction is made?"
            )}
          </p>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.prepInside}
              onChange={(e) => set({ prepInside: e.target.checked })}
              className="accent-accent"
            />
            Fit feature selection inside the pipeline, on training data only (it currently runs on
            all the data first)
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div
              className={cn(
                "rounded-lg border px-2.5 py-1.5",
                m - REAL > 0.04 ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="text-subtle text-[10px]">Test AUC you&apos;d report</p>
              <p className="font-mono text-lg">{m.toFixed(2)}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">AUC in production</p>
              <p className="font-mono text-lg">{REAL.toFixed(2)}</p>
            </div>
          </div>
          {lost.length > 0 && (
            <p className="text-viz-compute text-[11px]">
              You also removed {lost.join(", ")}, which was honest signal.
            </p>
          )}
          <p className="text-subtle text-[10px]">Illustrative numbers.</p>
        </div>
      }
    >
      <p>
        A churn model scores a test AUC of 0.99, far better than anything before. Before
        celebrating, inspect the features and remove any the model couldn&apos;t really know at
        prediction time. Then fix the preprocessing.
      </p>
      <p>
        Two kinds of leak are hiding. <Term id="target-leakage">Target leakage</Term>: features
        recorded after the outcome.{" "}
        <Term id="train-test-contamination">Train–test contamination</Term>: test rows influencing
        training, here through a city churn rate and feature selection computed on all the data.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Leaks in the wild --------------------------------------------------------------------------- */

export function Cases() {
  const items: [string, string][] = [
    [
      "Breast cancer contest, 2008",
      "In the KDD Cup, patient ID numbers predicted cancer: one ID range held 36% cancer cases against about 1–2% elsewhere, probably because data was merged from different hospitals. The winners found the leak and reported it.",
    ],
    [
      "COVID-19 scans, 2021",
      "A review of 62 studies found none ready for clinical use. Some models were really telling children from adults, because the “healthy” images came from young children.",
    ],
    [
      "Published science, 2023",
      "Kapoor and Narayanan found leakage affecting 294 papers across 17 fields. In one field, correcting it erased the fancy models' claimed edge over simple logistic regression.",
    ],
    [
      "Hospital records",
      "Predicting pneumonia with a “took antibiotics” feature: antibiotics are given because of pneumonia, so the feature arrives after the outcome.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Leaks in the wild"
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
        Leaks are rarely deliberate. Kaufman and colleagues, who wrote the classic paper on it, call
        leakage &ldquo;usually subtle and indirect&rdquo;. Their test is a &ldquo;no time
        machine&rdquo; rule: could I really know this value when I make the prediction?
      </p>
      <p>The tell-tale sign is a score that seems too good to be true. It usually is.</p>
    </StepLayout>
  );
}

/* 4 ─ Split first, then prepare ------------------------------------------------------------------- */

export function SplitFirst() {
  const [s, set] = useSceneState<LeakState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Split first, then prepare"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[false, true].map((inside) => (
              <button
                key={String(inside)}
                type="button"
                aria-pressed={s.demoInside === inside}
                onClick={() => set({ demoInside: inside })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.demoInside === inside ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {inside
                  ? "Select features inside the pipeline"
                  : "Select features on all data, then split"}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted">
              Labels are pure coin flips: nothing can truly predict them.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted w-20">accuracy</span>
              <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded">
                <motion.div
                  animate={{ width: `${s.demoInside ? 50 : 76}%` }}
                  className={cn("h-full", s.demoInside ? "bg-good" : "bg-bad")}
                />
              </div>
              <span className="w-10 font-mono">{s.demoInside ? "50%" : "76%"}</span>
            </div>
          </div>
          <Code>{`# leaky: the selector sees the test rows' labels
X_sel = SelectKBest(k=25).fit_transform(X, y)
X_train, X_test, ... = train_test_split(X_sel, y)

# safe: every step learns from training data only
model = make_pipeline(SelectKBest(k=25), GradientBoostingClassifier())
model.fit(X_train, y_train)`}</Code>
          <p className="text-subtle text-[10px]">
            Figures from scikit-learn&apos;s “Common pitfalls” demonstration.
          </p>
        </div>
      }
    >
      <p>
        scikit-learn&apos;s documentation has a striking demo: with labels that are pure chance,
        choosing features on all the data before splitting produced 76% &ldquo;accuracy&rdquo;. Done
        properly, it was 50%, exactly chance.
      </p>
      <p>
        The rule: split first, then learn every preprocessing step (scalers, encoders, feature
        selection) on training data only. A pipeline does this automatically, including inside
        cross-validation. For time-ordered data, also train on the past and test on the future.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Leak or safe? ------------------------------------------------------------------------------- */

export function LeakOrSafe() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Leak or safe?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="leak-or-safe"
            prompt="Predicting loan default at the moment of application. Is each feature safe?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "leak", label: "Leak" },
            ]}
            items={[
              {
                id: "income",
                label: "Declared income on the application",
                category: "safe",
                why: "Known when applying.",
              },
              {
                id: "collections",
                label: "Whether the account was sent to collections",
                category: "leak",
                why: "Happens after default.",
              },
              {
                id: "history",
                label: "Number of late payments on earlier loans",
                category: "safe",
                why: "Past behaviour, known at application.",
              },
              {
                id: "scaled",
                label: "Income scaled with a mean computed from all rows, test included",
                category: "leak",
                why: "Test data shaped training.",
              },
              {
                id: "restructured",
                label: "Whether the loan was later restructured",
                category: "leak",
                why: "Recorded after the outcome.",
              },
            ]}
            explanation="Ask whether you'd really know the value at prediction time, and whether test data touched any training step."
          />
        </div>
      }
    >
      <p>Sort the features.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Too good to be true", "Usually is: look for a leak."],
  ["No time machines", "Only data available at prediction time."],
  ["Split first", "Then learn every step on training data."],
  ["Use pipelines", "Including inside cross-validation."],
  ["Leaks are subtle", "IDs, merged sources, after-the-fact fields."],
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
      <p>Next: the simplest models of all, weighted sums.</p>
    </StepLayout>
  );
}
