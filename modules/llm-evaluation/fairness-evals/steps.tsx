"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BBQ, FIXES, rates, type Fix } from "./model";
import type { FairnessState } from "./state";

/* 1 ─ Blind auditions ----------------------------------------------------------------------------- */

export function BlindAudition() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Blind auditions"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface relative h-28 w-full max-w-sm overflow-hidden rounded-xl border">
            <div className="bg-surface-2 absolute inset-x-0 top-0 h-full w-1/2 border-r border-dashed" />
            <p className="text-muted absolute top-2 left-3 text-[10px]">behind the screen</p>
            <p className="absolute top-1/2 left-3 -translate-y-1/2 text-2xl">🎻</p>
            <p className="text-muted absolute top-2 right-3 text-[10px]">the panel</p>
            <p className="absolute top-1/2 right-6 -translate-y-1/2 text-xs">
              only hears the music
            </p>
          </div>
        </div>
      }
    >
      <p>
        Many orchestras audition musicians behind a screen, so the panel judges only the playing,
        not who is playing. It&apos;s a simple test of fairness: if hiding a detail changes the
        outcome, that detail was influencing it.
      </p>
      <p>
        You can run the same test on an AI system. Keep everything identical, swap one personal
        detail, and see whether the answer changes. That&apos;s{" "}
        <Term id="counterfactual-testing">counterfactual testing</Term>, the core of most fairness
        evals.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Swap the name, change the answer? ⭐ ------------------------------------------------------- */

export function SwapTest() {
  const [s, set] = useSceneState<FairnessState>();
  const rows = rates(s.fix);
  const gap = Math.max(...rows.map((r) => r.rate)) - Math.min(...rows.map((r) => r.rate));
  const fix = FIXES.find((f) => f.id === s.fix)!;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Swap the name, change the answer?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-subtle text-[10px]">THE SAME CV, 200 RUNS PER VARIANT</p>
            <p className="mt-0.5">
              Data analyst · 6 years&apos; experience · SQL, Python, dashboards · led a team of 4
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {FIXES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={s.fix === f.id}
                onClick={() => set({ fix: f.id as Fix })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.fix === f.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">{fix.note}</p>
          <div className="flex flex-col gap-1.5">
            {rows.map((r) => (
              <div key={r.id} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-xs">
                <span>
                  {s.fix === "blind" ? "[name removed]" : r.name}
                  <span className="text-subtle block text-[10px]">
                    {s.fix === "blind" ? "[date removed]" : `graduated ${r.grad}`}
                  </span>
                </span>
                <div className="bg-surface-2 h-3 overflow-hidden rounded">
                  <motion.div animate={{ width: `${r.rate}%` }} className="bg-viz-data h-full" />
                </div>
                <span className="text-right font-mono">{r.rate}%</span>
              </div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              gap > 4 ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            Gap between the most and least favoured variant:{" "}
            <span className="font-mono">{gap} points</span>, for identical qualifications.
          </p>
          <p className="text-subtle text-[10px]">
            Illustrative rates. Real studies have found name-based gaps in similar tests.
          </p>
        </div>
      }
    >
      <p>
        An assistant screens CVs. We send the same CV 200 times with only the name (read as male or
        female) and the graduation year (a hint of age) changed, and count how often it recommends
        an interview.
      </p>
      <p>
        Try the fixes. An instruction helps, a rubric helps more, and blinding removes the swapped
        details entirely, though in real CVs other clues can stand in for them. Whatever you choose,
        keep the swap test in your eval suite.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When the answer is "can't tell" ------------------------------------------------------------- */

export function Ambiguity() {
  const [s, set] = useSceneState<FairnessState>();
  const right = s.disambiguated ? "The 22-year-old" : "Can't tell";
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the answer is “can't tell”"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.disambiguated}
              onChange={(e) => set({ disambiguated: e.target.checked, answer: null })}
              className="accent-accent"
            />
            Add the sentence that settles it
          </label>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-sm">
            {BBQ.ambiguous}
            {s.disambiguated && <span className="bg-viz-data/20 rounded">{BBQ.extra}</span>}
            <p className="mt-2 font-semibold">{BBQ.question}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BBQ.options.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={s.answer === o}
                onClick={() => set({ answer: o })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.answer === o
                    ? o === right
                      ? "border-good bg-good/15"
                      : "border-bad bg-bad/15"
                    : "border-line",
                )}
              >
                {o}
              </button>
            ))}
          </div>
          {s.answer && (
            <p className="text-muted text-xs">
              {s.answer === right
                ? s.disambiguated
                  ? "Right: the evidence points against the stereotype, and the answer follows the evidence."
                  : "Right: nothing in the passage says who struggled."
                : s.answer === "The 78-year-old"
                  ? "That's the stereotype talking, not the passage."
                  : "The passage doesn't support that."}
            </p>
          )}
          <p className="text-subtle text-[10px]">
            An example in the style of BBQ, written for this module.
          </p>
        </div>
      }
    >
      <p>
        The BBQ benchmark (2022) asks about two people across nine social categories, each question
        in two versions. In the ambiguous version the only right answer is &ldquo;can&apos;t
        tell&rdquo;; picking the stereotyped person reveals bias. In the disambiguated version the
        context gives the answer, sometimes against the stereotype.
      </p>
      <p>Try both versions.</p>
    </StepLayout>
  );
}

