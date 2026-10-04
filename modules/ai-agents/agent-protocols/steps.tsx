"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, STATES } from "./model";
import type { ProtoState } from "./state";

/* 1 ─ A shared business language ------------------------------------------------------------------ */

export function Embassy() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A shared business language"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["Business card", "Who you are, what you do, how to reach you."],
            ["Purchase order", "A standard way to ask for work, with a reference number."],
            ["Delivery note", "A standard way to hand back the result."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Two companies that have never met can still do business, because they share conventions:
        business cards, purchase orders with reference numbers, delivery notes.
      </p>
      <p>
        Agents from different companies need the same. The{" "}
        <Term id="a2a">Agent2Agent protocol (A2A)</Term>, announced by Google in April 2025 and now
        run under the Linux Foundation, gives them a business card, a way to request work and a way
        to return results.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Delegate to another company's agent ⭐ ------------------------------------------------------- */

export function Delegate() {
  const [s, set] = useSceneState<ProtoState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Delegate to another company's agent"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <motion.span
              animate={{ scale: f.from === "travel" ? 1.06 : 1 }}
              className={cn(
                "rounded-lg border px-3 py-2",
                f.from === "travel" ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              Your travel agent
            </motion.span>
            <span className="text-muted flex-1 text-center font-mono text-[10px]">
              {f.from === "travel" ? "→ A2A →" : f.from === "hotel" ? "← A2A ←" : "· · ·"}
            </span>
            <motion.span
              animate={{ scale: f.from === "hotel" ? 1.06 : 1 }}
              className={cn(
                "rounded-lg border px-3 py-2",
                f.from === "hotel"
                  ? "border-viz-compute bg-viz-compute/10"
                  : "border-line bg-surface",
              )}
            >
              Seaside Hotels&apos; agent
            </motion.span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[10px]">
            <span className="text-muted mr-1">TASK</span>
            {STATES.map((st, i) => (
              <span key={st} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted">→</span>}
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 font-mono",
                    f.state === st
                      ? "border-accent bg-accent-soft font-semibold"
                      : "border-line text-muted",
                  )}
                >
                  {st}
                </span>
              </span>
            ))}
          </div>
          <Code>{f.msg}</Code>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.caption}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <p className="text-subtle text-[10px]">
            Messages simplified from the A2A 1.0 specification.
          </p>
        </div>
      }
    >
      <p>
        Your travel agent needs a hotel room; the hotel chain runs its own agent. Neither company
        knows how the other is built. Step through how A2A lets them work together.
      </p>
      <p>
        Every agent publishes an <Term id="agent-card">Agent Card</Term>. Work is tracked as a task
        with clear states, including one for &ldquo;I need more information&rdquo;, and results come
        back as artifacts. Underneath it is ordinary web technology: JSON-RPC over HTTPS, with
        streaming updates and webhooks for long jobs.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tools down, agents across ------------------------------------------------------------------- */

