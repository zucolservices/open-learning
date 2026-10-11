"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHOICES, START_DEBT, simulate, type Choice } from "./model";
import type { DebtState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function CreditCard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Buying the oven on a credit card"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Sensible borrowing</p>
            <p className="text-muted">
              The café puts a new oven on credit to open in time for Diwali, and pays it off in two
              months.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Interest that swallows the profit</p>
            <p className="text-muted">
              It keeps borrowing and only pays the minimum. Soon most of each month&apos;s takings
              go on interest.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Borrowing isn&apos;t bad in itself. It lets you do something now and pay later. The trouble
        starts when nobody pays it back and the interest piles up.
      </p>
      <p>
        <Term id="technical-debt">Technical debt</Term> works the same way. A shortcut ships a
        feature sooner, but every later change in that code is slower, until it&apos;s repaid by
        cleaning up.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Six months ⭐ -------------------------------------------------------------------------------- */

export function SixMonths() {
  const [s, set] = useSceneState<DebtState>();
  const months = simulate(s.plan);
  const total = Math.round(months.reduce((t, m) => t + m.features, 0) * 10) / 10;
  const debt = months.length ? months[months.length - 1].debtAfter : START_DEBT;
  const choose = (c: Choice) => s.plan.length < 6 && set({ plan: [...s.plan, c] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Six months of choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-xs">
            Month {Math.min(s.plan.length + 1, 6)} of 6 · the code starts with some debt already
          </p>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {CHOICES.map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={s.plan.length >= 6}
                onClick={() => choose(c.id)}
                className="border-line bg-surface hover:border-accent rounded-lg border px-3 py-2 text-left text-xs disabled:opacity-40"
              >
                <p className="font-semibold">{c.label}</p>
                <p className="text-muted text-[10px]">{c.detail}</p>
              </button>
            ))}
          </div>
          <div className="border-line bg-surface flex h-36 items-end gap-2 rounded-lg border px-3 pt-3 pb-1">
            {Array.from({ length: 6 }, (_, i) => {
              const m = months[i];
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-24 w-full items-end gap-0.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: m ? `${m.features * 10}%` : 0 }}
                      className="bg-good/60 flex-1 rounded-t"
                      title="features"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: m ? `${m.debtAfter * 100}%` : 0 }}
                      className="bg-bad/50 flex-1 rounded-t"
                      title="debt"
                    />
                  </div>
                  <span className="text-muted text-[9px]">
                    {m
                      ? m.choice === "ship"
                        ? "ship"
                        : m.choice === "steady"
                          ? "steady"
                          : "clean"
                      : `M${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="bg-good/60 size-2.5 rounded-sm" /> features delivered
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-bad/50 size-2.5 rounded-sm" /> debt level
            </span>
            <span className="ml-auto font-mono">Total features: {total}</span>
            {s.plan.length > 0 && (
              <button
                type="button"
                onClick={() => set({ plan: [] })}
                className="border-line-strong flex items-center gap-1 rounded-full border px-2 py-0.5"
              >
                <RotateCcw className="size-3" /> Start over
              </button>
            )}
          </div>
          {s.plan.length === 6 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">
              {debt >= 0.8
                ? "Shortcuts all the way: the first months looked fast, but by the end each feature took several times longer."
                : debt <= 0.15
                  ? "Low debt at the end: steady cleaning kept the team fast, and the next six months will be faster still."
                  : "A mix. Compare the totals with other plans: steady cleaning usually wins over six months."}
            </motion.p>
          )}
          <p className="text-subtle text-[10px]">
            Rates are illustrative, chosen to show the shape of the effect.
          </p>
        </div>
      }
    >
      <p>
        Plan six months for a café app&apos;s team. Each month, choose how to spend the team&apos;s
        time. Debt slows every feature; shortcuts add debt; cleaning reduces it.
      </p>
      <p>
        Try three plans: shortcuts every month, clean-as-you-go every month, and one big cleanup
        followed by shortcuts. Compare the total features delivered and the debt left behind.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Quadrant ------------------------------------------------------------------------------------- */

export function Quadrant() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Not all debt is the same"
      stage={
        <div className="grid flex-1 grid-cols-2 content-center gap-2 text-xs">
          {[
            ["Reckless, deliberate", "“We don't have time for design.”", "bad"],
            ["Prudent, deliberate", "“We must ship now and deal with the consequences.”", "ok"],
            ["Reckless, inadvertent", "“What's layering?”", "bad"],
            ["Prudent, inadvertent", "“Now we know how we should have done it.”", "ok"],
          ].map(([t, q, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * i }}
              className={cn(
                "rounded-lg border px-3 py-3",
                k === "bad" ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1">{q}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Ward Cunningham coined the metaphor in 1992: &ldquo;Shipping first time code is like going
        into debt. A little debt speeds development so long as it is paid back promptly with a
        rewrite.&rdquo;
      </p>
      <p>
        Martin Fowler&apos;s quadrant (2009) separates the kinds. Prudent, deliberate debt is a
        business decision. Prudent, inadvertent debt is unavoidable: you learn as you build. The
        reckless kinds are the ones to stop.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How big, and paying it down ------------------------------------------------------------------ */

export function PayDown() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How big is it, and how to pay it down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Estimates, not measurements</p>
            <p className="text-muted">
              In a 2018 survey for Stripe, developers estimated they spent about 17 of a 41-hour
              week on maintenance, including about 13 hours on technical debt. In a 2020 McKinsey
              survey of about 50 CIOs, they estimated debt at 20–40% of their technology
              estate&apos;s value.
            </p>
          </div>
          {[
            ["Clean as you go", "Leave code a little better each time you touch it."],
            [
              "Make it visible",
              "Record known debt like any other work, with its cost to future changes.",
            ],
            [
              "Pay down where you work",
              "Tie cleanup to the features that need it, so it's easy to justify.",
            ],
            [
              "Budget steadily",
              "A regular share of each cycle beats a heroic cleanup once a year.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs">
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Nobody can measure technical debt precisely, and headline numbers come from opinion surveys.
        They agree on the direction: debt quietly eats a large share of engineering time.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DebtCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of debt?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-debt"
            prompt="Is each a reasonable, prudent kind of debt or a reckless one?"
            categories={[
              { id: "prudent", label: "Prudent" },
              { id: "reckless", label: "Reckless" },
            ]}
            items={[
              {
                id: "diwali",
                label:
                  "Hard-code the Diwali offer to launch tonight, ticket to generalise next week",
                category: "prudent",
                why: "Deliberate, recorded, with a plan to repay.",
              },
              {
                id: "learned",
                label: "After a year, the team realises a better design for orders",
                category: "prudent",
                why: "Learning as you build; now refactor.",
              },
              {
                id: "notests",
                label: "Skip tests on every feature to go faster",
                category: "reckless",
                why: "Pure interest, no plan.",
              },
              {
                id: "copy",
                label: "Copy-paste the payment code into five places, permanently",
                category: "reckless",
                why: "Debt without a repayment plan.",
              },
              {
                id: "ignore",
                label: "Never revisit known shortcuts",
                category: "reckless",
                why: "Unpaid debt compounds.",
              },
            ]}
            explanation="Debt taken on purpose, recorded and repaid is a tool. Debt nobody plans to repay is just slowing the team down."
          />
        </div>
      }
    >
      <p>Sort each choice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Shortcuts borrow time", "Interest comes as slower changes."],
        ["Some debt is wise", "Deliberate, recorded, repaid."],
        ["Steady repayment wins", "Clean as you go."],
        ["Make it visible", "Debt you can't see, you can't plan for."],
        ["Numbers are estimates", "The direction is clear."],
      ]}
    >
      <p>
        That&apos;s the chapter on changing code. Next: tools and team habits, starting with static
        analysis.
      </p>
    </WrapStep>
  );
}
