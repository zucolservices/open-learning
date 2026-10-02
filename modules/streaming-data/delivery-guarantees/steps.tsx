"use client";

import { motion } from "motion/react";
import { Check, Copy, PackageX } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { run } from "./model";
import type { Consumer, DelState, Fault, Producer } from "./state";

/* 1 ─ Couriers and signatures ------------------------------------------------------------------- */

export function Courier() {
  const rows: [string, string, string][] = [
    ["Leave it at the door", "Never comes back. If it's stolen, it's gone.", "At most once"],
    [
      "Redeliver until signed",
      "If the signature slip is lost, a second parcel arrives.",
      "At least once",
    ],
    [
      "Numbered parcels and a register",
      "Redeliver until signed, and the customer turns away any number already received.",
      "Effectively once",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Couriers and signatures"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">
                {t} <span className="text-accent text-xs font-medium">· {k}</span>
              </p>
              <p className="text-muted text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A courier can never be sure a parcel arrived unless they hear back, and the reply can get
        lost too. So they either risk losing parcels or risk delivering twice. Numbering parcels and
        keeping a register fixes the second problem.
      </p>
      <p>
        Every streaming system faces the same choice (System Design introduced it). This module is
        about Kafka&apos;s machinery for <Term id="exactly-once">exactly-once</Term>: the{" "}
        <Term id="idempotent-producer">idempotent producer</Term> and{" "}
        <Term id="kafka-transaction">transactions</Term>, and where they stop.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Crash at the worst moment ⭐ --------------------------------------------------------------- */

const PRODUCERS: [Producer, string][] = [
  ["fire", "Fire and forget"],
  ["retry", "Retries"],
  ["idem", "Idempotent"],
  ["txn", "Transactional"],
];
const CONSUMERS: [Consumer, string][] = [
  ["before", "Commit, then process"],
  ["after", "Process, then commit"],
  ["txn", "Transaction (read_committed)"],
];
const FAULTS: [Fault, string][] = [
  ["lostWrite", "Write lost on the network"],
  ["lostAck", "Acknowledgement lost"],
  ["appRestart", "Producer app restarts and resends"],
  ["consumerCrash", "Consumer crashes mid-way"],
];

function Pills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange(v: T): void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-muted w-20 shrink-0">{label}</span>
      {options.map(([k, n]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "rounded-full border px-2.5 py-0.5",
            value === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export function CrashIt() {
  const [s, set] = useSceneState<DelState>();
  const r = run(s.producer, s.consumer, s.fault, s.sms, s.dedupe);
  const label = r.lost ? "At most once" : r.dup ? "At least once" : "Exactly once (this time)";
  return (
    <StepLayout
      eyebrow="Simulation · Kafka's rules"
      title="Crash at the worst moment"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          <Pills
            label="Failure"
            value={s.fault}
            options={FAULTS}
            onChange={(v) => set({ fault: v })}
          />
          <Pills
            label="Producer"
            value={s.producer}
            options={PRODUCERS}
            onChange={(v) => set({ producer: v })}
          />
          <Pills
            label="Consumer"
            value={s.consumer}
            options={CONSUMERS}
            onChange={(v) => set({ consumer: v })}
          />
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.sms}
                onChange={(e) => set({ sms: e.target.checked })}
                className="accent-accent"
              />
              Consumer also sends an SMS
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.dedupe}
                onChange={(e) => set({ dedupe: e.target.checked })}
                className="accent-accent"
              />
              Consumer skips event IDs it has seen
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2 text-center",
                r.lost ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <PackageX className={cn("mx-auto size-5", r.lost ? "text-bad" : "text-muted")} />
              <p className="font-mono text-lg font-semibold">{r.lost}</p>
              <p className="text-muted text-[10px]">lost</p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2 text-center",
                r.dup ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <Copy className={cn("mx-auto size-5", r.dup ? "text-bad" : "text-muted")} />
              <p className="font-mono text-lg font-semibold">{r.dup}</p>
              <p className="text-muted text-[10px]">duplicated</p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2 text-center",
                !r.lost && !r.dup ? "border-good/60 bg-good/10" : "border-line bg-surface",
              )}
            >
              <Check
                className={cn("mx-auto size-5", !r.lost && !r.dup ? "text-good" : "text-muted")}
              />
              <p className="text-sm font-semibold">{label}</p>
            </div>
          </div>
          <motion.p
            key={`${s.producer}${s.consumer}${s.fault}${s.sms}${s.dedupe}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {r.why}
          </motion.p>
        </div>
      }
    >
      <p>
        A payment event goes from a producer through Kafka to a consumer that writes a result to
        another topic. Pick a failure, then find the producer and consumer settings that neither
        lose nor duplicate it.
      </p>
      <p>
        Two lessons hide in here. Idempotence only lasts one producer session: an app that restarts
        and resends gets a new producer ID. And transactions stop at Kafka&apos;s edge: tick the SMS
        box. For anything outside Kafka, make the consumer{" "}
        <Term id="idempotent-consumer">idempotent</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How Kafka does exactly once ------------------------------------------------------------- */

const FRAMES: { title: string; text: string }[] = [
  {
    title: "1. Producer IDs and sequence numbers",
    text: "With idempotence on (the default since Kafka 3.0), each producer gets an ID and numbers every batch per partition. The broker drops a batch whose number it has already seen. Cost: negligible.",
  },
  {
    title: "2. A transactional.id that survives restarts",
    text: "Give a producer a transactional.id and Kafka recognises it after a restart, fences off any zombie instance still running, and aborts its unfinished transaction.",
  },
  {
    title: "3. One transaction for output and offsets",
    text: "A consume-transform-produce app writes its output and, with sendOffsetsToTransaction, the input offsets it consumed, then commits them together. Either both happen or neither.",
  },
  {
    title: "4. Markers and read_committed",
    text: "Commit or abort markers are written into the log. Consumers with isolation.level=read_committed (the default is read_uncommitted) skip aborted data and stop just before the first open transaction.",
  },
  {
    title: "5. Kafka Streams does it for you",
    text: "processing.guarantee=exactly_once_v2 (introduced in 2.6 as exactly_once_beta, renamed in 3.0) wires all of this up.",
  },
  {
    title: "6. Bugs get fixed",
    text: "Jepsen found that a delayed end-transaction message could commit or abort the next transaction (KAFKA-17754). Kafka 4.0's transaction protocol changes (KIP-890) address this and the old “hanging transaction” problem.",
  },
];

export function Machinery() {
  const [s, set] = useSceneState<DelState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="How Kafka does exactly once"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {FRAMES.map((x, i) => (
              <div
                key={x.title}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i === s.frame ? "bg-accent" : i < s.frame ? "bg-accent/40" : "bg-line",
                )}
              />
            ))}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Kafka&apos;s design notes say exactly-once to other systems &ldquo;generally requires
        cooperation with such systems&rdquo;. Inside Kafka, these pieces make read-process-write
        exactly once.
      </p>
      <p>
        The cost is per transaction, not per message. Confluent&apos;s 2017 test measured a 3%
        throughput drop against an ordered at-least-once producer, with 1 KB messages and 100 ms
        transactions.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Guarantees elsewhere -------------------------------------------------------------------- */

const OTHERS: [string, string][] = [
  [
    "Kinesis",
    "Producer and consumer retries cause duplicates; design consumers for at-least-once.",
  ],
  [
    "Pub/Sub",
    "At-least-once by default. Exactly-once delivery (GA 2022) for pull subscriptions within one region, with higher latency; publisher retries can still create duplicates.",
  ],
  [
    "Event Hubs",
    "At-least-once. Kafka transactions on its Kafka endpoint are in preview (Premium and Dedicated).",
  ],
  ["SQS FIFO", "Deduplicates messages with the same deduplication ID within 5 minutes."],
  [
    "Pulsar",
    "Broker deduplication exists but is off by default; transactions work much like Kafka's.",
  ],
];

export function Elsewhere() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Guarantees elsewhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {OTHERS.map(([t, d], i) => (
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
        Most services promise at-least-once and leave duplicates to you. A few offer deduplication
        within a window or a scope; read the fine print, as Kafka&apos;s own docs advise.
      </p>
      <p>
        The portable answer is the same everywhere: give every event an ID and make consumers skip
        repeats.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which guarantee? ------------------------------------------------------------------------ */

export function WhichGuarantee() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which guarantee?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-guarantee"
            prompt="What does each setup give you?"
            categories={[
              { id: "most", label: "At most once" },
              { id: "least", label: "At least once" },
              { id: "exact", label: "Exactly once" },
            ]}
            items={[
              {
                id: "acks0",
                label: "acks=0, no retries",
                category: "most",
                why: "Nothing is ever resent; failed writes are simply gone.",
              },
              {
                id: "retry",
                label: "Retries without idempotence, consumer commits after processing",
                category: "least",
                why: "Lost acks and crashes cause repeats.",
              },
              {
                id: "streams",
                label: "Kafka Streams with exactly_once_v2, reading and writing only Kafka",
                category: "exact",
                why: "Output and offsets commit atomically.",
              },
              {
                id: "before",
                label: "Consumer commits its offset before processing",
                category: "most",
                why: "A crash after the commit skips the event.",
              },
              {
                id: "email",
                label: "Transactional consumer that also sends emails",
                category: "least",
                why: "The email isn't part of the transaction; a retry sends another.",
              },
              {
                id: "dedupe",
                label: "At-least-once delivery plus a consumer that skips seen event IDs",
                category: "exact",
                why: "Effectively exactly once: duplicates arrive but have no effect.",
              },
            ]}
            explanation="Exactly-once is a property of the whole pipeline, not of one setting."
          />
        </div>
      }
    >
      <p>Six setups. Which guarantee does each really give?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Lose or repeat", "Without extra machinery, you choose one."],
  ["Idempotent producer", "Kills retry duplicates within one session."],
  ["Transactions", "Output and offsets commit together, inside Kafka."],
  ["Idempotent consumers", "The fix that works everywhere, including side effects."],
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
        That completes getting data in and out. Next chapter: processing streams, starting with the
        simplest building blocks.
      </p>
    </StepLayout>
  );
}
