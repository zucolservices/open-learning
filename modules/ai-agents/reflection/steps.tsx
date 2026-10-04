"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CRITICS, rounds } from "./model";
import type { ReflectState } from "./state";

/* 1 ─ Writer and editor --------------------------------------------------------------------------- */

export function Editor() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Writer and editor"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">&ldquo;Is it good?&rdquo;</p>
            <p className="text-muted mt-1">
              A writer re-reading their own draft at midnight changes a comma, changes it back, and
              still isn&apos;t sure.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">&ldquo;Page 3 contradicts page 1.&rdquo;</p>
            <p className="text-muted mt-1">
              An editor with the facts, or a reader who tried the recipe, gives feedback the writer
              can act on.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Re-reading your own work only goes so far. Specific feedback from outside, an editor, a test
        reader, a recipe that didn&apos;t rise, is what really improves it.
      </p>
      <p>
        Agents work the same way. <Term id="agent-reflection">Reflection</Term> means checking the
        work and revising it. It helps most when the check is grounded in evidence: running the
        tests, searching for the fact, validating the output.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Add a critic ⭐ ----------------------------------------------------------------------------- */

export function AddCritic() {
  const [s, set] = useSceneState<ReflectState>();
  const rs = rounds(s.critic, s.max);
  const last = rs[rs.length - 1];
  const W = 420;
  const H = 150;
  const x = (i: number) => 20 + (i / 4) * (W - 40);
  const y = (p: number) => H - 15 - (p / 10) * (H - 30);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Add a critic"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Task: write a function that reads dates like &ldquo;3 Oct 2026&rdquo;,
            &ldquo;03-Oct-2026&rdquo; and &ldquo;2026/10/03&rdquo;. Ten tests.
          </p>
          <div className="flex flex-wrap items-center gap-1">
            {CRITICS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.critic === c.id}
                onClick={() => set({ critic: c.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.critic === c.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {c.label}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-xs">
              <span className="text-muted">max rounds</span>
              <input
                type="range"
                min={1}
                max={4}
                value={s.max}
                onChange={(e) => set({ max: Number(e.target.value) })}
                className="accent-accent w-24"
                aria-label="Maximum revision rounds"
              />
              <span className="font-mono">{s.max}</span>
            </label>
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Tests passing after each round"
            >
              <line
                x1={20}
                y1={y(10)}
                x2={W - 20}
                y2={y(10)}
                className="stroke-good"
                strokeDasharray="3 3"
              />
              <text x={W - 20} y={y(10) - 3} textAnchor="end" className="fill-good text-[10px]">
                all 10 pass
              </text>
              <polyline
                points={rs.map((r, i) => `${x(i)},${y(r.pass)}`).join(" ")}
                className="stroke-accent fill-none"
                strokeWidth={2}
              />
              {rs.map((r, i) => (
                <g key={i}>
                  <circle
                    cx={x(i)}
                    cy={y(r.pass)}
                    r={4}
                    className={r.pass === 10 ? "fill-good" : "fill-accent"}
                  />
                  <text
                    x={x(i)}
                    y={y(r.pass) - 7}
                    textAnchor="middle"
                    className="fill-fg font-mono text-[10px]"
                  >
                    {r.pass}
                  </text>
                  <text x={x(i)} y={H - 3} textAnchor="middle" className="fill-muted text-[10px]">
                    {i === 0 ? "draft" : `round ${i}`}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            {rs.map((r, i) => (
              <motion.p
                key={`${s.critic}-${i}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="text-xs"
              >
                <span className="text-muted font-mono">{i === 0 ? "draft" : `round ${i}`}: </span>
                {r.note}
              </motion.p>
            ))}
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              last.pass === 10 ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            {last.pass === 10
              ? `Done after ${rs.length - 1} rounds: the tests said so, so the loop stopped.`
              : s.critic === "self"
                ? "Going round in circles: without evidence, the critic can't tell better from worse, or when to stop."
                : "Shipped with 4 failing cases; nobody looked."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative run.</p>
        </div>
      }
    >
      <p>
        A coding agent writes a date parser. Try three critics. With none, the first draft ships.
        Asking the model to &ldquo;review your answer&rdquo; produces confident changes that
        sometimes break working cases. Running the tests gives specific feedback, and a clear signal
        to stop.
      </p>
      <p>
        This is Anthropic&apos;s <Term id="evaluator-optimizer">evaluator-optimiser</Term> pattern.
        Its guide stresses that agents should get &ldquo;ground truth&rdquo; from the environment at
        each step, such as tool results or running the code.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What the research found --------------------------------------------------------------------- */

export function Research() {
  const items: [string, string][] = [
    [
      "Reflexion (2023)",
      "After a failed attempt, the agent writes a note on what went wrong and tries again with it. GPT-4 reached 91% on a coding test vs 80% without; the feedback came from running tests it wrote itself.",
    ],
    [
      "Self-Refine (2023)",
      "Draft, critique, rewrite with one model: about 20 points better on average across seven tasks, mostly open-ended writing.",
    ],
    [
      "“Cannot self-correct reasoning yet” (2024)",
      "Without outside feedback, answers often got worse: GPT-4 on school maths fell from 95.5% to 89.0% after two rounds of self-review.",
    ],
    [
      "CRITIC (2024)",
      "Check the answer with a search engine or code interpreter before revising; outside evidence makes revision work.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the research found"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
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
        Four papers tell a consistent story. Reflection helps when it rests on real feedback, like
        test results or search results, and on open-ended tasks where any thoughtful revision tends
        to improve the writing.
      </p>
      <p>
        For reasoning with a right answer, a model re-checking itself without evidence is
        unreliable. These are 2023–24 results; newer models are better at self-checking, but
        evidence still beats opinion.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Loops that end ------------------------------------------------------------------------------ */

export function StopRules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Loops that end"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`for round in range(MAX_ROUNDS):          # 1. a hard limit
    draft = writer(task, feedback)
    result = run_tests(draft)              # 2. evidence, not opinion
    if result.all_passed:                  # 3. a clear finish line
        return draft
    feedback = result.failures             # 4. specific feedback
escalate_to_person(draft, result)          # 5. a way out`}</Code>
        </div>
      }
    >
      <p>
        A reflection loop needs a finish line it can recognise. Tests passing, a schema validating
        or a rubric being met are good ones. Without one, the model keeps &ldquo;improving&rdquo; or
        gives up at random.
      </p>
      <p>
        Add a maximum number of rounds and a fallback, such as handing the draft and the remaining
        failures to a person, so the loop always ends somewhere sensible.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Evidence or opinion? ------------------------------------------------------------------------ */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Evidence or opinion?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="reflect-evidence"
            prompt="Which feedback gives a reflection loop real evidence?"
            categories={[
              { id: "evidence", label: "Outside evidence" },
              { id: "opinion", label: "The model's own opinion" },
            ]}
            items={[
              {
                id: "tests",
                label: "Run the unit tests and return the failures",
                category: "evidence",
                why: "The code either passes or it doesn't.",
              },
              {
                id: "sure",
                label: "Ask “Are you sure?”",
                category: "opinion",
                why: "No new information; models may change correct answers.",
              },
              {
                id: "search",
                label: "Search for the claimed fact and compare",
                category: "evidence",
                why: "An outside source.",
              },
              {
                id: "reread",
                label: "“Re-read your answer and improve it”",
                category: "opinion",
                why: "Same knowledge, same blind spots.",
              },
              {
                id: "schema",
                label: "Validate the output against a JSON schema",
                category: "evidence",
                why: "A precise, checkable rule.",
              },
            ]}
            explanation="Tests, searches, compilers and validators give the agent evidence it didn't have. Asking it to reconsider gives it nothing new."
          />
        </div>
      }
    >
      <p>Sort the feedback.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Check, then revise", "Reflection improves work between attempts."],
  ["Evidence beats opinion", "Tests and tools, not “are you sure?”."],
  ["Notes carry lessons", "Write down what went wrong for next time."],
  ["A clear finish line", "Stop when the check passes."],
  ["Limits and a way out", "Cap rounds; hand over to a person."],
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
      <p>Next: what happens when steps fail, and how agents recover.</p>
    </StepLayout>
  );
}
