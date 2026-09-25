"use client";

import { motion } from "motion/react";
import { BookOpen, FileText, History, ListChecks, UserRound, Wrench } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ The consultant's desk ⭐ ---------------------------------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "desk",
    kicker: "Desk",
    title: "A consultant with an empty desk",
    body: (
      <>
        <p>
          Imagine flying in a brilliant consultant for one hour. They know a huge amount in general,
          but about <em>your</em> company they know only what you put on their desk.
        </p>
        <p>
          A model is the same. Its training gives general knowledge; everything about your task has
          to be in its <Term id="context-window">context window</Term>, sent with every request.
        </p>
      </>
    ),
  },
  {
    id: "pile",
    kicker: "What goes on it",
    title: "Everything on the desk is context",
    body: (
      <>
        <p>
          Instructions, reference documents, the conversation so far, results from tools, facts
          about this customer. The model reads all of it before writing a single word.
        </p>
        <p>If a fact isn&apos;t on the desk, the model can only guess.</p>
      </>
    ),
  },
  {
    id: "edge",
    kicker: "Size",
    title: "The desk has an edge",
    body: (
      <>
        <p>
          Context windows are measured in <Term id="token">tokens</Term>. Some models now take a
          million, but you pay for every token on every request, and long inputs take longer to
          read.
        </p>
        <p>Your whole help centre, every order and every past chat won&apos;t fit, or pay.</p>
      </>
    ),
  },
  {
    id: "clutter",
    kicker: "Clutter",
    title: "A cluttered desk hides things",
    body: (
      <>
        <p>
          Even when everything fits, more isn&apos;t always better. Research keeps finding that
          models miss facts buried among lots of other text, especially in the middle.
        </p>
        <p>You&apos;ll measure this on a real model in a moment.</p>
      </>
    ),
  },
  {
    id: "curate",
    kicker: "Curate",
    title: "Context engineering",
    body: (
      <>
        <p>
          So the job is choosing, for each request, what goes on the desk and in what order: the
          right few documents, a summary rather than the whole history, stable parts first.
        </p>
        <p>
          That&apos;s <Term id="context-engineering">context engineering</Term>. It often matters
          more than how the prompt is worded.
        </p>
      </>
    ),
  },
];

const SHEETS = [
  { id: "rules", label: "Instructions", Icon: ListChecks },
  { id: "docs", label: "Help articles", Icon: BookOpen },
  { id: "chat", label: "Conversation so far", Icon: History },
  { id: "tool", label: "Tool results", Icon: Wrench },
  { id: "cust", label: "Customer's orders", Icon: FileText },
];

function Sheet({
  label,
  Icon,
  i,
  tone,
}: {
  label: string;
  Icon: typeof BookOpen;
  i: number;
  tone?: "dim" | "hot" | "out";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: tone === "dim" ? 0.35 : 1, y: 0 }}
      transition={{ delay: 0.08 * i }}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11px] shadow-sm",
        tone === "hot"
          ? "border-accent bg-accent-soft font-semibold"
          : tone === "out"
            ? "border-bad/50 bg-bad/10"
            : "border-line bg-surface",
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </motion.div>
  );
}

function Scene({ stage }: { stage: number }) {
  const clutter = Array.from({ length: 18 }, (_, i) => `Article ${i + 1}`);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-2">
      <div className="flex items-center gap-2 text-xs">
        <span className="bg-accent-soft grid size-9 place-items-center rounded-full">
          <UserRound className="text-accent size-5" />
        </span>
        <span className="text-muted">
          {stage === 0
            ? "Knows the world in general. Knows nothing about you."
            : "Reads the whole desk, every time"}
        </span>
      </div>
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl border-2 p-3",
          stage >= 2 ? "border-accent/60" : "border-line",
        )}
      >
        <p className="text-subtle absolute -top-2.5 left-3 bg-[var(--bg)] px-1 text-[10px]">
          {stage >= 2 ? "Context window (the desk)" : "The desk"}
        </p>
        {stage === 0 && (
          <div className="text-subtle grid h-40 place-items-center text-xs">empty</div>
        )}
        {(stage === 1 || stage === 2) && (
          <div className="grid min-h-40 grid-cols-2 gap-1.5">
            {SHEETS.map((s, i) => (
              <Sheet key={s.id} {...s} i={i} />
            ))}
          </div>
        )}
        {stage === 3 && (
          <div className="grid min-h-40 grid-cols-3 gap-1">
            {clutter.map((c, i) => (
              <Sheet
                key={c}
                label={i === 8 ? "The one fact" : c}
                Icon={i === 8 ? FileText : BookOpen}
                i={i * 0.3}
                tone={i === 8 ? "hot" : "dim"}
              />
            ))}
          </div>
        )}
        {stage === 4 && (
          <div className="grid min-h-40 content-center gap-1.5">
            {[
              ["Instructions", ListChecks],
              ["3 relevant articles", BookOpen],
              ["Summary of the chat + last few turns", History],
              ["This customer's open order", FileText],
            ].map(([l, I], i) => (
              <Sheet
                key={l as string}
                label={l as string}
                Icon={I as typeof BookOpen}
                i={i}
                tone={i === 1 ? "hot" : undefined}
              />
            ))}
          </div>
        )}
      </div>
      {stage === 2 && (
        <div className="flex w-full max-w-md flex-wrap justify-center gap-1.5">
          {["Whole help centre (180k tokens)", "Every past chat", "All 2 million orders"].map(
            (l, i) => (
              <Sheet key={l} label={l} Icon={BookOpen} i={i + 5} tone="out" />
            ),
          )}
          <p className="text-bad w-full text-center text-[10px]">
            Doesn&apos;t fit, or costs a fortune
          </p>
        </div>
      )}
    </div>
  );
}

export function Desk() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The consultant&apos;s desk
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why what you put in front of a model matters as much as what you ask.
          </p>
        </div>
      }
    />
  );
}
