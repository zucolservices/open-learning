"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { outcomes, type Opts } from "./model";
import type { JobsState } from "./state";

const TOGGLES: { id: keyof Opts; label: string; needs?: keyof Opts }[] = [
  { id: "queue", label: "Put the email and PDF on a queue for background workers" },
  { id: "retry", label: "Retry failed jobs with exponential backoff and jitter", needs: "queue" },
  { id: "dlq", label: "Send jobs that keep failing to a dead-letter queue", needs: "queue" },
  { id: "idem", label: "Make the email job idempotent (skip if already sent)", needs: "queue" },
];

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function DryCleaner() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The ticket at the dry cleaner"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Wait at the counter",
              "The clerk cleans your coat while you stand there for an hour.",
            ],
            [
              "Take a ticket",
              "Hand it over, get a ticket, go home. They'll text you when it's ready, and try again if the first text fails.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        No dry cleaner makes you wait while they clean your coat. You get a ticket, and the work
        happens in the back.
      </p>
      <p>
        Backends do the same with <Term id="background-job">background jobs</Term>: slow or
        unreliable work goes on a <Term id="message-queue">queue</Term>, the request returns
        straight away, and workers process the jobs, retrying if needed.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Simulate() {
  const [s, set] = useSceneState<JobsState>();
  const r = outcomes(s);
  const rows: [string, { ok: boolean; text: string }][] = [
    ["Placing an order", r.response],
    ["The email provider is down for 2 minutes", r.outage],
    ["One order has a malformed email address", r.poison],
    ["A worker crashes just after sending", r.dup],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Move slow work off the request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {TOGGLES.map((t) => {
              const disabled = !!t.needs && !s[t.needs];
              return (
                <label
                  key={t.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                    s[t.id] && !disabled ? "border-good/50 bg-good/10" : "border-line bg-surface",
                    disabled && "opacity-40",
                  )}
                >
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={s[t.id] && !disabled}
                    onChange={() => set({ [t.id]: !s[t.id] } as Partial<JobsState>)}
                  />
                  {t.label}
                </label>
              );
            })}
          </div>
          <div className="grid gap-1">
            {rows.map(([l, o]) => (
              <motion.div
                key={l}
                layout
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  o.ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="flex items-center gap-1 font-medium">
                  {o.ok ? (
                    <Check className="text-good size-3.5" />
                  ) : (
                    <X className="text-bad size-3.5" />
                  )}
                  {l}
                </p>
                <p className="text-muted text-[10.5px]">{o.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Placing an order also sends a confirmation email and renders an invoice PDF. Right now it
        all happens while the customer waits. Switch on improvements and test four situations.
      </p>
      <p>
        Most queues promise to deliver each job at least once, so a job can sometimes run twice.
        Workers must be safe to repeat.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Job systems and queues"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            ["Ruby", "Sidekiq 8; Solid Queue, the database-backed default in Rails 8"],
            ["Python", "Celery 5.6, with RabbitMQ, Redis or SQS"],
            ["Node.js", "BullMQ 6, on Redis or (new in 2026) PostgreSQL"],
            [".NET and Java", "Hangfire; Spring Batch 6 (in-process @Async isn't durable)"],
            [
              "Cloud queues",
              "Amazon SQS (messages up to 1 MiB since August 2025), Google Cloud Tasks and Pub/Sub, Azure Service Bus",
            ],
            [
              "Brokers and workflows",
              "RabbitMQ 4 (quorum queues); Temporal for long, multi-step workflows",
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
        Durable queues survive crashes and deploys; in-process &ldquo;fire and forget&rdquo; does
        not. If losing the job would matter, put it somewhere durable.
      </p>
      <p>
        Database-backed queues are popular again because they can share a transaction with your
        data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Backoff -------------------------------------------------------------------------------------- */

export function Backoff() {
  const waits = [1, 2, 4, 8, 16];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Retry slower each time, and randomly"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {waits.map((w, i) => (
            <div key={w} className="flex items-center gap-2 text-xs">
              <span className="text-muted w-16">Retry {i + 1}</span>
              <div className="bg-surface-2 relative h-3 flex-1 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(w / 16) * 100}%` }}
                  transition={{ delay: 0.08 * i }}
                  className="bg-viz-data/40 absolute h-3 rounded"
                />
                <div
                  className="bg-viz-data absolute top-0 h-3 w-1 rounded"
                  style={{ left: `${(w / 16) * 100 * [0.4, 0.8, 0.3, 0.65, 0.5][i]}%` }}
                />
              </div>
              <span className="text-subtle w-14 text-right font-mono text-[10px]">≤ {w}s</span>
            </div>
          ))}
          <p className="text-subtle text-[10px]">
            Bar: the maximum wait doubles. Marker: the actual wait, chosen at random below it (“full
            jitter”).
          </p>
        </div>
      }
    >
      <p>
        If a thousand jobs fail together and all retry after exactly one second, they hit the
        recovering service together again. Exponential backoff spreads retries out; jitter
        randomises them.
      </p>
      <p>
        Marc Brooker&apos;s 2015 analysis at AWS found &ldquo;full jitter&rdquo;, a random wait
        between zero and the current maximum, worked best. Cap the number of retries, then
        dead-letter.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function JobsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Now or later?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-jobs"
            prompt="Should each task happen during the request, or in a background job?"
            categories={[
              { id: "now", label: "During the request" },
              { id: "later", label: "Background job" },
            ]}
            items={[
              {
                id: "validate",
                label: "Validate the order and save it",
                category: "now",
                why: "The customer needs to know it worked.",
              },
              {
                id: "email",
                label: "Send the confirmation email",
                category: "later",
                why: "Slow, unreliable, and can wait seconds.",
              },
              {
                id: "stock",
                label: "Reserve the stock",
                category: "now",
                why: "Must be decided before saying “order placed”.",
              },
              {
                id: "photo",
                label: "Make thumbnails of an uploaded photo",
                category: "later",
                why: "Slow work nobody needs instantly.",
              },
              {
                id: "report",
                label: "Build a monthly sales report",
                category: "later",
                why: "Heavy, and can be emailed when done.",
              },
            ]}
            explanation="Do what the user needs an answer to now; queue anything slow, flaky or not needed for the immediate response."
          />
        </div>
      }
    >
      <p>Sort each task.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Answer fast, work later", "Queue slow and flaky tasks."],
        ["Durable queues", "Survive crashes and deploys."],
        ["Retry with backoff and jitter", "Then give up gracefully."],
        ["Dead-letter poison jobs", "And watch the dead-letter queue."],
        ["Safe to repeat", "At-least-once means idempotent workers."],
      ]}
    >
      <p>Next: telling other systems what happened, with webhooks and events.</p>
    </WrapStep>
  );
}
