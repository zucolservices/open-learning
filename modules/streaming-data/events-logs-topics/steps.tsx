"use client";

import { motion } from "motion/react";
import { BookOpen, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, YESTERDAY_1800 } from "./events";
import type { LogState, Reader } from "./state";

/* 1 ─ A passbook nobody can rewrite ------------------------------------------------------------- */

export function Passbook() {
  const lines = [
    ["02 Oct", "Salary credited", "+ ₹42,000"],
    ["03 Oct", "Rent paid", "− ₹15,000"],
    ["03 Oct", "Electricity bill", "− ₹1,840"],
    ["04 Oct", "Groceries", "− ₹2,310"],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A passbook nobody can rewrite"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 flex items-center gap-1.5 text-xs">
              <BookOpen className="size-3.5" /> Savings passbook
            </p>
            {lines.map(([d, w, a], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="border-line flex gap-3 border-t py-1.5 font-mono text-xs"
              >
                <span className="text-muted w-6">{i + 1}</span>
                <span className="text-muted w-14">{d}</span>
                <span className="flex-1">{w}</span>
                <span>{a}</span>
              </motion.div>
            ))}
            <p className="text-muted mt-2 text-[11px]">
              New lines go at the bottom. Mistakes are fixed by a new line, never by erasing an old
              one.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            {[
              ["You", "read up to line 4"],
              ["Your accountant", "up to line 2"],
              ["The tax office", "starts again from line 1"],
            ].map(([w, at]) => (
              <div key={w} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="font-semibold">{w}</p>
                <p className="text-muted">{at}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A bank passbook only ever grows at the bottom. Nobody rubs out yesterday&apos;s line, and
        anyone can read it at their own pace, keeping their own bookmark.
      </p>
      <p>
        That is the whole idea behind streaming platforms. Things that happen become{" "}
        <Term id="event">events</Term>, written one after another into an{" "}
        <Term id="append-only-log">append-only log</Term>. Every reader keeps its own position, its{" "}
        <Term id="offset">offset</Term>, and can go back and read again.
      </p>
    </StepLayout>
  );
}

/* 2 ─ What's in an event ----------------------------------------------------------------------- */

const PARTS: { id: string; label: string; value: string; text: string }[] = [
  {
    id: "key",
    label: "Key",
    value: '"asha"',
    text: "Says which thing the event is about. Kafka uses it to keep all of one customer's events in order (module 3). It can be empty.",
  },
  {
    id: "value",
    label: "Value",
    value: '{ "amount": 2999, "to": "Electronics" }',
    text: "The payload: what happened. Usually JSON, Avro or Protobuf bytes (module 9). Kafka's default limit is about 1 MB per batch of records.",
  },
  {
    id: "timestamp",
    label: "Timestamp",
    value: "2026-10-03 09:02:11",
    text: "When it happened (CreateTime, set by the producer, the default) or when the log stored it (LogAppendTime). The difference matters in module 12.",
  },
  {
    id: "headers",
    label: "Headers",
    value: "source=upi-app, trace-id=7f3a…",
    text: "Optional metadata, such as where the event came from or a trace ID, kept apart from the payload.",
  },
];

export function Anatomy() {
  const [s, set] = useSceneState<LogState>();
  const p = PARTS.find((x) => x.id === s.part) ?? PARTS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What's in an event"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3 font-mono text-xs">
            {PARTS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ part: x.id })}
                className={cn(
                  "flex w-full gap-3 rounded-md px-2 py-1.5 text-left",
                  x.id === p.id ? "bg-accent-soft" : "hover:bg-surface-2",
                )}
              >
                <span className="text-accent w-20 shrink-0">{x.label}</span>
                <span className="break-all">{x.value}</span>
              </button>
            ))}
          </div>
          <motion.p
            key={p.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {p.text}
          </motion.p>
          <p className="text-muted text-[11px]">
            Kafka&apos;s own example: key &ldquo;Alice&rdquo;, value &ldquo;Made a payment of $200
            to Bob&rdquo;, timestamp &ldquo;Jun. 25, 2020 at 2:06 p.m.&rdquo;
          </p>
        </div>
      }
    >
      <p>
        Kafka&apos;s documentation puts it simply: &ldquo;an event has a key, value, timestamp, and
        optional metadata headers&rdquo;. It is also called a record or a message. Click each part.
      </p>
      <p>
        An event records a fact in the past tense: &ldquo;Asha paid ₹2,999&rdquo;, not &ldquo;pay
        ₹2,999&rdquo;. Facts don&apos;t change, which is why the log never needs to.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Write once, read many times ⭐ --------------------------------------------------------------- */

