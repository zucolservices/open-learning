"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DESIGN, INCIDENTS } from "./model";
import type { CapState } from "./state";

/* 1 ─ Launch week --------------------------------------------------------------------------------- */

export function Launch() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Launch week"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 text-xs">
            <p className="text-muted text-[10px]">FROM: HEAD OF CUSTOMER SERVICE</p>
            <p className="mt-2">
              &ldquo;We get 3,000 support messages a week. Build us an AI agent that answers them,
              handles returns and refunds, and knows when to bring in a person. Launch is in a
              month.&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        You work for a made-up online electronics shop. Customer service wants an{" "}
        <Term id="ai-agent">agent</Term> to handle support: answer questions, process returns and
        refunds, and hand over to staff when needed.
      </p>
      <p>
        First you&apos;ll make five design choices. Then you&apos;ll live through week one, based on
        things that really happened to other companies, and fix each failure with what you&apos;ve
        learned in this track.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design the agent ---------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design the agent"
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
            {Object.keys(design).length} of 5 decided. Your choices decide which failures week one
            brings.
          </p>
        </div>
      }
    >
      <p>
        Make the five calls. Each maps to a part of this track: workflows versus agents, grounding
        answers, permissions, evaluation before release, and keeping people in the loop.
      </p>
      <p>There are no scores here. Week one will show you what each choice leads to.</p>
    </StepLayout>
  );
}

/* 3 ─ Week one: five failures ⭐ ------------------------------------------------------------------ */

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
      title="Week one: five failures"
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
        Week one brings five failures, each modelled on a real case. Some never happen, because your
        design prevented them. For the rest, pick the fix that removes the cause rather than
        patching the symptom.
      </p>
      <p>
        Notice the pattern in the weak fixes: a stricter prompt, a word filter, a promise to be
        careful. Root fixes change what the agent can see and do, or how changes are tested.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It happened to them ------------------------------------------------------------------------- */

export function RealCases() {
  const items: [string, string][] = [
    [
      "Air Canada, Feb 2024",
      "Its chatbot wrongly promised a bereavement refund. A Canadian tribunal held the airline responsible: “It makes no difference whether the information comes from a static page or a chatbot.” It paid about C$812 including interest and fees.",
    ],
    [
      "Chevrolet dealer, Dec 2023",
      "A user told a dealership's chatbot to agree with everything, then got it to “sell” an SUV for $1. The deal wasn't honoured; the bot was taken down.",
    ],
    [
      "DPD, Jan 2024",
      "After a system update its chatbot swore and criticised the company; DPD switched off the AI part.",
    ],
    [
      "Cursor, Apr 2025",
      "A support bot invented a “one device per subscription” rule. The company refunded the user and now labels AI replies.",
    ],
    [
      "Klarna, 2024–2025",
      "Said its assistant did the work of 700 agents (company figures); in 2025 its CEO said the cost focus had lowered quality and began hiring people again.",
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
        These are real. The lessons line up with the track: an agent&apos;s words are the
        company&apos;s words, so ground them in real policy; don&apos;t give it powers it can be
        talked out of; test every change; and keep a way to a person.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Before you launch --------------------------------------------------------------------------- */

export function Checklist() {
  const items: [string, string][] = [
    ["Shape", "Workflows for the known paths; an agent only where steps can't be predicted."],
    ["Tools", "Few, narrow, well-described; errors that say how to recover."],
    ["Permissions", "Least privilege; approval for money and irreversible actions."],
    ["Security", "Assume prompt injection; break the lethal trifecta."],
    ["State", "Checkpoints, idempotent actions, turn and budget limits."],
    ["People", "Clear handovers; AI replies labelled; always a way to a person."],
    ["Evals", "Outcome, path and cost, over many runs, before every release."],
    ["Operations", "Trace every run; watch cost, delay and failure rates."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Before you launch"
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
        Everything in this track, as a launch checklist. None of it needs exotic technology: most of
        it is careful design, honest testing and respect for the people on both sides of the
        conversation.
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
            id="capstone-fixes"
            prompt="Which area does each fix come from?"
            categories={[
              { id: "design", label: "Design and tools" },
              { id: "safety", label: "Safety and people" },
              { id: "ops", label: "Evaluation and operations" },
            ]}
            items={[
              {
                id: "workflow",
                label: "Route common questions to fixed workflows",
                category: "design",
                why: "Workflows or agents (module 3).",
              },
              {
                id: "approval",
                label: "A person approves refunds over ₹5,000",
                category: "safety",
                why: "Guardrails and humans in the loop.",
              },
              {
                id: "evals",
                label: "Run the eval suite before every prompt change",
                category: "ops",
                why: "Evaluating agents.",
              },
              {
                id: "trifecta",
                label: "Keep the browsing agent away from customer records",
                category: "safety",
                why: "Breaking the lethal trifecta.",
              },
              {
                id: "errors",
                label: "Make tool errors say how to recover",
                category: "design",
                why: "Designing tools.",
              },
              {
                id: "trace",
                label: "Trace every run and alert on cost spikes",
                category: "ops",
                why: "Cost, latency and tracing.",
              },
            ]}
            explanation="Good agents come from all three: sound design and tools, safety with people in the loop, and evaluation and monitoring that keep them honest."
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
  ["Start simple", "Workflows first; agents where steps can't be known."],
  ["Design tools for the model", "Clear, narrow, helpful errors."],
  ["Limit the damage", "Least privilege, guardrails, approvals."],
  ["Assume it can be fooled", "Break the lethal trifecta."],
  ["Prove it works", "Evals before release, traces after."],
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
        That&apos;s the AI Agents track. Agents are powerful because they choose their own steps,
        and risky for the same reason. Build them like any important system: simple first, limited
        by design, tested honestly and watched closely.
      </p>
    </StepLayout>
  );
}
