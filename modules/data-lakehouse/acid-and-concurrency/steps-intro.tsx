"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { AcidState } from "./state";

/* 1 ─ One transfer, four promises ------------------------------------------------ */

type Letter = AcidState["letter"];

interface Outcome {
  asha: number;
  ravi: number;
  /** What the observer (auditor, app…) sees as the bank's total. */
  total: number;
  events: string[];
  verdict: string;
  ok: boolean;
}

const START = { asha: 2000, ravi: 800 };
const TOTAL = START.asha + START.ravi;

const PROMISES: Record<
  Letter,
  { word: string; guards: string; scenario: string; without: Outcome; with: Outcome }
> = {
  A: {
    word: "Atomic",
    guards: "All or nothing",
    scenario:
      "Asha sends Ravi ₹500. The server crashes after taking money from Asha, before paying Ravi.",
    without: {
      asha: 1500,
      ravi: 800,
      total: 2300,
      events: ["Debit Asha ₹500 ✓", "💥 crash", "Credit Ravi ₹500 never happens"],
      verdict: "₹500 has vanished. Half a change was kept.",
      ok: false,
    },
    with: {
      asha: 2000,
      ravi: 800,
      total: TOTAL,
      events: ["Debit Asha ₹500 (pending)", "💥 crash", "Restart: incomplete transfer undone"],
      verdict: "Nothing happened, and the transfer can be retried. No half-changes survive.",
      ok: true,
    },
  },
  C: {
    word: "Consistent",
    guards: "Rules always hold",
    scenario:
      "The bank's rule: no balance may go below zero. Asha tries to send ₹2,500 but only has ₹2,000.",
    without: {
      asha: -500,
      ravi: 3300,
      total: TOTAL,
      events: ["Debit Asha ₹2,500 ✓", "Credit Ravi ₹2,500 ✓"],
      verdict: "Asha's balance is −₹500. The rule was broken, even though no money vanished.",
      ok: false,
    },
    with: {
      asha: 2000,
      ravi: 800,
      total: TOTAL,
      events: ["Check: 2,000 − 2,500 < 0", "Transfer rejected before anything changes"],
      verdict: "The change breaks a rule, so it's refused. Data only moves between valid states.",
      ok: true,
    },
  },
  I: {
    word: "Isolated",
    guards: "No interference",
    scenario: "An auditor adds up all balances at the very moment the ₹500 transfer is running.",
    without: {
      asha: 1500,
      ravi: 1300,
      total: 2300,
      events: [
        "Transfer: debit Asha",
        "Auditor reads Asha (1,500) and Ravi (800)",
        "Transfer: credit Ravi",
      ],
      verdict: "The auditor saw a half-done transfer and reports ₹2,300. ₹500 seems missing.",
      ok: false,
    },
    with: {
      asha: 1500,
      ravi: 1300,
      total: TOTAL,
      events: [
        "Transfer: debit + credit",
        "Auditor reads a consistent snapshot: before or after, never in between",
      ],
      verdict:
        "The auditor sees ₹2,800 either way. Concurrent work behaves as if it ran one at a time.",
      ok: true,
    },
  },
  D: {
    word: "Durable",
    guards: "Done means done",
    scenario: "The app shows “Transfer successful”. A second later, the power goes out.",
    without: {
      asha: 2000,
      ravi: 800,
      total: TOTAL,
      events: [
        "Transfer applied in memory",
        "“Transfer successful” shown",
        "⚡ power cut: memory lost",
      ],
      verdict: "After restart the transfer is gone, although the customer was told it succeeded.",
      ok: false,
    },
    with: {
      asha: 1500,
      ravi: 1300,
      total: TOTAL,
      events: [
        "Transfer written to durable storage",
        "“Transfer successful” shown",
        "⚡ power cut",
      ],
      verdict:
        "After restart the transfer is still there. Success is only reported once it's safe.",
      ok: true,
    },
  },
};

export function FourPromises() {
  const [s, set] = useSceneState<AcidState>();
  const p = PROMISES[s.letter];
  const o = s.withPromise ? p.with : p.without;

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="One transfer, four promises"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(PROMISES) as Letter[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => set({ letter: l, withPromise: false })}
                className={cn(
                  "rounded-xl border px-2 py-2 text-center transition-colors",
                  l === s.letter
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="block text-2xl font-semibold">{l}</span>
                <span className="text-muted block text-[11px]">{PROMISES[l].word}</span>
              </button>
            ))}
          </div>

          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-xs">{p.guards}</p>
            <p className="mt-0.5 text-sm">{p.scenario}</p>
          </div>

          <Segmented
            size="sm"
            value={s.withPromise ? "with" : "without"}
            options={[
              ["without", "Without the promise"],
              ["with", "With the promise"],
            ]}
            onChange={(v) => set({ withPromise: v === "with" })}
          />

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem]">
            <Account name="Asha" value={o.asha} before={START.asha} />
            <Account name="Ravi" value={o.ravi} before={START.ravi} />
            <div
              className={cn(
                "rounded-xl border p-3 transition-colors",
                o.total === TOTAL ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <p className="text-muted text-[11px]">
                {s.letter === "I" ? "Auditor's total" : "Money in the bank"}
              </p>
              <motion.p
                key={`${s.letter}-${s.withPromise}-t`}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="font-mono text-xl font-semibold tabular-nums"
              >
                ₹{o.total.toLocaleString("en-IN")}
              </motion.p>
              <p className="text-subtle text-[10px]">should be ₹{TOTAL.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${s.letter}-${s.withPromise}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3",
                o.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <ol className="text-muted grid gap-0.5 font-mono text-[11px]">
                {o.events.map((e, i) => (
                  <motion.li
                    key={e}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * i }}
                  >
                    {i + 1}. {e}
                  </motion.li>
                ))}
              </ol>
              <p className="mt-2 text-sm font-medium">{o.verdict}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Before lakehouses, think of a bank. Moving money is a{" "}
        <Term id="transaction">transaction</Term>: several changes that must behave as one.
      </p>
      <p>
        Databases make four promises about transactions, together called <Term id="acid">ACID</Term>
        . Pick each letter and flip the switch to see what goes wrong without it.
      </p>
      <p>
        Every promise protects against a different failure. Keep the bank in mind: next you&apos;ll
        see how a lakehouse keeps the same four promises with no database server at all.
      </p>
    </StepLayout>
  );
}

function Account({ name, value, before }: { name: string; value: number; before: number }) {
  const diff = value - before;
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-muted text-[11px]">{name}</p>
      <motion.p
        key={value}
        initial={{ y: -4, opacity: 0.4 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn("font-mono text-xl font-semibold tabular-nums", value < 0 && "text-bad")}
      >
        ₹{value.toLocaleString("en-IN")}
      </motion.p>
      <p className="text-subtle font-mono text-[10px]">
        {diff === 0
          ? "unchanged"
          : `${diff > 0 ? "+" : "−"}₹${Math.abs(diff).toLocaleString("en-IN")}`}
      </p>
    </div>
  );
}
