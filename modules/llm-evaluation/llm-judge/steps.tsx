"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { N, cause, judge, type Fixes } from "./model";
import type { JudgeState } from "./state";

/* 1 ─ A food critic with habits ------------------------------------------------------------------- */

export function TheCritic() {
  const habits: [string, string][] = [
    ["Always prefers the first dish served", "position"],
    ["Thinks bigger portions taste better", "length"],
    ["Rates their own restaurant's dishes higher", "self-preference"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="A food critic with habits"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {habits.map(([t, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span>{t}</span>
              <span className="bg-viz-compute/20 rounded-full px-2 py-0.5 text-[10px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A famous food critic can taste a hundred dishes a day, far more than any panel of diners.
        But this critic has habits: they favour the first plate, bigger portions, and dishes from
        their own kitchen.
      </p>
      <p>
        An <Term id="llm-judge">LLM judge</Term> is that critic: a language model grading other
        models&apos; answers, quickly and cheaply. It&apos;s the most popular way to grade
        open-ended answers, and it has the same habits. This module is about catching them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Catch the biased judge ⭐ ------------------------------------------------------------------- */

const FIXES: [keyof Fixes, string][] = [
  ["swap", "Judge both orders; a verdict that flips is a tie"],
  ["rubric", "Rubric: judge accuracy and helpfulness, not length"],
  ["otherFamily", "Use a judge from a different model family"],
  ["reference", "Give the judge a reference answer for fact questions"],
  ["reason", "Let the judge reason before giving a verdict"],
];

export function BiasedJudge() {
  const [s, set] = useSceneState<JudgeState>();
  const v = judge(s.fixes);
  const agree = v.filter((x) => x === "agree").length;
  const dis = v.filter((x) => x === "disagree").length;
  const tie = N - agree - dis;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Catch the biased judge"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {FIXES.map(([k, l]) => (
              <label
                key={k}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                  s.fixes[k] ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.fixes[k]}
                  onChange={(e) => set({ fixes: { ...s.fixes, [k]: e.target.checked } })}
                  className="accent-accent mt-0.5"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-10 gap-1">
            {v.map((x, i) => (
              <motion.button
                key={i}
                type="button"
                aria-label={`Pair ${i + 1}`}
                onClick={() => set({ pick: i })}
                animate={{ scale: s.pick === i ? 1.15 : 1 }}
                className={cn(
                  "h-6 rounded",
                  x === "agree" ? "bg-good/60" : x === "disagree" ? "bg-bad" : "bg-muted/40",
                  s.pick === i && "ring-fg ring-2",
                )}
              />
            ))}
          </div>
          <div className="text-xs">
            <span className="text-good">{agree} agree with experts</span> ·{" "}
            <span className="text-bad">{dis} disagree</span> ·{" "}
            <span className="text-muted">{tie} ties (order changed the verdict)</span>
          </div>
          <p className="border-line bg-surface min-h-10 rounded-lg border px-3 py-2 text-xs">
            {s.pick === null
              ? "Click a red square to see why the judge got it wrong."
              : v[s.pick] === "disagree"
                ? `Pair ${s.pick + 1}: likely cause — ${cause(s.pick, s.fixes)}.`
                : v[s.pick] === "tie"
                  ? `Pair ${s.pick + 1}: the verdict flipped when the order was swapped, so it isn't trustworthy.`
                  : `Pair ${s.pick + 1}: the judge agreed with the experts.`}
          </p>
          <p className="text-subtle text-[10px]">
            40 illustrative answer pairs with expert verdicts.
          </p>
        </div>
      }
    >
      <p>
        A judge compares 40 pairs of answers that experts have already ranked. Out of the box it
        agrees with them not much more often than a coin. Switch on the fixes and click red squares
        to see what went wrong.
      </p>
      <p>
        These biases are documented: in one 2023 study, simply swapping the order of two answers
        changed a judge&apos;s verdict on most questions. Swapping doesn&apos;t remove{" "}
        <Term id="position-bias">position bias</Term>; it exposes it, so you can count those
        verdicts as ties.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three ways to judge ------------------------------------------------------------------------- */

export function ThreeStyles() {
  const styles: [string, string, string][] = [
    [
      "Grade one answer",
      "“Score this reply from 1 to 5 for accuracy.”",
      "Scales well; scores drift if the judge model changes.",
    ],
    [
      "Compare two answers",
      "“Which reply is better, A or B?”",
      "Good at small differences; the number of pairs grows fast.",
    ],
    [
      "Grade against a reference",
      "“Does this reply agree with the correct answer?”",
      "Best for maths and facts.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to judge"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {styles.map(([t, e, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="mt-0.5 font-mono text-[11px]">{e}</p>
              <p className="text-muted mt-0.5">{n}</p>
            </motion.div>
          ))}
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            In the 2023 study that popularised LLM judges, GPT-4 agreed with human experts about as
            often as experts agreed with each other: 85% versus 81%, counting only votes that
            weren&apos;t ties.
          </div>
        </div>
      }
    >
      <p>
        Zheng and colleagues (2023) described three styles of judge. Pick by what you need: a score
        per answer for tracking, a comparison for choosing between versions, a reference for facts.
      </p>
      <p>
        Their headline result made LLM judges popular. The fine print matters too: agreement drops
        when ties count, and the judge still showed the biases above.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Writing a judge prompt ---------------------------------------------------------------------- */

export function JudgePrompt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Writing a judge prompt"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code>{`You are grading a customer-support reply.

Question: {question}
Correct policy: {reference}
Reply: {reply}

Criteria:
1. Accurate: agrees with the policy.
   Any wrong fact fails.
2. Complete: answers what was asked.
3. Polite. Length does not matter.

Think step by step about each criterion,
then answer on the last line: PASS or FAIL.`}</Code>
          <p className="text-muted text-[11px]">
            One clear question, a reference, specific criteria, reasoning first, a pass/fail
            verdict.
          </p>
        </div>
      }
    >
      <p>
        Good judge prompts are specific. Ask one question at a time, define what pass and fail mean,
        give the correct answer when there is one, and say plainly that length doesn&apos;t count.
        Pass/fail is usually easier to make reliable than a 1-to-10 scale.
      </p>
      <p>
        Methods like G-Eval go further, having the judge write its own evaluation steps and
        weighting the score by how confident it was. Whatever you do, check the judge against people
        before trusting it: that&apos;s the next module.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Name the bias ------------------------------------------------------------------------------- */

export function NameTheBias() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the bias"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="name-the-bias"
            prompt="Which bias explains each symptom?"
            categories={[
              { id: "pos", label: "Position" },
              { id: "len", label: "Verbosity" },
              { id: "self", label: "Self-preference" },
            ]}
            items={[
              {
                id: "flip",
                label: "Swapping A and B flips the verdict",
                category: "pos",
                why: "The slot mattered, not the answer.",
              },
              {
                id: "padded",
                label: "A padded answer beats a short correct one",
                category: "len",
                why: "Longer looks better to the judge.",
              },
              {
                id: "own",
                label: "The judge rates its own model's answers highest",
                category: "self",
                why: "Its own style feels right to it.",
              },
              {
                id: "first",
                label: "Answer A wins 70% of comparisons, whatever A is",
                category: "pos",
                why: "Favouring the first slot.",
              },
              {
                id: "bullets",
                label: "Answers with more bullet points score higher",
                category: "len",
                why: "More text, more apparent effort.",
              },
            ]}
            explanation="Swap orders to expose position bias, tell the rubric to ignore length, and use a judge from a different family than the models being judged."
          />
        </div>
      }
    >
      <p>Sort the symptoms.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Judges scale", "Grade open-ended answers quickly and cheaply."],
  ["Judges have habits", "Position, length, their own style."],
  ["Swap orders", "A flipped verdict is a tie."],
  ["Give references and rubrics", "Facts need a correct answer to compare."],
  ["Check before trusting", "Compare with human labels."],
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
      <p>Next: measuring how far you can trust your judge.</p>
    </StepLayout>
  );
}
