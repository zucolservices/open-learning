"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AGENTS, pass } from "./model";
import type { EvalState } from "./state";

/* 1 ─ The driving test ---------------------------------------------------------------------------- */

export function DrivingTest() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The driving test"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["Did they arrive?", "Reaching the destination isn't enough…"],
            ["How did they drive?", "…a red light run on the way fails the test."],
            ["Every time?", "One good drive doesn't prove the next one will be."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A driving examiner doesn&apos;t just check that you reached the destination. They watch how
        you drove, and a single pass doesn&apos;t mean you&apos;ll never make a mistake.
      </p>
      <p>
        Agents need the same kind of test. An agent can reach the right answer by a dangerous route,
        or succeed once and fail the next time. Evaluating agents means checking the outcome, the{" "}
        <Term id="agent-trajectory">trajectory</Term> (the steps it took), the cost, and how
        reliably it does it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Score ten runs ⭐ --------------------------------------------------------------------------- */

export function ScoreRuns() {
  const [s, set] = useSceneState<EvalState>();
  const g = { path: s.path, budget: s.budget };
  const score = (k: "A" | "B") => AGENTS[k].filter((r) => pass(r, g).ok).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Score ten runs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Task: refund a damaged order. Company rule: verify the customer&apos;s identity before
            any refund. Two agents, five runs each.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-1.5 opacity-60">
              <input type="checkbox" checked disabled className="accent-accent" />
              Outcome: right refund in the database
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.path}
                onChange={(e) => set({ path: e.target.checked })}
                className="accent-accent"
              />
              Path: identity verified before refunding
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.budget}
                onChange={(e) => set({ budget: e.target.checked })}
                className="accent-accent"
              />
              Cost: at most 15k tokens
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["A", "B"] as const).map((k) => (
              <div
                key={k}
                className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3"
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">Agent {k}</p>
                  <p
                    className={cn(
                      "font-mono text-lg font-semibold",
                      score(k) >= 4 ? "text-good" : "text-bad",
                    )}
                  >
                    {score(k)}/5
                  </p>
                </div>
                {AGENTS[k].map((r, i) => {
                  const res = pass(r, g);
                  return (
                    <motion.div
                      key={`${k}-${i}-${s.path}-${s.budget}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className={cn(
                        "rounded-md border px-2 py-1 text-[10px]",
                        res.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                      )}
                    >
                      <span className="font-mono">{r.steps.join(" → ")}</span>
                      <span className="text-muted block">
                        {r.tokens}k tokens{res.ok ? "" : ` · fails: ${res.why}`}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Illustrative runs.</p>
        </div>
      }
    >
      <p>
        Judged on outcome alone, Agent A wins: four right refunds out of five. Now add the path
        check. Two of A&apos;s &ldquo;successes&rdquo; refunded without verifying who they were
        paying. Add a cost budget and B pays for its caution.
      </p>
      <p>
        No single number tells the story. Decide which properties matter, here a correct result, a
        required safety step and a budget, and grade each one.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Once, or every time? ------------------------------------------------------------------------ */

export function Reliability() {
  const [s, set] = useSceneState<EvalState>();
  const p = s.p / 100;
  const atLeastOne = 1 - Math.pow(1 - p, s.k);
  const all = Math.pow(p, s.k);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Once, or every time?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            ["p", "chance one try succeeds", s.p, 10, 99, "%"],
            ["k", "number of tries", s.k, 1, 10, ""],
          ].map(([key, l, v, min, max, unit]) => (
            <label key={key as string} className="flex items-center gap-2 text-xs">
              <span className="text-muted w-40">{l}</span>
              <input
                type="range"
                min={min as number}
                max={max as number}
                value={v as number}
                onChange={(e) => set({ [key as string]: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label={l as string}
              />
              <span className="w-10 font-mono">
                {v}
                {unit}
              </span>
            </label>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="font-mono text-2xl font-semibold">{Math.round(atLeastOne * 100)}%</p>
              <p className="text-muted text-xs">
                pass@{s.k}: at least one of {s.k} tries succeeds
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-4 py-3",
                all < 0.5 ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="font-mono text-2xl font-semibold">{Math.round(all * 100)}%</p>
              <p className="text-muted text-xs">
                pass^{s.k}: all {s.k} tries succeed
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        For a coding assistant you review, succeeding once in several tries may be fine: that&apos;s
        pass@k. For an agent that serves every customer, it must succeed every time: that&apos;s{" "}
        <Term id="pass-hat-k">pass^k</Term>, from Sierra&apos;s τ-bench (2024).
      </p>
      <p>
        At 75% per try, the chance of three successes in a row is about 42%. Small unreliability
        compounds, so evaluate every task several times, not once.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Benchmarks for agents ----------------------------------------------------------------------- */

export function Benchmarks() {
  const items: [string, string][] = [
    [
      "SWE-bench (2023)",
      "Fix real GitHub issues; hidden tests decide. A checked subset, SWE-bench Verified (2024), was the headline coding score until OpenAI stopped reporting it in Feb 2026: flawed tests and models that had seen the answers.",
    ],
    [
      "τ-bench (2024)",
      "A simulated customer and a policy; grading checks the final database state. τ²-bench (2025) makes the user act too.",
    ],
    [
      "GAIA, WebArena, OSWorld",
      "Assistant questions, realistic websites, and full desktop computers (2023–2024).",
    ],
    ["Terminal-Bench (2025)", "Real tasks in a command-line terminal."],
    [
      "METR time horizons",
      "How long a task (in human-expert time) agents can finish half the time: doubling about every 7 months from 2019, faster since 2023.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Benchmarks for agents"
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
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Public benchmarks compare agents on shared tasks, and they wear out: once models train on
        the answers, scores stop meaning much. Use them to shortlist, then test on your own tasks.
      </p>
      <p>
        Anthropic&apos;s January 2026 advice: start with 20–50 tasks drawn from real failures, grade
        outcomes rather than exact paths where you can, mix code-based, model-based and human
        grading, and read the transcripts. The LLM Evaluation track goes deeper.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Outcome or path? ---------------------------------------------------------------------------- */

export function OutcomeOrPath() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Outcome or path?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="outcome-or-path"
            prompt="Does each check look at the outcome or the path?"
            categories={[
              { id: "outcome", label: "Outcome" },
              { id: "path", label: "Path (trajectory)" },
            ]}
            items={[
              {
                id: "db",
                label: "The refund in the database is ₹1,200",
                category: "outcome",
                why: "The end state.",
              },
              {
                id: "verify",
                label: "Identity was verified before the refund",
                category: "path",
                why: "The order of steps.",
              },
              {
                id: "tests",
                label: "All tests pass after the fix",
                category: "outcome",
                why: "The result.",
              },
              {
                id: "nodelete",
                label: "The agent never called delete_account",
                category: "path",
                why: "What it did on the way.",
              },
              {
                id: "file",
                label: "The report file contains a summary table",
                category: "outcome",
                why: "The product.",
              },
            ]}
            explanation="Outcome checks look at the end state; path checks look at the steps. Grade outcomes by default, and check paths where the steps themselves matter, such as safety rules."
          />
        </div>
      }
    >
      <p>Sort the checks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Outcome first", "Did it produce the right result?"],
  ["Path where it matters", "Required or forbidden steps."],
  ["Cost counts", "Tokens and time per task."],
  ["Every time, not once", "pass^k for customer-facing agents."],
  ["Benchmarks wear out", "Test on your own tasks."],
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
      <p>Next: running agents day to day: cost, delay and tracing.</p>
    </StepLayout>
  );
}
