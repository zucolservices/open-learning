"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ReasonState } from "./state";

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 1 ─ Answer fast ------------------------------------------------------------------------------------- */

export function Puzzle() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Answer fast"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="bat-ball"
            prompt="A cup of chai and a samosa cost ₹110 together. The chai costs ₹100 more than the samosa. How much is the samosa? (Answer quickly!)"
            min={0}
            max={60}
            step={1}
            unit=" rupees"
            answer={5}
            tolerance={0}
            explanation="₹5. If the samosa were ₹10, the chai would be ₹110 and the total ₹120. With samosa = x: x + (x + 100) = 110, so x = 5. Most people's first instinct is ₹10; writing the steps out catches the mistake."
          />
        </div>
      }
    >
      <p>
        A classic puzzle, in rupees. Don&apos;t work it out carefully: give your first instinct.
      </p>
      <p className="text-muted text-sm">
        Psychologists call the fast, intuitive answer &ldquo;System 1&rdquo; and slow, careful
        working &ldquo;System 2&rdquo;. Language models have a similar split.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Thinking out loud ⭐ -------------------------------------------------------------------------- */

const TRACE: { line: string; note: string }[] = [
  {
    line: "The samosa is probably ₹10.",
    note: "The one-shot answer: the model writes its first, most likely guess, just like a person answering fast.",
  },
  {
    line: "Check: samosa ₹10, then chai = 10 + 100 = ₹110.",
    note: "A reasoning model instead writes out checks before committing. Every word it writes becomes context for the next.",
  },
  {
    line: "Total = 10 + 110 = ₹120. That's not ₹110. Wait.",
    note: "Having written the numbers down, the mistake is visible to the model itself. Reasoning traces often contain “wait” moments like this.",
  },
  {
    line: "Let samosa = x. Then x + (x + 100) = 110, so 2x = 10, x = 5.",
    note: "It tries another approach. Each step is simple; the chain gets it right.",
  },
  {
    line: "Answer: the samosa is ₹5.",
    note: "The final answer comes after the thinking. The thinking cost about 60 extra tokens here; on hard problems it can be tens of thousands.",
  },
];

