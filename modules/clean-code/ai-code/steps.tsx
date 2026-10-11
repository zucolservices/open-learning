"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { ISSUES, SUGGESTIONS, type Decision, type Issue } from "./model";
import type { AiState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function NewHire() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A fast, confident new cook"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">What they&apos;re great at</p>
            <p className="text-muted">
              Dozens of plates an hour, every recipe they&apos;ve ever seen, never tired.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">What to watch</p>
            <p className="text-muted">
              Doesn&apos;t know this kitchen&apos;s ways, sometimes invents an ingredient, and never
              says “I&apos;m not sure”.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Imagine a new cook who works incredibly fast and sounds sure of everything, but has never
        seen your kitchen. You&apos;d taste their dishes before they leave the pass, at least for a
        while.
      </p>
      <p>
        <Term id="ai-assistant">AI coding assistants</Term> are a bit like that. They write code
        quickly, but someone still has to read it, understand it and own it. Every clean-code habit
        in this track decides whether generated code helps or slowly makes the codebase harder to
        change.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Review ⭐ ------------------------------------------------------------------------------------ */

const DECISIONS: { id: Decision; label: string }[] = [
  { id: "accept", label: "Accept" },
  { id: "changes", label: "Request changes" },
  { id: "reject", label: "Reject" },
];

export function Review() {
  const [s, set] = useSceneState<AiState>();
  const sg = SUGGESTIONS[s.item];
  const mine = s.issues[sg.id] ?? [];
  const dec = s.decisions[sg.id];
  const toggle = (i: Issue) =>
    set({
      issues: {
        ...s.issues,
        [sg.id]: mine.includes(i) ? mine.filter((x) => x !== i) : [...mine, i],
      },
    });
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Review four suggestions before accepting them"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {SUGGESTIONS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.item === i}
                onClick={() => set({ item: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.item === i
                    ? "border-accent bg-accent text-accent-fg"
                    : s.decisions[x.id]
                      ? "border-line-strong bg-surface-2"
                      : "border-line text-muted",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <motion.div
            key={sg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2"
          >
            <p className="text-xs">
              <span className="text-muted">You asked:</span> {sg.ask}
            </p>
            <Code lines={sg.code} title="Suggested by the assistant" />
            <div>
              <p className="text-muted mb-1 text-[10px]">Problems you can see (tick any)</p>
              <div className="flex flex-wrap gap-1">
                {ISSUES.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    aria-pressed={mine.includes(i.id)}
                    onClick={() => toggle(i.id)}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      mine.includes(i.id)
                        ? "border-accent bg-accent-soft"
                        : "border-line text-muted",
                    )}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {DECISIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={dec === d.id}
                  onClick={() => set({ decisions: { ...s.decisions, [sg.id]: d.id } })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    dec === d.id
                      ? d.id === sg.decision
                        ? "border-good bg-good/20"
                        : "border-bad bg-bad/15"
                      : "border-line-strong",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {dec && (
              <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className={dec === sg.decision ? "text-good" : "text-muted"}>
                  {dec === sg.decision ? "Good call." : "Look again before deciding."} {sg.why}
                </p>
                <p className="text-muted mt-1 text-[10px]">
                  Problems in this one:{" "}
                  {sg.issues.length
                    ? sg.issues
                        .map((i) => ISSUES.find((x) => x.id === i)!.label.toLowerCase())
                        .join(", ")
                    : "none"}
                  .
                </p>
              </div>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        An assistant has offered four pieces of code for a café app. Review each as you would a
        colleague&apos;s pull request: tick the problems you spot, then accept, request changes or
        reject.
      </p>
      <p>
        The failures here are typical: code that duplicates what already exists, misses an edge
        case, or calls something that was never written. All of them look fine at a glance.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The evidence --------------------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the studies say, so far"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Faster on a small task",
              "In 2022, 95 freelancers wrote a small web server about 56% faster with an assistant (Peng et al.). One task, speed only.",
            ],
            [
              "Slower, while feeling faster",
              "In 2025, 16 experienced open-source developers took 19% longer on 246 real tasks with AI tools, yet believed they had been about 20% faster (METR).",
            ],
            [
              "More copying, less tidying",
              "A vendor's analysis of 211 million changed lines found copy-pasted code rising and moved (refactored) code falling from 2020 to 2024 (GitClear, 2025). A correlation, not proof of cause.",
            ],
            [
              "Widely used, cautiously trusted",
              "84% of developers used or planned to use AI tools in 2025, and 46% distrusted the accuracy of their output (Stack Overflow survey).",
            ],
            [
              "An amplifier",
              "Google's DORA research (2025) describes AI as amplifying a team's existing strengths and weaknesses.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The research is young and mixed, and the tools change every few months. The most consistent
        lesson is the gap between how productive AI feels and what&apos;s measured, and the risk of
        more duplicated code if nobody reviews carefully.
      </p>
      <p>That points straight back to the habits in this track.</p>
    </StepLayout>
  );
}

/* 4 ─ Habits --------------------------------------------------------------------------------------- */

export function Habits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Habits for working with an assistant"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Read every line you accept",
              "If you can't explain it, don't merge it. You own it now.",
            ],
            [
              "Search before you accept",
              "Is there already a helper for this? Duplication is the most common cost.",
            ],
            [
              "Ask for tests, especially edge cases",
              "Then read the tests too: they show what the code is meant to do.",
            ],
            [
              "Keep design decisions human",
              "Let the assistant fill in details inside a structure you chose.",
            ],
            [
              "Keep changes small",
              "Small diffs are reviewable; a 600-line generated change isn't.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        None of these are new: they&apos;re how you&apos;d review any colleague&apos;s code. The
        difference is volume. Assistants make it easy to produce more code than anyone can read
        carefully, so the reading has to be deliberate.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AiCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good habit or risk?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-ai"
            prompt="Is each way of using an assistant a good habit or a risk?"
            categories={[
              { id: "good", label: "Good habit" },
              { id: "risk", label: "Risk" },
            ]}
            items={[
              {
                id: "merge",
                label: "Merging a large generated change because the tests pass",
                category: "risk",
                why: "Passing tests aren't understanding.",
              },
              {
                id: "search",
                label: "Checking whether a helper already exists first",
                category: "good",
                why: "Stops duplication.",
              },
              {
                id: "edge",
                label: "Asking for tests of the overnight-hours case",
                category: "good",
                why: "Edge cases are where suggestions slip.",
              },
              {
                id: "api",
                label: "Trusting an unfamiliar method name it used",
                category: "risk",
                why: "It may not exist.",
              },
              {
                id: "design",
                label: "Deciding the structure yourself, then letting it fill in details",
                category: "good",
                why: "Humans own design.",
              },
            ]}
            explanation="Use assistants for speed, but read, test and own what you accept. Watch for duplication, missed edge cases and invented APIs."
          />
        </div>
      }
    >
      <p>Sort each habit.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Generated fast, read slowly", "You own every line you accept."],
        ["Watch for three failures", "Duplication, edge cases, invented calls."],
        ["Ask for tests", "And read them."],
        ["Humans own design", "Assistants fill in details."],
        ["Feeling isn't measuring", "Check the actual effect on your team."],
      ]}
    >
      <p>Next: agreeing on conventions as a team.</p>
    </WrapStep>
  );
}
