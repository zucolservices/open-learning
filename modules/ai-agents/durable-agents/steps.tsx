"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CRASHES, STEPS, simulate } from "./model";
import type { DurableState } from "./state";

/* 1 ─ Saving the game ----------------------------------------------------------------------------- */

export function SaveGame() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Saving the game"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">No save points</p>
            <p className="text-muted mt-1">
              The power cuts out on level 9. Back to level 1, and you collect the same coins twice.
            </p>
          </div>
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A save after every level</p>
            <p className="text-muted mt-1">
              Back on level 9 in seconds, with exactly the coins you had.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A video game without save points sends you back to the start after every crash. With them,
        you lose a few minutes at most.
      </p>
      <p>
        Real agent tasks can take minutes or days, and must survive crashes, deploys and waiting for
        a person. A <Term id="agent-checkpoint">checkpoint</Term> after each step is the
        agent&apos;s save game: it records where the run is, so it can resume instead of starting
        over, and without repeating things it already did.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Crash and resume ⭐ ------------------------------------------------------------------------- */

export function Crash() {
  const [s, set] = useSceneState<DurableState>();
  const r = simulate(s.crash, s.checkpoints, s.idem);
  const bad = r.refunds > 1 || r.emails > 1 || r.approvals > 1;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Crash and resume"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {CRASHES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.crash === c.id}
                onClick={() => set({ crash: c.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.crash === c.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.checkpoints}
                onChange={(e) => set({ checkpoints: e.target.checked })}
                className="accent-accent"
              />
              Save a checkpoint after each step
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.idem}
                onChange={(e) => set({ idem: e.target.checked })}
                className="accent-accent"
              />
              Refund call uses an idempotency key
            </label>
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3">
            {STEPS.map((st, i) => (
              <div key={st.id} className="grid grid-cols-[1fr_auto] items-center gap-2 text-xs">
                <span className={cn(st.effect && "font-semibold")}>
                  {st.label}{" "}
                  {st.effect && (
                    <span className="text-muted text-[10px]">(changes the real world)</span>
                  )}
                </span>
                <span className="flex gap-1">
                  {Array.from({ length: r.runs[i] }, (_, k) => (
                    <motion.span
                      key={`${s.crash}-${s.checkpoints}-${s.idem}-${k}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "size-3 rounded-full",
                        k > 0
                          ? st.effect === "email" ||
                            st.id === "approve" ||
                            (st.effect === "refund" && !s.idem)
                            ? "bg-bad"
                            : "bg-viz-compute"
                          : "bg-good",
                      )}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
          <div
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              bad ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            <p>
              Refunds paid: <span className="font-mono font-semibold">{r.refunds}</span> · Emails
              sent: <span className="font-mono font-semibold">{r.emails}</span> · Manager asked:{" "}
              <span className="font-mono font-semibold">{r.approvals}</span>×
            </p>
            <p className="text-muted mt-1">
              {s.crash === "none"
                ? "A clean run: every step once."
                : !s.checkpoints
                  ? "No saved state, so the agent starts again from step 1, repeating everything, including the waiting and anything that touched the real world."
                  : bad
                    ? "The crash came after the money moved but before the checkpoint was saved, so the refund step ran again. An idempotency key makes the repeat harmless."
                    : "Resumed from the last checkpoint; nothing was done twice."}
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            Dots: each time a step ran. Green: first run; amber: a harmless repeat; red: a repeated
            real-world action.
          </p>
        </div>
      }
    >
      <p>
        An agent is processing a refund that needs a manager&apos;s approval. Make it crash at
        different points. Without saved state it starts over: asking the manager again, refunding
        again, emailing again.
      </p>
      <p>
        Checkpoints fix most of it, but not a crash between doing something and recording it. That
        gap is why any step that changes the real world must be safe to repeat, here with an{" "}
        <Term id="idempotency-key">idempotency key</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Pausing for a person ------------------------------------------------------------------------ */

export function Pausing() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Pausing for a person"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`def approve_refund(state):
    notify_manager(state["order"])   # runs again on resume!
    decision = interrupt({"amount": state["amount"]})
    return {"approved": decision == "yes"}

graph = builder.compile(checkpointer=PostgresSaver(...))
graph.invoke(inputs, {"configurable": {"thread_id": "ticket-881"}})
# ...two days later, same thread_id:
graph.invoke(Command(resume="yes"), {"configurable": {"thread_id": "ticket-881"}})`}</Code>
          <p className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            On resume, the whole step runs again from its start, so the manager gets a second
            notification. Put the notification in its own step, or make it safe to repeat.
          </p>
        </div>
      }
    >
      <p>
        Pausing for a person is the same problem in slow motion: the agent may wait hours or days.
        Frameworks such as LangGraph save state under a <Term id="agent-thread">thread</Term> id
        after each step; a pause point stops the run, and a later call with the same id resumes it.
      </p>
      <p>
        One gotcha: in LangGraph, resuming re-runs the paused step from its beginning, so anything
        before the pause in that step happens twice. The fix is the same: idempotent actions, or
        separate steps.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools for durable agents -------------------------------------------------------------------- */

export function Engines() {
  const items: [string, string][] = [
    [
      "Framework checkpoints",
      "LangGraph checkpointers and threads; OpenAI Agents SDK sessions; Claude Agent SDK sessions you can resume or fork.",
    ],
    [
      "Durable execution engines",
      "Temporal, Restate, DBOS, Inngest, AWS Step Functions and Lambda durable functions record each finished step and reuse its result after a failure.",
    ],
    [
      "Agents on engines",
      "OpenAI's Agents SDK has a Temporal integration (generally available since March 2026); Pydantic AI supports several engines.",
    ],
    [
      "Server-side history",
      "Some APIs can keep the conversation for you, such as OpenAI's Conversations API.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools for durable agents"
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
        <Term id="durable-execution">Durable execution</Term> engines were built for long business
        processes and fit agents well. After a crash they re-run the program, but skip finished
        steps by reusing their saved results.
      </p>
      <p>
        None of them makes an outside action happen exactly once on its own: steps can still be
        retried. Idempotency stays your job.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What could go wrong? ------------------------------------------------------------------------ */

export function WhatGoesWrong() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What could go wrong?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="resume-risk"
            prompt="An agent's step sends a “payment pending” text to the customer, then pauses for approval. Two days later it resumes. With checkpoints saved after every step, what can still go wrong?"
            options={[
              {
                id: "lost",
                label: "The agent forgets the whole conversation",
                feedback:
                  "Checkpoints save the state under the thread id; that's what they're for.",
              },
              {
                id: "double",
                label:
                  "The customer gets the text twice, because the paused step re-runs on resume",
                correct: true,
                feedback: "Yes. Move the text into its own step, or make sending it idempotent.",
              },
              {
                id: "nothing",
                label: "Nothing: checkpoints make every action happen exactly once",
                feedback:
                  "Checkpoints and engines reduce repeats; they don't guarantee outside actions happen exactly once.",
              },
              {
                id: "approval",
                label: "The approval is applied to a different customer",
                feedback: "The thread id keeps each run's state separate.",
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
  ["Save after every step", "Checkpoints under a thread id."],
  ["Resume, don't restart", "Skip finished work."],
  ["Pauses are long resumes", "Wait for people without losing state."],
  ["Repeats still happen", "Make real-world actions idempotent."],
  ["Use the tools", "Framework checkpoints or durable engines."],
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
      <p>Next: when one agent isn&apos;t enough.</p>
    </StepLayout>
  );
}
