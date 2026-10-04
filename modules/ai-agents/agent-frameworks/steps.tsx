"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { JOBS, OPTIONS } from "./model";
import type { FwState } from "./state";

/* 1 ─ Build it, or buy a kit ---------------------------------------------------------------------- */

export function FlatPack() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Build it, or buy a kit"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["Timber and tools", "Total control; every joint is your job."],
            ["A flat-pack kit", "Pre-cut pieces and instructions; you assemble."],
            [
              "Delivered and fitted",
              "Someone else builds and installs it; you choose from their range.",
            ],
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
        You can make a bookshelf from raw timber, assemble a flat-pack kit, or have one delivered
        and fitted. Each step saves work and gives up some control.
      </p>
      <p>
        Agents are the same. You can write the loop yourself in a few dozen lines, use an{" "}
        <Term id="agent-framework">agent framework</Term> that adds tools, memory and tracing, or
        run on a managed <Term id="agent-platform">agent platform</Term> that also hosts, scales and
        secures the agent for you.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Who does which job? ⭐ ---------------------------------------------------------------------- */

export function Map() {
  const [s, set] = useSceneState<FwState>();
  const o = OPTIONS.find((x) => x.id === s.option) ?? OPTIONS[0];
  const yours = JOBS.filter((j) => !j.by[o.id]).length;
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Who does which job?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {OPTIONS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.option === x.id}
                onClick={() => set({ option: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.option === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">e.g. {o.examples}</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {JOBS.map((j, i) => {
              const kit = j.by[o.id];
              return (
                <motion.div
                  key={`${o.id}-${j.id}`}
                  initial={{ opacity: 0, x: kit ? 6 : -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-xs",
                    kit ? "border-good bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span>{j.label}</span>
                  <span
                    className={cn("text-[10px] font-semibold", kit ? "text-good" : "text-muted")}
                  >
                    {kit ? "handled for you" : "your job"}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted">
              your jobs: {yours} of {JOBS.length}
            </span>
            <span className="text-muted ml-auto">dependence on one vendor</span>
            <span className="flex gap-0.5">
              {[1, 2, 3, 4].map((k) => (
                <span
                  key={k}
                  className={cn(
                    "h-3 w-3 rounded-sm",
                    k <= o.lockIn ? "bg-viz-compute" : "bg-surface-2",
                  )}
                />
              ))}
            </span>
          </div>
          <p className="text-subtle text-[10px]">
            A rough guide; individual products vary, and features change often.
          </p>
        </div>
      }
    >
      <p>
        Pick a way to build and see which jobs it takes off your hands. Calling the model API
        directly leaves everything to you. Agent SDKs handle the loop, tools and handoffs. Graph
        frameworks add durable, resumable state. Managed platforms also run the infrastructure.
      </p>
      <p>
        Every job a product handles for you is also a way you depend on it. That&apos;s not bad, but
        it&apos;s worth choosing on purpose.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The main options ---------------------------------------------------------------------------- */

export function Landscape() {
  const groups: [string, [string, string][]][] = [
    [
      "Open-source frameworks",
      [
        ["LangGraph", "Graphs with checkpoints for long, controllable agents (1.0, Oct 2025)."],
        ["Microsoft Agent Framework", "Successor to AutoGen and Semantic Kernel (1.0, Apr 2026)."],
        [
          "CrewAI, LlamaIndex, Pydantic AI, smolagents",
          "Role-based crews, agents over your data, type-safe agents, code-writing agents.",
        ],
      ],
    ],
    [
      "Model makers' SDKs",
      [
        ["OpenAI Agents SDK", "Agents, tools, handoffs, guardrails, tracing (Mar 2025)."],
        ["Claude Agent SDK", "The harness behind Claude Code (renamed Sept 2025)."],
        ["Google ADK, AWS Strands Agents", "Open-source kits from the clouds (2025)."],
      ],
    ],
    [
      "Managed platforms",
      [
        [
          "Amazon Bedrock AgentCore",
          "Runtime, memory, identity and gateway services (GA Oct 2025).",
        ],
        ["Google Agent Runtime", "In the Gemini Enterprise Agent Platform (formerly Vertex AI)."],
        [
          "Microsoft Foundry Agent Service; Claude Managed Agents",
          "Hosted agents from Microsoft and Anthropic.",
        ],
      ],
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The main options"
      stage={
        <div className="grid flex-1 content-center gap-2 lg:grid-cols-3">
          {groups.map(([g, items], gi) => (
            <motion.div
              key={g}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * gi }}
              className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border p-3 text-xs"
            >
              <p className="text-muted text-[10px] uppercase">{g}</p>
              {items.map(([t, d]) => (
                <p key={t}>
                  <span className="font-semibold">{t}: </span>
                  <span className="text-muted">{d}</span>
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There are dozens of options; these are prominent examples as of October 2026. Most SDKs work
        with models from several providers, and nearly all support MCP for tools.
      </p>
      <p>Names and versions change constantly, so check what&apos;s current before you choose.</p>
    </StepLayout>
  );
}

/* 4 ─ Choosing and staying portable --------------------------------------------------------------- */

export function Portable() {
  const changes: [string, string][] = [
    ["Aug 2026", "OpenAI's Assistants API shut down; builders moved to the Responses API."],
    ["Jul 2026", "Amazon's classic Bedrock Agents closed to new customers in favour of AgentCore."],
    ["Apr 2026", "Google renamed Vertex AI to Gemini Enterprise Agent Platform."],
    ["Apr 2026", "Microsoft Agent Framework 1.0; AutoGen moves to maintenance mode."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing and staying portable"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">QUESTIONS TO ASK</p>
            <p>Do you need durable state, or is each task short?</p>
            <p>Which models and clouds must it support?</p>
            <p>Who will run it: your platform team, or a managed service?</p>
            <p>Can you see every step (tracing) and test it (evals)?</p>
            <p>How hard would it be to move?</p>
          </div>
          <div className="flex flex-col gap-1">
            {changes.map(([d, t]) => (
              <div key={t} className="grid grid-cols-[4.5rem_1fr] gap-2 text-xs">
                <span className="text-accent font-mono">{d}</span>
                <span className="text-muted">{t}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        In the past year alone, APIs were shut down, services closed to new customers and products
        renamed. Plan for change: keep prompts, tools and evaluations in your own code and open
        formats such as MCP, so moving frameworks means rewiring, not rewriting.
      </p>
      <p>
        Start with the simplest option that does the job; a framework should remove work, not add
        concepts you don&apos;t need.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Framework or platform? ---------------------------------------------------------------------- */

export function FrameworkOrPlatform() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Framework or platform?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="framework-platform"
            prompt="Is each a library you run yourself, or a managed service?"
            categories={[
              { id: "framework", label: "Framework you run" },
              { id: "platform", label: "Managed platform" },
            ]}
            items={[
              {
                id: "lg",
                label: "LangGraph",
                category: "framework",
                why: "An open-source library.",
              },
              {
                id: "ac",
                label: "Amazon Bedrock AgentCore",
                category: "platform",
                why: "AWS runs it.",
              },
              {
                id: "adk",
                label: "Google Agent Development Kit",
                category: "framework",
                why: "Open source.",
              },
              {
                id: "foundry",
                label: "Microsoft Foundry Agent Service",
                category: "platform",
                why: "Microsoft runs it.",
              },
              {
                id: "crew",
                label: "CrewAI",
                category: "framework",
                why: "An open-source library.",
              },
              {
                id: "cma",
                label: "Claude Managed Agents",
                category: "platform",
                why: "Anthropic hosts it.",
              },
            ]}
            explanation="Frameworks are code you run in your own infrastructure; platforms run, scale and secure agents for you as a cloud service."
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
  ["Raw API, SDK, framework, platform", "Each handles more for you."],
  ["Each job handled is a dependence", "Choose on purpose."],
  ["Many good options", "Most support several models and MCP."],
  ["Things change fast", "Shutdowns and renames every year."],
  ["Stay portable", "Own your prompts, tools and evals."],
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
      <p>Next: guardrails and permissions that limit what can go wrong.</p>
    </StepLayout>
  );
}
