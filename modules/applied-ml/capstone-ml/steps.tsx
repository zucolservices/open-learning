"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DESIGN, INCIDENTS } from "./model";
import type { CapState } from "./state";

/* 1 ─ "Stop customers leaving" -------------------------------------------------------------------- */

export function Memo() {
  const bars: [string, number][] = [
    ["All customers", 26.5],
    ["Month-to-month", 43],
    ["Two-year contract", 3],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="“Stop customers leaving”"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 text-xs">
            <p className="text-muted text-[10px]">FROM: HEAD OF CUSTOMER SUCCESS</p>
            <p className="mt-2">
              &ldquo;Too many customers are leaving. My team can make 500 retention calls a week.
              Can a model tell us whom to call?&rdquo;
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-1">
            {bars.map(([t, v], i) => (
              <div
                key={t}
                className="grid grid-cols-[8rem_1fr_3rem] items-center gap-2 text-[11px]"
              >
                <span className="text-muted">{t}</span>
                <div className="bg-surface-2 h-2.5 rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v * 2}%` }}
                    transition={{ delay: 0.15 * i }}
                    className="bg-viz-data h-2.5 rounded"
                  />
                </div>
                <span className="text-right font-mono">{v}%</span>
              </div>
            ))}
            <p className="text-subtle text-[10px]">
              Share who left, in IBM&apos;s sample Telco dataset (7,043 made-up customers).
            </p>
          </div>
        </div>
      }
    >
      <p>
        You lead the ML work at a made-up phone and internet company. The practice data is modelled
        on IBM&apos;s sample Telco Customer Churn dataset: about one customer in four left, and
        contract type is a strong signal. Even this clean-looking file has surprises, such as 11
        customers with no total charge because they only just joined.
      </p>
      <p>
        First, five design choices that cover the whole track. Then five surprises, modelled on how
        real ML projects go wrong, and the fixes that address the cause. There are no scores: the
        surprises show what each choice leads to.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design the project -------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design the project"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DESIGN.map((d) => (
            <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">{d.prompt}</p>
              <div className="mt-1 flex flex-col gap-1">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={design[d.id] === c.id}
                    onClick={() => set({ design: { ...design, [d.id]: c.id } })}
                    className={cn(
                      "rounded border px-2 py-1 text-left text-[11px]",
                      design[d.id] === c.id ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-[11px]">
            {Object.keys(design).length} of 5 decided. Your choices decide which surprises the
            project brings.
          </p>
        </div>
      }
    >
      <p>
        Make the five calls. Each maps to a part of this track: framing and data, evaluation,
        turning predictions into action, serving, and monitoring.
      </p>
      <p>There are no right-answer ticks here. The next step shows what each choice leads to.</p>
    </StepLayout>
  );
}

/* 3 ─ Five surprises ⭐ --------------------------------------------------------------------------- */

