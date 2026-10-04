"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ANSWERS, GOLD, GRADERS, OUTPUTS, QUESTION, grade, passAtK, type GraderId } from "./model";
import type { CodeChecksState } from "./state";

/* 1 ─ The answer key ------------------------------------------------------------------------------ */

export function AnswerKey() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The answer key"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">MULTIPLE CHOICE</p>
            <p className="mt-1 font-mono text-sm">1 B · 2 D · 3 A · 4 C</p>
            <p className="text-muted mt-2">
              A machine marks 500 papers in seconds, the same way every time.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">ESSAY</p>
            <p className="mt-1 text-sm">&ldquo;Discuss the causes of the First World War.&rdquo;</p>
            <p className="text-muted mt-2">Needs a person, or a careful rubric.</p>
          </div>
        </div>
      }
    >
      <p>
        Teachers mark multiple-choice tests with an answer key, and essays by hand. AI answers are
        the same: when &ldquo;correct&rdquo; is precise, a program can grade it fast, cheaply and
        consistently.
      </p>
      <p>
        Is the number right? Is the output valid JSON? Does the generated code pass its{" "}
        <Term id="unit-test">tests</Term>? Use code checks wherever they fit, and save slower
        graders for what&apos;s left. But even simple checks have traps.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Graders a program can run ⭐ ---------------------------------------------------------------- */

