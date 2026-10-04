"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LEVELS } from "./model";
import type { AgentState } from "./state";

/* 2 ─ Autonomy is a dial ⭐ ----------------------------------------------------------------------- */

export function Dial() {
  const [s, set] = useSceneState<AgentState>();
  const l = LEVELS[s.level] ?? LEVELS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Autonomy is a dial"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {LEVELS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.level === i}
                onClick={() => set({ level: i })}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "h-2 w-full rounded-full",
                    i <= s.level ? "bg-accent" : "bg-surface-2",
                  )}
                />
                <span
                  className={cn(
                    "text-center text-[10px] leading-tight",
                    s.level === i ? "text-fg font-semibold" : "text-muted",
                  )}
                >
                  {x.name}
                </span>
              </button>
            ))}
          </div>
          <motion.div
            key={s.level}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm">{l.who}</p>
            <Code>{l.code}</Code>
            <p className="text-muted text-xs">
              <span className="text-fg font-semibold">Example: </span>
              {l.example}
            </p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Levels from Hugging Face&apos;s smolagents guide; code is simplified pseudocode.
          </p>
        </div>
      }
    >
      <p>
        &ldquo;Agent&rdquo; isn&apos;t a yes-or-no label. Move along the dial: at each level the
        model controls a little more of what the program does next.
      </p>
      <p>
        Most useful systems sit in the middle. Further right is more flexible, but slower, costlier
        and harder to predict, which is why every major AI lab advises starting simple and adding
        autonomy only when it clearly helps.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What people mean by agent ------------------------------------------------------------------- */

export function Definitions() {
  const defs: [string, string, string][] = [
    [
      "Anthropic, Dec 2024",
      "Workflows follow code paths written in advance; agents let the model direct its own steps and tool use.",
      "“…just LLMs using tools based on environmental feedback in a loop.”",
    ],
    [
      "OpenAI, Apr 2025",
      "Simple chatbots and one-shot classifiers don't count.",
      "“Agents are systems that independently accomplish tasks on your behalf.”",
    ],
    [
      "Google, Sept 2024",
      "An app that pursues a goal by observing the world and acting with tools, looping until done.",
      "From Google's “Agents” whitepaper.",
    ],
    [
      "Russell & Norvig",
      "The textbook definition, decades older: perceive through sensors, act through actuators.",
      "By that definition, even a thermostat is an agent.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What people mean by agent"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {defs.map(([who, d, q], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-accent font-semibold">{who}</p>
              <p className="mt-0.5">{d}</p>
              <p className="text-muted mt-1 italic">{q}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There&apos;s no single official definition. The labs agree on the core, though: a model that
        uses <Term id="tool-calling">tools</Term> and decides its own next steps towards a goal.
      </p>
      <p>
        Watch for a trap: OpenAI uses &ldquo;workflow&rdquo; more loosely than Anthropic does. In
        this track, &ldquo;workflow&rdquo; means steps fixed by your code, and &ldquo;agent&rdquo;
        means steps chosen by the model.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Agents you may have met --------------------------------------------------------------------- */

export function MetAlready() {
  const items: [string, string][] = [
    [
      "Dec 2024",
      "Gemini Deep Research: plans searches, reads dozens of pages and writes a report.",
    ],
    [
      "Feb 2025",
      "OpenAI deep research and a preview of Claude Code, a coding agent in the terminal.",
    ],
    [
      "May 2025",
      "OpenAI Codex and GitHub Copilot's coding agent: assign an issue, get back a pull request.",
    ],
    ["Jul 2025", "ChatGPT agent: browses, fills forms and uses a virtual computer for you."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Agents you may have met"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
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
        Agents went from research demos to everyday products in about a year. Research and coding
        came first, because their results can be checked: a report has sources, and code either
        passes its tests or doesn&apos;t.
      </p>
      <p>
        That pattern recurs throughout this track: agents work best where they can see whether
        they&apos;re succeeding.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Agent or not? ------------------------------------------------------------------------------- */

export function AgentOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Agent or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="agent-or-not"
            prompt="Using this track's meaning, what is each?"
            categories={[
              { id: "single", label: "A single model call" },
              { id: "workflow", label: "Workflow" },
              { id: "agent", label: "Agent" },
            ]}
            items={[
              {
                id: "summary",
                label: "Summarise the email the user pasted",
                category: "single",
                why: "One call, nothing decided.",
              },
              {
                id: "router",
                label: "Send each question to the billing or technical prompt",
                category: "workflow",
                why: "The model picks a branch your code defined.",
              },
              {
                id: "coder",
                label: "Edit files and rerun tests until they pass",
                category: "agent",
                why: "The model chooses each next step in a loop.",
              },
              {
                id: "pipeline",
                label: "For every invoice: extract fields, validate, save",
                category: "workflow",
                why: "Fixed steps in code.",
              },
              {
                id: "research",
                label: "Decide what to search next until the question is answered",
                category: "agent",
                why: "Open-ended, model-directed.",
              },
            ]}
            explanation="If your code fixes the steps, it's a workflow, even with a model inside. If the model decides what to do next, in a loop, it's an agent."
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
  ["Model, tools, loop", "An agent decides its own next step towards a goal."],
  ["Workflow versus agent", "Code fixes the steps, or the model chooses them."],
  ["A dial, not a switch", "Autonomy ranges from routing to full independence."],
  ["No official definition", "But the labs agree on the core."],
  ["Start simple", "Add autonomy only when it clearly helps."],
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
      <p>Next: the loop every agent runs, one turn at a time.</p>
    </StepLayout>
  );
}
