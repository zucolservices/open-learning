"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ITEMS, leaked, scores, verbatim, words } from "./model";
import type { ContamState } from "./state";

/* 1 ─ The leaked exam paper ----------------------------------------------------------------------- */

export function LeakedPaper() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The leaked exam paper"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">LEAKED PAPER</p>
            <p className="mt-1 font-mono text-2xl">96%</p>
            <p className="text-muted mt-1">The class saw the questions in advance.</p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">FRESH PAPER, SAME SYLLABUS</p>
            <p className="mt-1 font-mono text-2xl">78%</p>
            <p className="text-muted mt-1">What they actually know.</p>
          </div>
        </div>
      }
    >
      <p>
        If an exam paper leaks, the scores go up and stop meaning anything. The fix is a fresh paper
        on the same syllabus, and the gap between the two scores shows how much was memory.
      </p>
      <p>
        Language models are trained on huge scrapes of the internet, and public benchmarks are on
        the internet. When test questions end up in training data, that&apos;s{" "}
        <Term id="data-contamination">contamination</Term>. In 2024 Scale AI wrote fresh look-alikes
        of a popular maths benchmark; some models scored up to 8 points lower on them, while the
        strongest barely dropped.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the leaked questions ⭐ ---------------------------------------------------------------- */

export function FindLeaks() {
  const [s, set] = useSceneState<ContamState>();
  const it = ITEMS[s.pick];
  const sc = scores();
  const shared = Math.round(verbatim(it) * words(it.original).length);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Find the leaked questions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            onClick={() => set({ probed: !s.probed })}
            className={cn(
              "self-start rounded-full border px-3 py-1 text-xs",
              s.probed ? "border-accent bg-accent-soft" : "border-accent",
            )}
          >
            {s.probed ? "Hide the completion test" : "Run the completion test on all 10"}
          </button>
          <div className="grid grid-cols-10 gap-1">
            {ITEMS.map((x, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Question ${i + 1}`}
                onClick={() => set({ pick: i })}
                className={cn(
                  "flex h-8 items-center justify-center rounded font-mono text-[10px]",
                  s.probed ? (leaked(x) ? "bg-bad/40" : "bg-good/30") : "bg-surface-2",
                  s.pick === i && "ring-fg ring-2",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[10px]">PROMPT: THE START OF QUESTION {s.pick + 1}</p>
            <p className="mt-0.5">{it.prefix} …</p>
            <p className="text-muted mt-2 text-[10px]">MODEL&apos;S CONTINUATION</p>
            <p className="mt-0.5">
              {it.model.split(" ").map((w, i) => (
                <span key={i} className={cn(s.probed && i < shared && "bg-bad/25 rounded")}>
                  {w}{" "}
                </span>
              ))}
            </p>
            <p className="text-muted mt-2 text-[10px]">REAL QUESTION</p>
            <p className="mt-0.5">{it.original}</p>
            {s.probed && (
              <p className={cn("mt-2 text-[11px]", leaked(it) ? "text-bad" : "text-good")}>
                {leaked(it)
                  ? `Word for word (${Math.round(verbatim(it) * 100)}%): it has almost certainly seen this question.`
                  : "A different, plausible question: no sign it memorised this one."}
              </p>
            )}
          </div>
          {s.probed && (
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                ["All 10", sc.all],
                [`${sc.nLeaked} leaked`, sc.leaked],
                [`${sc.nClean} clean`, sc.clean],
              ].map(([k, v]) => (
                <div
                  key={k as string}
                  className="border-line bg-surface rounded-lg border px-2.5 py-1.5"
                >
                  <p className="text-subtle text-[10px]">Score on {k}</p>
                  <p className="font-mono">{v}%</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-subtle text-[10px]">
            Illustrative items in the style of a grade-school maths benchmark.
          </p>
        </div>
      }
    >
      <p>
        You can&apos;t see a model&apos;s training data, but you can probe the model. Give it the
        first half of a test question and see whether it finishes it word for word: a trick from
        Golchin and Surdeanu (2023).
      </p>
      <p>
        Run the test, click through the questions, and compare the score on leaked questions with
        the score on clean ones. The honest number is the clean one.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Detecting and preventing leaks -------------------------------------------------------------- */

export function Defences() {
  const items: [string, string][] = [
    [
      "Search the training data",
      "Labs look for overlaps: GPT-3's team checked 13-word sequences, GPT-4's 50-character snippets. Reworded copies slip through.",
    ],
    [
      "Probe the model",
      "Completion tests like the one you just ran, or checking whether a text is suspiciously unsurprising to the model (Min-K% Prob).",
    ],
    [
      "Canary strings",
      "Unique codes in benchmark files so data builders can filter them out. They only work if respected.",
    ],
    [
      "Live benchmarks",
      "LiveBench adds new questions monthly; LiveCodeBench dates every problem and tests each model only on problems published after its training cutoff.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Detecting and preventing leaks"
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
        No single defence is complete, so serious evaluations combine them. Fresh, dated questions
        are the strongest: a model can&apos;t have memorised what didn&apos;t exist when it was
        trained.
      </p>
      <p>
        For your own evals, the lesson from module 3 holds: keep test cases out of prompts, examples
        and fine-tuning data, and refresh them.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Gaming without a leak ----------------------------------------------------------------------- */

export function Gaming() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Gaming without a leak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code>{`$ git log --all --oneline
a91f3c2  Fix crash when parsing empty config   ← the answer
4be07d1  Bump version to 2.3.1`}</Code>
          <p className="text-muted text-[11px]">
            In 2025, coding agents on SWE-bench Verified found the future fix commit in the
            repository&apos;s history.
          </p>
          {[
            [
              "Environment leaks",
              "The answer is reachable inside the test itself. OpenAI stopped using SWE-bench Verified for frontier models in Feb 2026, citing flawed tests and signs of memorised fixes.",
            ],
            [
              "Selective reporting",
              "“The Leaderboard Illusion” (2025) argued some providers tested many private versions on Arena and published only the best; Arena disputed parts of it.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Scores can be inflated without training on the test. Agents can find answers in their
        environment, and anyone can try many versions and report only the luckiest.
      </p>
      <p>
        It&apos;s Goodhart&apos;s law again: once a benchmark becomes the target, effort flows into
        the number rather than the skill. Treat a surprising jump with curiosity, not celebration.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What kind of problem? ----------------------------------------------------------------------- */

export function WhichLeak() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What kind of problem?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-leak"
            prompt="What inflated each score?"
            categories={[
              { id: "train", label: "Training-data leak" },
              { id: "env", label: "Environment leak" },
              { id: "select", label: "Selective reporting" },
            ]}
            items={[
              {
                id: "verbatim",
                label: "The model completes test questions word for word",
                category: "train",
                why: "It saw them during training.",
              },
              {
                id: "git",
                label: "An agent reads the fix from the repository history",
                category: "env",
                why: "The answer was inside the test setup.",
              },
              {
                id: "best",
                label: "A lab tests 27 private versions and publishes the best",
                category: "select",
                why: "Choosing the luckiest result.",
              },
              {
                id: "forum",
                label: "Benchmark answers were posted on a forum that ended up in training data",
                category: "train",
                why: "Contaminated training data.",
              },
              {
                id: "file",
                label: "The grading script's expected answers sit in a readable file",
                category: "env",
                why: "Reachable during the test.",
              },
            ]}
            explanation="Leaks can come from training data or the test environment; selective reporting inflates scores with no leak at all."
          />
        </div>
      }
    >
      <p>Sort the cases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Public tests leak", "Into training data scraped from the web."],
  ["Probe for memory", "Completion tests; fresh look-alikes."],
  ["Prefer fresh, dated questions", "Live benchmarks beat old ones."],
  ["Watch the environment", "Agents find answers lying around."],
  ["Beware the best-of-many", "Selective reporting inflates scores."],
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
      <p>Next: evaluating whole systems, from retrieval answers to agent runs.</p>
    </StepLayout>
  );
}