export function Graders() {
  const [s, set] = useSceneState<CodeChecksState>();
  const g = GRADERS.find((x) => x.id === s.grader)!;
  const rows = ANSWERS.map((a) => ({ ...a, pass: grade(s.grader, a.text) }));
  const falseFail = rows.filter((r) => r.correct && !r.pass).length;
  const falsePass = rows.filter((r) => !r.correct && r.pass).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Graders a program can run"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {GRADERS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.grader === x.id}
                onClick={() => set({ grader: x.id as GraderId })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.grader === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">
            <span className="font-mono">{QUESTION}</span> Gold answer:{" "}
            <span className="font-mono">{GOLD}</span>. Grader: {g.how}.
          </p>
          <div className="border-line bg-surface flex flex-col rounded-lg border">
            {rows.map((r, i) => {
              const wrong = r.pass !== r.correct;
              return (
                <motion.div
                  key={i}
                  layout
                  className={cn(
                    "border-line grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-2 px-3 py-1.5 text-xs",
                    i > 0 && "border-t",
                    wrong && "bg-bad/10",
                  )}
                >
                  <span className="font-mono">{JSON.stringify(r.text)}</span>
                  <span
                    className={cn("text-center text-[11px]", r.pass ? "text-good" : "text-bad")}
                  >
                    {r.pass ? "pass" : "fail"}
                  </span>
                  <span className="text-muted text-center text-[10px]">
                    {r.correct ? "really right" : "really wrong"}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs">
            <span className={cn(falseFail ? "text-bad" : "text-good")}>
              {falseFail} right answer{falseFail === 1 ? "" : "s"} failed
            </span>{" "}
            ·{" "}
            <span className={cn(falsePass ? "text-bad" : "text-good")}>
              {falsePass} wrong answer{falsePass === 1 ? "" : "s"} passed
            </span>
          </p>
          <p className="text-subtle text-[10px]">Illustrative answers.</p>
        </div>
      }
    >
      <p>
        Seven answers to a simple question, and we know which are really right. Try each grader and
        count its mistakes.
      </p>
      <p>
        <Term id="exact-match">Exact match</Term> fails over a trailing newline; in 2023 a bug like
        that on a public leaderboard marked correct answers wrong. Normalising helps;
        &ldquo;contains&rdquo; passes a wrong answer that mentions the right number. No string check
        reads &ldquo;eighteen eighty-nine&rdquo;. Match the grader to the answer format, and ask for
        a fixed format in the prompt.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Shape isn't truth --------------------------------------------------------------------------- */

export function ShapeNotTruth() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Shape isn't truth"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code>{`schema: { refund_days: integer, currency: "INR" | "USD" }`}</Code>
          {OUTPUTS.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{o.label}</p>
              <p className="mt-1 font-mono text-[11px]">{o.json}</p>
              <p className="mt-1 flex flex-wrap gap-3 text-[11px]">
                <span className={o.schema ? "text-good" : "text-bad"}>
                  schema {o.schema ? "✓" : "✗"}
                </span>
                <span className={o.true_ ? "text-good" : "text-bad"}>
                  correct {o.true_ ? "✓" : "✗"}
                </span>
                <span className="text-muted">{o.note}</span>
              </p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Checking output against a <Term id="json-schema">JSON Schema</Term> is a great first gate:
        it catches broken, truncated or badly shaped output before anything else runs.
      </p>
      <p>
        But a schema checks shape, not truth. Structured-output features can make models follow a
        schema very reliably, yet the values inside can still be wrong. Pair format checks with
        checks on the values.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Running the code: pass@k -------------------------------------------------------------------- */

export function RunTheCode() {
  const [s, set] = useSceneState<CodeChecksState>();
  const n = 10;
  const p = passAtK(n, s.c, s.k);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Running the code: pass@k"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: n }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-7 flex-1 items-center justify-center rounded font-mono text-[10px]",
                  i < s.c ? "bg-good/30 text-good" : "bg-bad/20 text-bad",
                )}
              >
                {i < s.c ? "✓" : "✗"}
              </span>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            10 attempts at one problem, each run against its unit tests.
          </p>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24">attempts passing</span>
            <input
              type="range"
              min={0}
              max={n}
              value={s.c}
              onChange={(e) => set({ c: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Attempts passing"
            />
            <span className="w-8 font-mono">{s.c}</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24">tries allowed, k</span>
            <input
              type="range"
              min={1}
              max={n}
              value={s.k}
              onChange={(e) => set({ k: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Tries allowed"
            />
            <span className="w-8 font-mono">{s.k}</span>
          </label>
          <p className="text-sm">
            pass@{s.k} ={" "}
            <span className="text-accent font-mono text-lg">{(p * 100).toFixed(0)}%</span>
          </p>
          <Code>{`pass@k = 1 − C(n−c, k) / C(n, k)    # n samples, c passed`}</Code>
        </div>
      }
    >
      <p>
        For code, the best check is to run it. <Term id="pass-at-k">pass@k</Term> asks: if the model
        gets k tries, how likely is at least one to pass the tests? The Codex paper (2021) gave the
        standard way to estimate it from n samples, alongside its HumanEval set of 164 hand-written
        Python problems.
      </p>
      <p>
        SWE-bench grades real bug fixes the same way: the tests for the bug must now pass, and the
        tests that passed before must still pass. Note that pass@k flatters: users usually get one
        try.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Can code grade it? -------------------------------------------------------------------------- */

export function CodeOrJudgment() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Can code grade it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="code-or-judgment"
            prompt="Could a program grade each reliably?"
            categories={[
              { id: "code", label: "Code check" },
              { id: "judge", label: "Needs judgement" },
            ]}
            items={[
              {
                id: "json",
                label: "Is the output valid JSON with the right fields?",
                category: "code",
                why: "Schema validation.",
              },
              {
                id: "sql",
                label: "Does the generated SQL return the expected rows?",
                category: "code",
                why: "Run it and compare.",
              },
              {
                id: "kind",
                label: "Is the reply kind to an upset customer?",
                category: "judge",
                why: "Tone needs a rubric and a judge.",
              },
              {
                id: "label",
                label: "Did it pick the right category from a fixed list?",
                category: "code",
                why: "Exact match on a label.",
              },
              {
                id: "summary",
                label: "Does the summary capture the main points?",
                category: "judge",
                why: "Open-ended.",
              },
            ]}
            explanation="Fixed formats, numbers, labels and runnable code: use code. Open-ended qualities need a judge, covered next."
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
  ["Code first", "Fast, cheap and consistent where it fits."],
  ["Normalise before matching", "Spaces, case and punctuation trip exact match."],
  ["Contains is leaky", "It passes wrong answers that mention the right one."],
  ["Schemas check shape", "Not whether the values are true."],
  ["Run the code", "Unit tests; pass@k for k tries."],
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
        Next: metrics that compare an answer with a reference, and why they&apos;re easily fooled.
      </p>
    </StepLayout>
  );
}
