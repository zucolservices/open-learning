"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, type Send } from "./model";
import type { GuardState } from "./state";

/* 1 ─ The hotel key card -------------------------------------------------------------------------- */

export function KeyCard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The hotel key card"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Your key card</p>
            <p className="text-muted mt-1">
              Opens room 412 and the gym, until Sunday. Lose it and the damage is small.
            </p>
          </div>
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A master key</p>
            <p className="text-muted mt-1">
              Opens every room, forever. Convenient, until it goes missing.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A hotel gives you a key card that opens your room, not every room. If it&apos;s lost or
        copied, little harm is done. That&apos;s the principle of{" "}
        <Term id="least-privilege">least privilege</Term>: everyone gets only the access their job
        needs.
      </p>
      <p>
        An agent can only do damage with the access you give it. Tight permissions, plus{" "}
        <Term id="agent-guardrail">guardrails</Term> that check inputs, outputs and actions, limit
        what can go wrong when the model makes a mistake or is tricked.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Permissions for an email agent ⭐ ----------------------------------------------------------- */

const SENDS: { id: Send; label: string }[] = [
  { id: "drafts", label: "Drafts only" },
  { id: "internal", label: "Colleagues only" },
  { id: "anyone", label: "Anyone" },
];

export function Permissions() {
  const [s, set] = useSceneState<GuardState>();
  const p = {
    send: s.send,
    del: s.del,
    approval: s.approval,
    outputCheck: s.outputCheck,
    rateLimit: s.rateLimit,
  };
  const results = ACTIONS.map((a) => ({ a, r: a.check(p) }));
  const harmsDone = results.filter((x) => x.a.harmful && x.r.outcome === "done").length;
  const useful = results.find((x) => !x.a.harmful)!.r.outcome;
  const toggles: [keyof GuardState, string][] = [
    ["del", "Can delete emails"],
    ["approval", "Ask a person before sending outside"],
    ["outputCheck", "Check outgoing text for account numbers"],
    ["rateLimit", "Limit to 20 emails an hour"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Permissions for an email agent"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-muted mr-1">Can send to</span>
            {SENDS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.send === x.id}
                onClick={() => set({ send: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1",
                  s.send === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="grid gap-1.5 text-xs sm:grid-cols-2">
            {toggles.map(([k, l]) => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s[k] as boolean}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="accent-accent"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {results.map(({ a, r }) => (
              <motion.div
                key={`${a.id}-${r.outcome}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  a.harmful
                    ? r.outcome === "done"
                      ? "border-bad bg-bad/10"
                      : "border-good bg-good/10"
                    : r.outcome === "blocked"
                      ? "border-bad bg-bad/10"
                      : "border-good bg-good/10",
                )}
              >
                <span>
                  <span className={cn("font-semibold", !a.harmful && "text-accent")}>
                    {a.harmful ? "" : "Useful: "}
                  </span>
                  {a.label}
                  <span className="text-muted block text-[11px]">{r.why}</span>
                </span>
                <span className="text-[10px] font-semibold uppercase">{r.outcome}</span>
              </motion.div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              harmsDone === 0 && useful !== "blocked"
                ? "border-good bg-good/10"
                : "border-viz-compute bg-viz-compute/10",
            )}
          >
            {harmsDone} of 4 harmful actions got through · the useful reply is{" "}
            {useful === "done" ? "sent" : useful === "slowed" ? "slowed by a check" : "impossible"}.
          </p>
          <p className="text-subtle text-[10px]">Illustrative agent and outcomes.</p>
        </div>
      }
    >
      <p>
        An agent answers a company&apos;s inbox. Out of the box it can send to anyone and delete
        anything. Tighten its permissions and add checks until no harmful action gets through, while
        it can still do its actual job of replying to customers.
      </p>
      <p>
        Notice the trade-off: &ldquo;colleagues only&rdquo; is safe but useless here; approval for
        external email keeps it useful and safe, at the cost of a person&apos;s time.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Excessive agency ---------------------------------------------------------------------------- */

export function ExcessiveAgency() {
  const roots: [string, string, string][] = [
    [
      "Too many tools",
      "A “run any shell command” tool when it only needs to read files.",
      "Give only the tools the job needs; make each narrow.",
    ],
    [
      "Too many permissions",
      "Database credentials that can write, when it only reads.",
      "Read-only credentials; act with the user's own permissions.",
    ],
    [
      "Too much autonomy",
      "High-impact actions with nobody checking.",
      "Ask a person before irreversible or costly actions.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Excessive agency"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {roots.map(([t, e, f], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-2 text-xs sm:grid-cols-[9rem_1fr_1fr] sm:gap-3"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-bad">{e}</span>
              <span className="text-good">{f}</span>
            </motion.div>
          ))}
          <p className="text-muted text-[11px]">
            Also enforce permissions in the real systems the tools touch, not in the prompt; logging
            and rate limits don&apos;t prevent harm, but they limit how much happens before someone
            notices.
          </p>
        </div>
      }
    >
      <p>
        The OWASP Top 10 for LLM Applications (2025) calls this risk{" "}
        <Term id="excessive-agency">excessive agency</Term> and traces it to three roots: too many
        tools, too many permissions and too much autonomy.
      </p>
      <p>
        In 1975 Saltzer and Schroeder wrote: &ldquo;Every program and every user of the system
        should operate using the least set of privileges necessary to complete the job.&rdquo; It
        applies to agents exactly.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Layers of guardrails ------------------------------------------------------------------------ */

export function Layers() {
  const layers: [string, string][] = [
    [
      "Input checks",
      "Classify the request or incoming content before the agent acts: off-topic, abusive, a prompt attack.",
    ],
    [
      "Tool permissions",
      "Rate each tool by risk: read or write, reversible or not, money involved. Narrow the risky ones.",
    ],
    [
      "Output checks",
      "Scan what the agent is about to send or do: personal data, account numbers, policy violations.",
    ],
    ["Human approval", "Pause high-impact actions for a person."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Layers of guardrails"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {layers.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
                style={{ marginLeft: `${i * 0.6}rem` }}
              >
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </motion.div>
            ))}
          </div>
          <p className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">Tools: </span>
            <span className="text-muted">
              NVIDIA NeMo Guardrails and Guardrails AI (open source), Meta&apos;s Llama Guard 4
              (open weights), Amazon Bedrock Guardrails, Azure Prompt Shields, and the guardrails
              built into agent SDKs.
            </span>
          </p>
        </div>
      }
    >
      <p>
        No single check is enough, so guardrails come in layers. OpenAI&apos;s agent guide suggests
        rating every tool low, medium or high risk and adding checks or approval to the high ones.
      </p>
      <p>
        A detail that matters: in OpenAI&apos;s Agents SDK, input guardrails run alongside the agent
        by default, so a tool may already have run by the time a check trips. Guardrails reduce
        risk; they don&apos;t make an agent safe by themselves.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which defence is it? ------------------------------------------------------------------------ */

export function WhichDefence() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which defence is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-defence"
            prompt="What kind of defence is each?"
            categories={[
              { id: "least", label: "Least privilege" },
              { id: "check", label: "Guardrail check" },
              { id: "human", label: "Human approval" },
            ]}
            items={[
              {
                id: "ro",
                label: "Give the agent read-only database credentials",
                category: "least",
                why: "Less access to begin with.",
              },
              {
                id: "classifier",
                label: "A classifier screens incoming messages for prompt attacks",
                category: "check",
                why: "An automatic check on input.",
              },
              {
                id: "manager",
                label: "A manager approves refunds over ₹50,000",
                category: "human",
                why: "A person decides.",
              },
              {
                id: "shell",
                label: "Remove the 'run any command' tool",
                category: "least",
                why: "Fewer, narrower tools.",
              },
              {
                id: "redact",
                label: "An output scanner blocks card numbers in replies",
                category: "check",
                why: "An automatic check on output.",
              },
              {
                id: "delete",
                label: "Ask before deleting any file",
                category: "human",
                why: "A person confirms irreversible actions.",
              },
            ]}
            explanation="Least privilege limits what's possible, guardrail checks catch problems automatically, and human approval puts a person in front of high-impact actions. Use all three."
          />
        </div>
      }
    >
      <p>Sort the defences.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Least privilege", "Only the access the job needs."],
  ["Excessive agency", "Too many tools, permissions or autonomy."],
  ["Layered checks", "Input, tools, output, approval."],
  ["Enforce in the system", "Not in the prompt."],
  ["Keep it useful", "Balance safety with doing the job."],
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
      <p>Next: prompt injection, when the data an agent reads starts giving orders.</p>
    </StepLayout>
  );
}