export function Surprises() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  const fixes = s.fixes ?? {};
  const prevented = (id: string) => {
    const d = DESIGN.find((x) => x.prevents === id);
    return !!d && d.choices.find((c) => c.id === design[d.id])?.good;
  };
  const open = INCIDENTS.filter((i) => !prevented(i.id));
  const fixedOk = open.filter((i) => i.fixes.find((f) => f.id === fixes[i.id])?.good).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Five surprises"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {INCIDENTS.map((inc) => {
            const pre = prevented(inc.id);
            const f = inc.fixes.find((x) => x.id === fixes[inc.id]);
            return (
              <div
                key={inc.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  pre
                    ? "border-good/50 bg-good/5"
                    : !f
                      ? "border-bad bg-bad/10"
                      : f.good
                        ? "border-good bg-good/10"
                        : "border-viz-compute bg-viz-compute/10",
                )}
              >
                <p className="font-semibold">
                  {inc.title}{" "}
                  {pre && (
                    <span className="text-good text-[10px] font-normal">
                      · prevented by your design
                    </span>
                  )}
                </p>
                {!pre && (
                  <>
                    <p className="text-muted mt-0.5">{inc.detail}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {inc.fixes.map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={fixes[inc.id] === x.id}
                          onClick={() => set({ fixes: { ...fixes, [inc.id]: x.id } })}
                          className={cn(
                            "rounded border px-2 py-1 text-left text-[11px]",
                            fixes[inc.id] === x.id ? "border-accent bg-accent-soft" : "border-line",
                          )}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                    {f && (
                      <p className="text-muted mt-1 text-[11px]">
                        {f.good
                          ? "Fixed at the root. "
                          : "A patch: it will happen again in another form. "}
                        {inc.real}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            {5 - open.length} prevented by design · {fixedOk} of {open.length} remaining fixed at
            the root.
          </p>
        </div>
      }
    >
      <p>
        Five surprises, each modelled on how real ML projects go wrong. Some never happen, because
        your design caught them. For the rest, pick the fix that removes the cause rather than
        hiding the symptom.
      </p>
      <p>
        Notice the pattern in the weak fixes: patch the one bug you saw, find a nicer number, push
        harder on the same action. Root fixes change what data you use, what you measure, and how
        you ship and watch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It happened to them ------------------------------------------------------------------------- */

export function Happened() {
  const items: [string, string][] = [
    [
      "Zillow Offers, 2021",
      "Zillow shut its home-buying business after its price forecasts proved too unreliable in a fast-moving market, writing down about $304 million and planning to cut about a quarter of its staff. It also cited capacity and operational problems.",
    ],
    [
      "Google Flu Trends, 2011–13",
      "Estimating flu from search terms, it overestimated flu in 100 of 108 weeks from August 2011, at one point predicting more than double the CDC's level. Researchers argued such data should supplement traditional data, not replace it.",
    ],
    [
      "Amazon CV screening, reported 2018",
      "An experimental model trained on past hiring learned to mark down CVs containing the word “women's”. Amazon dropped it; according to Reuters' sources it was never used on its own to decide.",
    ],
    [
      "Apple Card, 2019–21",
      "After complaints that women got lower limits, New York's financial regulator found no unlawful discrimination, but criticised poor customer service and transparency. Being able to explain decisions matters.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happened to them"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Big companies with strong teams hit the same problems: a world that moved, data that
        drifted, labels that carried old bias, and decisions people couldn&apos;t get explained.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The whole track as a checklist -------------------------------------------------------------- */

export function Checklist() {
  const items: [string, string][] = [
    ["Framing", "The decision the model supports, the label, and a simple baseline."],
    ["Data", "Train, validation and test sets; split by time where time matters."],
    ["Leakage", "Every feature known at prediction time."],
    ["Model", "Start simple; then boosted trees; tune on validation data only."],
    ["Metrics", "Fit the decision: precision and recall at capacity, calibrated probabilities."],
    ["Explanations", "What the model relies on, and reasons for individual decisions."],
    ["Serving", "One feature definition; registry; shadow and canary."],
    ["Monitoring", "Drift, outcomes and a retraining plan, with an owner."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The whole track as a checklist"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        With this list, &ldquo;can a model help?&rdquo; becomes a project you can plan, test and
        trust, and <Term id="machine-learning">machine learning</Term> becomes one tool among
        several, used where it earns its place.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which part of the track? -------------------------------------------------------------------- */

export function WhereFrom() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which part of the track?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="capstone-ml-fixes"
            prompt="Which area does each fix come from?"
            categories={[
              { id: "data", label: "Framing and data" },
              { id: "eval", label: "Models and evaluation" },
              { id: "prod", label: "Production" },
            ]}
            items={[
              {
                id: "timestamps",
                label: "Check every feature's timestamp",
                category: "data",
                why: "Data leakage.",
              },
              {
                id: "baseline",
                label: "Compare against a contract-type rule",
                category: "data",
                why: "Framing: always have a baseline.",
              },
              {
                id: "capacity",
                label: "Precision at 500 calls a week",
                category: "eval",
                why: "Choosing metrics.",
              },
              {
                id: "control",
                label: "Hold out a random control group",
                category: "eval",
                why: "Measuring the effect of acting on predictions.",
              },
              {
                id: "shared",
                label: "One feature definition for training and scoring",
                category: "prod",
                why: "Serving.",
              },
              {
                id: "drift",
                label: "Monthly drift and outcome checks",
                category: "prod",
                why: "Monitoring.",
              },
            ]}
            explanation="Every fix traces back to a module: framing and data, models and evaluation, or production."
          />
        </div>
      }
    >
      <p>Sort the fixes.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Frame the decision", "Label, baseline, what action follows."],
  ["Guard against leakage", "Only what you'd know on the day."],
  ["Measure what matters", "Not accuracy by default."],
  ["Prediction isn't impact", "Test actions with a control group."],
  ["Ship one pipeline", "Same features in training and serving."],
  ["Keep watching", "The world moves; plan to retrain."],
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
      <p>
        That&apos;s the Applied ML track. You can take a business question to a model that is tested
        honestly, explained, served safely and watched over time.
      </p>
    </StepLayout>
  );
}