export function ThinkingOutLoud() {
  const [s, set] = useSceneState<ReasonState>();
  const step = Math.min(s.traceFrame, TRACE.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Thinking out loud"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface min-h-44 rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px] tracking-wide uppercase">Thinking</p>
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {TRACE.slice(0, step + 1).map((t, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "font-mono text-xs",
                      i === 0 && step > 0 && "text-muted line-through",
                      i === 2 && "text-bad",
                      i === TRACE.length - 1 && "text-good font-semibold",
                    )}
                  >
                    {t.line}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <Stepper step={step} count={TRACE.length} onChange={(n) => set({ traceFrame: n })} />
          <FrameCaption
            frameKey={step}
            title={
              step === 0
                ? "Answer at once"
                : step === TRACE.length - 1
                  ? "Then answer"
                  : "Keep thinking"
            }
          >
            {TRACE[step].note}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A model can&apos;t think silently between tokens: all its &ldquo;working&rdquo; has to be
        written as tokens. So <Term id="reasoning-model">reasoning models</Term> write a{" "}
        <Term id="chain-of-thought">chain of thought</Term> first, and the answer second.
      </p>
      <p>Step through an illustrative trace for the samosa puzzle.</p>
      <p className="text-muted text-sm">
        Asking any model to &ldquo;think step by step&rdquo; helps a little (a 2022 finding).
        Reasoning models are trained to do it well, often for thousands of tokens, and many hide or
        summarise the raw thinking.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How long should it think? ⭐ ------------------------------------------------------------------- */

const BUDGETS = [0, 1000, 4000, 16000, 64000];
const TASKS: Record<
  ReasonState["task"],
  { label: string; base: number; gain: number; cap: number; note: string }
> = {
  lookup: {
    label: "Look up a fact",
    base: 0.9,
    gain: 0.004,
    cap: 0.92,
    note: "Either the model knows the fact or it doesn't; thinking longer barely helps and only adds wait and cost.",
  },
  maths: {
    label: "Olympiad maths",
    base: 0.12,
    gain: 0.155,
    cap: 0.85,
    note: "Hard multi-step problems gain a lot: each doubling of thinking buys more accuracy, up to a point.",
  },
  writing: {
    label: "Write a poem",
    base: 0.7,
    gain: 0.02,
    cap: 0.76,
    note: "Quality is taste, not a checkable answer; extra thinking helps little.",
  },
};
const TOK_PER_S = 80;
const PRICE_PER_M = 10; // illustrative $ per million output tokens

function accuracy(task: ReasonState["task"], thinking: number) {
  const t = TASKS[task];
  if (thinking === 0) return t.base;
  return Math.min(t.cap, t.base + t.gain * Math.log2(1 + thinking / 250));
}

export function Budget() {
  const [s, set] = useSceneState<ReasonState>();
  const t = TASKS[s.task];
  const thinking = BUDGETS[s.budget];
  const acc = accuracy(s.task, thinking);
  const secs = (thinking + 300) / TOK_PER_S;
  const cost = ((thinking + 300) / 1e6) * PRICE_PER_M;
  const W = 360;
  const H = 110;
  const x = (i: number) => 30 + (i / (BUDGETS.length - 1)) * (W - 40);
  const y = (v: number) => H - 16 - v * (H - 26);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="How long should it think?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.task}
            options={(Object.keys(TASKS) as ReasonState["task"][]).map(
              (k) => [k, TASKS[k].label] as [string, string],
            )}
            onChange={(v) => set({ task: v as ReasonState["task"] })}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Thinking budget</span>
            <Segmented
              size="sm"
              value={String(s.budget)}
              options={BUDGETS.map(
                (b, i) => [String(i), b === 0 ? "none" : `${b / 1000}k tokens`] as [string, string],
              )}
              onChange={(v) => set({ budget: Number(v) })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Accuracy against thinking budget"
            >
              {(Object.keys(TASKS) as ReasonState["task"][]).map((k) => (
                <path
                  key={k}
                  d={BUDGETS.map(
                    (b, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(accuracy(k, b))}`,
                  ).join(" ")}
                  fill="none"
                  stroke={k === s.task ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={k === s.task ? 2 : 1}
                />
              ))}
              <motion.circle
                r={4.5}
                fill="var(--accent)"
                initial={false}
                animate={{ cx: x(s.budget), cy: y(acc) }}
              />
              {BUDGETS.map((b, i) => (
                <text
                  key={b}
                  x={x(i)}
                  y={H - 3}
                  textAnchor="middle"
                  className="fill-subtle text-[7px]"
                >
                  {b === 0 ? "none" : `${b / 1000}k`}
                </text>
              ))}
              {[0, 0.5, 1].map((v) => (
                <text
                  key={v}
                  x={26}
                  y={y(v) + 3}
                  textAnchor="end"
                  className="fill-subtle text-[7px]"
                >
                  {v * 100}%
                </text>
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Accuracy" value={`${Math.round(acc * 100)}%`} />
            <Stat
              label="Time to answer"
              value={secs < 60 ? `${secs.toFixed(0)} s` : `${(secs / 60).toFixed(1)} min`}
              bad={secs > 60}
            />
            <Stat label="Cost per question" value={`$${cost.toFixed(3)}`} bad={cost > 0.1} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.task}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {t.note}
            </motion.p>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            Illustrative curves: {TOK_PER_S} tokens a second and ${PRICE_PER_M} per million output
            tokens assumed. Grey lines: the other two tasks. The maths curve is shaped like
            OpenAI&apos;s published o1 results.
          </p>
        </div>
      }
    >
      <p>
        Thinking is paid for in tokens: more time, more money.{" "}
        <Term id="test-time-compute">Test-time compute</Term> is the new dial: spend more of it on
        problems that reward it.
      </p>
      <p>Change the task and the budget. Where is extra thinking worth it?</p>
      <p className="text-muted text-sm">
        A real anchor: OpenAI&apos;s o1 (September 2024) solved 74% of AIME 2024 maths problems in
        one attempt, against 12% for GPT-4o, and did better the longer it thought.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Training a reasoner --------------------------------------------------------------------------- */

const RL: { title: string; text: string }[] = [
  {
    title: "Problems with checkable answers",
    text: "Maths with known answers, code with tests: a computer can tell whether the final answer is right, no human needed.",
  },
  {
    title: "Many attempts per problem",
    text: "The model writes several full attempts (thinking + answer) for the same problem.",
  },
  {
    title: "Score them automatically",
    text: "Right answers get reward 1, wrong answers 0 (plus small rewards for a clean format).",
  },
  {
    title: "Reinforce the better-than-average",
    text: "DeepSeek's GRPO compares each attempt with the group's average and makes above-average reasoning more likely. No reward model needed for these tasks.",
  },
  {
    title: "Thinking emerges",
    text: "DeepSeek-R1-Zero (January 2025) learned this way from a base model with no examples of reasoning: its thoughts grew longer and it began checking itself (“wait…”) on its own.",
  },
];

export function Training() {
  const [s, set] = useSceneState<ReasonState>();
  const step = Math.min(s.rlFrame, RL.length - 1);
  const f = RL[step];
  const attempts = [
    { ok: true, len: 0.7 },
    { ok: false, len: 0.3 },
    { ok: true, len: 0.9 },
    { ok: false, len: 0.5 },
  ];
  return (
    <StepLayout
      eyebrow="Step through"
      title="How reasoning is trained"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid gap-1.5 rounded-xl border p-3">
            <p className="font-mono text-xs">Problem: 2x + 100 = 110. Find x.</p>
            {attempts.map((a, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: step >= 1 ? 1 : 0.15 }}
                className="flex items-center gap-2 text-xs"
              >
                <span className="text-muted w-16 shrink-0">attempt {i + 1}</span>
                <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                  <span
                    className="bg-viz-data/60 absolute inset-y-0 left-0 rounded"
                    style={{ width: `${a.len * 100}%` }}
                  />
                </span>
                <span
                  className={cn(
                    "w-14 text-right font-mono",
                    step >= 2 ? (a.ok ? "text-good" : "text-bad") : "text-subtle",
                  )}
                >
                  {step >= 2 ? (a.ok ? "x = 5 ✓" : "x = 10 ✗") : "…"}
                </span>
                <span className="w-16 text-right font-mono text-[10px]">
                  {step >= 3 ? (a.ok ? "↑ more likely" : "↓ less") : ""}
                </span>
              </motion.div>
            ))}
          </div>
          <Stepper step={step} count={RL.length} onChange={(n) => set({ rlFrame: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        How do you teach a model to reason without writing out millions of worked solutions? Let it
        try, check the answers automatically, and reinforce what worked: reinforcement learning with
        verifiable rewards.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: worth thinking? --------------------------------------------------------------------- */

export function WorthIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Worth thinking hard?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="worth-thinking"
            prompt="Should each job use a high thinking budget?"
            categories={[
              { id: "think", label: "Think hard" },
              { id: "fast", label: "Answer fast" },
            ]}
            items={[
              {
                id: "debug",
                label: "Find the bug in a tricky concurrency issue",
                category: "think",
                why: "Multi-step analysis where checking your working pays off.",
              },
              {
                id: "sentiment",
                label: "Tag the sentiment of 2 million reviews",
                category: "fast",
                why: "Easy per item and huge in volume: thinking would multiply cost for little gain.",
              },
              {
                id: "plan",
                label: "Plan a 5-city trip within a budget and dates",
                category: "think",
                why: "Many constraints to satisfy and verify.",
              },
              {
                id: "greet",
                label: "Translate 'good morning' into Tamil",
                category: "fast",
                why: "Known or not; thinking won't help much.",
              },
              {
                id: "proof",
                label: "Check a financial model's formulas for errors",
                category: "think",
                why: "Careful step-by-step checking is exactly what reasoning buys.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Reasoning is a cost you choose per request. Choose it where it pays.</p>
    </StepLayout>
  );
}

/* 6 ─ Controls you'll meet --------------------------------------------------------------------------- */

const CONTROLS: [string, string][] = [
  ["OpenAI", "reasoning_effort (none, minimal, low, medium, high, xhigh, max)."],
  [
    "Anthropic",
    "Adaptive thinking with an effort setting (low to max); fixed token budgets are the older style.",
  ],
  [
    "Google Gemini",
    "thinking_level (minimal to high, by model); thinking_budget is the older style.",
  ],
  [
    "DeepSeek",
    "reasoning_effort in thinking mode; the R1 paper made reasoning training widely reproducible.",
  ],
];

export function Controls() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Thinking dials you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {CONTROLS.map(([k, d], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{k}</p>
              <p className="text-muted mt-0.5 font-mono text-[11px]">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every major provider now lets you set how hard the model thinks, in slightly different ways.
      </p>
      <p className="text-muted text-sm">
        As of September 2026. Reasoning tokens are billed as output tokens even when you don&apos;t
        see them.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Thinking is written", "Models reason by generating tokens before the answer."],
  ["Test-time compute", "More thinking tokens can buy accuracy on hard, checkable problems."],
  ["Trained with checkable rewards", "Try, verify, reinforce: reasoning emerges."],
  ["Not free", "Thinking costs time and money; easy tasks gain little."],
  ["A dial per request", "Effort settings let you choose where to spend it."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([tt, d], i) => (
            <motion.div
              key={tt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{tt}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>That completes how models learn.</p>
      <p>Next chapter: using models well, starting with prompting.</p>
    </StepLayout>
  );
}
