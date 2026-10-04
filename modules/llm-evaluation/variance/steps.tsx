"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEYNMAN, TASKS, atLeastOnce, avg, everyTime, tryOk, width } from "./model";
import type { VarianceState } from "./state";

/* 1 ─ Free throws --------------------------------------------------------------------------------- */

export function FreeThrows() {
  const shots = [true, true, false, true, true, true, false, true];
  return (
    <StepLayout
      eyebrow="Story"
      title="Free throws"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex gap-1.5">
            {shots.map((ok, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.12 * i }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                  ok ? "bg-good/30 text-good" : "bg-bad/20 text-bad",
                )}
              >
                {ok ? "✓" : "✗"}
              </motion.span>
            ))}
          </div>
          <p className="text-muted text-xs">
            A 75% shooter: scores at least once in 8? Almost certainly. Scores all 8? About 1 in 10.
          </p>
        </div>
      }
    >
      <p>
        A basketball player who makes 75% of free throws will nearly always score at least once in
        eight attempts, and will rarely score all eight. Same player, two very different numbers.
      </p>
      <p>
        Language models are like that. Ask the same question twice and you may get different
        answers, so an eval must ask: do you need it right at least once, or right every time?
      </p>
    </StepLayout>
  );
}

/* 2 ─ Right every time? ⭐ ------------------------------------------------------------------------ */

