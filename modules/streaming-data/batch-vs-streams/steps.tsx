"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AMOUNT, COUNT, TRIGGER, checkAt, clock, lost, rupees, times } from "./attack";
import type { BvsState, Cadence } from "./state";

/* 2 ─ How often do you look? ⭐ ------------------------------------------------------------------- */

const CADENCES: [Cadence, string][] = [
  ["nightly", "Nightly batch"],
  ["hourly", "Every hour"],
  ["five", "Every 5 minutes"],
  ["event", "Every event"],
];

const NOTE: Record<Cadence, string> = {
  nightly:
    "Cheapest and simplest: one job, once a day, over complete data. Fine for reports, useless here.",
  hourly: "The first run after the rule becomes true is at midnight. The attack is over by 23:52.",
  five: "A micro-batch every five minutes catches it at 23:45, after seven payments.",
  event: "Each payment is checked as it arrives: the third one is declined at 23:43.",
};

export function RunEvery() {
  const [s, set] = useSceneState<BvsState>();
  const n = lost(s.cadence);
  const at = checkAt(s.cadence);
  const span = times[COUNT - 1] - times[0] + 60;
  const x = (t: number) => `${Math.min(100, ((t - times[0]) / span) * 100)}%`;
  return (
    <StepLayout
      eyebrow="Simulation · illustrative attack"
      title="How often do you look?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Segmented
            size="sm"
            value={s.cadence}
            options={CADENCES}
            onChange={(v) => set({ cadence: v })}
          />
          <div className="relative h-20">
            <div className="bg-line absolute top-9 right-0 left-0 h-0.5" />
            {times.map((t, i) => (
              <motion.span
                key={t}
                className={cn(
                  "absolute top-7 size-4 -translate-x-1/2 rounded-full border",
                  i < n ? "bg-viz-remove/70 border-viz-remove" : "border-viz-idle bg-surface",
                )}
                style={{ left: x(t) }}
                layout
              />
            ))}
            {at <= times[COUNT - 1] + 60 ? (
              <motion.div
                className="bg-viz-add absolute top-3 h-12 w-0.5"
                animate={{ left: x(at) }}
              />
            ) : null}
            <span className="text-muted absolute top-14 left-0 text-[10px]">{clock(times[0])}</span>
            <span className="text-muted absolute top-14 right-0 text-[10px]">
              {clock(times[COUNT - 1])}
            </span>
          </div>
          <motion.div
            key={s.cadence}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              n <= TRIGGER ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            <p className="text-sm">
              Check runs at <span className="font-mono font-semibold">{clock(at)}</span> · lost{" "}
              <span className="font-mono font-semibold">{rupees(n * AMOUNT)}</span> ({n} of {COUNT}{" "}
              payments)
            </p>
            <p className="text-muted mt-1 text-xs">{NOTE[s.cadence]}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        The rule is the same in every case: three payments to a new payee within two minutes. Only
        one thing changes: how often the system looks. Pick a schedule and see how much of the
        shopkeeper&apos;s money is gone before it acts.
      </p>
      <p>
        Looking more often costs more. On Google Cloud Dataflow, a streaming worker&apos;s vCPU
        costs about 23% more per hour than a batch one, and batch jobs that can wait up to six hours
        to start get about 40% off again. Speed is a choice you pay for.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The latency ladder ----------------------------------------------------------------------- */

const TIERS: { name: string; examples: string; how: string }[] = [
  {
    name: "Days",
    examples: "Monthly GST returns, quarterly board reports",
    how: "Batch jobs over complete data",
  },
  {
    name: "Hours",
    examples: "Overnight sales dashboards, payroll, data-warehouse loads",
    how: "Scheduled batch (Spark, warehouse SQL, Airflow)",
  },
  {
    name: "Minutes",
    examples: "Fresh lakehouse tables, near-real-time inventory",
    how: "Frequent or micro-batch jobs",
  },
  {
    name: "Seconds",
    examples: "Live delivery tracking, UPI's 15-second response limit, IPL scoreboards",
    how: "Stream processing (Spark Structured Streaming: as low as 100 ms)",
  },
  {
    name: "Milliseconds",
    examples: "Card authorisation, ad bidding, fraud scoring",
    how: "Per-event engines (Flink, Kafka Streams; Spark's Real-Time Mode since 4.1)",
  },
];

export function Ladder() {
  const [s, set] = useSceneState<BvsState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The latency ladder"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {TIERS.map((t, i) => {
            const on = s.tier === i;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => set({ tier: i })}
                style={{ marginLeft: `${(4 - i) * 6}%` }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition",
                  on ? "border-accent bg-accent-soft" : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <p className="text-sm font-semibold">{t.name}</p>
                {on && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-xs">{t.examples}</p>
                    <p className="text-muted mt-0.5 text-[11px]">{t.how}</p>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      }
    >
      <p>
        <Term id="latency">Latency</Term> here means the time from something happening to someone
        acting on it. Every rung down costs more effort and money, so the question is always:
        what&apos;s the slowest answer that&apos;s still useful?
      </p>
      <p>
        Between batch and streaming sits the <Term id="micro-batch">micro-batch</Term>: a small
        batch every few seconds. Spark Structured Streaming works this way. Visa says VisaNet
        authorises or declines payments &ldquo;in milliseconds&rdquo; while handling up to 83,000
        messages a second.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How we got here ------------------------------------------------------------------------- */

const YEARS: { year: string; title: string; text: string }[] = [
  {
    year: "2011",
    title: "Kafka leaves LinkedIn",
    text: "LinkedIn open-sources Kafka, a log for moving events between systems; it becomes a top-level Apache project in 2012. Nathan Marz describes running a batch layer and a real-time layer side by side, later called the Lambda architecture.",
  },
  {
    year: "2013",
    title: "The log",
    text: "Jay Kreps, one of Kafka's creators, writes “The Log”: the append-only log as the unifying idea behind databases and data pipelines. Google publishes MillWheel, its streaming engine.",
  },
  {
    year: "2014",
    title: "Questioning Lambda",
    text: "Kreps proposes keeping one streaming pipeline and reprocessing by replaying the log: “Maybe we could call this the Kappa Architecture.”",
  },
  {
    year: "2015",
    title: "Engines grow up",
    text: "Apache Flink becomes a top-level project, out of TU Berlin's Stratosphere research. Google's Dataflow Model paper sets out windows, triggers and event time.",
  },
  {
    year: "2016–17",
    title: "Streams everywhere",
    text: "Spark Structured Streaming arrives (stable in 2017), and Apache Beam, from Google's Dataflow, becomes a top-level project in January 2017.",
  },
  {
    year: "2025",
    title: "Simpler and faster",
    text: "Kafka 4.0 drops ZooKeeper and runs on its own consensus (KRaft). Spark 4.1 adds a Real-Time Mode with sub-second latency.",
  },
  {
    year: "2026",
    title: "Big business",
    text: "IBM completes its $11 billion purchase of Confluent, the company founded by Kafka's creators. Kafka's site says more than 80% of the Fortune 100 use it.",
  },
];

export function History() {
  const [s, set] = useSceneState<BvsState>();
  const y = YEARS[s.year] ?? YEARS[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="How we got here"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {YEARS.map((x, i) => (
              <button
                key={x.year}
                type="button"
                onClick={() => set({ year: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                  i === s.year
                    ? "border-accent bg-accent-soft"
                    : i < s.year
                      ? "border-line bg-surface-2"
                      : "border-line",
                )}
              >
                {x.year}
              </button>
            ))}
          </div>
          <FrameCaption frameKey={s.year} title={`${y.year} · ${y.title}`}>
            {y.text}
          </FrameCaption>
          <Stepper step={s.year} count={YEARS.length} onChange={(n) => set({ year: n })} />
        </div>
      }
    >
      <p>
        For years teams ran two systems: a slow, correct batch pipeline and a fast, approximate
        streaming one, the <Term id="lambda-architecture">Lambda architecture</Term>. Better engines
        made the <Term id="kappa-architecture">Kappa</Term> idea practical: one streaming pipeline,
        and replay the log when you need to recompute.
      </p>
      <p>Step through the milestones; the rest of this track opens up each idea.</p>
    </StepLayout>
  );
}

/* 5 ─ Batch or stream? ------------------------------------------------------------------------- */

export function SortWork() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Batch or stream?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="batch-or-stream"
            prompt="Which fits each job better?"
            categories={[
              { id: "batch", label: "Batch" },
              { id: "stream", label: "Stream" },
            ]}
            items={[
              {
                id: "gst",
                label: "The monthly GST return",
                category: "batch",
                why: "Needs complete data for the month; nobody gains from it a second early.",
              },
              {
                id: "card",
                label: "Declining a card payment that looks fraudulent",
                category: "stream",
                why: "Useless after the money has gone.",
              },
              {
                id: "eta",
                label: "A delivery app's live arrival estimate",
                category: "stream",
                why: "The estimate must follow the rider as they move.",
              },
              {
                id: "backfill",
                label: "Recomputing a year of history after fixing a bug",
                category: "batch",
                why: "Bounded data, all available now: batch is cheaper and simpler.",
              },
              {
                id: "payroll",
                label: "Running payroll",
                category: "batch",
                why: "Once a month, over a complete, checked set of data.",
              },
              {
                id: "alerts",
                label: "Alerting a trader when a share price crosses a limit",
                category: "stream",
                why: "The value is in acting the moment it happens.",
              },
            ]}
            explanation="Stream when acting late loses most of the value; batch when completeness, cost or simplicity matter more."
          />
        </div>
      }
    >
      <p>Six jobs. Streaming isn&apos;t automatically better: pick what each one needs.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Bounded vs unbounded", "A day's data has an end; the events themselves never stop."],
  ["Timing is the difference", "The same rule, run sooner, can stop the damage."],
  ["Latency costs money", "Choose the slowest answer that's still useful."],
  ["The log underneath", "Kafka's append-only log made modern streaming possible."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: what an event is, and the append-only log that holds them.</p>
    </StepLayout>
  );
}
