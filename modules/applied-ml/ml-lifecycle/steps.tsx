"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, PHASES, upTo } from "./model";
import type { LifecycleState } from "./state";

/* 1 ─ Opening a bakery ---------------------------------------------------------------------------- */

export function Bakery() {
  const steps = [
    "Who are the customers?",
    "What do they buy?",
    "Buy and prep ingredients",
    "Bake",
    "Taste-test",
    "Open the doors",
    "Watch what sells, adjust",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Opening a bakery"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {steps.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                i === 3 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <span className="text-accent mr-2 font-mono">{i + 1}</span>
              {t}
              {i === 3 && <span className="text-muted"> — the part everyone pictures</span>}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Ask people what running a bakery involves and they picture baking. In reality most of the
        work is before and after: knowing your customers, sourcing ingredients, opening on time, and
        changing the menu when tastes change.
      </p>
      <p>
        Machine learning projects are the same. Training the model is the part everyone pictures,
        and it&apos;s one small step in a loop that starts with a business question and never really
        ends.
      </p>
    </StepLayout>
  );
}

const SHORT: Record<string, string> = {
  business: "business",
  data: "explore data",
  prep: "prepare",
  model: "model",
  eval: "evaluate",
  deploy: "deploy",
  monitor: "monitor",
};

/* 2 ─ A churn project, start to finish ⭐ --------------------------------------------------------- */

export function ChurnProject() {
  const [s, set] = useSceneState<LifecycleState>();
  const e = EVENTS[s.step];
  const { weeks, total } = upTo(s.step);
  const R = 70;
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="A churn project, start to finish"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[17rem_1fr]">
          <svg viewBox="0 0 220 200" className="mx-auto w-full max-w-[17rem]">
            <circle
              cx={110}
              cy={100}
              r={R}
              className="stroke-line-strong fill-none"
              strokeDasharray="3 3"
            />
            {PHASES.map((p, i) => {
              const a = (i / PHASES.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.round((110 + R * Math.cos(a)) * 10) / 10;
              const y = Math.round((100 + R * Math.sin(a)) * 10) / 10;
              const on = p.id === e.phase;
              return (
                <g key={p.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={on ? 9 : 6}
                    className={
                      on ? "fill-accent" : weeks[p.id] ? "fill-viz-data/60" : "fill-surface-2"
                    }
                  />
                  <text
                    x={x}
                    y={y + (y > 100 ? 18 : -12)}
                    textAnchor="middle"
                    className={cn("font-mono text-[7px]", on ? "fill-accent" : "fill-muted")}
                  >
                    {SHORT[p.id]}
                  </text>
                </g>
              );
            })}
            <text x={110} y={104} textAnchor="middle" className="fill-fg font-mono text-[9px]">
              week {total}
            </text>
          </svg>
          <div className="flex flex-col gap-3">
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-xs",
                e.loop ? "border-viz-compute bg-viz-compute/10" : "border-accent bg-accent-soft",
              )}
            >
              <p className="text-muted text-[10px] uppercase">
                {PHASES.find((p) => p.id === e.phase)?.name}
                {e.loop && " · looping back"}
              </p>
              <p className="mt-1 text-sm">{e.text}</p>
            </motion.div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={s.step === 0}
                onClick={() => set({ step: s.step - 1 })}
                className="border-line rounded-full border px-3 py-1 text-xs disabled:opacity-40"
              >
                ← Earlier
              </button>
              <button
                type="button"
                disabled={s.step === EVENTS.length - 1}
                onClick={() => set({ step: s.step + 1 })}
                className="border-accent rounded-full border px-3 py-1 text-xs disabled:opacity-40"
              >
                Later →
              </button>
              <span className="text-muted self-center text-[11px]">
                {s.step + 1} of {EVENTS.length}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-subtle text-[10px]">WHERE THE WEEKS WENT</p>
              {PHASES.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[9rem_1fr_2rem] items-center gap-2 text-[11px]"
                >
                  <span className="text-muted">{p.name}</span>
                  <div className="bg-surface-2 h-2 overflow-hidden rounded">
                    <motion.div
                      animate={{ width: `${(weeks[p.id] / 5) * 100}%` }}
                      className={cn("h-full", p.id === "model" ? "bg-accent" : "bg-viz-data")}
                    />
                  </div>
                  <span className="text-right font-mono">{weeks[p.id]}w</span>
                </div>
              ))}
            </div>
            <p className="text-subtle text-[10px]">An illustrative project.</p>
          </div>
        </div>
      }
    >
      <p>
        Follow a project to predict which subscribers will cancel, or <Term id="churn">churn</Term>.
        Step through it and watch two things: how often it loops back, and how few of the weeks go
        on modelling.
      </p>
      <p>
        The classic map is CRISP-DM (1996–2000), with six phases from business understanding to
        deployment. It says plainly that you&apos;ll move back and forth between them. Modern
        practice adds a seventh: monitoring after launch.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The model is a small box -------------------------------------------------------------------- */

