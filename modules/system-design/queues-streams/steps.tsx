"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MINUTES, PER_CONSUMER, WORKERS, backlogSim, orderingSim } from "./sim";
import type { QueueState } from "./state";

/* 2 ─ The ticket sale ⭐ ----------------------------------------------------------------------------- */

export const CONSUMER_COUNTS = [2, 4, 8, 12, 16];
const PARTITIONS = 8;

function fmt(n: number) {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(Math.round(n));
}

function BacklogChart({
  backlog,
  arrivals,
  capacity,
}: {
  backlog: number[];
  arrivals: number[];
  capacity: number;
}) {
  const W = 360;
  const H = 150;
  const maxB = Math.max(700_000, ...backlog);
  const maxR = 900;
  const x = (m: number) => 30 + (m / (MINUTES - 1)) * (W - 38);
  const yB = (v: number) => H - 18 - (v / maxB) * (H - 30);
  const yR = (v: number) => H - 18 - (v / maxR) * (H - 30);
  const area =
    `M${x(0)},${yB(0)} ` +
    backlog.map((b, m) => `L${x(m)},${yB(b)}`).join(" ") +
    ` L${x(MINUTES - 1)},${yB(0)} Z`;
  const rate = arrivals.map((r, m) => `${m === 0 ? "M" : "L"}${x(m)},${yR(r)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Backlog over time"
    >
      <motion.path
        d={area}
        fill="var(--viz-data)"
        opacity={0.25}
        initial={{ d: area }}
        animate={{ d: area }}
        transition={{ duration: 0.4 }}
      />
      <path d={rate} fill="none" stroke="var(--line-strong)" strokeWidth={1} />
      <motion.line
        x1={x(0)}
        x2={x(MINUTES - 1)}
        initial={{ y1: yR(capacity), y2: yR(capacity) }}
        animate={{ y1: yR(capacity), y2: yR(capacity) }}
        stroke="var(--viz-compute)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      {[0, 15, 30, 45, MINUTES - 1].map((m) => (
        <text
          key={m}
          x={x(m)}
          y={H - 4}
          textAnchor={m === MINUTES - 1 ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          {`10:${String(m).padStart(2, "0")}`}
        </text>
      ))}
    </svg>
  );
}

export function TicketSale() {
  const [s, set] = useSceneState<QueueState>();
  const consumers = CONSUMER_COUNTS[s.consumers];
  const r = useMemo(
    () => backlogSim({ consumers, mode: s.mode, partitions: PARTITIONS }),
    [consumers, s.mode],
  );
  const capacity = r.active * PER_CONSUMER;
  const never = r.drainedAt === null;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The ticket sale"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-24 text-xs">Kind</span>
            <Segmented
              size="sm"
              value={s.mode}
              options={[
                ["queue", "Queue"],
                ["log", `Log, ${PARTITIONS} partitions`],
              ]}
              onChange={(v) => set({ mode: v as QueueState["mode"] })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-24 text-xs">Consumers</span>
            <Segmented
              size="sm"
              value={String(s.consumers)}
              options={CONSUMER_COUNTS.map((c, i) => [String(i), String(c)] as [string, string])}
              onChange={(v) => set({ consumers: Number(v) })}
            />
          </div>
          <div className="flex flex-wrap gap-1" aria-label="Consumers">
            {Array.from({ length: consumers }, (_, i) => (
              <motion.span
                key={i}
                layout
                className={cn(
                  "grid size-6 place-items-center rounded-md text-[9px] font-medium",
                  i < r.active ? "bg-viz-compute text-bg" : "bg-viz-idle/40 text-muted",
                )}
                title={i < r.active ? "working" : "idle: no partition left"}
              >
                {i + 1}
              </motion.span>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <BacklogChart backlog={r.backlog} arrivals={r.arrivals} capacity={capacity} />
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-viz-data/40 size-2.5" /> messages waiting
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-line-strong h-px w-4" /> orders/s arriving
              </span>
              <span className="flex items-center gap-1">
                <span className="border-viz-compute w-4 border-t border-dashed" /> consumers can
                handle
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Peak backlog" value={fmt(r.peak)} bad={r.peak > 0} />
            <Stat
              label="Longest wait"
              value={r.worstWaitMin < 1 ? "< 1 min" : `${r.worstWaitMin.toFixed(0)} min`}
              bad={r.worstWaitMin > 5}
            />
            <Stat
              label="Back to empty"
              value={never ? "not by 11:00" : `10:${String(r.drainedAt).padStart(2, "0")}`}
              bad={never}
            />
            <Stat label="Idle consumers" value={String(r.idle)} bad={r.idle > 0} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.mode}${consumers}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                r.idle > 0 || never ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {r.idle > 0
                ? `In a log, each partition goes to one consumer in the group. With ${PARTITIONS} partitions, consumers 9 to ${consumers} have nothing to read. To go faster, you'd need more partitions, which is best planned up front.`
                : never
                  ? capacity < 160
                    ? "Consumers can't even keep up with normal traffic, so the backlog never clears. Add consumers (or make each one faster)."
                    : "Consumers only just exceed normal traffic, so the spike's backlog drains slowly: orders placed at 10:25 are still waiting at 11:00. Spare capacity is what clears a backlog."
                  : r.peak === 0
                    ? "Enough consumers to absorb the spike as it happens. You're paying for them all day, though."
                    : `The queue absorbed the spike: nothing was turned away. Without it, about ${fmt(r.wouldDrop)} orders would have hit an overloaded service at once.`}
            </motion.p>
          </AnimatePresence>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this simulation works</summary>
            <p className="mt-2">
              One hour, minute by minute. Orders arrive at about 150 a second, jumping to about 800
              a second from 10:10 to 10:25. Each consumer handles {PER_CONSUMER} a second. The wait
              is Little&apos;s law: messages waiting ÷ messages handled per minute.
            </p>
          </details>
        </div>
      }
    >
      <p>
        Concert tickets go on sale at 10:10. Orders pour into a queue; consumers charge cards and
        send confirmations.
      </p>
      <p>
        Choose how many consumers to run. Then switch to a log with {PARTITIONS} <em>partitions</em>{" "}
        (the log&apos;s version of <Term id="shard">shards</Term>) and try again.
      </p>
      <p className="text-muted text-sm">
        A queue turns &ldquo;too much at once&rdquo; into &ldquo;a bit later&rdquo;. That&apos;s
        only acceptable when the work can wait: card charges within minutes, yes; a page load, no.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 3 ─ Predict: consumer groups ------------------------------------------------------------------ */