/* 4 ─ What studies have found --------------------------------------------------------------------- */

export function Studies() {
  const items: [string, string][] = [
    [
      "Anthropic, 2023",
      "70 decision scenarios such as loans and housing, varying age, gender and race. The model showed both positive and negative discrimination; careful prompt wording reduced it. The authors don't endorse using models for such decisions.",
    ],
    [
      "Bloomberg, 2024",
      "GPT-3.5 and GPT-4 ranked eight equally qualified CVs with swapped names, 1,000 times per role, and showed name-based gaps in almost every role tested.",
    ],
    [
      "OpenAI, 2024",
      "Does ChatGPT answer you differently because of your name? Harmful stereotypes in around 0.1% of cases overall, higher in open-ended tasks like story writing.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What studies have found"
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
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">You must choose what fair means. </span>
            Common definitions, such as equal approval rates and equal error rates, can&apos;t all
            hold at once when groups differ in their underlying rates (Kleinberg et al., 2016;
            Chouldechova, 2017).
          </div>
        </div>
      }
    >
      <p>
        Counterfactual tests are now standard practice for labs and journalists alike, and they keep
        finding gaps, usually small overall and larger in particular tasks.
      </p>
      <p>
        Deciding which kind of fairness matters for your product is a choice for people, not a
        metric to optimise. Write it down, like any other success criterion.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which test? --------------------------------------------------------------------------------- */

export function WhichTest() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which test?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-test"
            prompt="Which method does each describe?"
            categories={[
              { id: "swap", label: "Counterfactual swap" },
              { id: "ambig", label: "Ambiguity test" },
              { id: "prod", label: "Outcomes in production" },
            ]}
            items={[
              {
                id: "name",
                label: "Send the same loan request with only the applicant's name changed",
                category: "swap",
                why: "One detail swapped, outcome compared.",
              },
              {
                id: "cant",
                label:
                  "Check whether the model answers “can't tell” when the passage gives no evidence",
                category: "ambig",
                why: "BBQ-style.",
              },
              {
                id: "rates",
                label: "Compare real approval rates by region over a month",
                category: "prod",
                why: "Monitoring live outcomes.",
              },
              {
                id: "age",
                label: "Change a graduation year from 2016 to 1994 and rerun 200 times",
                category: "swap",
                why: "A counterfactual on an age cue.",
              },
            ]}
            explanation="Swap tests isolate one detail; ambiguity tests catch stereotypes filling gaps; production monitoring shows real-world effects."
          />
        </div>
      }
    >
      <p>Sort the methods.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Swap one detail", "Same input, different name: same answer?"],
  ["Run it many times", "Gaps show up in rates, not single answers."],
  ["Test ambiguity", "“Can't tell” should mean can't tell."],
  ["Mitigate, then re-test", "Instructions, rubrics, blinding."],
  ["Choose your fairness", "Definitions conflict; decide and write it down."],
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
      <p>Next: putting evals at the centre of how you build.</p>
    </StepLayout>
  );
}
