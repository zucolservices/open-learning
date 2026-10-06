"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SLOTS } from "./model";
import type { FramingState } from "./state";

/* 1 ─ "I feel unwell" ----------------------------------------------------------------------------- */

export function Doctor() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“I feel unwell”"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
          {[
            ["Patient", "I feel unwell."],
            ["Doctor", "Since when? Where does it hurt? Any fever?"],
            ["Patient", "Three days. My throat. Yes, last night."],
            ["Doctor", "Let's test for a strep infection."],
          ].map(([w, t], i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 * i }}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-1.5",
                w === "Doctor"
                  ? "bg-accent-soft self-end"
                  : "bg-surface border-line self-start border",
              )}
            >
              <span className="text-muted mr-1 text-[11px]">{w}:</span>
              {t}
            </motion.p>
          ))}
        </div>
      }
    >
      <p>
        A good doctor doesn&apos;t treat &ldquo;I feel unwell&rdquo;. They ask questions until the
        problem is specific enough to test: which symptom, since when, how bad.
      </p>
      <p>
        ML projects arrive as &ldquo;reduce churn&rdquo; or &ldquo;use AI on our sales data&rdquo;.
        Framing turns that into a precise question a model can answer: what to predict, for whom,
        when, compared with what, and what will be done with the answer.
      </p>
    </StepLayout>
  );
}

/* 2 ─ From "reduce churn" to a prediction target ⭐ ---------------------------------------------- */

