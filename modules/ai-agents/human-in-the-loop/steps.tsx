"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ROLES, month } from "./model";
import type { HitlState } from "./state";

/* 1 ─ The autopilot ------------------------------------------------------------------------------- */

export function Autopilot() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The autopilot"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Cruising</p>
            <p className="text-muted mt-1">
              The autopilot flies for hours. The pilots monitor, and stay ready.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Landing in a storm</p>
            <p className="text-muted mt-1">
              The pilots take over. Everyone knows when, and how the handover works.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Airliners fly mostly on autopilot, but pilots don&apos;t leave the cockpit. The art is
        knowing which moments need a person, and making the handover clear.
      </p>
      <p>
        Most useful agents work the same way, with a{" "}
        <Term id="human-in-the-loop">person in the loop</Term> at the moments that matter: approving
        risky actions, unblocking stuck tasks, and taking over when the agent is out of its depth.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A month of expense claims ⭐ ---------------------------------------------------------------- */

const STOPS = [0, 1000, 5000, 10000, 20000, 50000, 1e9];
const LABEL = (t: number) =>
  t === 0 ? "every claim" : t >= 1e9 ? "never" : `claims ≥ ₹${t.toLocaleString("en-IN")}`;

export function Expenses() {
  const [s, set] = useSceneState<HitlState>();
  const idx = Math.max(0, STOPS.indexOf(s.threshold));
  const m = month(s.threshold, s.newVendors);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A month of expense claims"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            An agent checks 400 expense claims a month and gets 12 of them wrong. Where should a
            person look?
          </p>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24">ask a person for</span>
            <input
              type="range"
              min={0}
              max={STOPS.length - 1}
              value={idx}
              onChange={(e) => set({ threshold: STOPS[Number(e.target.value)] })}
              className="accent-accent flex-1"
              aria-label="Approval threshold"
            />
            <span className="w-36 font-mono">{LABEL(s.threshold)}</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.newVendors}
              onChange={(e) => set({ newVendors: e.target.checked })}
              className="accent-accent"
            />
            Always ask for suppliers the company hasn&apos;t paid before
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">{m.asked}</p>
              <p className="text-muted">approvals asked</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">{Math.round(m.minutes / 60)} h</p>
              <p className="text-muted">of someone&apos;s time</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                m.slipped > 7 ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-mono text-lg font-semibold">{m.slipped} of 12</p>
              <p className="text-muted">mistakes slipped through</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                m.lost > 50000 ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-mono text-lg font-semibold">₹{(m.lost / 1000).toFixed(0)}k</p>
              <p className="text-muted">wrongly paid</p>
            </div>
          </div>
          <motion.p
            key={`${s.threshold}-${s.newVendors}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              m.fatigue ? "border-bad bg-bad/10" : "border-line bg-surface",
            )}
          >
            {m.fatigue
              ? `${m.asked} approvals a month: the approver starts clicking “yes” without reading. Only about ${Math.round(m.catchRate * 100)}% of mistakes they see get caught.`
              : m.asked === 0
                ? "Nobody checks anything; every mistake is paid."
                : `Few enough that the approver reads each one carefully: about ${Math.round(m.catchRate * 100)}% of mistakes they see get caught.`}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative claims, mistakes and catch rates.</p>
        </div>
      }
    >
      <p>
        Asking about every claim sounds safest, but 400 approvals a month turns the approver into a
        rubber stamp: people follow and approve automated suggestions without really checking, a
        pattern called <Term id="automation-bias">automation bias</Term>. Asking about nothing lets
        every mistake through.
      </p>
      <p>
        Find the setting that catches the expensive mistakes with the fewest approvals. Targeting
        risk, here large claims and unfamiliar suppliers, beats checking everything.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Levels of autonomy -------------------------------------------------------------------------- */

export function Roles() {
  const [s, set] = useSceneState<HitlState>();
  const r = ROLES[s.role] ?? ROLES[3];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Levels of autonomy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {ROLES.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.role === i}
                onClick={() => set({ role: i })}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "h-2 w-full rounded-full",
                    i <= s.role ? "bg-accent" : "bg-surface-2",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px]",
                    s.role === i ? "text-fg font-semibold" : "text-muted",
                  )}
                >
                  {x.name}
                </span>
              </button>
            ))}
          </div>
          <motion.div
            key={s.role}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
          >
            <p>
              <span className="font-semibold">You are the {r.name.toLowerCase()}. </span>
              {r.human}
            </p>
            <p className="text-muted mt-1 text-xs">e.g. {r.example}</p>
          </motion.div>
          <p className="text-muted text-xs">
            Like the driving-automation scale (SAE levels 0 to 5), defined by what the person must
            still do. Most cars sold today are level 2: the driver must watch the road the whole
            time.
          </p>
        </div>
      }
    >
      <p>
        Researchers at the University of Washington (Feng, McDonald and Zhang, 2025) describe five
        roles for the person, from operator to observer. Their point: how much an agent acts alone
        is a design choice, separate from how capable it is.
      </p>
      <p>
        The right level depends on the stakes. The same agent might act as a consultant for travel
        plans and an approver for payments.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Designing the handover ---------------------------------------------------------------------- */

export function Handover() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Designing the handover"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">A bad prompt</p>
              <p className="text-muted mt-1 font-mono">Allow tool call: payments_create? [y/n]</p>
            </div>
            <div className="border-good bg-good/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">A good prompt</p>
              <p className="text-muted mt-1">
                Pay ₹48,000 to Kestrel Supplies (first payment to this supplier). Invoice #2231
                matches a claim already paid on 2 Sept. Approve anyway?
              </p>
            </div>
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-4 py-3 text-xs">
            <p>Ask rarely, so each request gets real attention.</p>
            <p>Show what will change, why, and what&apos;s unusual about it.</p>
            <p>
              Make the safe choice easy: a clear &ldquo;no&rdquo;, an edit option, a way to
              escalate.
            </p>
            <p>Escalate when the agent keeps failing, not only before risky actions.</p>
          </div>
        </div>
      }
    >
      <p>
        Approval only works if people actually read. Anthropic reports that users approve 93% of
        Claude Code&apos;s permission prompts, a sign that frequent prompts get waved through.
        OpenAI&apos;s agent guide suggests calling a person in two situations: when the agent keeps
        failing, and before sensitive or irreversible actions.
      </p>
      <p>
        Frameworks support pausing: LangGraph&apos;s interrupt, the OpenAI Agents SDK&apos;s
        approval flag on tools, and MCP&apos;s elicitation, which lets a tool ask the user a
        question mid-task.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Ask a person, or act? ----------------------------------------------------------------------- */

export function AskOrAct() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Ask a person, or act?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ask-or-act"
            prompt="Should the agent ask a person first?"
            categories={[
              { id: "ask", label: "Ask a person" },
              { id: "act", label: "Let the agent act" },
            ]}
            items={[
              {
                id: "search",
                label: "Search the help centre for an answer",
                category: "act",
                why: "Read-only and harmless.",
              },
              {
                id: "refund",
                label: "Refund ₹75,000 to a customer",
                category: "ask",
                why: "Costly and hard to reverse.",
              },
              {
                id: "draft",
                label: "Draft a reply for a person to send",
                category: "act",
                why: "Nothing leaves without a person.",
              },
              {
                id: "delete",
                label: "Delete a customer's account",
                category: "ask",
                why: "Irreversible.",
              },
              {
                id: "stuck",
                label: "Third failed attempt to reach the shipping system",
                category: "ask",
                why: "Repeated failure: escalate.",
              },
              {
                id: "tag",
                label: "Tag a ticket as 'billing'",
                category: "act",
                why: "Low risk, easily corrected.",
              },
            ]}
            explanation="Let the agent act on low-risk, reversible steps; ask a person before costly or irreversible actions, and when the agent keeps failing."
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
  ["Autonomy is a design choice", "Pick the person's role per task."],
  ["Target the risk", "Large, irreversible, unfamiliar."],
  ["Too many prompts backfire", "People stop reading."],
  ["Clear handovers", "What, why, what's unusual."],
  ["Escalate on failure", "Not only before risky actions."],
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
      <p>Next: how to tell whether an agent really works.</p>
    </StepLayout>
  );
}
