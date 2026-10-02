"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUDGET, EVENTS, REQUESTS, SLO, hoursToEmpty, status } from "./model";
import type { BudgetState } from "./state";

/* 1 ─ Spend the budget ⭐ ------------------------------------------------------------------------- */

export function SpendIt() {
  const [s, set] = useSceneState<BudgetState>();
  const spentList = (s.spent ?? []).map((id) => EVENTS.find((e) => e.id === id)!).filter(Boolean);
  const spent = spentList.reduce((n, e) => n + e.bad, 0);
  const st = status(spent);
  const big = spentList.filter((e) => e.bad > BUDGET * 0.2);
  // Remaining budget after each event, for the burn-down line.
  const points = [
    BUDGET,
    ...spentList.map((_, i) => BUDGET - spentList.slice(0, i + 1).reduce((n, e) => n + e.bad, 0)),
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Spend the budget"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">
              SLO {SLO}% over 4 weeks · {REQUESTS.toLocaleString("en-IN")} requests · budget{" "}
              {BUDGET.toLocaleString("en-IN")} bad requests
            </p>
            <div className="bg-surface-2 mt-2 h-4 overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${Math.max(0, (st.left / BUDGET) * 100)}%` }}
                className={cn(
                  "h-full rounded-full",
                  st.level === "ok"
                    ? "bg-good/70"
                    : st.level === "low"
                      ? "bg-viz-compute/70"
                      : "bg-bad/70",
                )}
              />
            </div>
            <p className="mt-1 font-mono text-sm font-semibold">
              {st.left > 0
                ? `${st.left.toLocaleString("en-IN")} left (${Math.round((st.left / BUDGET) * 100)}%)`
                : `Overspent by ${(-st.left).toLocaleString("en-IN")}`}
            </p>
            <svg viewBox="0 0 100 30" className="mt-2 h-14 w-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                className="stroke-accent"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                points={points
                  .map(
                    (v, i) =>
                      `${(i / Math.max(points.length - 1, 1)) * 100},${28 - (Math.max(v, -BUDGET) / BUDGET) * 13 - 13}`,
                  )
                  .join(" ")}
              />
              <line
                x1={0}
                x2={100}
                y1={15}
                y2={15}
                className="stroke-line"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            {EVENTS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => set({ spent: [...(s.spent ?? []), e.id] })}
                className="border-line hover:bg-surface-2 flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-xs"
              >
                {e.label}
                <span className="text-muted shrink-0 font-mono">
                  −{e.bad.toLocaleString("en-IN")}
                </span>
              </button>
            ))}
            {spentList.length > 0 && (
              <button
                type="button"
                onClick={() => set({ spent: [] })}
                className="text-muted flex items-center gap-1 self-start text-xs"
              >
                <RotateCcw className="size-3" /> New four weeks
              </button>
            )}
          </div>
          <motion.div
            key={st.level + big.length}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              st.level === "ok"
                ? "border-good/50 bg-good/10"
                : st.level === "low"
                  ? "border-viz-compute/60 bg-viz-compute/10"
                  : "border-bad/60 bg-bad/10",
            )}
          >
            <p className="font-semibold">
              {st.level === "ok"
                ? "Policy: ship as usual"
                : st.level === "low"
                  ? "Policy: be careful"
                  : "Policy: release freeze"}
            </p>
            <p className="text-muted">
              {st.level === "ok"
                ? "Budget remains. Releases, experiments and planned maintenance go ahead."
                : st.level === "low"
                  ? "Under a quarter left. Risky launches wait; reliability work moves up the list."
                  : '"Halt all changes and releases other than P0 issues or security fixes until the service is back within its SLO."'}
            </p>
            {big.length > 0 && (
              <p className="mt-1 text-xs">
                A single incident used over 20% of the budget: the policy requires a postmortem.
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        If the target is 99.9%, the other 0.1% isn&apos;t failure; it&apos;s an{" "}
        <Term id="error-budget">error budget</Term>. The SRE book calls it &ldquo;a clear, objective
        metric that determines how unreliable the service is allowed to be&rdquo;.
      </p>
      <p>
        Spend it: add releases, incidents and experiments and watch the budget and the{" "}
        <Term id="error-budget-policy">policy</Term> respond. The rules come from the example error
        budget policy in Google&apos;s SRE Workbook, which adds that it is &ldquo;not intended to
        serve as a punishment&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Burn rate ----------------------------------------------------------------------------------- */

const RATES = [1, 2, 6, 14.4, 100, 1000];

export function BurnRate() {
  const [s, set] = useSceneState<BudgetState>();
  const h = hoursToEmpty(s.burn);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Burn rate"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set({ burn: r })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  s.burn === r ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {r}×
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">A 30-day budget lasts</p>
            <p className={cn("font-mono text-2xl font-semibold", h < 24 && "text-bad")}>
              {h >= 48
                ? `${(h / 24).toFixed(1)} days`
                : h >= 1
                  ? `${h.toFixed(1)} hours`
                  : `${Math.round(h * 60)} minutes`}
            </p>
          </div>
          <div className="border-line bg-surface overflow-hidden rounded-xl border text-xs">
            {[
              ["14.4×", "for 1 hour", "2% of the budget gone", "page someone"],
              ["6×", "for 6 hours", "5% gone", "page someone"],
              ["1×", "for 3 days", "10% gone", "open a ticket"],
            ].map((row, i) => (
              <div
                key={row[0]}
                className={cn(
                  "grid grid-cols-4 gap-2 px-3 py-1.5",
                  i > 0 && "border-line border-t",
                )}
              >
                {row.map((c, j) => (
                  <span key={j} className={j === 0 ? "font-mono font-semibold" : "text-muted"}>
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        <Term id="burn-rate">Burn rate</Term> is &ldquo;how fast, relative to the SLO, the service
        consumes the error budget&rdquo;. At 1× it lasts exactly the window; at 14.4×, an hour uses
        2% of a month&apos;s budget; at 1,000×, it&apos;s all gone in 43 minutes.
      </p>
      <p>
        Burn rate is what good alerts watch, as the next module shows. The table is the
        Workbook&apos;s recommended starting point for a 99.9% SLO.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The Friday launch --------------------------------------------------------------------------- */

export function FridayLaunch() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The Friday launch"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="friday-launch"
            prompt="It's day 12 of four weeks and 90% of the error budget is gone after two incidents. Product wants to launch a big new feature on Friday. The team agreed an error budget policy. What does it point to?"
            options={[
              {
                id: "launch",
                label: "Launch anyway; the budget is just a number",
                feedback: "Then the SLO means nothing, and users pay for the next incident.",
              },
              {
                id: "reliability",
                label:
                  "Hold the risky launch, put the team on the incidents' fixes, keep shipping urgent and security fixes",
                correct: true,
                feedback:
                  "That's the agreement working as designed: the budget refills as the window rolls on, and the launch follows.",
              },
              {
                id: "hide",
                label: "Raise the SLO window to 90 days so the numbers look better",
                feedback: "Changing the measure to escape it defeats the purpose.",
              },
              {
                id: "blame",
                label: "Find out who caused the incidents and stop them deploying",
                feedback:
                  "The policy isn't a punishment; it shifts the team's priorities, not blame.",
              },
            ]}
            explanation="An error budget turns an argument about risk into a shared rule: plenty of budget, move fast; budget gone, fix reliability first."
          />
        </div>
      }
    >
      <p>
        The SRE book explains why this matters: &ldquo;The use of an error budget resolves the
        structural conflict of incentives between development and SRE.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Budget = 1 − SLO", "99.9% leaves 0.1% to spend."],
  ["Spend it on purpose", "Releases, experiments, maintenance."],
  ["Agree the policy first", "What happens when it runs out, decided calmly in advance."],
  ["Watch the burn rate", "How fast it's going, not just how much is left."],
  ["Not a punishment", "It's a shared rule for balancing speed and reliability."],
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
      <p>
        GitLab publishes its own: a 99.95% target over 28 days leaves about 20 minutes of budget,
        shared between the product teams and the infrastructure team.
      </p>
      <p>Next: turning burn rates into alerts that wake people only when it matters.</p>
    </StepLayout>
  );
}