export function FrameIt() {
  const [s, set] = useSceneState<FramingState>();
  const picks = s.picks ?? {};
  const chosen = SLOTS.map((sl) => ({ sl, o: sl.options.find((o) => o.id === picks[sl.id]) }));
  const good = chosen.filter((c) => c.o?.kind === "good").length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="From “reduce churn” to a prediction target"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[1fr_15rem]">
          <div className="flex flex-col gap-2">
            {SLOTS.map((sl) => (
              <div
                key={sl.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{sl.name}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {sl.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={picks[sl.id] === o.id}
                      onClick={() => set({ picks: { ...picks, [sl.id]: o.id } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        picks[sl.id] === o.id
                          ? o.kind === "good"
                            ? "border-good bg-good/10"
                            : o.kind === "weak"
                              ? "border-viz-compute bg-viz-compute/10"
                              : "border-bad bg-bad/10"
                          : "border-line",
                      )}
                    >
                      {o.text}
                      {picks[sl.id] === o.id && (
                        <span className="text-muted mt-0.5 block text-[10px]">{o.why}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-accent bg-accent-soft self-start rounded-xl border px-3 py-3 text-xs">
            <p className="text-muted text-[10px]">PROBLEM STATEMENT</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {chosen.map(({ sl, o }) => (
                <li
                  key={sl.id}
                  className={cn(
                    !o && "text-subtle",
                    o?.kind === "bad" && "text-bad line-through",
                    o?.kind === "weak" && "text-viz-compute",
                  )}
                >
                  {o ? o.text : "…"}
                </li>
              ))}
            </ul>
            <p className="text-muted mt-3">
              {good} of {SLOTS.length} choices are ready to build on.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Marketing&apos;s brief is &ldquo;reduce churn&rdquo;. Build a problem statement one decision
        at a time, and read the feedback on each choice.
      </p>
      <p>
        Most ML problems are <Term id="classification">classification</Term> (pick a category),{" "}
        <Term id="regression">regression</Term> (predict a number) or{" "}
        <Term id="ranking">ranking</Term> (put a list in order). The right one depends on what
        action follows, which is why the business question comes first.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Beat the dumb baseline ---------------------------------------------------------------------- */

export function Baseline() {
  const [s, set] = useSceneState<FramingState>();
  const majority = 1 - s.rate;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Beat the dumb baseline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-32">customers who leave</span>
            <input
              type="range"
              min={0.02}
              max={0.5}
              step={0.01}
              value={s.rate}
              onChange={(e) => set({ rate: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Churn rate"
            />
            <span className="w-10 font-mono">{Math.round(s.rate * 100)}%</span>
          </label>
          {[
            ["“Nobody leaves” (always guess the common answer)", majority, "bg-muted/50"],
            [
              "Rule: no login for 21 days → will leave",
              Math.min(0.97, majority + 0.04),
              "bg-viz-data",
            ],
            ["Your new model", Math.min(0.98, majority + 0.05), "bg-accent"],
          ].map(([k, v, c]) => (
            <div
              key={k as string}
              className="grid grid-cols-[1fr_8rem_3rem] items-center gap-2 text-xs"
            >
              <span>{k}</span>
              <div className="bg-surface-2 h-3 overflow-hidden rounded">
                <motion.div
                  animate={{ width: `${(v as number) * 100}%` }}
                  className={cn("h-full", c as string)}
                />
              </div>
              <span className="text-right font-mono">{Math.round((v as number) * 100)}%</span>
            </div>
          ))}
          <p className="text-muted text-xs">
            Accuracy. With {Math.round(s.rate * 100)}% leaving, guessing &ldquo;nobody leaves&rdquo;
            is already {Math.round(majority * 100)}% accurate, and finds no one to save. The model
            must clearly beat the rule, on a measure that matters.
          </p>
          <p className="text-subtle text-[10px]">Illustrative.</p>
        </div>
      }
    >
      <p>
        Always start with a <Term id="baseline">baseline</Term>: the dumbest sensible answer, like
        always guessing the most common outcome, or a simple rule of thumb.
      </p>
      <p>
        Google&apos;s Rules of ML start with &ldquo;Don&apos;t be afraid to launch a product without
        machine learning.&rdquo; If a model can&apos;t clearly beat the rule, ship the rule. Module
        12 shows why accuracy is the wrong measure here anyway.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When the target is a stand-in --------------------------------------------------------------- */

export function Proxies() {
  const items: [string, string][] = [
    [
      "Health care, 2019",
      "A widely used US health-care algorithm predicted future health costs as a stand-in for health need. Less was spent on Black patients, so equally sick Black patients got lower scores. The researchers estimated fixing it would raise the share of Black patients flagged for extra help from 17.7% to 46.5%. Race wasn't an input: the bias came from the label.",
    ],
    [
      "Video, any year",
      "Predict “clicks play” as a stand-in for “enjoys it”, and you reward clickbait.",
    ],
    [
      "Netflix Prize, 2006–2009",
      "$1M for a 10% better rating prediction. Netflix used two simpler methods from early in the contest, but said the final winning blend's extra accuracy “did not seem to justify the engineering effort”.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the target is a stand-in"
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
        Often you can&apos;t measure what you really want, so you predict something measurable
        instead: a <Term id="proxy-label">proxy label</Term>. Every proxy has side effects, and some
        are harmful.
      </p>
      <p>
        And even a perfectly framed model is only worth it if someone acts on it and the gain
        justifies the cost of building and running it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Classification, regression or ranking? ------------------------------------------------------ */

export function WhichType() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Classification, regression or ranking?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-type"
            prompt="What kind of problem is each?"
            categories={[
              { id: "cls", label: "Classification" },
              { id: "reg", label: "Regression" },
              { id: "rank", label: "Ranking" },
            ]}
            items={[
              {
                id: "fraud",
                label: "Is this card payment fraud?",
                category: "cls",
                why: "A category: yes or no.",
              },
              {
                id: "price",
                label: "What will this flat sell for?",
                category: "reg",
                why: "A number.",
              },
              {
                id: "search",
                label: "Which 10 products to show first for “running shoes”",
                category: "rank",
                why: "An order.",
              },
              {
                id: "demand",
                label: "How many umbrellas will the store sell tomorrow?",
                category: "reg",
                why: "A number.",
              },
              {
                id: "ticket",
                label: "Which team should handle this support ticket?",
                category: "cls",
                why: "One of several categories.",
              },
              {
                id: "leads",
                label: "Which 50 sales leads to call first this week",
                category: "rank",
                why: "A limited list in order.",
              },
            ]}
            explanation="A category: classification. A number: regression. An order, often because capacity is limited: ranking."
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
  ["Make it precise", "What, for whom, when, over what window."],
  ["Pick the output type", "Classification, regression or ranking."],
  ["Use only past information", "As it will be at prediction time."],
  ["Beat a baseline", "Or ship the simple rule."],
  ["Watch your proxies", "And know the action that follows."],
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
      <p>Next: splitting the data so the score you report is honest.</p>
    </StepLayout>
  );
}