const READERS: { id: Reader; name: string }[] = [
  { id: "fraud", name: "Fraud check" },
  { id: "ledger", name: "Ledger" },
  { id: "sms", name: "SMS alerts" },
];

export function TheLog() {
  const [s, set] = useSceneState<LogState>();
  const n = s.appended;
  const queue = s.mode === "queue";
  const taken = s.taken ?? {};
  const nextFree = () => {
    for (let i = 0; i < n; i++) if (!(i in taken)) return i;
    return -1;
  };
  const read = (r: Reader) => {
    if (queue) {
      const i = nextFree();
      if (i >= 0) set({ taken: { ...taken, [i]: r } });
    } else if (s.offsets[r] < n) set({ offsets: { ...s.offsets, [r]: s.offsets[r] + 1 } });
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Write once, read many times"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.mode}
            options={[
              ["log", "A log (Kafka-style)"],
              ["queue", "A classic queue"],
            ]}
            onChange={(v) => set({ mode: v, taken: {}, offsets: { fraud: 0, ledger: 0, sms: 0 } })}
          />
          <div className="flex flex-col gap-1">
            {EVENTS.slice(0, n).map((e, i) => {
              const gone = queue && i in taken;
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: gone ? 0.25 : 1, x: 0 }}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-1 font-mono text-[11px]",
                    gone ? "border-line border-dashed" : "border-line bg-surface",
                  )}
                >
                  <span className="text-muted w-5 text-right">{i}</span>
                  <span
                    className={cn(
                      "w-[5.5rem] shrink-0 whitespace-nowrap",
                      e.day === "yesterday" && "text-muted",
                    )}
                  >
                    {e.day === "yesterday" ? "yest." : "today"} {e.time}
                  </span>
                  <span className="text-accent w-11">{e.key}</span>
                  <span className={cn("flex-1 truncate", gone && "line-through")}>{e.value}</span>
                  <span className="flex gap-0.5">
                    {queue
                      ? gone && (
                          <span className="text-muted text-[10px]">
                            → {READERS.find((r) => r.id === taken[i])!.name}, deleted
                          </span>
                        )
                      : READERS.filter((r) => s.offsets[r.id] === i).map((r) => (
                          <span
                            key={r.id}
                            className="bg-accent text-accent-fg rounded px-1 text-[9px]"
                          >
                            {r.name}
                          </span>
                        ))}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={n >= EVENTS.length}
              onClick={() => set({ appended: n + 1 })}
              className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
            >
              Producer: append an event
            </button>
            {READERS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => read(r.id)}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
              >
                {r.name}: read next{queue ? "" : ` (at ${s.offsets[r.id]})`}
              </button>
            ))}
            {!queue && (
              <button
                type="button"
                onClick={() => set({ offsets: { ...s.offsets, ledger: YESTERDAY_1800 } })}
                className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Ledger: replay from yesterday 18:00
              </button>
            )}
          </div>
          <p className="text-muted text-[11px]">
            {queue
              ? "Each message goes to one reader and is removed once handled (SQS, RabbitMQ's classic queues). Nobody can read it again."
              : "Reading moves only that reader's offset. The events stay for the retention period (Kafka's default: 7 days), whoever has read them."}
          </p>
        </div>
      }
    >
      <p>
        A <Term id="producer">producer</Term> appends payment events to a{" "}
        <Term id="topic">topic</Term>. Three <Term id="consumer">consumers</Term> read it: a fraud
        check, the ledger and an SMS service. Append some events, let each reader move at its own
        speed, then replay the ledger from yesterday evening, as you would after fixing a bug.
      </p>
      <p>
        Then switch to a classic queue and see the difference: messages are shared out and deleted.
        Kafka&apos;s design notes say rewinding &ldquo;violates the common contract of a
        queue&rdquo;, and that this is the point. (Kafka 4 can also behave like a queue, with share
        groups.)
      </p>
    </StepLayout>
  );
}

/* 4 ─ Same idea, different names ---------------------------------------------------------------- */

type Platform = LogState["platform"];