export function TwoDirections() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools down, agents across"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg
            viewBox="0 0 360 190"
            className="w-full max-w-md"
            role="img"
            aria-label="MCP connects agents to tools; A2A connects agents to agents"
          >
            {[
              [40, "Travel agent"],
              [220, "Hotel agent"],
            ].map(([x, l]) => (
              <g key={l as string}>
                <rect
                  x={x as number}
                  y={30}
                  width={100}
                  height={30}
                  rx={6}
                  className="fill-accent/15 stroke-accent"
                />
                <text
                  x={(x as number) + 50}
                  y={49}
                  textAnchor="middle"
                  className="fill-fg text-[10px]"
                >
                  {l}
                </text>
                {[0, 1].map((k) => (
                  <g key={k}>
                    <line
                      x1={(x as number) + 25 + k * 50}
                      y1={60}
                      x2={(x as number) + 25 + k * 50}
                      y2={120}
                      className="stroke-viz-data"
                      strokeDasharray="3 3"
                    />
                    <rect
                      x={(x as number) + 5 + k * 50}
                      y={120}
                      width={40}
                      height={24}
                      rx={4}
                      className="fill-viz-data/10 stroke-viz-data"
                    />
                    <text
                      x={(x as number) + 25 + k * 50}
                      y={135}
                      textAnchor="middle"
                      className="fill-fg text-[8px]"
                    >
                      {x === 40 ? ["search", "calendar"][k] : ["rooms DB", "payments"][k]}
                    </text>
                  </g>
                ))}
              </g>
            ))}
            <line
              x1={140}
              y1={45}
              x2={220}
              y2={45}
              className="stroke-viz-compute"
              strokeWidth={2}
            />
            <text
              x={180}
              y={38}
              textAnchor="middle"
              className="fill-viz-compute text-[10px] font-semibold"
            >
              A2A
            </text>
            <text x={20} y={95} className="fill-viz-data text-[10px] font-semibold">
              MCP
            </text>
            <text x={180} y={175} textAnchor="middle" className="fill-muted text-[9px]">
              MCP: an agent and its tools · A2A: agent and agent
            </text>
          </svg>
        </div>
      }
    >
      <p>
        The two protocols fit together. <Term id="mcp">MCP</Term> connects an agent to its tools and
        data, downwards. A2A connects an agent to other agents, across. Both projects describe them
        as complementary, and both now sit in the Linux Foundation&apos;s Agentic AI Foundation.
      </p>
      <p>
        The difference that matters: a tool does one defined thing; another agent can plan, ask
        questions and take its time, which is why A2A has tasks with states rather than single
        calls.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The wider landscape ------------------------------------------------------------------------- */

export function Landscape() {
  const items: [string, string][] = [
    ["Apr 2025", "Google announces A2A with more than 50 partners."],
    ["Jun 2025", "A2A moves to the Linux Foundation."],
    ["Aug 2025", "IBM's Agent Communication Protocol (ACP) merges into A2A."],
    [
      "Sep 2025",
      "Payments: Google's AP2 builds on A2A and MCP; OpenAI and Stripe publish the Agentic Commerce Protocol.",
    ],
    ["Mar 2026", "A2A version 1.0."],
    ["Aug 2026", "A2A joins the Agentic AI Foundation, alongside MCP."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The wider landscape"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Agent protocols settled fast. Several competing efforts merged or found their niche, and
        payment protocols emerged for agents that buy things on someone&apos;s behalf.
      </p>
      <p>
        Watch the acronyms: IBM&apos;s ACP (agent communication, now part of A2A) and the
        OpenAI–Stripe ACP (agentic commerce) are unrelated.
      </p>
    </StepLayout>
  );
}

/* 5 ─ MCP or A2A? --------------------------------------------------------------------------------- */

export function McpOrA2A() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="MCP or A2A?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mcp-or-a2a"
            prompt="Which protocol fits each connection?"
            categories={[
              { id: "mcp", label: "MCP: agent to tool" },
              { id: "a2a", label: "A2A: agent to agent" },
            ]}
            items={[
              {
                id: "cal",
                label: "Let an assistant read and add calendar events",
                category: "mcp",
                why: "A tool with defined actions.",
              },
              {
                id: "quote",
                label: "A procurement agent asks a supplier's agent for a quote",
                category: "a2a",
                why: "Two agents from different companies.",
              },
              {
                id: "db",
                label: "A coding agent queries a database",
                category: "mcp",
                why: "A tool.",
              },
              {
                id: "hotel",
                label: "A travel agent hands hotel booking to a hotel chain's agent",
                category: "a2a",
                why: "Delegating a task that may need questions and time.",
              },
              {
                id: "docs",
                label: "Offer company document search to many assistants",
                category: "mcp",
                why: "One server, many clients.",
              },
            ]}
            explanation="MCP connects an agent to tools and data. A2A connects independent agents that plan, ask questions and return results over time."
          />
        </div>
      }
    >
      <p>Sort the connections.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A2A: agents across companies", "Discover, delegate, return results."],
  ["Agent Card", "A machine-readable business card."],
  ["Tasks with states", "Including “I need more input”."],
  ["MCP down, A2A across", "Complementary, both open."],
  ["Version 1.0 in 2026", "Under the Linux Foundation."],
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
      <p>Next: frameworks and platforms that do much of this plumbing for you.</p>
    </StepLayout>
  );
}
