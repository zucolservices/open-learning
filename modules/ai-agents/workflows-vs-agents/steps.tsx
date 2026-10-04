"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PATTERNS, TASKS, judge, type Pattern } from "./model";
import type { FlowState } from "./state";

/* 1 ─ Set menu or à la carte ---------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Set menu or à la carte"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The set menu</p>
            <p className="text-muted mt-1">
              Three courses, always in this order. The kitchen is fast, consistent and knows exactly
              what it costs.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The chef&apos;s choice</p>
            <p className="text-muted mt-1">
              The chef decides on the night, based on what&apos;s fresh and what you like. Wonderful
              when it works, slower and dearer, and harder to predict.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A restaurant can serve a fixed set menu or let the chef improvise. Most nights, the set menu
        is the better business; improvisation earns its keep for special occasions.
      </p>
      <p>
        AI systems face the same choice. A <Term id="agent-workflow">workflow</Term> fixes the steps
        in code; an <Term id="ai-agent">agent</Term> lets the model decide them. Anthropic&apos;s
        guide describes five reusable workflow patterns that cover most needs before you reach for a
        full agent.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Five workflow patterns ---------------------------------------------------------------------- */

function Flow({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {nodes.map((n, i) => (
        <motion.span
          key={`${n}-${i}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i }}
          className="flex items-center gap-1"
        >
          {i > 0 && <span className="text-muted">→</span>}
          <span className="border-accent bg-accent-soft rounded-md border px-2 py-1 font-mono text-[11px]">
            {n}
          </span>
        </motion.span>
      ))}
    </div>
  );
}

export function Patterns() {
  const [s, set] = useSceneState<FlowState>();
  const p = PATTERNS.find((x) => x.id === s.pattern) ?? PATTERNS[1];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Five workflow patterns"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {PATTERNS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.pattern === x.id}
                onClick={() => set({ pattern: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.pattern === x.id ? "border-accent bg-accent-soft" : "border-line",
                  (x.id === "single" || x.id === "agent") && "border-dashed",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface flex min-h-32 flex-col justify-center gap-3 rounded-xl border p-4">
            <Flow key={p.id} nodes={p.nodes} />
            <p className="text-sm">{p.what}</p>
          </div>
          <p className="text-subtle text-[10px]">
            Pattern names from Anthropic&apos;s &ldquo;Building effective agents&rdquo; (Dec 2024);
            other vendors use different names. One model call and Agent are the two ends of the
            dial.
          </p>
        </div>
      }
    >
      <p>
        Every pattern is built from one block, the augmented model: a model that can retrieve
        information, call tools and remember. The patterns differ in who decides the steps.
      </p>
      <p>
        In the first four, your code decides. Orchestrator-workers lets a lead model decide the
        subtasks; a full agent lets the model decide everything.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Match the task to the pattern ⭐ ------------------------------------------------------------ */

export function Match() {
  const [s, set] = useSceneState<FlowState>();
  const picks = s.picks ?? {};
  const good = TASKS.filter((t) => picks[t.id] === t.best).length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Match the task to the pattern"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {TASKS.map((t) => {
            const r = judge(t, picks[t.id]);
            return (
              <div
                key={t.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  !r
                    ? "border-line bg-surface"
                    : r.tone === "good"
                      ? "border-good bg-good/10"
                      : r.tone === "ok"
                        ? "border-viz-compute bg-viz-compute/10"
                        : "border-bad bg-bad/10",
                )}
              >
                <p className="font-semibold">{t.text}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {PATTERNS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-label={`${t.text}: ${p.label}`}
                      aria-pressed={picks[t.id] === p.id}
                      onClick={() => set({ picks: { ...picks, [t.id]: p.id as Pattern } })}
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px]",
                        picks[t.id] === p.id ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {r && <p className="text-muted mt-1 text-[11px]">{r.text}</p>}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            {good} of {TASKS.length} best fits.
          </p>
        </div>
      }
    >
      <p>
        Pick the simplest pattern that does each job well. Choosing too little autonomy fails the
        task; choosing too much works, but costs more and is harder to test and trust.
      </p>
      <p>
        Notice where real agents earn their place: only where nobody can write down the steps in
        advance.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Start simple -------------------------------------------------------------------------------- */

export function StartSimple() {
  const rungs: [string, string, string][] = [
    ["One model call", "×1", "Many applications need nothing more."],
    ["A workflow", "a few calls", "Predictable cost and behaviour; easy to test each step."],
    ["One agent", "≈ 4× a chat", "Flexible; errors can compound over many steps."],
    ["Many agents", "≈ 15× a chat", "For broad, parallel work only."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Start simple"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rungs.map(([t, c, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_6rem_1fr] items-center gap-2 rounded-lg border px-3 py-2 text-xs"
              style={{ marginLeft: `${i * 0.75}rem` }}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-accent font-mono">{c}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            Token multiples are Anthropic&apos;s internal figures for its research system (June
            2025), not universal.
          </p>
        </div>
      }
    >
      <p>
        Anthropic, OpenAI and Google all give the same advice: start with the simplest thing that
        might work, often a single well-prompted call, and add steps or autonomy only when it
        measurably helps.
      </p>
      <p>
        Agents cost more because they take many turns, and a small mistake early can compound.
        Anthropic measured its agents using about four times the tokens of a chat, and multi-agent
        systems about fifteen times.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What would you build first? ----------------------------------------------------------------- */

export function WhatFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What would you build first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="build-first"
            prompt="An insurer wants to pull twelve fields from every claim form and check them against its rules before a person reviews the claim. What should it build first?"
            options={[
              {
                id: "multi",
                label: "A team of agents that discuss each claim",
                feedback: "Far more cost and unpredictability than a fixed, known process needs.",
              },
              {
                id: "agent",
                label: "One agent with tools, free to decide how to handle each claim",
                feedback:
                  "The steps are known in advance, so letting the model choose them adds risk without benefit.",
              },
              {
                id: "chain",
                label:
                  "A workflow: extract the fields, validate them with code, flag problems for the reviewer",
                correct: true,
                feedback: "Yes. Known steps, checkable at each stage, cheap and easy to test.",
              },
              {
                id: "nothing",
                label: "Nothing: models can't read forms",
                feedback:
                  "Extracting fields from documents is a routine model task; the checks make it trustworthy.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Workflow or agent", "Who decides the steps: your code or the model."],
  ["Five patterns", "Chain, route, parallelise, orchestrate, evaluate."],
  ["Known steps", "Use a workflow: cheaper, predictable, testable."],
  ["Unknown steps", "That's where an agent earns its cost."],
  ["Start simple", "Add autonomy only when it measurably helps."],
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
      <p>Next: tools, and why their design decides whether an agent succeeds.</p>
    </StepLayout>
  );
}
