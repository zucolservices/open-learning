"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { READY, TARGETS, evaluate, fmt } from "./model";
import type { SlaState } from "./state";

/* 1 ─ The bakery's promise ------------------------------------------------------------------------ */

export function Bakery() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The bakery's promise"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "“Fresh bread in the morning”",
              "Vague: is 10 am morning? Is one late day a broken promise?",
            ],
            [
              "“Bread on the shelf by 7 am, at least 19 days in 20”",
              "Measurable, and honest that some days go wrong.",
            ],
            ["“…or your bread is free”", "Now it's a promise with consequences."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Fresh bread in the morning&rdquo; sounds like a promise, but nobody can say when
        it&apos;s broken. &ldquo;On the shelf by 7, 19 days in 20&rdquo; can be checked, and admits
        the oven sometimes fails.
      </p>
      <p>
        Data needs the same precision. <Term id="data-freshness">Freshness</Term> is how up to date
        data is when someone looks. A <Term id="slo">service level objective</Term> turns &ldquo;the
        dashboard should be fresh&rdquo; into a target you can measure.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A bad month ⭐ ------------------------------------------------------------------------------ */

export function Budget() {
  const [s, set] = useSceneState<SlaState>();
  const r = evaluate(s.deadline, s.target);
  const max = 14;
  const lo = 5;
  const y = (h: number) => 100 - ((Math.min(h, max) - lo) / (max - lo)) * 100;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A bad month"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted">data complete by</span>
            <input
              type="range"
              min={6.5}
              max={10}
              step={0.5}
              value={s.deadline}
              onChange={(e) => set({ deadline: Number(e.target.value) })}
              className="accent-accent w-32"
              aria-label="Deadline"
            />
            <span className="font-mono font-semibold">{fmt(s.deadline)}</span>
            <span className="text-muted ml-2">on</span>
            {TARGETS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.target === t}
                onClick={() => set({ target: t })}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono",
                  s.target === t ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {t}%
              </button>
            ))}
            <span className="text-muted">of weekdays</span>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[10px]">
              TIME YESTERDAY&apos;S ORDERS WERE ALL IN THE DASHBOARD, EACH WEEKDAY
            </p>
            <div className="relative h-36">
              <div
                className="border-accent absolute right-0 left-0 border-t border-dashed"
                style={{ top: `${y(s.deadline)}%` }}
              >
                <span className="text-accent absolute -top-4 right-0 text-[9px]">deadline</span>
              </div>
              <div className="flex h-full items-start gap-0.5">
                {READY.map((h, i) => (
                  <div key={i} className="relative h-full flex-1">
                    <div
                      className={cn(
                        "absolute right-0 left-0 rounded-sm",
                        r.misses[i] ? "bg-bad" : "bg-good",
                      )}
                      style={{ top: `${y(h)}%`, height: 4 }}
                    />
                    <div
                      className={cn(
                        "absolute right-1/2 bottom-0 w-px",
                        r.misses[i] ? "bg-bad/50" : "bg-good/30",
                      )}
                      style={{ top: `${y(h) + 2}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-subtle mt-1 text-[9px]">
              Later is higher. Days 9–11: an upstream outage. Illustrative data.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold">
                Error budget: {r.allowed} late {r.allowed === 1 ? "day" : "days"} a month
              </span>
              <span className={cn("font-semibold", r.ok ? "text-good" : "text-bad")}>
                {r.missed} late · {r.met.toFixed(0)}% on time ·{" "}
                {r.ok ? "objective met" : "objective missed"}
              </span>
            </div>
            <div className="mt-2 flex gap-0.5">
              {r.budget.map((b, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-3 flex-1 rounded-sm",
                    b >= 0 ? (r.misses[i] ? "bg-viz-compute" : "bg-good/40") : "bg-bad",
                  )}
                />
              ))}
            </div>
            <p className="text-muted mt-1 text-[11px]">
              {r.allowed === 0
                ? "A 99% target over 22 days allows no late days at all: one bad morning breaks it."
                : r.ok
                  ? "Budget left (amber: late days paid from it): the team can keep shipping changes."
                  : "Budget overspent (red): pause risky changes and work on reliability until it recovers."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Set a deadline and a target for the sales dashboard, then replay a month that includes a
        three-day upstream outage. The share of days you&apos;re allowed to miss is the{" "}
        <Term id="error-budget">error budget</Term>: 100% minus the target.
      </p>
      <p>
        Try 99%: it sounds responsible, but over a month of weekdays it means never being late. Pick
        a target the team can keep and the business can live with; 100% is never the right answer.
      </p>
    </StepLayout>
  );
}

/* 3 ─ SLI, SLO, SLA ------------------------------------------------------------------------------- */

export function Ladder() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="SLI, SLO, SLA"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Indicator (SLI)",
              "What you measure",
              "Hours since the newest order landed in the table.",
            ],
            ["Objective (SLO)", "The target for it", "Under 9 hours at 08:00, on 95% of weekdays."],
            [
              "Agreement (SLA)",
              "A promise with consequences",
              "If missed, the vendor credits a month's fees.",
            ],
          ].map(([t, d, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
              style={{ marginLeft: `${i * 1}rem` }}
            >
              <span className="text-accent font-semibold">{t}</span>
              <span>
                {d}
                <span className="text-muted block">{e}</span>
              </span>
            </motion.div>
          ))}
          <Code>{`sources:
  - name: shop
    tables:
      - name: orders
        config:
          loaded_at_field: _loaded_at
          freshness:
            warn_after: { count: 6, period: hour }
            error_after: { count: 9, period: hour }`}</Code>
        </div>
      }
    >
      <p>
        These terms come from Google&apos;s Site Reliability Engineering books. The test for an{" "}
        <Term id="sla">SLA</Term>: what happens if it&apos;s missed? If the answer is
        &ldquo;nothing&rdquo;, it&apos;s an objective. Many data &ldquo;SLAs&rdquo; are really SLOs.
      </p>
      <p>
        dbt can check source freshness: it compares the newest load time with warn and error limits.
        Older projects put <span className="font-mono">freshness</span> at the top level; current
        versions put it under <span className="font-mono">config</span>.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Service levels for pipelines ---------------------------------------------------------------- */

export function Pipelines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Service levels for pipelines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["Freshness", "How old is the data?"],
              ["Correctness", "Is it right?"],
              ["Coverage", "Is all of it there?"],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3 text-xs">
            <p className="text-muted text-[10px]">THREE WAYS TO WRITE A FRESHNESS OBJECTIVE</p>
            <p>“X% of data processed within Y minutes”</p>
            <p>“The oldest data is no older than Y”</p>
            <p>“The pipeline job completed within Y”</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-viz-compute bg-viz-compute/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Late data</p>
              <p className="text-muted">Usually means waiting; it arrives eventually.</p>
            </div>
            <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Missing or wrong data</p>
              <p className="text-muted">May need reprocessing and telling everyone who used it.</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Google&apos;s SRE Workbook names three indicators for data pipelines: freshness, correctness
        and coverage. Measure them end to end, at the point where people use the data, not stage by
        stage.
      </p>
      <p>
        Freshness gets the attention because it&apos;s easy to measure, but a late table and a wrong
        table are very different problems.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Indicator, objective or agreement? ---------------------------------------------------------- */

export function WhichOne() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Indicator, objective or agreement?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="sli-slo-sla"
            prompt="Which is each statement?"
            categories={[
              { id: "sli", label: "SLI" },
              { id: "slo", label: "SLO" },
              { id: "sla", label: "SLA" },
            ]}
            items={[
              {
                id: "hours",
                label: "Hours since the customers table last updated",
                category: "sli",
                why: "A measurement, with no target.",
              },
              {
                id: "target",
                label: "Dashboard complete by 08:00 on 95% of weekdays",
                category: "slo",
                why: "A target, with no stated consequence.",
              },
              {
                id: "credit",
                label: "Feed delivered by 06:00 or the provider refunds the day",
                category: "sla",
                why: "There's a consequence.",
              },
              {
                id: "rows",
                label: "Percentage of yesterday's orders present in the table",
                category: "sli",
                why: "Coverage, measured.",
              },
              {
                id: "team",
                label: "Our internal 'SLA': fresh within a day, 99% of the time",
                category: "slo",
                why: "Called an SLA, but nothing happens if it's missed.",
              },
            ]}
            explanation="An indicator is a measurement, an objective is a target for it, and an agreement adds consequences. If nothing happens when it's missed, it's an SLO, whatever it's called."
          />
        </div>
      }
    >
      <p>Sort the statements.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Be specific", "What, by when, how often: a measurable objective."],
  ["SLI → SLO → SLA", "Measure, target, consequences."],
  ["Error budget", "100% minus the target: allowed misses."],
  ["Not 100%", "Pick what users need and the team can keep."],
  ["Beyond freshness", "Correctness and coverage matter too."],
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
        Next: watching the data itself, so problems you didn&apos;t write tests for still surface.
      </p>
    </StepLayout>
  );
}
