"use client";

import { motion } from "motion/react";
import { Car } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { retryTimes } from "./model";
import { PoisonPanel } from "./poison-panel";
import type { DlqState } from "./state";

/* 1 ─ A breakdown at the toll booth ------------------------------------------------------------ */

export function BrokenCar() {
  const rows: [string, string][] = [
    ["Wait forever", "The car at the barrier won't start. Everyone behind it waits, all day."],
    [
      "Push it aside and forget it",
      "Traffic flows, but the car and its driver are simply abandoned.",
    ],
    [
      "Try a few times, then tow it to the side lane",
      "A couple of restarts, a short wait between each. If it still won't go, it's moved to a lane where a mechanic can look at it, and later it rejoins.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A breakdown at the toll booth"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3",
                i === 2 ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <Car className={cn("mt-0.5 size-5 shrink-0", i === 2 ? "text-good" : "text-muted")} />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        One broken-down car can stop a whole toll lane. A partition is a lane too: events are
        processed in order, so one that always fails holds up everything behind it.
      </p>
      <p>
        Confluent calls it a <Term id="poison-pill">poison pill</Term>: &ldquo;a record that …
        always fails when consumed, no matter how many times it is attempted&rdquo;. The answer is
        the side lane: a <Term id="dead-letter-queue">dead-letter queue</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One bad event ⭐ ---------------------------------------------------------------------------- */

export function PoisonPill() {
  const [s, set] = useSceneState<DlqState>();
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="One bad event"
      stage={
        <PoisonPanel
          strategy={s.strategy}
          error={s.error}
          onStrategy={(v) => set({ strategy: v })}
          onError={(v) => set({ error: v })}
        />
      }
    >
      <p>
        Payment #4 fails. Try each strategy against two kinds of failure: a malformed event that
        will never work, and a database timeout that will work if you wait.
      </p>
      <p>
        The pattern that copes with both: retry a few times with growing waits, then park the event
        in a dead-letter topic with the error attached, and keep going. Retry topics (Uber described
        them in 2018; Spring Kafka&apos;s @RetryableTopic builds them) avoid pausing the partition,
        but Spring&apos;s docs warn: &ldquo;By using this strategy you lose Kafka&apos;s ordering
        guarantees for that topic.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Back off, with jitter ⭐ -------------------------------------------------------------------- */

export function Backoff() {
  const [s, set] = useSceneState<DlqState>();
  const times = retryTimes(12, s.jitter);
  const max = Math.max(...times.flat(), 31);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Back off, with jitter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.jitter ? "jitter" : "plain"}
            options={[
              ["plain", "Exponential backoff"],
              ["jitter", "Exponential backoff + full jitter"],
            ]}
            onChange={(v) => set({ jitter: v === "jitter" })}
          />
          <p className="text-muted text-[10px]">12 consumers · each mark is one retry</p>
          <div className="flex flex-col gap-1">
            {times.map((row, c) => (
              <div key={c} className="bg-surface-2 relative h-3 rounded">
                {row.map((t, k) => (
                  <motion.span
                    key={k}
                    layout
                    className="bg-accent absolute top-0 h-3 w-1 rounded-sm"
                    style={{ left: `${(t / max) * 100}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="text-muted flex justify-between font-mono text-[9px]">
            <span>0 s</span>
            <span>{Math.round(max)} s</span>
          </div>
          <p className="text-sm">
            {s.jitter
              ? "Retries are spread out, so the recovering service sees a trickle instead of waves."
              : "Twelve consumers failed at the same moment, so every retry lands at the same moment too: 1, 3, 7, 15, 31 seconds. Each wave can knock the service over again."}
          </p>
        </div>
      }
    >
      <p>
        Retrying immediately hammers a service that is already struggling. Exponential backoff
        doubles the wait each time. But when many consumers fail together, they also retry together.
      </p>
      <p>
        Marc Brooker&apos;s 2015 AWS Architecture Blog post showed the fix: add jitter, a random
        wait up to the backoff, so retries spread out. Retries also mean an event may be processed
        more than once, so consumers must be idempotent (module 10).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Dead letters everywhere ------------------------------------------------------------------ */

const PLATFORMS: [string, string][] = [
  [
    "Kafka Connect",
    "errors.tolerance=all with errors.deadletterqueue.topic.name, for sink connectors only (since Kafka 2.0); retries via errors.retry.timeout. Context headers record what failed.",
  ],
  [
    "Kafka Streams",
    "Exception handlers for deserialization, processing and production (renamed in 4.0; the default is to fail). Since 4.2, errors.dead.letter.queue.topic.name sends failures to a dead-letter topic.",
  ],
  [
    "Spring for Apache Kafka",
    "DefaultErrorHandler retries 9 times with no delay by default, blocking the partition; DeadLetterPublishingRecoverer writes to a -dlt topic; @RetryableTopic adds non-blocking retry topics.",
  ],
  [
    "AWS",
    "SQS sends a message to its dead-letter queue after maxReceiveCount receives and can redrive it back. Lambda on Kinesis or Kafka can bisect failing batches and send failures to SQS, SNS, S3 or Kafka; with defaults, AWS warns, a bad record can block a Kinesis shard for up to a week.",
  ],
  [
    "Google and Azure",
    "Pub/Sub dead-letter topics per subscription after 5–100 attempts, with per-message backoff that doesn't block other messages. Event Hubs has no dead-lettering (Service Bus does).",
  ],
  [
    "Flink",
    "No built-in DLQ: route bad records to a side output. A deserializer that throws in the Kafka source fails the job, which then crash-loops through restores.",
  ],
];

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Dead letters everywhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {PLATFORMS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        A dead-letter queue is only useful if someone looks at it. Alert when it grows, keep enough
        context (error, topic, partition, offset) to understand each failure, and once the bug is
        fixed, <Term id="replay-dlq">replay</Term> the parked events back into the main topic.
      </p>
      <p>Uber&apos;s 2018 design framed the operations simply: list, purge, or merge back.</p>
    </StepLayout>
  );
}

/* 5 ─ Retry, park or replay? ------------------------------------------------------------------- */

export function WhatToDo() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Retry, park or replay?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="retry-park-replay"
            prompt="What's the right response to each failure?"
            categories={[
              { id: "retry", label: "Retry with backoff" },
              { id: "park", label: "Dead-letter it" },
              { id: "replay", label: "Replay from the DLQ" },
            ]}
            items={[
              {
                id: "timeout",
                label: "The database timed out for a few seconds",
                category: "retry",
                why: "Transient: waiting and trying again will work.",
              },
              {
                id: "json",
                label: "An event's JSON is truncated and can't be parsed",
                category: "park",
                why: "Permanent: no number of retries will fix it.",
              },
              {
                id: "fixed",
                label: "A bug that rejected Hindi merchant names has been fixed",
                category: "replay",
                why: "Send the parked events back through the fixed consumer.",
              },
              {
                id: "gateway",
                label: "The payment gateway returns 503 Service Unavailable",
                category: "retry",
                why: "Usually transient; back off with jitter.",
              },
              {
                id: "unknown",
                label: "An event uses a schema version the consumer doesn't know",
                category: "park",
                why: "Park it until the consumer is upgraded, then replay.",
              },
            ]}
            explanation="Retry what's transient, park what's permanent, and replay once the cause is fixed."
          />
        </div>
      }
    >
      <p>Five failures. Which response fits?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["One bad event blocks a partition", "Ordered processing means no skipping by default."],
  ["Retry transient errors", "With exponential backoff and jitter."],
  ["Park permanent ones", "Dead-letter topic, with error context, and an alert."],
  ["Replay after the fix", "Merge parked events back into the stream."],
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
      <p>Next: sizing a streaming platform, and what it costs.</p>
    </StepLayout>
  );
}
