"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ARCHS, outcome, type Task } from "./model";
import type { MultiState } from "./state";

/* 1 ─ Too many cooks ------------------------------------------------------------------------------ */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Too many cooks"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A wedding feast</p>
            <p className="text-muted mt-1">
              A head chef splits the menu: one cook on starters, one on curries, one on desserts.
              Each dish is independent; the kitchen is fast.
            </p>
          </div>
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">One sauce</p>
            <p className="text-muted mt-1">
              Five cooks seasoning the same pot, each tasting and adding salt. Too many cooks spoil
              the broth.
            </p>
          </div>
        </div>
      }
    >
      <p>
        More cooks speed up a feast of independent dishes, but ruin a single sauce. Whether a team
        helps depends on whether the work splits into pieces that don&apos;t depend on each other.
      </p>
      <p>
        <Term id="multi-agent-system">Multi-agent systems</Term> are the same. Several agents can
        work in parallel or specialise, usually with a lead coordinating them. That pays off on
        broad tasks, and backfires when everyone needs the same context.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One agent or a team? ⭐ --------------------------------------------------------------------- */

const TASKS: { id: Task; label: string; text: string }[] = [
  {
    id: "research",
    label: "Broad research",
    text: "Survey how ten competitors price their product.",
  },
  {
    id: "coding",
    label: "Build a feature",
    text: "Add a discount system touching checkout, invoices and emails.",
  },
];

