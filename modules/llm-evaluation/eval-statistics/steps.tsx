"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TRUE_P, needed, sampleScore, simple, wilson } from "./model";
import type { StatsState } from "./state";

/* 1 ─ An opinion poll ----------------------------------------------------------------------------- */

export function Poll() {
  return (
    <StepLayout
      eyebrow="Story"
      title="An opinion poll"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <p className="text-accent text-5xl font-semibold">42%</p>
          <p className="text-muted text-sm">± 3 points, 1,000 people asked</p>
          <p className="text-muted max-w-xs text-center text-xs">
            Nobody reads a poll as exactly 42%. Ask a different 1,000 people and you&apos;d get 40%
            or 44%.
          </p>
        </div>
      }
    >
      <p>
        Opinion polls always come with a margin of error, because they ask a sample, not everyone. A
        different sample gives a slightly different answer.
      </p>
      <p>
        An eval set is a sample too: a few hundred questions standing in for every question users
        might ask. So an eval score is an estimate, and it needs an error bar, a{" "}
        <Term id="confidence-interval">confidence interval</Term>, just like a poll.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch the score wobble ⭐ ------------------------------------------------------------------- */

export function Wobble() {
  const [s, set] = useSceneState<StatsState>();
  const scores = Array.from({ length: s.runs }, (_, i) => sampleScore(s.n, i + 1));
  const last = scores[scores.length - 1];
  const [lo, hi] = (s.wilson ? wilson : simple)(last, s.n);
  const X = (v: number) => `${Math.min(100, Math.max(0, ((v - 0.55) / 0.45) * 100))}%`;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Watch the score wobble"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted">questions</span>
              <input
                type="range"
                min={20}
                max={2000}
                step={20}
                value={s.n}
                onChange={(e) => set({ n: Number(e.target.value), runs: 1 })}
                className="accent-accent flex-1"
                aria-label="Questions"
              />
              <span className="w-12 font-mono">{s.n}</span>
            </label>
            <button
              type="button"
              onClick={() => set({ runs: Math.min(40, s.runs + 1) })}
              className="border-accent rounded-full border px-3 py-1"
            >
              Run on a fresh sample
            </button>
            <button
              type="button"
              onClick={() => set({ runs: Math.min(40, s.runs + 10) })}
              className="border-line rounded-full border px-3 py-1"
            >
              +10 runs
            </button>
          </div>
          <div className="border-line bg-surface relative h-28 rounded-lg border">
            <span
              className="border-good absolute top-0 bottom-0 border-l border-dashed"
              style={{ left: X(TRUE_P) }}
            >
              <span className="text-good absolute -top-0.5 left-1 text-[9px]">true 80%</span>
            </span>
            <motion.span
              className="bg-accent/15 border-accent absolute bottom-2 h-5 rounded border"
              animate={{ left: X(lo), width: `calc(${X(hi)} - ${X(lo)})` }}
            />
            {scores.map((v, i) => (
              <motion.span
                key={`${s.n}-${i}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "absolute h-2 w-2 -translate-x-1/2 rounded-full",
                  i === scores.length - 1 ? "bg-accent" : "bg-viz-data/60",
                )}
                style={{ left: X(v), top: `${12 + (i % 8) * 8}px` }}
              />
            ))}
            <span className="text-subtle absolute bottom-0.5 left-1 text-[9px]">55%</span>
            <span className="text-subtle absolute right-1 bottom-0.5 text-[9px]">100%</span>
          </div>
          <p className="text-sm">
            Latest: <span className="font-mono">{(last * 100).toFixed(1)}%</span>, 95% interval{" "}
            <span className="font-mono">
              {(lo * 100).toFixed(1)}–{(hi * 100).toFixed(1)}%
            </span>
            {hi > 1 && <span className="text-bad"> (above 100%: impossible)</span>}
          </p>
          <p className="text-muted text-xs">
            {s.runs > 1
              ? `${s.runs} runs: scores from ${(Math.min(...scores) * 100).toFixed(0)}% to ${(Math.max(...scores) * 100).toFixed(0)}%, though the system never changed.`
              : "Run it again on a fresh sample and see what changes."}
          </p>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.wilson}
              onChange={(e) => set({ wilson: e.target.checked })}
              className="accent-accent"
            />
            Use the Wilson interval (better for small samples and scores near 0% or 100%)
          </label>
        </div>
      }
    >
      <p>
        Behind this eval is a system that truly answers 80% of all possible questions correctly. Run
        the eval on a fresh sample of questions, again and again, and watch the score wobble. Then
        change the number of questions.
      </p>
      <p>
        For pass/fail scores, the <Term id="standard-error">standard error</Term> is √(p(1−p)/n),
        and a 95% interval is about ±2 of them: 82% on 100 questions is really &ldquo;82% ± 7.5
        points&rdquo;. On 1,000 questions it&apos;s about ±2.4.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How many questions do you need? ------------------------------------------------------------- */

export function HowMany() {
  const [s, set] = useSceneState<StatsState>();
  const un = needed(s.gap, false);
  const pa = needed(s.gap, true);
  return (
    <StepLayout
      eyebrow="Explore"
      title="How many questions do you need?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-32">difference to detect</span>
            <input
              type="range"
              min={1}
              max={10}
              value={s.gap}
              onChange={(e) => set({ gap: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Difference to detect"
            />
            <span className="w-14 font-mono">{s.gap} pts</span>
          </label>
          {[
            ["Two separate question sets", un],
            ["Same questions for both (paired)", pa],
          ].map(([k, v]) => (
            <div
              key={k as string}
              className="grid grid-cols-[11rem_1fr_5rem] items-center gap-2 text-xs"
            >
              <span className="text-muted">{k}</span>
              <div className="bg-surface-2 h-3 overflow-hidden rounded">
                <motion.div
                  animate={{ width: `${Math.min(100, ((v as number) / 6000) * 100)}%` }}
                  className="bg-viz-data h-full"
                />
              </div>
              <span className="text-right font-mono">{(v as number).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <p className="text-muted text-[11px]">
            Questions per version for about 80% power at 95% confidence, scores near 80%, paired
            correlation 0.5. Rough textbook approximations.
          </p>
          <Code>{`Halve the gap → about 4× the questions`}</Code>
        </div>
      }
    >
      <p>
        Before running an eval, ask what difference you need to detect. Telling apart versions 3
        points apart takes well over a thousand questions, even when both answer the same ones;
        halving the gap takes about four times as many.
      </p>
      <p>
        Running both versions on the same questions helps a lot, because they tend to get the same
        questions right and wrong. Module 10 builds on this.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reporting results honestly ------------------------------------------------------------------ */

export function Advice() {
  const items: [string, string][] = [
    ["Report the error bar", "Every score with its standard error or interval."],
    [
      "Cluster related questions",
      "Questions sharing one reading passage aren't independent; their error bars can be over three times larger.",
    ],
    ["Reduce noise", "Sample several answers per question and average them."],
    [
      "Compare question by question",
      "Paired differences between versions, not two separate scores.",
    ],
    ["Plan the size", "Work out how many questions you need before you run."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reporting results honestly"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{i + 1}</span>
              <span>
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In 2024 Evan Miller at Anthropic published &ldquo;Adding Error Bars to Evals&rdquo;, with
        five recommendations for model evaluations. They apply just as well to your own evals.
      </p>
      <p>
        When a score isn&apos;t a simple average, the <Term id="bootstrap">bootstrap</Term> works:
        resample your questions with replacement many times and read the interval from the spread.
        And don&apos;t lower the temperature just to make results look steadier.
      </p>
    </StepLayout>
  );
}

/* 5 ─ A real difference? -------------------------------------------------------------------------- */

export function Meaningful() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A real difference?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="meaningful"
            prompt="Is each difference clearly bigger than the noise?"
            categories={[
              { id: "yes", label: "Clearly real" },
              { id: "no", label: "Could be noise" },
            ]}
            items={[
              {
                id: "a",
                label: "82% vs 80%, 100 questions each",
                category: "no",
                why: "Each score is ±8 points.",
              },
              {
                id: "b",
                label: "82% vs 80%, 20,000 questions each",
                category: "yes",
                why: "Error bars under a point.",
              },
              {
                id: "c",
                label: "90% vs 70%, 100 questions each",
                category: "yes",
                why: "A 20-point gap dwarfs the noise.",
              },
              {
                id: "d",
                label: "75% vs 72%, 200 questions each",
                category: "no",
                why: "±6 points each.",
              },
              {
                id: "e",
                label: "A 1-point gain on a 50-question set",
                category: "no",
                why: "One question is 2 points.",
              },
            ]}
            explanation="Compare the gap with the error bars. Small eval sets can only detect large differences."
          />
        </div>
      }
    >
      <p>Sort the results.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A score is an estimate", "Your questions are a sample."],
  ["Add error bars", "±1.96 × √(p(1−p)/n) for pass/fail."],
  ["Small sets, big wobble", "100 questions: about ±8 points."],
  ["Wilson for edge cases", "Small n or scores near 0% or 100%."],
  ["Plan the size", "Smaller gaps need far more questions."],
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
      <p>Next: comparing two versions without fooling yourself.</p>
    </StepLayout>
  );
}
