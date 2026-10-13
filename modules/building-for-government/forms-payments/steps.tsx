"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ISSUES, funnel } from "./model";
import type { FormState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Queue() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The counter that sends you away"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Counter 1", "“Wrong form. Get the new one from counter 4.”"],
            ["Counter 4", "“Bring two more photocopies.”"],
            ["Counter 2", "“We only take a demand draft. Come back tomorrow.”"],
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
        Everyone has been bounced between counters. Each obstacle is small, but together they send
        people home without what they came for, and some never return.
      </p>
      <p>
        Online forms do the same, silently. Most public services are forms and payments, and every
        unnecessary field, upload rule or payment hurdle loses applicants. Benefits then flow back
        by <Term id="direct-benefit-transfer">Direct Benefit Transfer</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Funnel() {
  const [s, set] = useSceneState<FormState>();
  const fixed = new Set(s.fixed);
  const f = funnel(fixed);
  const finished = f.at(-1)!.n;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the leaking application"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <div className="flex h-28 items-end gap-2">
              {f.map((x) => (
                <div key={x.stage} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px]">{x.n}</span>
                  <motion.div
                    animate={{ height: `${(x.n / 1000) * 80}px` }}
                    className={cn(
                      "w-full rounded-t-md",
                      x.n > 800 ? "bg-good/70" : x.n > 500 ? "bg-viz-meta/70" : "bg-bad/60",
                    )}
                  />
                  <span className="text-muted text-[10px]">{x.stage}</span>
                </div>
              ))}
            </div>
            <p className="mt-1">
              {finished} of 1,000 eligible students who start, finish.{" "}
              <span className="text-subtle">(Illustrative numbers.)</span>
            </p>
          </div>
          <div className="grid gap-1">
            {ISSUES.map((i) => (
              <div
                key={i.id}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border px-3 py-1.5 sm:flex-row sm:items-center sm:gap-2",
                  fixed.has(i.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <span className="w-full sm:flex-1">
                  <span className="text-muted mr-1 text-[10px]">{i.stage}</span>
                  {i.problem}
                </span>
                <button
                  type="button"
                  aria-pressed={fixed.has(i.id)}
                  onClick={() =>
                    set({
                      fixed: fixed.has(i.id)
                        ? s.fixed.filter((x) => x !== i.id)
                        : [...s.fixed, i.id],
                    })
                  }
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-left text-[10px]",
                    fixed.has(i.id) ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {fixed.has(i.id) ? "Fixed · undo" : i.fix}
                </button>
              </div>
            ))}
          </div>
          <label
            className={cn(
              "flex items-start gap-2 rounded-lg border px-3 py-2",
              s.bank ? "border-good/50 bg-good/10" : "border-viz-meta/50 bg-viz-meta/10",
            )}
          >
            <input
              type="checkbox"
              checked={s.bank}
              onChange={() => set({ bank: !s.bank })}
              className="mt-0.5"
            />
            <span>
              Before submitting, show which bank account the scholarship will be paid into
              <span className="text-muted block text-[11px]">
                {s.bank
                  ? "Students spot an old account and fix it before payment day, not after."
                  : "Benefits linked to Aadhaar go to the last bank that linked it, which may be an account the student forgot."}
              </span>
            </span>
          </label>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s scholarship application is losing more than half the students who start
        it. Each bar is how many are still going at that stage. Apply the fixes and watch the funnel
        fill.
      </p>
      <p>
        Online shops know this well: in Baymard&apos;s research, about 70% of shopping carts are
        abandoned, and long or complicated checkouts cause 17% of those.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Money ---------------------------------------------------------------------------------------- */

export function Money() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Paying fees, receiving benefits"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Paying the government",
              "PayGov (MeitY's gateway), Bharatkosh for central fees and fines, and state treasury e-challans.",
            ],
            [
              "UPI dominates by count",
              "About 85% of all payment transactions by number in 2025 (RBI), though a small share by value.",
            ],
            [
              "Direct Benefit Transfer",
              "About ₹53.8 lakh crore paid straight into bank accounts since 2013, across 320 central schemes (October 2026).",
            ],
            [
              "Estimated gains",
              "The government estimates about ₹5.1 lakh crore saved, mostly by removing duplicate and ineligible beneficiaries. An estimate, not an audit.",
            ],
            [
              "PFMS",
              "The Public Financial Management System checks bank accounts and makes the payments.",
            ],
            [
              "Aadhaar Payment Bridge",
              "Routes a benefit using only the Aadhaar number, to whichever bank linked it last.",
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
        Money flows both ways: fees in through payment gateways, benefits out by DBT. Both need
        clear receipts and status, because people care about money more than about any page.
      </p>
      <p>Offer the payment methods people already use; for most, that&apos;s UPI.</p>
    </StepLayout>
  );
}

/* 4 ─ Receipts ------------------------------------------------------------------------------------- */

export function Receipts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Receipts, status and reconciliation"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "A reference for everything",
              "One number that works online, by SMS, by phone and at a service centre.",
            ],
            [
              "Reconcile automatically",
              "Match each payment confirmation from the bank to an application, so nobody pays twice or is marked unpaid.",
            ],
            [
              "Catch data problems early",
              "Most failed benefit payments trace to name mismatches, inactive accounts or Aadhaar linked to another bank.",
            ],
            [
              "Ask once",
              "The National Scholarship Portal uses a one-time registration number for a student's whole academic career, created with Aadhaar face authentication since 2025-26.",
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
        A failed payment with no receipt becomes a grievance (next module). A clear receipt and
        automatic matching prevent most of them.
      </p>
      <p>Face authentication needs an alternative for people it fails, as module 5 showed.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FormCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How a scholarship reaches a student"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="gov-payments"
            prompt="Put the steps of a scholarship payment in order."
            items={[
              { id: "apply", label: "The student applies with their registration number" },
              { id: "eligible", label: "The scheme portal checks eligibility" },
              { id: "pfms", label: "PFMS validates the bank account and creates the payment" },
              { id: "bank", label: "The bank system moves the money" },
              { id: "sms", label: "The student gets an SMS confirming payment" },
            ]}
            explanation="The scheme decides who is eligible; PFMS checks the account and pays; the banking system moves the money; the student is told. A problem at any step needs a clear status and reference."
          />
        </div>
      }
    >
      <p>Put them in order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Ask only what's needed", "Fill the rest from records."],
        ["Save and resume", "Applications take more than one sitting."],
        ["Pay the way people pay", "UPI first."],
        ["Receipts and references", "Everywhere, for everything."],
        ["Check the bank account", "Before benefits go out."],
      ]}
    >
      <p>Next: grievances, and what they reveal.</p>
    </WrapStep>
  );
}
