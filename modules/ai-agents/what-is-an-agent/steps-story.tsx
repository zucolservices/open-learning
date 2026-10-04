"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

type Who = "you" | "code" | "model";

const RUNS: { title: string; steps: [string, Who][] }[] = [
  {
    title: "Chatbot",
    steps: [
      ["Explains how to search for trains", "model"],
      ["You search, compare and book", "you"],
      ["You add it to your calendar", "you"],
    ],
  },
  {
    title: "Workflow",
    steps: [
      ["Search trains for Friday", "code"],
      ["Model picks the cheapest under ₹800", "model"],
      ["Book it", "code"],
      ["Add to calendar", "code"],
    ],
  },
  {
    title: "Agent",
    steps: [
      ["Search trains for Friday", "model"],
      ["None under ₹800: try Thursday night", "model"],
      ["Ask you: is Thursday OK?", "model"],
      ["Book, then add to calendar", "model"],
    ],
  },
];

const WHO: Record<Who, string> = {
  you: "border-line bg-surface-2",
  code: "border-viz-compute bg-viz-compute/10",
  model: "border-accent bg-accent-soft",
};

function Scene({ index }: { index: number }) {
  const shown = Math.min(index, 2);
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4">
      {RUNS.map((r, i) => (
        <motion.div
          key={r.title}
          animate={{ opacity: i <= shown ? 1 : 0.2 }}
          className="flex flex-col gap-1"
        >
          <p className="text-muted text-[10px] uppercase">{r.title}</p>
          <div className="flex flex-wrap gap-1">
            {r.steps.map(([s, who]) => (
              <span key={s} className={cn("rounded-md border px-2 py-1 text-[11px]", WHO[who])}>
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
      <motion.div
        animate={{ opacity: index >= 3 ? 1 : 0 }}
        className="text-muted flex gap-3 text-[10px]"
      >
        <span className="flex items-center gap-1">
          <span className="bg-surface-2 border-line size-2 rounded-sm border" /> you decide
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-viz-compute/40 size-2 rounded-sm" /> developer&apos;s code decides
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-accent size-2 rounded-sm" /> model decides
        </span>
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "chatbot",
    kicker: "One request",
    title: "Ask a chatbot",
    body: (
      <p>
        &ldquo;Book me a train to Pune on Friday, under ₹800, and put it in my calendar.&rdquo; A
        chatbot can only reply with words. It explains how you might do it. Everything else is still
        your job.
      </p>
    ),
  },
  {
    id: "workflow",
    kicker: "Fixed steps",
    title: "Build a workflow",
    body: (
      <p>
        A developer could write a program that always searches, asks a model to pick the cheapest
        train, books it and adds it to the calendar. The model helps with one step, but the code
        decides the order. Anthropic calls this a <Term id="agent-workflow">workflow</Term>.
      </p>
    ),
  },
  {
    id: "agent",
    kicker: "Free choice",
    title: "Give it to an agent",
    body: (
      <p>
        An <Term id="ai-agent">agent</Term> gets the goal and some tools, and decides each step
        itself. No train under ₹800 on Friday? It tries Thursday night, asks you if that&apos;s OK,
        then books. Nobody wrote those steps in advance.
      </p>
    ),
  },
  {
    id: "who",
    kicker: "The difference",
    title: "Who decides the next step?",
    body: (
      <p>
        That&apos;s the real question. In Anthropic&apos;s words, an agent is usually &ldquo;just
        LLMs using tools based on environmental feedback in a loop.&rdquo; The more steps the model
        chooses, the more <Term id="agent-autonomy">autonomy</Term> it has, for better and for
        worse.
      </p>
    ),
  },
];

export function ThreeWays() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Three ways to book a train
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            The same request, handled by a chatbot, a workflow and an agent.
          </p>
        </div>
      }
    />
  );
}
