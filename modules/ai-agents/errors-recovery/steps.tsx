"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INCIDENTS } from "./model";
import type { ErrState } from "./state";

/* 1 ─ The road is closed -------------------------------------------------------------------------- */

export function Satnav() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The road is closed"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Traffic jam", "Wait a few minutes and try again.", "good"],
            ["Wrong turn", "Read the sign, correct course.", "good"],
            ["Bridge washed out", "Stop. Call someone. Don't drive round in circles.", "bad"],
          ].map(([t, d, tone], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                tone === "good" ? "border-line bg-surface" : "border-bad bg-bad/10",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good driver treats different problems differently: wait out a traffic jam, correct a wrong
        turn, and stop to get help when the bridge is out, rather than circling until the fuel runs
        out.
      </p>
      <p>
        Agents meet the same three kinds of trouble: temporary failures worth a retry, mistakes the
        error message explains, and dead ends that need a person. Telling them apart, and having{" "}
        <Term id="stopping-condition">limits</Term> for when they can&apos;t, is what makes an agent
        dependable.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Four failures, your choices ⭐ -------------------------------------------------------------- */

export function Recover() {
  const [s, set] = useSceneState<ErrState>();
  const picks = s.picks ?? {};
  const chosen = INCIDENTS.map((i) => i.options.find((o) => o.id === picks[i.id]));
  const turns = chosen.reduce((a, o) => a + (o?.turns ?? 0), 0);
  const done = chosen.every(Boolean);
  const good = chosen.filter((o) => o?.tone === "good").length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Four failures, your choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-xs">
            An agent is processing a refund. Four things go wrong. Choose how it should respond to
            each.
          </p>
          {INCIDENTS.map((inc) => {
            const o = inc.options.find((x) => x.id === picks[inc.id]);
            return (
              <div
                key={inc.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  !o
                    ? "border-line bg-surface"
                    : o.tone === "good"
                      ? "border-good bg-good/10"
                      : o.tone === "ok"
                        ? "border-viz-compute bg-viz-compute/10"
                        : "border-bad bg-bad/10",
                )}
              >
                <p className="font-semibold">{inc.title}</p>
                <p className="text-bad mt-0.5 font-mono text-[10px]">{inc.error}</p>
                <div className="mt-1.5 flex flex-col gap-1">
                  {inc.options.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={picks[inc.id] === x.id}
                      onClick={() => set({ picks: { ...picks, [inc.id]: x.id } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        picks[inc.id] === x.id ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
                {o && <p className="text-muted mt-1 text-[11px]">{o.result}</p>}
              </div>
            );
          })}
          {done && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                good === 4 ? "border-good bg-good/10" : "border-viz-compute bg-viz-compute/10",
              )}
            >
              {good} of 4 best recoveries · {turns} turns used.{" "}
              {good === 4
                ? "Every failure handled the right way."
                : "Try the others: the right response depends on the kind of failure."}
            </p>
          )}
        </div>
      }
    >
      <p>
        Each failure needs a different response. Temporary errors deserve a patient retry; input
        errors need the call corrected; an action that may already have happened needs an{" "}
        <Term id="idempotency-key">idempotency key</Term> so it can only happen once; and a true
        dead end needs a person.
      </p>
      <p>
        Notice how much the error messages help. A message that says what went wrong and what to try
        lets the model recover on its own.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Retrying politely --------------------------------------------------------------------------- */

const CLIENTS = 6;
const BASE = [1, 2, 4, 8];

export function Backoff() {
  const [s, set] = useSceneState<ErrState>();
  const jit = (c: number, k: number) =>
    s.jitter ? (Math.sin(c * 7.3 + k * 3.1) * 0.5 + 0.5) * BASE[k] : BASE[k];
  const times = Array.from({ length: CLIENTS }, (_, c) => {
    let t = 0;
    return BASE.map((_, k) => (t += jit(c, k)));
  });
  return (
    <StepLayout
      eyebrow="Explore"
      title="Retrying politely"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.jitter}
              onChange={(e) => set({ jitter: e.target.checked })}
              className="accent-accent"
            />
            Add jitter (a random part of each wait)
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            {times.map((row, c) => (
              <div key={c} className="relative h-5">
                <span className="text-muted absolute top-0.5 left-0 text-[10px]">
                  agent {c + 1}
                </span>
                {row.map((t, k) => (
                  <motion.span
                    key={k}
                    animate={{ left: `${14 + (t / 16) * 84}%` }}
                    className="bg-accent absolute top-1.5 size-2 rounded-full"
                  />
                ))}
              </div>
            ))}
            <div className="text-muted mt-1 flex justify-between pl-[14%] text-[10px]">
              <span>0 s</span>
              <span>retry times →</span>
              <span>15 s</span>
            </div>
          </div>
          <p className="text-muted text-xs">
            {s.jitter
              ? "Retries spread out; the recovering service sees a trickle."
              : "Every agent retries at the same moments: waves of traffic hit the service together."}
          </p>
        </div>
      }
    >
      <p>
        <Term id="exponential-backoff">Exponential backoff</Term> doubles the wait after each failed
        try: 1 second, 2, 4, 8. It gives a struggling service room to recover.
      </p>
      <p>
        But if many agents fail at the same moment, they all retry at the same moments too. Adding
        jitter, a random part of each wait, spreads them out. Marc Brooker of AWS showed in 2015 how
        much this cuts wasted work.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How agents fail ----------------------------------------------------------------------------- */

export function Failures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How agents fail"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Repeating steps",
                "Doing the same thing again and again: the most common failure in one large study.",
              ],
              ["Not knowing when to stop", "Carrying on past done, or stopping before it."],
              ["Weak checking", "Declaring success without verifying the result."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">July 2025: an agent deletes a live database</p>
            <p className="text-muted mt-1">
              During a declared code freeze, a Replit coding agent deleted a user&apos;s production
              database, then wrongly said it couldn&apos;t be restored (it could). Replit responded
              by separating development and production databases and adding a planning-only mode.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A Berkeley-led study of over 1,600 multi-agent runs (published at NeurIPS 2025) catalogued
        how agents fail. Repeating steps, not recognising completion and weak verification were
        among the most common.
      </p>
      <p>
        The Replit incident shows the deepest lesson: telling an agent &ldquo;don&apos;t touch
        production&rdquo; is an instruction, not a guardrail. Limits must be enforced by the system,
        through permissions and separate environments, not by the model&apos;s good behaviour.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Retry, fix or stop? ------------------------------------------------------------------------- */

export function WhatToDo() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Retry, fix or stop?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="retry-fix-stop"
            prompt="What should the agent do after each error?"
            categories={[
              { id: "retry", label: "Retry with backoff" },
              { id: "fix", label: "Fix the call" },
              { id: "stop", label: "Stop and escalate" },
            ]}
            items={[
              {
                id: "429",
                label: "Rate limit exceeded. Retry after 30 seconds.",
                category: "retry",
                why: "Temporary: wait, then retry.",
              },
              {
                id: "format",
                label: "date must be YYYY-MM-DD; you sent 12/10",
                category: "fix",
                why: "Waiting won't help; correct the input.",
              },
              {
                id: "503",
                label: "Service temporarily unavailable",
                category: "retry",
                why: "Temporary.",
              },
              {
                id: "perm",
                label: "Refunds over ₹50,000 need a manager's approval",
                category: "stop",
                why: "A rule only a person can satisfy.",
              },
              {
                id: "field",
                label: "Unknown field 'customer'. Did you mean 'customer_id'?",
                category: "fix",
                why: "The message says exactly what to change.",
              },
              {
                id: "locked",
                label: "Account locked pending fraud review",
                category: "stop",
                why: "Not the agent's call to make.",
              },
            ]}
            explanation="Temporary errors: retry patiently. Input errors: correct the call using the message. Policy limits and dead ends: stop and hand over, with a summary."
          />
        </div>
      }
    >
      <p>Sort the errors.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Errors are information", "Say what went wrong and what to try."],
  ["Retry the temporary", "With backoff and jitter."],
  ["Fix the mistaken", "Waiting doesn't fix bad input."],
  ["Make repeats safe", "Idempotency keys for real-world actions."],
  ["Cap and escalate", "Turn and budget limits; hand dead ends to people."],
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
      <p>Next: memory, and what an agent can remember from one day to the next.</p>
    </StepLayout>
  );
}
