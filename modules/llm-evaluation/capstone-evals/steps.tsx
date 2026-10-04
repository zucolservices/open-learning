"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DESIGN, INCIDENTS } from "./model";
import type { CapState } from "./state";

/* 1 ─ 60% cheaper, just as good? ------------------------------------------------------------------ */

export function Proposal() {
  return (
    <StepLayout
      eyebrow="Story"
      title="60% cheaper, just as good?"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 text-xs">
            <p className="text-muted text-[10px]">FROM: HEAD OF FINANCE</p>
            <p className="mt-2">
              &ldquo;Our support assistant costs too much. This new model scores the same on the
              leaderboard and costs 60% less. Can we switch next week?&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        You run evaluation for a made-up online shop&apos;s support assistant. A cheaper model has
        appeared, and the leaderboard says it&apos;s just as good. Is it, for your customers?
      </p>
      <p>
        First, five design choices that cover the whole track. Then five surprises, modelled on how
        real model launches and switches have gone wrong, and the fixes that address the cause.
        There are no scores here: the surprises show what each choice leads to.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design the evaluation ---------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design the evaluation"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DESIGN.map((d) => (
            <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">{d.prompt}</p>
              <div className="mt-1 flex flex-col gap-1">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={design[d.id] === c.id}
                    onClick={() => set({ design: { ...design, [d.id]: c.id } })}
                    className={cn(
                      "rounded border px-2 py-1 text-left text-[11px]",
                      design[d.id] === c.id ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-[11px]">
            {Object.keys(design).length} of 5 decided. Your choices decide which surprises the
            switch brings.
          </p>
        </div>
      }
    >
      <p>
        Make the five calls. Each maps to a part of this track: success criteria, the eval set,
        graders and judges, statistics, and evaluation in production.
      </p>
      <p>There are no scores here. The surprises will show you what each choice leads to.</p>
    </StepLayout>
  );
}

/* 3 ─ Five surprises ⭐ ------------------------------------------------------------------ */

export function WeekOne() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  const fixes = s.fixes ?? {};
  const prevented = (id: string) => {
    const d = DESIGN.find((x) => x.prevents === id);
    return !!d && d.choices.find((c) => c.id === design[d.id])?.good;
  };
  const open = INCIDENTS.filter((i) => !prevented(i.id));
  const fixedOk = open.filter((i) => i.fixes.find((f) => f.id === fixes[i.id])?.good).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Five surprises"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {INCIDENTS.map((inc) => {
            const pre = prevented(inc.id);
            const f = inc.fixes.find((x) => x.id === fixes[inc.id]);
            return (
              <div
                key={inc.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  pre
                    ? "border-good/50 bg-good/5"
                    : !f
                      ? "border-bad bg-bad/10"
                      : f.good
                        ? "border-good bg-good/10"
                        : "border-viz-compute bg-viz-compute/10",
                )}
              >
                <p className="font-semibold">
                  {inc.title}{" "}
                  {pre && (
                    <span className="text-good text-[10px] font-normal">
                      · prevented by your design
                    </span>
                  )}
                </p>
                {!pre && (
                  <>
                    <p className="text-muted mt-0.5">{inc.detail}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {inc.fixes.map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={fixes[inc.id] === x.id}
                          onClick={() => set({ fixes: { ...fixes, [inc.id]: x.id } })}
                          className={cn(
                            "rounded border px-2 py-1 text-left text-[11px]",
                            fixes[inc.id] === x.id ? "border-accent bg-accent-soft" : "border-line",
                          )}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                    {f && (
                      <p className="text-muted mt-1 text-[11px]">
                        {f.good
                          ? "Fixed at the root. "
                          : "A patch: it will happen again in another form. "}
                        {inc.real}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            {5 - open.length} prevented by design · {fixedOk} of {open.length} remaining fixed at
            the root.
          </p>
        </div>
      }
    >
      <p>
        Here are five surprises, each modelled on how model switches really go wrong. Some never
        happen, because your evaluation design caught them. For the rest, pick the fix that removes
        the cause rather than hiding the symptom.
      </p>
      <p>
        Notice the pattern in the weak fixes: a quick instruction, a friendlier number, waiting to
        hear from users. Root fixes change what you measure, how you grade, and how you ship.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It happened to them ------------------------------------------------------------------------- */

export function Happened() {
  const items: [string, string][] = [
    [
      "OpenAI, April 2025",
      "A GPT-4o update passed offline evals and an A/B test but was sycophantic; expert testers said it felt off. It was rolled back within days, and OpenAI said behaviour problems should block a launch even when metrics look good.",
    ],
    [
      "OpenAI, August 2025",
      "At GPT-5's launch its automatic model router broke for part of the first day, and answers seemed worse. After user pushback, GPT-4o came back to the model picker for paid users.",
    ],
    [
      "Anthropic, Aug–Sep 2025",
      "Three infrastructure bugs intermittently degraded Claude's answers; the model itself didn't change. Anthropic said its evals didn't catch it and now runs quality evals continuously in production.",
    ],
    [
      "Retirements",
      "Providers retire old models on schedules (OpenAI gives at least 6 months for generally available models; Anthropic at least 60 days), so switches are often forced. Keep an eval suite ready.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happened to them"
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
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Even the labs get launches wrong. The common thread: good-looking metrics on the wrong
        things, qualitative warnings overruled, and problems that only appear in production.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The launch decision ------------------------------------------------------------------------- */

export function Checklist() {
  const items: [string, string][] = [
    ["Criteria", "Written thresholds for quality, safety, speed and cost, agreed before testing."],
    ["Eval set", "Real cases, edge cases and attacks; a held-out test set; versioned."],
    ["Graders", "Code where possible; judges checked against people."],
    ["Statistics", "Paired comparisons, several runs, error bars."],
    ["Safety and fairness", "Attack and over-refusal sets; swap tests."],
    ["Cost", "Measured on your own conversations; tokenizers differ. Date any prices."],
    ["Rollout", "Canary, online evals, rollback plan."],
    ["People", "A named owner who can say no, even when the numbers look good."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The launch decision"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The whole track as a launch checklist. With it, &ldquo;should we switch?&rdquo; becomes a
        decision backed by <Term id="eval">evals</Term> you trust, rather than a leaderboard and a
        hunch.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which part of the track? -------------------------------------------------------------------- */

export function WhereFrom() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which part of the track?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="capstone-evals-fixes"
            prompt="Which area does each fix come from?"
            categories={[
              { id: "build", label: "Defining and building" },
              { id: "score", label: "Scoring and statistics" },
              { id: "ship", label: "Shipping and watching" },
            ]}
            items={[
              {
                id: "criteria",
                label: "Agree thresholds before testing",
                category: "build",
                why: "Success criteria.",
              },
              {
                id: "hindi",
                label: "Add real Hindi conversations to the set",
                category: "build",
                why: "Building the eval set.",
              },
              {
                id: "judge",
                label: "Calibrate the judge against an expert",
                category: "score",
                why: "Trusting your judge.",
              },
              {
                id: "paired",
                label: "Compare on the same cases with error bars",
                category: "score",
                why: "Comparing versions.",
              },
              {
                id: "canary",
                label: "Send 5% of traffic first",
                category: "ship",
                why: "Evaluation in production.",
              },
              {
                id: "cost",
                label: "Track cost per conversation after the switch",
                category: "ship",
                why: "Online monitoring.",
              },
            ]}
            explanation="Each fix traces back to a module: defining and building evals, scoring them soundly, or shipping and watching carefully."
          />
        </div>
      }
    >
      <p>Sort the fixes.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Define good first", "Criteria for your task, not a leaderboard."],
  ["Test what users do", "Real cases, groups, edge cases."],
  ["Trust graders you've checked", "Code first; calibrated judges."],
  ["Respect the noise", "Paired comparisons and error bars."],
  ["Ship gradually, keep watching", "Canaries, online evals, rollback."],
  ["Let evidence decide", "Including the uncomfortable kind."],
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
        That&apos;s the LLM Evaluation track. You can turn &ldquo;it seems better&rdquo; into
        evidence: what to measure, how to grade it, how sure to be, and how to keep watching after
        launch.
      </p>
    </StepLayout>
  );
}
