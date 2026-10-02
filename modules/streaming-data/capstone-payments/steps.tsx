"use client";

import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, Check, Smartphone, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, FAILURES, outcome, type Level, type Verdict } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ---------------------------------------------------------------------------------- */

const NEEDS: [string, string][] = [
  ["Scale", "About 2,000 payments a second on a normal day; ten times that at festival peaks."],
  ["Fraud checks", "Flag a payer making too many payments in five minutes, within seconds."],
  ["Merchants", "A shopkeeper sees a payment on the dashboard within seconds."],
  ["Audit", "Every payment kept for years, each counted exactly once."],
  [
    "No surprises",
    "A broker, a job or a bad release must not silently lose or double-count payments.",
  ],
];

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="A real-time payments monitor"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <Smartphone className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              India made 24.07 billion UPI payments in September 2026, about 9,300 a second on
              average. Your client is one illustrative payments app with a slice of that.
            </p>
          </div>
          <p className="text-muted text-xs">
            Real systems look like this: Razorpay has written about using Kafka and Flink for fraud
            detection since 2019, and in 2026 described detecting anomalies in under 30 seconds over
            5 billion events a day.
          </p>
          {NEEDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You&apos;re the data engineer. Payment events flow from the app into a{" "}
        <Term id="topic">topic</Term>; a stream job checks each payer&apos;s recent activity;
        results feed alerts, a merchant dashboard and long-term storage.
      </p>
      <p>
        Every decision in the next step draws on a module in this track. Then you&apos;ll break the
        design seven ways and see what holds. There are no marks, and you can change your mind as
        often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the choices ⭐ ------------------------------------------------------------------------- */

const NOTES: Record<string, Record<string, string>> = {
  key: {
    payer:
      "Each payer's events stay in order on one partition: exactly what a per-payer velocity check needs.",
    merchant:
      "Per-merchant order, but the job must reshuffle by payer, and big merchants make hot partitions.",
    none: "Even spread, but one payer's events are scattered: the job must reshuffle them, and order between partitions is lost.",
  },
  partitions: {
    "6": "Caps each consumer group at six consumers.",
    "48": "Room for 48 consumers, with modest overhead.",
    "2000": "Far more than needed; each partition costs memory and recovery time.",
  },
  durability: {
    safe: "Survives one broker failure with no acknowledged write lost.",
    acks1:
      "Faster writes; a leader failure can lose acknowledged ones. (Producers default to acks=all since Kafka 3.0.)",
    one: "Cheapest; a broker failure takes its partitions offline.",
  },
  schema: {
    registry: "Incompatible changes are rejected before they reach the topic.",
    none: "Anything can be published, including breaking changes.",
  },
  guarantee: {
    eos: "Each payment affects results exactly once, even after a crash.",
    dedupe: "Cheaper; repeats after a crash are dropped by the alert service.",
    auto: "Offsets and state drift apart: crashes skip or repeat payments.",
  },
  time: {
    event: "Windows by when the payment happened; stragglers rechecked.",
    eventDrop: "Correct windows, but late events vanish without trace.",
    processing: "Simple, but delays move payments into the wrong window.",
  },
  errors: {
    dlq: "Bad events are parked with their error; the stream keeps going.",
    forever: "One bad event can stop a partition.",
    skip: "The stream never stops, and never tells you what it dropped.",
  },
  storage: {
    both: "Seconds-fresh dashboards and cheap long-term history.",
    lake: "One copy, minutes behind.",
    olap: "Seconds-fresh, but years of history in a costly store.",
  },
};

const VERDICT_CLS: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-accent",
  bad: "text-bad",
};