export function PredictGroup() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How many sit idle?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="idle-consumers"
            prompt="A Kafka topic has 6 partitions. A consumer group runs 10 consumers. How many consumers get no partition at all?"
            min={0}
            max={10}
            step={1}
            unit=" idle"
            answer={4}
            tolerance={0}
            explanation="Within one consumer group, each partition is read by exactly one consumer, so at most 6 do work and 4 wait as spares (useful if one crashes). A second consumer group would get its own copy of all 6 partitions."
          />
        </div>
      }
    >
      <p>
        A <Term id="consumer-group">consumer group</Term> is a team of consumers sharing the work of
        reading a log. Every group gets every message; within a group, each message goes to one
        member.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Deposit before withdrawal ⭐ -------------------------------------------------------------- */

const ROUTINGS: [QueueState["routing"], string, string][] = [
  ["competing", "Queue, competing consumers", "Whichever consumer is free takes the next message."],
  [
    "random",
    "Log, random partition",
    "Each message lands on a random partition; each partition has its own consumer.",
  ],
  [
    "key",
    "Log, partition by account",
    "Messages with the same key (the account) always go to the same partition.",
  ],
];

export function Ordering() {
  const [s, set] = useSceneState<QueueState>();
  const o = useMemo(() => orderingSim(s.routing, s.run + 4), [s.routing, s.run]);
  const scale = (t: number) => (t / o.span) * 100;
  const broken = o.results.filter((r) => r.error);
  return (
    <StepLayout
      eyebrow="Experiment"
      title="Deposit before withdrawal"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-1.5 sm:grid-cols-3">
            {ROUTINGS.map(([id, label, hint]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ routing: id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-left",
                  s.routing === id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-medium">{label}</span>
                <span className="text-muted block text-[10px]">{hint}</span>
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            Arrival order:{" "}
            <span className="font-mono">
              {"A-open B-open A+500 C-open B+800 A−300 C+200 B−100 C−150"}
            </span>
          </p>
          <div className="border-line bg-surface space-y-1.5 rounded-xl border p-3">
            {Array.from({ length: WORKERS }, (_, w) => (
              <div key={w} className="flex items-center gap-2">
                <span className="text-muted w-16 shrink-0 text-[10px]">
                  {s.routing === "competing" ? `consumer ${w + 1}` : `partition ${w}`}
                </span>
                <div className="bg-surface-2 relative h-7 flex-1 rounded-md">
                  {o.placed
                    .filter((p) => p.worker === w)
                    .map((p) => (
                      <motion.div
                        key={`${s.routing}${s.run}${p.i}`}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: p.start * 0.08, duration: 0.3 }}
                        style={{
                          left: `${scale(p.start)}%`,
                          width: `${scale(p.end - p.start)}%`,
                          originX: 0,
                        }}
                        className="border-viz-data/60 bg-viz-data/20 absolute top-0.5 bottom-0.5 grid place-items-center overflow-hidden rounded border font-mono text-[9px]"
                      >
                        {p.msg.account}
                        {p.msg.kind === "open"
                          ? "·open"
                          : p.msg.kind === "deposit"
                            ? `+${p.msg.amount}`
                            : `−${p.msg.amount}`}
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
            <p className="text-subtle text-right text-[9px]">time →</p>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {o.results.map((r) => (
              <div
                key={r.account}
                className={cn(
                  "rounded-xl border px-3 py-2",
                  r.error ? "border-bad/50 bg-bad/10" : "border-good/40 bg-good/10",
                )}
              >
                <p className="text-xs font-semibold">Account {r.account}</p>
                <p className="text-muted text-[10px]">{r.error ?? `balance ₹${r.balance}`}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted text-xs">
              {broken.length
                ? `${broken.length} account${broken.length > 1 ? "s" : ""} processed out of order.`
                : s.routing === "key"
                  ? "Every account in order, every run."
                  : "In order this time. Run it again."}
            </p>
            <button
              type="button"
              onClick={() => set({ run: s.run + 1 })}
              className="border-line hover:bg-surface-2 shrink-0 rounded-full border px-3 py-1 text-xs"
            >
              Run again
            </button>
          </div>
        </div>
      }
    >
      <p>
        A bank sends account events through a queue. Order matters: a withdrawal processed before
        its deposit gets rejected.
      </p>
      <p>
        Try each setup and press <em>Run again</em> a few times. Consumers take different amounts of
        time per message, so work finishes in a different order than it arrived.
      </p>
      <p className="text-muted text-sm">
        Logs keep order only <em>within</em> a partition. Pick the key so that the messages that
        must stay in order share it. Queues offer the same idea: FIFO queues with a message group ID
        (SQS), sessions (Azure Service Bus), ordering keys (Pub/Sub).
      </p>
    </StepLayout>
  );
}

/* 5 ─ The poison message ------------------------------------------------------------------------ */

interface PoisonFrame {
  title: string;
  text: string;
  cells: ("ok" | "poison" | "done" | "waiting" | "parked")[];
  tone?: "good" | "bad";
}

function poisonFrames(kind: QueueState["kind"], dlq: boolean): PoisonFrame[] {
  const first: PoisonFrame = {
    title: "A message that can't be processed",
    text: "Message 3 has a malformed payload. The consumer throws an error every time it tries.",
    cells: ["done", "done", "poison", "waiting", "waiting", "waiting"],
  };
  if (kind === "queue") {
    const retry: PoisonFrame = {
      title: "It comes back",
      text: "The consumer never acknowledges it, so after a visibility timeout the queue hands it out again. And again.",
      cells: ["done", "done", "poison", "done", "done", "waiting"],
    };
    return dlq
      ? [
          first,
          retry,
          {
            title: "Parked after 5 tries",
            text: "After the maximum receive count, the queue moves it to a dead-letter queue. An alarm fires; someone inspects it, fixes the bug, and replays it.",
            cells: ["done", "done", "parked", "done", "done", "done"],
            tone: "good",
          },
        ]
      : [
          first,
          retry,
          {
            title: "Forever",
            text: "Without a dead-letter queue it keeps coming back until it expires, wasting consumer time and filling logs with the same error. With a FIFO queue it's worse: messages in its group wait behind it.",
            cells: ["done", "done", "poison", "done", "done", "done"],
            tone: "bad",
          },
        ];
  }
  const stuck: PoisonFrame = {
    title: "The partition stops",
    text: "A log consumer reads in order and only moves its offset forward after success. Stuck on message 3, it can't reach 4, 5 or 6: the whole partition stalls.",
    cells: ["done", "done", "poison", "waiting", "waiting", "waiting"],
    tone: "bad",
  };
  return dlq
    ? [
        first,
        stuck,
        {
          title: "Park it and move on",
          text: "After a few retries, the consumer writes message 3 to a dead-letter topic and advances its offset. The partition flows again; the parked message is fixed and replayed later.",
          cells: ["done", "done", "parked", "done", "done", "done"],
          tone: "good",
        },
      ]
    : [
        first,
        stuck,
        {
          title: "Or skip it silently",
          text: "The other option, skipping errors, loses the message without a trace. Neither is acceptable: logs need a consumer-side dead-letter topic.",
          cells: ["done", "done", "waiting", "done", "done", "done"],
          tone: "bad",
        },
      ];
}

const CELL: Record<PoisonFrame["cells"][number], string> = {
  ok: "border-line bg-surface",
  done: "border-good/40 bg-good/10",
  poison: "border-bad bg-bad/15",
  waiting: "border-line bg-surface",
  parked: "border-viz-compute/60 bg-viz-compute/15",
};

export function Poison() {
  const [s, set] = useSceneState<QueueState>();
  const fs = poisonFrames(s.kind, s.dlq);
  const step = Math.min(s.frame, fs.length - 1);
  const f = fs[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="The poison message"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.kind}
              options={[
                ["queue", "Queue"],
                ["log", "Log"],
              ]}
              onChange={(v) => set({ kind: v as QueueState["kind"], frame: 0 })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.dlq}
                onChange={(e) => set({ dlq: e.target.checked, frame: 0 })}
                className="accent-[var(--accent)]"
              />
              Dead-letter queue
            </label>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {f.cells.map((c, i) => (
              <motion.div
                key={i}
                layout
                className={cn(
                  "grid h-14 place-items-center rounded-lg border font-mono text-sm transition",
                  CELL[c],
                )}
              >
                {i + 1}
                <span className="text-muted text-[9px]">
                  {c === "parked" ? "DLQ" : c === "poison" ? "error" : c === "done" ? "done" : ""}
                </span>
              </motion.div>
            ))}
          </div>
          <Stepper step={step} count={fs.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.kind}${s.dlq}${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Some messages fail every time: bad data, or a bug the message triggers. Retrying them
        won&apos;t help.
      </p>
      <p>
        A <Term id="dead-letter-queue">dead-letter queue</Term> is where they&apos;re parked so the
        rest can flow. Step through with and without one, for a queue and for a log.
      </p>
      <p className="text-muted text-sm">
        SQS, Azure Service Bus and Pub/Sub have dead-lettering built in. Kafka and Kinesis leave it
        to the consumer (frameworks such as Kafka Connect and Spring Kafka provide one).
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: queue or log? ------------------------------------------------------------------- */

export function QueueOrLog() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Queue or log?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="queue-or-log"
            prompt="Which fits each job better? A queue hands each message out once, then it's gone; a log keeps messages to be replayed and read by many."
            categories={[
              { id: "queue", label: "Queue" },
              { id: "log", label: "Log" },
            ]}
            items={[
              {
                id: "resize",
                label: "Resize each uploaded photo",
                category: "queue",
                why: "One worker per job; once resized, the job is done.",
              },
              {
                id: "email",
                label: "Send each password-reset email",
                category: "queue",
                why: "A task to do once; per-message retries and dead-lettering matter most.",
              },
              {
                id: "teams",
                label: "Fraud, analytics and loyalty teams all read every order",
                category: "log",
                why: "Each team is its own consumer group reading the full stream.",
              },
              {
                id: "replay",
                label: "Rebuild a search index from last week's events",
                category: "log",
                why: "Logs retain messages, so a new reader can start from the past.",
              },
              {
                id: "clicks",
                label: "Millions of click events a second, kept in order per user",
                category: "log",
                why: "Partitioned logs handle huge ordered volumes.",
              },
              {
                id: "jobs",
                label: "Nightly report jobs with uneven run times",
                category: "queue",
                why: "Competing consumers balance uneven work: free workers take the next job.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The line between them is blurring (Kafka 4.2 added queue-style &ldquo;share groups&rdquo;;
        RabbitMQ has streams), but the question is still the right one to ask.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Landscape --------------------------------------------------------------------------------- */

export const LANDSCAPE: [string, string, string][] = [
  ["AWS", "SQS (standard and FIFO); Amazon MQ", "Kinesis Data Streams; MSK (managed Kafka)"],
  [
    "Google Cloud",
    "Pub/Sub (acknowledged messages are removed; seek can replay retained ones)",
    "Managed Service for Apache Kafka",
  ],
  [
    "Azure",
    "Service Bus queues and topics; Storage queues",
    "Event Hubs (also speaks the Kafka protocol)",
  ],
  ["Open source", "RabbitMQ; ActiveMQ", "Apache Kafka; Redpanda; Apache Pulsar (both styles)"],
];

const DEFAULTS: [string, string][] = [
  ["SQS visibility timeout (default)", "30 s"],
  ["SQS retention (default; max 14 days)", "4 days"],
  ["Kafka retention (default)", "7 days"],
  ["Pub/Sub ack deadline (default)", "10 s"],
  ["Service Bus max deliveries before DLQ", "10"],
  ["Kinesis write per shard", "1 MB/s"],
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Queues and logs you'll meet"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="space-y-2 sm:hidden">
            {LANDSCAPE.map(([who, q, l]) => (
              <div key={who} className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
                <p className="font-semibold">{who}</p>
                <p className="mt-1">
                  <span className="text-muted">Queues: </span>
                  {q}
                </p>
                <p className="mt-0.5">
                  <span className="text-muted">Logs: </span>
                  {l}
                </p>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-left text-xs sm:table">
            <thead>
              <tr className="text-muted border-line border-b">
                <th className="py-2 pr-3 font-medium" />
                <th className="py-2 pr-3 font-medium">Queues</th>
                <th className="py-2 font-medium">Logs / streams</th>
              </tr>
            </thead>
            <tbody>
              {LANDSCAPE.map(([who, q, l], i) => (
                <motion.tr
                  key={who}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="border-line border-b last:border-0"
                >
                  <td className="py-2.5 pr-3 font-semibold">{who}</td>
                  <td className="py-2.5 pr-3">{q}</td>
                  <td className="py-2.5">{l}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DEFAULTS.map(([k, v]) => (
              <div key={k} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="font-mono text-sm">{v}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>Every cloud has both kinds; the ideas carry across.</p>
      <p className="text-muted text-sm">
        Below the table: defaults worth knowing. The visibility timeout (ack deadline) is how long a
        consumer has before a message is handed to someone else.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Queues decouple", "Producers don't wait; spikes become backlog instead of errors."],
  ["Watch the backlog", "A queue that keeps growing means consumers can't keep up."],
  [
    "Queue vs log",
    "Queues hand each message out once; logs keep them for many readers and replay.",
  ],
  [
    "Order needs a key",
    "Logs keep order only within a partition; partitions cap a group's consumers.",
  ],
  ["Park poison messages", "Dead-letter them so the rest keep flowing, and alarm on it."],
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
      <p>Queues deliver messages at least once, so sometimes twice.</p>
      <p>Next: retries, and how to make doing something twice harmless.</p>
    </StepLayout>
  );
}