export function SmallBox() {
  const boxes: [string, number, number, number, number][] = [
    ["Data collection", 0, 0, 34, 26],
    ["Data checks", 36, 0, 30, 26],
    ["Feature building", 68, 0, 32, 26],
    ["Configuration", 0, 28, 30, 22],
    ["ML code", 42, 36, 12, 10],
    ["Serving", 68, 28, 32, 22],
    ["Monitoring", 0, 52, 48, 22],
    ["Analysis tools", 50, 52, 50, 22],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The model is a small box"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="relative h-56 w-full">
            {boxes.map(([t, x, y, w, h], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.06 * i }}
                className={cn(
                  "absolute flex items-center justify-center rounded-lg border text-center text-[11px]",
                  t === "ML code"
                    ? "border-accent bg-accent text-accent-fg font-semibold"
                    : "border-line bg-surface",
                )}
                style={{
                  left: `${x}%`,
                  top: `${(y / 76) * 100}%`,
                  width: `${w}%`,
                  height: `${(h / 76) * 100}%`,
                }}
              >
                {t}
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            After Sculley et al. (2015); sizes are illustrative, not measured.
          </p>
        </div>
      }
    >
      <p>
        In 2015 Google engineers drew a now-famous picture of a real ML system: a tiny box of model
        code surrounded by much bigger ones for collecting, checking and serving data, and for
        monitoring the result.
      </p>
      <p>
        Preparing data is usually the biggest single slice of a data scientist&apos;s time. Surveys
        disagree on how big, from about 40% to 80%, but nobody finds it small.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where projects stall ------------------------------------------------------------------------ */

export function WhereFail() {
  const items: [string, string][] = [
    [
      "Only about half reach production",
      "Gartner surveys in 2019 and 2022 found about 53–54% of AI projects made it from pilot to production.",
    ],
    [
      "“Don't be afraid to launch without ML”",
      "Rule #1 of Google's Rules of Machine Learning. A simple rule is a fine first version and a baseline to beat.",
    ],
    [
      "Metrics before models",
      "Agree how you'll measure success, and keep the first model simple while you get the plumbing right.",
    ],
    [
      "Deployment isn't the end",
      "Models go stale as the world changes. MLOps applies DevOps habits to data and models: automated training, testing, deployment and monitoring.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where projects stall"
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
        Many ML projects never reach the people they were meant to help. The usual reasons
        aren&apos;t exotic algorithms: a vague question, messy data, a model nobody can act on, or
        no plan for running it.
      </p>
      <p>
        You&apos;ll often hear that 85% or 87% of projects fail. Those numbers don&apos;t hold up:
        one was a prediction about biased results, the other has no source. The honest picture is
        &ldquo;about half&rdquo;, which is still sobering. <Term id="mlops">MLOps</Term> exists to
        close that gap.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Put the phases in order --------------------------------------------------------------------- */

export function PhaseOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the phases in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="phase-order"
            prompt="Put a first pass through an ML project in order."
            items={[
              { id: "business", label: "Agree the business question and how success is measured" },
              { id: "data", label: "Explore what data exists and how good it is" },
              { id: "prep", label: "Clean and join the data; build features" },
              { id: "model", label: "Train and compare models against a simple baseline" },
              { id: "eval", label: "Check results against the business goal" },
              { id: "deploy", label: "Deploy, then monitor and retrain" },
            ]}
            explanation="That's CRISP-DM's order for a first pass, plus monitoring. In practice you'll loop back several times, as the churn project did."
          />
        </div>
      }
    >
      <p>Drag the steps into order, then check.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A loop, not a line", "Expect to go back to earlier phases."],
  ["Start with the question", "And a simple baseline."],
  ["Data takes the most time", "Modelling is a small slice."],
  ["About half reach production", "Plan for running it from day one."],
  ["Monitor after launch", "The world changes; models go stale."],
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
      <p>Next: turning a vague goal into a precise prediction problem.</p>
    </StepLayout>
  );
}