export function Choose() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Design"
      title="Make the choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => {
            const o = d.options.find((x) => x.id === choices[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">
                  {d.area} <span className="text-muted font-normal">· module {d.module}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set({ choices: { ...choices, [d.id]: opt.id } })}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-left text-[11px]",
                        choices[d.id] === opt.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {o && (
                  <p className={cn("mt-1 text-[10px]", VERDICT_CLS[o.verdict])}>
                    {NOTES[d.id][o.id]}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "Every decision made. Continue to break it."}
          </p>
        </div>
      }
    >
      <p>
        Eight decisions, from the partition key to where results are stored. Choose what you would
        actually build. Some options are traps people really fall into; some work but cost more than
        they need to.
      </p>
      <p>A note under each choice says what it buys you. The real test comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ Break it ⭐ ---------------------------------------------------------------------------------- */

const LEVEL: Record<Level, { cls: string; icon: typeof Check; label: string }> = {
  holds: { cls: "border-good/50 bg-good/10", icon: Check, label: "Holds" },
  degrades: { cls: "border-accent/50 bg-accent-soft", icon: AlertTriangle, label: "Degrades" },
  breaks: { cls: "border-bad/60 bg-bad/10", icon: X, label: "Breaks" },
};

const STAGES: [string, string][] = [
  ["producer", "Payments app"],
  ["kafka", "Kafka topic"],
  ["process", "Fraud-check job"],
  ["storage", "Alerts · dashboard · lakehouse"],
];

export function BreakIt() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const f = FAILURES.find((x) => x.id === s.failure) ?? FAILURES[0];
  const o = outcome(f.id, choices);
  const all = FAILURES.map((x) => ({ x, o: outcome(x.id, choices) }));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Break it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {all.map(({ x, o: r }) => {
              const Icon = r ? LEVEL[r.level].icon : null;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ failure: x.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    s.failure === x.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "size-3",
                        r!.level === "holds"
                          ? "text-good"
                          : r!.level === "breaks"
                            ? "text-bad"
                            : "text-accent",
                      )}
                    />
                  )}
                  {x.name}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:flex-nowrap">
            {STAGES.map(([id, label], i) => (
              <div key={id} className="flex flex-1 items-center gap-1">
                <motion.div
                  animate={{ scale: f.where === id ? 1.04 : 1 }}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-2 text-center text-[11px]",
                    f.where === id
                      ? o
                        ? LEVEL[o.level].cls
                        : "border-accent bg-accent-soft"
                      : "border-line bg-surface text-muted",
                  )}
                >
                  {label}
                </motion.div>
                {i < STAGES.length - 1 && <ArrowRight className="text-subtle size-3 shrink-0" />}
              </div>
            ))}
          </div>
          <p className="text-sm">{f.text}</p>
          <motion.div
            key={`${f.id}-${JSON.stringify(choices)}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              o ? LEVEL[o.level].cls : "border-line bg-surface",
            )}
          >
            {o ? (
              <>
                <p className="font-semibold">
                  {LEVEL[o.level].label}{" "}
                  <span className="text-muted text-xs font-normal">· see module {o.module}</span>
                </p>
                <p className="text-sm">{o.text}</p>
              </>
            ) : (
              <p className="text-muted text-sm">
                The decision this depends on isn&apos;t made yet. Go back a step to choose.
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Seven things that really happen to streaming systems. Pick one to see how your design copes;
        the icons show the result of every test at a glance.
      </p>
      <p>
        Go back, change a choice, and come here again. Notice how failures combine: a schema change
        without a registry becomes a bad-event problem, and the bad-event choice decides what
        happens next.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What to fix first -------------------------------------------------------------------------- */

export function FixFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to fix first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fix-first"
            prompt="A colleague's pipeline has these findings. Which must be fixed before launch?"
            categories={[
              { id: "now", label: "Before launch" },
              { id: "later", label: "Improve later" },
            ]}
            items={[
              {
                id: "acks",
                label: "Producers use acks=1 for payment events",
                category: "now",
                why: "A leader failure can lose acknowledged payments.",
              },
              {
                id: "forever",
                label: "The consumer retries a failing event for ever",
                category: "now",
                why: "One malformed event stops a partition and its payers go unmonitored.",
              },
              {
                id: "auto",
                label: "The job auto-commits offsets and keeps counts in memory",
                category: "now",
                why: "A crash skips or double-counts payments.",
              },
              {
                id: "parts",
                label: "The topic has 2,000 partitions where 48 would do",
                category: "later",
                why: "Wasteful, not dangerous. Partitions can't be reduced, so plan a migration.",
              },
              {
                id: "ff",
                label: "Consumers don't fetch from a replica in their own zone",
                category: "later",
                why: "A cost saving (module 19), not a risk.",
              },
              {
                id: "dash",
                label: "The internal finance dashboard is five minutes behind",
                category: "later",
                why: "Finance doesn't need seconds. Merchants would.",
              },
            ]}
            explanation="Anything that can lose, skip or double-count a payment blocks launch; cost and freshness tuning go on the improvement list."
          />
        </div>
      }
    >
      <p>Reviewing someone else&apos;s pipeline is half the job.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ---------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "Batch vs streams; events, logs and topics."],
  ["The log", "Partitions, consumer groups, replication, retention, platforms."],
  ["Getting data in and out", "CDC and the outbox, schemas, delivery guarantees."],
  ["Processing streams", "Stateless steps, event time, windows, state, checkpoints, SQL."],
  ["Operating streams", "Backpressure and lag, bad events, sizing and cost."],
  ["Streams meet storage", "Lakehouse tables and real-time analytics stores."],
  ["In practice", "Event-driven patterns and this payments monitor."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole track"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHAPTERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        That&apos;s Streaming Data Systems: twenty-three modules from &ldquo;why not just run a
        batch job tonight&rdquo; to a payments monitor that survives a bad day.
      </p>
      <p>
        The habits carry over to any platform: choose keys for the order you need, keep enough
        copies, make state and offsets move together, judge time by when things happened, park what
        you can&apos;t process, and store each result where its readers need it.
      </p>
    </StepLayout>
  );
}