export function Compare() {
  const [s, set] = useSceneState<MultiState>();
  const r = outcome(s.task, s.arch, s.n);
  const t = TASKS.find((x) => x.id === s.task)!;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One agent or a team?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {TASKS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.task === x.id}
                onClick={() => set({ task: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.task === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
            <span className="text-muted self-center text-[11px]">{t.text}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {ARCHS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.arch === x.id}
                onClick={() => set({ arch: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.arch === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          {s.arch === "orchestrator" && (
            <label className="flex items-center gap-2 text-xs">
              <span className="text-muted">workers</span>
              <input
                type="range"
                min={1}
                max={5}
                value={s.n}
                onChange={(e) => set({ n: Number(e.target.value) })}
                className="accent-accent w-32"
                aria-label="Number of workers"
              />
              <span className="font-mono">{s.n}</span>
            </label>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              ["time", `${r.time} min`, false],
              ["tokens", `≈${r.tokens}× a chat`, r.tokens > 12],
              ["quality", `${r.quality}/100`, r.quality < 70],
              ["clashes", String(r.conflicts), r.conflicts > 0],
            ].map(([k, v, bad]) => (
              <div
                key={k as string}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  bad ? "border-bad bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="font-mono text-base font-semibold">{v}</p>
                <p className="text-muted">{k}</p>
              </div>
            ))}
          </div>
          <motion.p
            key={`${s.task}-${s.arch}-${s.n}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
          >
            {r.note}
          </motion.p>
          <p className="text-subtle text-[10px]">
            Illustrative numbers, shaped by Anthropic&apos;s and Cognition&apos;s published
            experiences.
          </p>
        </div>
      }
    >
      <p>
        Try both tasks. For broad research, a lead with parallel workers is faster and better: each
        worker explores a different angle in its own context and reports back. Anthropic built its
        Research feature this way.
      </p>
      <p>
        For a feature where every part must fit together, parallel writers clash. What works is one
        agent doing the writing, with other agents reviewing or advising. Either way, a team spends
        far more tokens than one agent.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two ways to pass work ----------------------------------------------------------------------- */

export function Handoffs() {
  const [s, set] = useSceneState<MultiState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two ways to pass work"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {(
              [
                ["tool", "Agent as a tool"],
                ["handoff", "Handoff"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.style === k}
                onClick={() => set({ style: k })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.style === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <motion.div
            key={s.style}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="border-accent bg-accent-soft rounded-md border px-2 py-1">
                support agent
              </span>
              <span className="text-muted">
                {s.style === "tool" ? "→ asks →" : "→ hands over →"}
              </span>
              <span className="border-viz-compute bg-viz-compute/10 rounded-md border px-2 py-1">
                refunds agent
              </span>
              {s.style === "tool" && <span className="text-muted">→ answer back to support</span>}
            </div>
            <Code>
              {s.style === "tool"
                ? `support = Agent(name="Support",
    tools=[refunds.as_tool(tool_name="ask_refunds",
                           tool_description="Check refund eligibility")])
# Support stays in charge and talks to the customer.`
                : `support = Agent(name="Support", handoffs=[refunds])
# The model sees a tool like transfer_to_refunds_agent.
# Once called, Refunds takes over the conversation.`}
            </Code>
          </motion.div>
        </div>
      }
    >
      <p>
        OpenAI&apos;s Agents SDK names two patterns. With an agent as a tool, a manager agent calls
        a specialist and stays in charge. With a <Term id="agent-handoff">handoff</Term>, the
        specialist takes over the conversation.
      </p>
      <p>
        Use agents as tools when one agent should own the outcome, and handoffs when the specialist
        should talk to the user directly, like being transferred to the refunds desk.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What builders learned ----------------------------------------------------------------------- */

export function Debate() {
  const items: [string, string][] = [
    [
      "Anthropic, June 2025",
      "Its Research feature: a lead agent plans, workers search in parallel. On an internal test it beat a single agent by 90.2%. It uses about 15× the tokens of a chat, and suits poorly tasks where agents share context, like most coding.",
    ],
    [
      "Cognition, June 2025",
      "“Don't build multi-agents”: share full context, because every action carries hidden decisions, and parallel agents make conflicting ones.",
    ],
    [
      "Cognition, April 2026",
      "Multi-agent works when only one agent writes and the others add intelligence: reviewers, advisors, a manager splitting work. Free-form swarms are “mostly a distraction”.",
    ],
    [
      "Research, 2023–2025",
      "CAMEL, MetaGPT, ChatDev and AutoGen explored agent teams; a 2025 study of 1,600+ runs (MAST) catalogued 14 ways they fail.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What builders learned"
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
        These posts are often framed as opposites, but they agree on more than they disagree. Both
        say tasks that need shared context, such as most coding, are a poor fit for parallel agents.
      </p>
      <p>
        The 90.2% figure is Anthropic&apos;s internal evaluation of research tasks, not a general
        rule. Default to one agent, and add more only for broad, splittable work where the result is
        worth the tokens.
      </p>
    </StepLayout>
  );
}

/* 5 ─ One agent or many? -------------------------------------------------------------------------- */

export function OneOrMany() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One agent or many?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="one-or-many"
            prompt="What fits each task best?"
            categories={[
              { id: "one", label: "One agent" },
              { id: "many", label: "Lead + parallel workers" },
              { id: "review", label: "One writer + reviewers" },
            ]}
            items={[
              {
                id: "survey",
                label: "Compare prices across 20 supplier websites",
                category: "many",
                why: "Independent pieces, searched in parallel.",
              },
              {
                id: "email",
                label: "Answer one customer's email about a delivery",
                category: "one",
                why: "Small and sequential; extra agents add only cost.",
              },
              {
                id: "code",
                label: "Write a payment feature that must pass security review",
                category: "review",
                why: "One author keeps it consistent; reviewers check.",
              },
              {
                id: "papers",
                label: "Summarise 40 research papers into a literature review",
                category: "many",
                why: "Each paper can be read separately.",
              },
              {
                id: "bug",
                label: "Fix a bug in one function",
                category: "one",
                why: "Shared context, small task.",
              },
            ]}
            explanation="Parallel workers suit broad work that splits into independent parts. Shared-context work needs one author, perhaps with reviewers. Small tasks need one agent."
          />
        </div>
      }
    >
      <p>Sort the tasks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Split only what splits", "Independent pieces suit parallel workers."],
  ["Shared context needs one author", "Parallel writers clash."],
  ["Reviewers are safe help", "They add checks without conflicts."],
  ["Teams cost tokens", "≈15× a chat in Anthropic's system."],
  ["Default to one", "Add agents only when it pays."],
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
      <p>Next: how agents from different companies find and work with each other.</p>
    </StepLayout>
  );
}