export function EveryTime() {
  const [s, set] = useSceneState<VarianceState>();
  const once = avg((p) => atLeastOnce(p, s.k));
  const all = avg((p) => everyTime(p, s.k));
  const single = avg((p) => p);
  const pts = Array.from({ length: 8 }, (_, i) => i + 1);
  const X = (k: number) => 20 + ((k - 1) / 7) * 260;
  const Y = (v: number) => 110 - v * 95;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Right every time?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted">tries per task, k</span>
              <input
                type="range"
                min={1}
                max={8}
                value={s.k}
                onChange={(e) => set({ k: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Tries per task"
              />
              <span className="w-6 font-mono">{s.k}</span>
            </label>
            <button
              type="button"
              onClick={() => set({ seed: s.seed + 1 })}
              className="border-line rounded-full border px-3 py-1"
            >
              Rerun
            </button>
          </div>
          <div className="border-line bg-surface flex flex-col gap-0.5 rounded-lg border px-3 py-2">
            {TASKS.map((t, ti) => {
              const tries = Array.from({ length: s.k }, (_, a) => tryOk(ti, a, s.seed));
              const allOk = tries.every(Boolean);
              const anyOk = tries.some(Boolean);
              return (
                <div
                  key={t.name}
                  className="grid grid-cols-[1fr_auto_4rem] items-center gap-2 text-[11px]"
                >
                  <span className="truncate">{t.name}</span>
                  <span className="flex gap-0.5">
                    {tries.map((ok, a) => (
                      <span
                        key={a}
                        className={cn("h-3 w-3 rounded-sm", ok ? "bg-good/70" : "bg-bad/70")}
                      />
                    ))}
                  </span>
                  <span
                    className={cn(
                      "text-right text-[10px]",
                      allOk ? "text-good" : anyOk ? "text-viz-compute" : "text-bad",
                    )}
                  >
                    {allOk ? "every time" : anyOk ? "sometimes" : "never"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_12rem]">
            <svg viewBox="0 0 300 125" className="mx-auto w-full max-w-sm">
              <line x1={20} y1={110} x2={290} y2={110} className="stroke-line-strong" />
              <polyline
                fill="none"
                strokeWidth={2}
                className="stroke-viz-data"
                points={pts.map((k) => `${X(k)},${Y(avg((p) => atLeastOnce(p, k)))}`).join(" ")}
              />
              <polyline
                fill="none"
                strokeWidth={2}
                className="stroke-bad"
                points={pts.map((k) => `${X(k)},${Y(avg((p) => everyTime(p, k)))}`).join(" ")}
              />
              <line
                x1={X(s.k)}
                y1={10}
                x2={X(s.k)}
                y2={110}
                className="stroke-accent"
                strokeDasharray="3 3"
              />
              <text x={22} y={122} className="fill-muted font-mono text-[8px]">
                k = 1
              </text>
              <text x={262} y={122} className="fill-muted font-mono text-[8px]">
                k = 8
              </text>
            </svg>
            <div className="flex flex-col justify-center gap-1 text-xs">
              <p>
                <span className="text-muted">One try: </span>
                <span className="font-mono">{Math.round(single * 100)}%</span>
              </p>
              <p className="text-viz-data">
                pass@{s.k} (at least once):{" "}
                <span className="font-mono">{Math.round(once * 100)}%</span>
              </p>
              <p className="text-bad">
                pass^{s.k} (every time): <span className="font-mono">{Math.round(all * 100)}%</span>
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Expected rates from illustrative per-task success chances; the squares are one random
            run.
          </p>
        </div>
      }
    >
      <p>
        A support agent faces ten tasks, each with its own chance of success per try. Raise the
        number of tries and watch two measures pull apart.
      </p>
      <p>
        <Term id="pass-at-k">pass@k</Term> (at least one success in k) suits code with tests, where
        you keep the attempt that works. <Term id="pass-hat-k">pass^k</Term> (success on all k)
        suits an agent serving customers, who each get one try. In the 2024 τ-bench study, GPT-4o
        solved about 61% of retail tasks once, but under 25% eight times out of eight.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Same question, different answers ------------------------------------------------------------ */

export function SameQuestion() {
  const [s, set] = useSceneState<VarianceState>();
  const pick = FEYNMAN[s.asks % 3 === 2 ? 1 : 0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same question, different answers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted font-mono text-[11px]">
              “Tell me about Richard Feynman” · temperature 0
            </p>
            <motion.p
              key={s.asks}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1"
            >
              {pick.text}
            </motion.p>
          </div>
          <button
            type="button"
            onClick={() => set({ asks: s.asks + 1 })}
            className="border-accent self-start rounded-full border px-3 py-1 text-xs"
          >
            Ask again
          </button>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-subtle text-[10px]">Normal server</p>
              <p className="font-mono text-lg">80</p>
              <p className="text-muted text-[11px]">
                different answers from 1,000 identical requests
              </p>
            </div>
            <div className="border-good bg-good/10 rounded-lg border px-3 py-2">
              <p className="text-subtle text-[10px]">Batch-invariant code</p>
              <p className="font-mono text-lg">1</p>
              <p className="text-muted text-[11px]">all 1,000 identical, but slower</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Figures from Thinking Machines Lab (Sep 2025). The answers above are abbreviated.
          </p>
        </div>
      }
    >
      <p>
        Models choose each word by <Term id="sampling">sampling</Term> from a list of probabilities;
        the <Term id="temperature">temperature</Term> controls how adventurous that is. Even at
        temperature 0, hosted models often aren&apos;t perfectly repeatable.
      </p>
      <p>
        Thinking Machines Lab traced most of this to batching: your request is bundled with others,
        the bundle size changes with load, and that changes tiny rounding steps. In their test the
        answers matched for 102 tokens, then split between &ldquo;Queens, New York&rdquo; and
        &ldquo;New York City&rdquo;. Random seeds help only a little, and OpenAI has deprecated its
        seed option.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Run each case several times ----------------------------------------------------------------- */

export function SeveralRuns() {
  const [s, set] = useSceneState<VarianceState>();
  const opts = [1, 2, 3, 5, 10];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Run each case several times"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {opts.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={s.runs === r}
                onClick={() => set({ runs: r })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.runs === r ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {r} run{r > 1 ? "s" : ""}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {opts.map((r) => (
              <div key={r} className="grid grid-cols-[4rem_1fr_4rem] items-center gap-2 text-xs">
                <span className="text-muted">
                  {r} run{r > 1 ? "s" : ""}
                </span>
                <div className="bg-surface-2 relative h-3 rounded">
                  <motion.span
                    className={cn(
                      "absolute top-0 bottom-0 rounded",
                      r === s.runs ? "bg-accent/60" : "bg-viz-data/40",
                    )}
                    style={{ left: `${50 - width(r) * 6}%`, width: `${width(r) * 12}%` }}
                  />
                </div>
                <span className="text-right font-mono">±{(width(r) / 2).toFixed(1)}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            Error bar on the overall score, in points. Each extra run helps less than the last.
          </p>
          <p className="text-subtle text-[10px]">Illustrative.</p>
        </div>
      }
    >
      <p>
        Because answers vary, run each question several times and average its results before
        averaging across questions. That shrinks the error bar, quickly at first and then with
        diminishing returns: the questions themselves still vary.
      </p>
      <p>
        Resist lowering the temperature just to make scores look steadier. You&apos;d be measuring a
        system your users don&apos;t use.
      </p>
    </StepLayout>
  );
}

/* 5 ─ At least once, or every time? --------------------------------------------------------------- */

export function WhichMeasure() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="At least once, or every time?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-measure"
            prompt="Which measure fits each use?"
            categories={[
              { id: "at", label: "pass@k (at least once)" },
              { id: "hat", label: "pass^k (every time)" },
            ]}
            items={[
              {
                id: "code",
                label: "Generate 5 code fixes and keep the one that passes the tests",
                category: "at",
                why: "You keep the success.",
              },
              {
                id: "support",
                label: "A support agent handling thousands of customers",
                category: "hat",
                why: "Each customer gets one try.",
              },
              {
                id: "ideas",
                label: "Brainstorm 10 slogans for a person to choose from",
                category: "at",
                why: "One good one is enough.",
              },
              {
                id: "refund",
                label: "An agent that issues refunds without review",
                category: "hat",
                why: "It must be right every time.",
              },
            ]}
            explanation="If you can pick the best of several attempts, pass@k. If every attempt reaches a user, pass^k."
          />
        </div>
      }
    >
      <p>Sort the uses.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Answers vary", "Even at temperature 0, mostly from batching."],
  ["pass@k: at least once", "Rises with more tries."],
  ["pass^k: every time", "Falls with more tries; what customers feel."],
  ["Run cases several times", "Average per question; returns diminish."],
  ["Keep production settings", "Don't tune temperature for steadier scores."],
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
      <p>Next: the public benchmarks behind every model announcement.</p>
    </StepLayout>
  );
}
