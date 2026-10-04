"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, CATEGORIES, STARTS, REGRESSED, byCategory, chanceToSpot, sample } from "./model";
import type { WhyEvalsState } from "./state";

/* 2 ─ Five answers versus a hundred cases ⭐ ------------------------------------------------------ */

const CELL: Record<string, string> = {
  pass: "bg-good/60",
  fail: "bg-muted/40",
  regressed: "bg-bad",
  fixed: "bg-viz-data",
};

export function FiveVsHundred() {
  const [s, set] = useSceneState<WhyEvalsState>();
  const picked = sample(s.n, s.seed);
  const shown = (i: number) => s.ran || picked.has(i);
  const found = [...picked].filter((i) => CASES[i].outcome === "regressed").length;
  const cats = byCategory();
  const v1 = cats.reduce((a, c) => a + c.v1, 0);
  const v2 = cats.reduce((a, c) => a + c.v2, 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Five answers versus a hundred cases"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted">try</span>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={s.n}
                onChange={(e) => set({ n: Number(e.target.value), ran: false })}
                className="accent-accent flex-1"
                aria-label="Answers to try"
              />
              <span className="w-20 font-mono whitespace-nowrap">{s.n} answers</span>
            </label>
            <button
              type="button"
              onClick={() => set({ seed: s.seed + 1, ran: false })}
              className="border-line rounded-full border px-3 py-1"
            >
              Try a different {s.n}
            </button>
            <button
              type="button"
              onClick={() => set({ ran: true })}
              className={cn(
                "rounded-full border px-3 py-1",
                s.ran ? "border-accent bg-accent-soft" : "border-accent",
              )}
            >
              Run all 100 cases
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((c, ci) => (
              <div key={c.id} className="grid grid-cols-[6.5rem_1fr] items-center gap-2">
                <span className="text-muted text-[10px] leading-tight">{c.name}</span>
                <div className="flex flex-wrap gap-[3px]">
                  {Array.from({ length: c.size }, (_, i) => {
                    const idx = STARTS[ci] + i;
                    return (
                      <motion.span
                        key={i}
                        animate={{ scale: shown(idx) ? 1 : 0.8 }}
                        className={cn(
                          "h-3 w-3 rounded-sm",
                          shown(idx) ? CELL[CASES[idx].outcome] : "bg-surface-2",
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="text-subtle flex flex-wrap gap-3 text-[10px]">
            <span>
              <span className="bg-good/60 mr-1 inline-block h-2 w-2 rounded-sm" />
              still right
            </span>
            <span>
              <span className="bg-viz-data mr-1 inline-block h-2 w-2 rounded-sm" />
              newly fixed
            </span>
            <span>
              <span className="bg-bad mr-1 inline-block h-2 w-2 rounded-sm" />
              newly broken
            </span>
            <span>
              <span className="bg-muted/40 mr-1 inline-block h-2 w-2 rounded-sm" />
              wrong before and after
            </span>
          </div>
          {!s.ran ? (
            <p className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              Your {s.n} answers:{" "}
              {found ? <span className="text-bad">{found} newly broken</span> : "all look fine"}. A
              random {s.n} would catch at least one of the {REGRESSED} broken cases about{" "}
              <span className="font-mono">{Math.round(chanceToSpot(s.n) * 100)}%</span> of the time,
              and wouldn&apos;t tell you which kind of question broke.
            </p>
          ) : (
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p>
                Overall: <span className="font-mono">{v1}</span> →{" "}
                <span className="font-mono">{v2}</span> of 100. It looks like a small win.
              </p>
              <div className="mt-1 grid grid-cols-[1fr_auto_auto] gap-x-3 font-mono text-[11px]">
                {cats.map((c) => (
                  <div key={c.id} className={cn("contents", c.v2 < c.v1 && "text-bad")}>
                    <span className="font-sans">{c.name}</span>
                    <span>
                      {c.v1}/{c.size}
                    </span>
                    <span>
                      → {c.v2}/{c.size}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted mt-1">
                The new prompt answers Hindi questions in English and is curt with upset customers.
              </p>
            </div>
          )}
          <p className="text-subtle text-[10px]">Illustrative cases.</p>
        </div>
      }
    >
      <p>
        You&apos;ve changed a support assistant&apos;s prompt to make answers shorter. Try a few
        answers, as most people would, then try a different few. Then run the full set of 100
        prepared cases.
      </p>
      <p>
        Two lessons hide here. Small samples usually miss problems that affect a minority of
        questions. And even a full run can hide them in one overall number, so break results down by
        kind of question.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why ordinary tests aren't enough ------------------------------------------------------------ */

export function NotLikeTests() {
  const answers = [
    "Returns are free within 30 days.",
    "You can return it within 30 days; we'll email a label.",
    "Sure! Our policy allows returns for a month, though sale items may differ.",
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why ordinary tests aren't enough"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-xs">
            <p className="text-muted">add(2, 3)</p>
            <p>→ 5, every time. Test: result == 5 ✓</p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted font-mono">“Can I return this?” (asked three times)</p>
            {answers.map((a, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 * i }}
                className="mt-1"
              >
                → {a}
              </motion.p>
            ))}
            <p className="text-muted mt-2">
              Which are right? You need a check that judges meaning, run over many questions.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">The “same” model changes too</p>
            <p className="text-muted mt-0.5">
              Researchers compared GPT-4&apos;s March and June 2023 versions and found large changes
              in behaviour on the same tasks. Re-run your evals whenever the model, the prompt or
              the provider changes.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Ordinary software tests check exact outputs. Language models can give different, equally
        good answers to the same question, and occasionally a wrong one, so one run proves little.
      </p>
      <p>
        An <Term id="eval">eval</Term> is a test built for that: many prepared cases, a way to score
        each answer, and a summary you can compare between versions.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Evals across a product's life --------------------------------------------------------------- */

export function Lifecycle() {
  const stages: [string, string][] = [
    ["Before building", "Decide what success means and how you'll measure it."],
    [
      "While building",
      "Run evals on every prompt or model change to see what got better or worse.",
    ],
    ["Before release", "A regression suite blocks changes that break things that used to work."],
    ["In production", "Score real traffic, collect feedback and turn new failures into new cases."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Evals across a product's life"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {stages.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{i + 1}</span>
              <span>
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
          <blockquote className="border-accent text-muted mt-1 border-l-2 pl-3 text-xs italic">
            &ldquo;Unsuccessful products almost always share a common root cause: a failure to
            create robust evaluation systems.&rdquo;{" "}
            <span className="not-italic">Hamel Husain, 2024</span>
          </blockquote>
        </div>
      }
    >
      <p>
        Evals aren&apos;t a one-off exam. Both OpenAI&apos;s and Anthropic&apos;s guides start the
        same way: define what success looks like, then build evals to measure it, and keep using
        them.
      </p>
      <p>
        Vibe checks still have a place, as OpenAI&apos;s testers showed by spotting the flattery.
        Treat a bad feeling as a reason to write a new eval, not a reason to ignore one.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Vibe check or eval? ------------------------------------------------------------------------- */

export function VibeOrEval() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Vibe check or eval?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="vibe-or-eval"
            prompt="Is each a vibe check or an eval?"
            categories={[
              { id: "vibe", label: "Vibe check" },
              { id: "eval", label: "Eval" },
            ]}
            items={[
              {
                id: "five",
                label: "Asking the new prompt five questions in the playground",
                category: "vibe",
                why: "A handful of unscored tries.",
              },
              {
                id: "suite",
                label: "Scoring 300 saved questions before and after a change",
                category: "eval",
                why: "Many cases, scored, compared.",
              },
              {
                id: "demo",
                label: "“The demo went well, let's ship”",
                category: "vibe",
                why: "One impression.",
              },
              {
                id: "cat",
                label: "Pass rates per question type, compared with last week's version",
                category: "eval",
                why: "Scored and broken down.",
              },
              {
                id: "feel",
                label: "A tester says replies feel more flattering",
                category: "vibe",
                why: "Valuable: turn it into an eval.",
              },
            ]}
            explanation="Evals are many prepared cases, scored the same way each time. Vibe checks are impressions: useful warnings, not evidence."
          />
        </div>
      }
    >
      <p>Sort them.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A few answers prove little", "Models vary; small samples miss rare failures."],
  ["Evals are tests for AI", "Many cases, scored the same way."],
  ["Break results down", "One overall number hides regressions."],
  ["Passing means passing your tests", "Measure what matters, or miss it."],
  ["Evaluate all the time", "Every change of model, prompt or provider."],
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
      <p>Next: deciding what &ldquo;good&rdquo; means before you measure anything.</p>
    </StepLayout>
  );
}
