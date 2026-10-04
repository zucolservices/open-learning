"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, SEVERITIES } from "./model";
import type { IncState } from "./state";

/* 1 ─ The product recall -------------------------------------------------------------------------- */

export function Recall() {
  const steps = [
    "Confirm the fault",
    "Pull it from shelves",
    "Tell customers",
    "Replace or refund",
    "Fix the factory",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The product recall"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {steps.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="text-accent font-mono text-xs">{i + 1}</span>
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        When a food company finds a contaminated batch, it doesn&apos;t start by redesigning the
        factory. It confirms the problem, pulls the batch from shelves, tells customers, replaces
        what they bought, and only then fixes the cause for good.
      </p>
      <p>
        A <Term id="data-incident">data incident</Term> (wrong, missing or late data reaching the
        people who rely on it) deserves the same calm order: confirm, contain, communicate, repair,
        learn.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Monday, 09:10 ⭐ ---------------------------------------------------------------------------- */

export function Monday() {
  const [s, set] = useSceneState<IncState>();
  const picks = s.picks ?? [];
  const step = picks.length;
  const done = step >= DECISIONS.length;
  const d = DECISIONS[Math.min(step, DECISIONS.length - 1)];
  const chosen = picks
    .map((id, i) => DECISIONS[i].choices.find((c) => c.id === id)!)
    .filter(Boolean);
  const last = chosen[chosen.length - 1];
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Monday, 09:10"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2 rounded-xl px-3 py-2 font-mono text-[10px] leading-relaxed">
            <p className="text-muted">incident document</p>
            {chosen.length === 0 && <p className="text-subtle">(empty)</p>}
            {chosen.map((c) => (
              <p key={c.id} className={c.good ? "text-fg" : "text-bad"}>
                {c.log}
              </p>
            ))}
          </div>
          {last && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                last.good ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {last.outcome}
            </motion.div>
          )}
          {!done ? (
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-accent font-mono text-xs">{d.time}</p>
              <p className="mt-1 text-sm font-semibold">{d.prompt}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set({ picks: [...picks, c.id] })}
                    className="border-line hover:bg-surface-2 rounded-lg border px-3 py-1.5 text-left text-xs"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted text-sm">
                {chosen.every((c) => c.good)
                  ? "Bad numbers were contained in 15 minutes, fixed by lunch, and the pipeline is safer than before."
                  : "Go back and try the other choices: each one changes how the day goes."}
              </p>
              <button
                type="button"
                onClick={() => set({ picks: [] })}
                className="text-muted flex shrink-0 items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Replay
              </button>
            </div>
          )}
        </div>
      }
    >
      <p>
        Sunday&apos;s revenue is doubled on the sales dashboard. You&apos;re the{" "}
        <Term id="incident-commander">incident commander</Term>: you coordinate rather than fix.
        Make six decisions and watch the incident document fill up.
      </p>
      <p>
        Google&apos;s SRE advice carries straight over to data: declare early, separate roles so
        only one person changes things, stop the bleeding before hunting the root cause, and keep
        the people affected informed.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How bad is it? ------------------------------------------------------------------------------ */

export function Severity() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How bad is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SEVERITIES.map(([sev, what, resp], i) => (
            <motion.div
              key={sev}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "grid grid-cols-[4rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs",
                i === 0
                  ? "border-bad bg-bad/10"
                  : i === 1
                    ? "border-viz-compute bg-viz-compute/10"
                    : "border-line bg-surface",
              )}
            >
              <span className="font-mono font-semibold">{sev}</span>
              <span>
                {what}
                <span className="text-muted block">{resp}</span>
              </span>
            </motion.div>
          ))}
          <div className="border-line bg-surface mt-1 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Declare an incident if any is true</p>
            <p className="text-muted">
              You need a second team · users can see it · an hour&apos;s focused work hasn&apos;t
              solved it.
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            An example scale; every organisation defines its own levels.
          </p>
        </div>
      }
    >
      <p>
        Severity levels decide who gets woken up. Write them down before you need them, in terms of
        impact (who sees it, what money or decisions it touches), not in terms of how hard the fix
        looks.
      </p>
      <p>
        Data incidents are common. In one 2023 survey of 200 data professionals, commissioned by the
        vendor Monte Carlo, respondents averaged 67 incidents a month and 15 hours to resolve each,
        and most said business users usually spotted problems first.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Repairing data safely ----------------------------------------------------------------------- */

export function Repair() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Repairing data safely"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`# Airflow 3: re-run a DAG for a date range
airflow backfill create --dag-id orders_daily \\
  --from-date 2026-10-04 --to-date 2026-10-04

# dbt: rebuild an incremental model from scratch
dbt run --select fct_orders --full-refresh

# dbt microbatch model: rebuild just a window
dbt run --select fct_orders \\
  --event-time-start 2026-10-04 --event-time-end 2026-10-05`}</Code>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Idempotent loads make repairs safe</p>
            <p className="text-muted mt-1">
              Replace the whole day (delete-then-insert, or overwrite the partition) instead of
              appending, and a rerun gives the same result however many times it happens. Module 18
              goes deeper.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A <Term id="backfill">backfill</Term> re-runs a pipeline for past periods to repair them.
        It&apos;s only safe if the job is <Term id="idempotent">idempotent</Term>: the Sunday
        incident happened precisely because a retry appended instead of replacing.
      </p>
      <p>
        Airflow 2&apos;s <span className="font-mono">airflow dags backfill</span> is gone in Airflow
        3, which manages backfills in the scheduler. Careful with{" "}
        <span className="font-mono">--full-refresh</span> plus a trailing{" "}
        <span className="font-mono">+</span>: it rebuilds every incremental model downstream too.
      </p>
    </StepLayout>
  );
}

/* 5 ─ In what order? ------------------------------------------------------------------------------ */

export function Steps() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In what order?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="incident-order"
            prompt="Drag the steps of a data incident into a sensible order."
            items={[
              { id: "confirm", label: "Confirm the data really is wrong" },
              { id: "declare", label: "Declare an incident and name a commander" },
              { id: "contain", label: "Stop the spread: flag reports, pause exports" },
              { id: "tell", label: "Tell consumers what's affected and when you'll update" },
              { id: "repair", label: "Repair the data with an idempotent backfill" },
              { id: "review", label: "Hold a blameless review with owned follow-ups" },
            ]}
            explanation="Confirm and declare, then contain before you fix; communicate early and keep updating; repair safely; learn afterwards. Telling consumers often happens alongside containment."
          />
        </div>
      }
    >
      <p>
        A <Term id="postmortem">blameless review</Term> asks how the system allowed the mistake, not
        who made it. The idea came to software from healthcare and aviation.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Declare early", "A second team, visible to users, or an hour unsolved."],
  ["Coordinate, don't fix", "The commander keeps the big picture."],
  ["Contain first", "Stop bad data spreading before root-causing."],
  ["Tell people", "What's affected, what to do, next update."],
  ["Repair, then learn", "Idempotent backfills; blameless reviews."],
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
      <p>Next: duplicates, and how to tell when two records are the same customer.</p>
    </StepLayout>
  );
}