const VOCAB: Record<Platform, [string, string][]> = {
  kafka: [
    ["Log", "Topic (split into partitions)"],
    ["Position", "Offset per record"],
    ["Keeps events", "7 days by default; any time, or forever"],
    ["Replay", "Seek to an offset, or look one up by time"],
  ],
  redpanda: [
    ["Log", "Topic: speaks the Kafka protocol"],
    ["Position", "Offset"],
    ["Keeps events", "Configurable, like Kafka"],
    ["Replay", "As Kafka; one C++ binary, no JVM"],
  ],
  pulsar: [
    ["Log", "Topic, stored as ledgers in BookKeeper"],
    ["Position", "A cursor per subscription"],
    ["Keeps events", "Deletes acknowledged messages unless retention is set"],
    ["Replay", "Reset a subscription's cursor"],
  ],
  kinesis: [
    ["Log", "Stream, split into shards"],
    ["Position", "Sequence number"],
    ["Keeps events", "24 hours by default, up to 365 days"],
    ["Replay", "Start an iterator at a sequence number or time"],
  ],
  pubsub: [
    ["Log", "Topic, read through subscriptions"],
    ["Position", "Acknowledged or not, per message"],
    ["Keeps events", "7 days by default, up to 31"],
    ["Replay", "Seek a subscription to a time or snapshot"],
  ],
  eventhubs: [
    ["Log", "Event hub: “an append-only log… equivalent to a Kafka topic”"],
    ["Position", "Offset and sequence number"],
    ["Keeps events", "Up to 7 days (Standard), 90 (Premium)"],
    ["Replay", "Read from an earlier offset or time"],
  ],
};

export function Platforms() {
  const [s, set] = useSceneState<LogState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same idea, different names"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["kafka", "Kafka"],
                ["redpanda", "Redpanda"],
                ["pulsar", "Pulsar"],
                ["kinesis", "Kinesis"],
                ["pubsub", "Pub/Sub"],
                ["eventhubs", "Event Hubs"],
              ] as [Platform, string][]
            ).map(([k, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ platform: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.platform === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {VOCAB[s.platform].map(([k, v], i) => (
              <motion.div
                key={s.platform + k}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="text-accent w-24 shrink-0 font-semibold">{k}</span>
                <span>{v}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every streaming platform has the same core: a durable, ordered log, readers with their own
        positions, and a way to go back. The names differ. Module 7 compares them properly.
      </p>
      <p>
        The idea scales a long way. LinkedIn, where Kafka began, reported over 32 trillion records a
        day in 2025, as it moved to its own successor system; in India, PhonePe has written that
        Kafka carries about 100 billion events a day for it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Log or queue? ---------------------------------------------------------------------------- */

export function LogOrQueue() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Log or queue?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="log-or-queue"
            prompt="Which does each sentence describe?"
            categories={[
              { id: "log", label: "A log" },
              { id: "queue", label: "A classic queue" },
            ]}
            items={[
              {
                id: "keep",
                label: "Reading a message doesn't remove it",
                category: "log",
                why: "Events stay for the retention period, whoever reads them.",
              },
              {
                id: "one",
                label: "Each message is handed to one worker, then deleted",
                category: "queue",
                why: "Work is shared out; once acknowledged it's gone.",
              },
              {
                id: "new",
                label: "A new service can start reading from last week's events",
                category: "log",
                why: "Its offset can start anywhere still retained.",
              },
              {
                id: "replay",
                label: "After a bug fix, reprocess yesterday's data",
                category: "log",
                why: "Rewind the offset and read again.",
              },
              {
                id: "sqs",
                label: "Amazon SQS once a consumer deletes the message",
                category: "queue",
                why: "SQS consumers delete messages explicitly; they can't be read again.",
              },
            ]}
            explanation="A log keeps events and lets every reader move at its own pace; a queue shares out work and forgets it."
          />
        </div>
      }
    >
      <p>Five sentences, two models.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Events are facts", "Key, value, timestamp, headers: something that happened."],
  ["The log only grows", "Appended in order, never rewritten, kept for a set time."],
  ["Readers keep offsets", "Each consumer moves at its own pace and can rewind."],
  ["Not a queue", "Reading doesn't delete; many readers share one log."],
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
      <p>
        One log on one machine has limits. Next: splitting a topic into partitions, and what that
        does to ordering.
      </p>
    </StepLayout>
  );
}
