"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CLAUSES } from "./model";
import type { ContractState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Tenancy() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Read the lease before you move in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Who fixes the roof?", "Decide now, not when it leaks."],
            ["What does rent cover?", "And what happens if the water stops?"],
            ["How do you leave?", "Notice, deposit back, keys returned."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A tenant who signs a lease without reading it finds out about the roof, the deposit and the
        notice period when it&apos;s too late to negotiate.
      </p>
      <p>
        Most government systems are built and run by vendors. The contract decides{" "}
        <Term id="sla">service levels</Term>, who owns the code and data, how changes are handled
        and how to switch vendors: its <Term id="exit-management">exit management</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Review() {
  const [s, set] = useSceneState<ContractState>();
  const fixed = new Set(s.fixed);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the draft contract"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {CLAUSES.map((c, i) => {
            const on = fixed.has(c.id);
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  on ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                )}
              >
                <p className="font-semibold">
                  {i + 1}. {c.title}
                </p>
                <motion.p
                  key={`${c.id}-${on}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-[10.5px]"
                >
                  {on ? c.fixed : c.draft}
                </motion.p>
                {on && <p className="text-muted mt-0.5 text-[11px]">{c.why}</p>}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    set({ fixed: on ? s.fixed.filter((x) => x !== c.id) : [...s.fixed, c.id] })
                  }
                  className={cn(
                    "mt-1 rounded-full border px-2.5 py-0.5 text-[11px]",
                    on ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {on ? "Fixed · undo" : "Rewrite this clause"}
                </button>
              </div>
            );
          })}
          <p className="text-muted">
            {fixed.size === CLAUSES.length
              ? "Ready to sign: the department can measure, change and leave."
              : `${fixed.size} of ${CLAUSES.length} clauses fixed.`}
          </p>
        </div>
      }
    >
      <p>
        A vendor has sent Kalpanagar its draft contract for a new state portal. Read each clause,
        spot the problem, and rewrite it.
      </p>
      <p>
        The rewrites follow the spirit of MeitY&apos;s model contract. The uptime figure is
        illustrative; this isn&apos;t legal or procurement advice.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Model ---------------------------------------------------------------------------------------- */

export function Model() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="India's model contract"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Model RFP, 2018",
              "MeitY's guidance and sample contract for choosing implementation agencies. Advisory, not mandatory.",
            ],
            [
              "How to choose",
              "Lowest qualified price for clear-cut projects; quality and cost (70:30) for risky ones.",
            ],
            [
              "Service credits",
              "Capped at 12% of fees in one service category and 10% across all, each month.",
            ],
            [
              "Deemed acceptance",
              "If the department doesn't review a deliverable in time (15 days in the template), it counts as accepted.",
            ],
            [
              "Code and escrow",
              "Custom code belongs to the government; source-code escrow is an optional extra safeguard.",
            ],
            [
              "Guarantees",
              "Performance security and a liability cap; the General Financial Rules now set performance security at 3–5% for services.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
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
        The model contract balances both sides: it protects the government&apos;s ownership and
        exit, and protects vendors from endless reviews and unpaid changes.
      </p>
      <p>Older tenders may still quote 10% performance security; check the current rules.</p>
    </StepLayout>
  );
}

/* 4 ─ Lessons -------------------------------------------------------------------------------------- */

export function Lessons() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Lessons from India and abroad"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "The tax portal, 2021",
              "A ₹4,241.97 crore project over 8.5 years (the total outlay, not the vendor's fee) launched for all taxpayers at once in June 2021, during filing season, with widespread glitches.",
            ],
            [
              "The lesson",
              "Lowest price, fixed scope and a big-bang launch put all the risk on one day.",
            ],
            [
              "UK: spend controls",
              "From 2010 to April 2026, central approval of digital spending pushed departments towards open, agile choices; departments now own their assurance under a new playbook.",
            ],
            [
              "US: TechFAR",
              "Guidance on buying digital services in small, iterative contracts and judging vendors by working demonstrations.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Smaller, staged contracts, with working software shown before payment, spread risk better
        than one giant contract with one launch date.
      </p>
      <p>Keep enough skilled people in the department to judge what vendors deliver.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ContractCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe clause or risky?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-contracts"
            prompt="Does each clause protect the department, or put it at risk?"
            categories={[
              { id: "safe", label: "Protects the department" },
              { id: "risky", label: "Puts it at risk" },
            ]}
            items={[
              {
                id: "code",
                label: "The department owns the custom source code",
                category: "safe",
                why: "It can maintain or move the system.",
              },
              {
                id: "data",
                label: "The vendor keeps a copy of citizens' data after the contract",
                category: "risky",
                why: "Data must be returned and deleted.",
              },
              {
                id: "credits",
                label: "Service credits when uptime targets are missed",
                category: "safe",
                why: "Makes targets enforceable.",
              },
              {
                id: "noexit",
                label: "No plan for handing over at the end",
                category: "risky",
                why: "Switching becomes a restart.",
              },
              {
                id: "milestones",
                label: "Payment on accepted milestones",
                category: "safe",
                why: "Pay for what works.",
              },
            ]}
            explanation="Good contracts keep code and data with the government, make service levels enforceable, pay for accepted work and plan the exit from day one."
          />
        </div>
      }
    >
      <p>Sort each clause.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Own the code and data", "Custom code belongs to the government."],
        ["Measurable service levels", "With service credits."],
        ["Pay for accepted work", "Milestones, deemed acceptance."],
        ["Plan the exit on day one", "Handover of code, data, knowledge."],
        ["Small and staged", "Not one big launch."],
      ]}
    >
      <p>Next: measuring whether services actually help people.</p>
    </WrapStep>
  );
}
