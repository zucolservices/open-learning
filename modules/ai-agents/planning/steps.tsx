"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TODOS, run, type Strategy } from "./model";
import type { PlanState } from "./state";

/* 1 ─ Planning a wedding -------------------------------------------------------------------------- */

export function Wedding() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Planning a wedding"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The checklist</p>
            <p className="text-muted mt-1">
              Venue, caterer, invitations, music: written down months ahead, ticked off one by one.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The phone call</p>
            <p className="text-muted mt-1">
              &ldquo;The venue double-booked us.&rdquo; Nobody throws the checklist away: they fix
              that line and keep going.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Nobody organises a wedding by deciding the next thing each morning. You make a checklist,
        work through it, and when something goes wrong you change the plan, not start again.
      </p>
      <p>
        Agents can work either way. Some decide one step at a time; others make a plan first, a{" "}
        <Term id="task-decomposition">decomposition</Term> of the goal into steps, and then carry it
        out, re-planning when reality disagrees.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Plan first or as you go ⭐ ------------------------------------------------------------------ */

const LABELS: Record<Strategy, string> = {
  react: "Step by step",
  plan: "Plan, then execute",
  replan: "Plan, execute, re-plan",
};

export function Strategies() {
  const [s, set] = useSceneState<PlanState>();
  const r = run(s.strategy, s.surprise);
  const tokens = r.calls.reduce((a, c) => a + c.tokens, 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Plan first or as you go"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Task: organise a two-day team offsite for twelve people.
          </p>
          <div className="flex flex-wrap items-center gap-1">
            {(Object.keys(LABELS) as Strategy[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.strategy === k}
                onClick={() => set({ strategy: k })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.strategy === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {LABELS[k]}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.surprise}
                onChange={(e) => set({ surprise: e.target.checked })}
                className="accent-accent"
              />
              The first venue turns out to be full
            </label>
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3">
            {r.calls.map((c, i) => (
              <motion.div
                key={`${s.strategy}-${s.surprise}-${i}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="grid grid-cols-[5rem_1fr_7rem] items-center gap-2 text-[11px]"
              >
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-center text-[10px]",
                    c.who === "planner"
                      ? "bg-accent-soft text-accent"
                      : c.who === "executor"
                        ? "bg-viz-compute/15"
                        : "bg-viz-data/15",
                  )}
                >
                  {c.who}
                </span>
                <span className={cn("font-mono", c.bad && "text-bad")}>{c.text}</span>
                <span className="bg-surface-2 h-2 overflow-hidden rounded-full">
                  <span
                    className="bg-muted/60 block h-full"
                    style={{ width: `${Math.min(100, (c.tokens / 7500) * 100)}%` }}
                  />
                </span>
              </motion.div>
            ))}
          </div>
          <div
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              r.ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            <p>{r.outcome}</p>
            <p className="text-muted mt-1 text-[11px]">
              {r.calls.length} model calls · about {(tokens / 1000).toFixed(1)}k tokens read
              (illustrative)
            </p>
          </div>
        </div>
      }
    >
      <p>
        Step by step (the ReAct loop from module 2) adapts naturally, but every call re-reads the
        whole growing history. <Term id="plan-and-execute">Plan-and-execute</Term> makes one
        planning call, then short, focused calls for each step, which can be done by a cheaper
        model.
      </p>
      <p>
        Now add the surprise. A fixed plan carries on blindly; adding a re-planning step fixes only
        what broke. One research system, ReWOO, reported about 64% fewer tokens than step-by-step on
        average by planning its tool calls up front.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The living to-do list ----------------------------------------------------------------------- */

export function TodoList() {
  const [s, set] = useSceneState<PlanState>();
  const list = TODOS[s.todo] ?? TODOS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The living to-do list"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-4">
            <p className="text-muted mb-2 font-mono text-[10px]">todo.md</p>
            {list.map(([t, done]) => (
              <motion.p
                key={t}
                layout
                className={cn("font-mono text-xs", done ? "text-muted line-through" : "")}
              >
                {done ? "[x]" : "[ ]"} {t}
              </motion.p>
            ))}
          </div>
          <Stepper
            step={s.todo}
            count={TODOS.length}
            onChange={(n) => set({ todo: n })}
            label="The agent rewrites its list as it works"
          />
        </div>
      }
    >
      <p>
        Many agents keep their plan as a visible to-do list and rewrite it as they go. The Manus
        agent writes a <span className="font-mono">todo.md</span> file; coding agents such as Claude
        Code have task-list tools; Anthropic&apos;s research agent saves its plan to memory so it
        survives when the context fills.
      </p>
      <p>
        Rewriting the list does two jobs: it records progress outside the model, and it puts the
        goal back at the end of the context, where the model pays most attention, so a long task
        doesn&apos;t drift.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Plans need checking ------------------------------------------------------------------------- */

export function CheckPlans() {
  const items: [string, string][] = [
    [
      "Plan-and-Solve (2023)",
      "Just asking a model to devise a plan before answering beat “Let's think step by step” on maths and reasoning puzzles.",
    ],
    [
      "Tree of Thoughts (2023)",
      "Explore several next steps and back up from dead ends: a number puzzle went from 4% to 74% with GPT-4.",
    ],
    [
      "LLM-Modulo (2024)",
      "In tests with GPT-4, only about 12% of plans worked unaided. The authors argue plans need an external checker.",
    ],
    [
      "LLM+P (2023)",
      "Translate the problem for a classical planning program, let it plan, translate back.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Plans need checking"
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
        Planning helps, but model-written plans can be wrong in confident ways: steps in the wrong
        order, missing preconditions, impossible actions. Research from the GPT-4 era found models
        planned poorly without help.
      </p>
      <p>
        Today&apos;s models plan better, but the lesson holds: check plans against reality, with
        tools, tests, rules or a person, before trusting them with anything important.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Plan up front? ------------------------------------------------------------------------------ */

export function PlanOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Plan up front?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="plan-or-not"
            prompt="Which approach suits each task?"
            categories={[
              { id: "plan", label: "Plan up front, re-plan if needed" },
              { id: "step", label: "Decide step by step" },
            ]}
            items={[
              {
                id: "migrate",
                label: "Migrate 40 database tables, each needing the same steps",
                category: "plan",
                why: "Steps are known; plan once, execute cheaply.",
              },
              {
                id: "debug",
                label: "Find out why a test fails only sometimes",
                category: "step",
                why: "Each finding changes what to try next.",
              },
              {
                id: "onboard",
                label: "Set up accounts for a new employee from a checklist",
                category: "plan",
                why: "A known list of steps.",
              },
              {
                id: "research",
                label: "Investigate a competitor's pricing change",
                category: "step",
                why: "Open-ended; follow the leads.",
              },
              {
                id: "form",
                label: "Fill in a 30-field form from a scanned document",
                category: "plan",
                why: "The structure is known in advance.",
              },
            ]}
            explanation="When the steps can be known, plan first: cheaper, easier to check. When each result changes what comes next, decide step by step, ideally with a written to-do list."
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
  ["Decompose the goal", "Break big tasks into steps."],
  ["Plan, then execute", "One planning call, cheap focused steps."],
  ["Re-plan on surprises", "Fix the broken step, keep the rest."],
  ["Keep a to-do list", "It tracks progress and keeps the goal fresh."],
  ["Check the plan", "Against tools, rules or a person."],
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
      <p>Next: agents that check and improve their own work.</p>
    </StepLayout>
  );
}
