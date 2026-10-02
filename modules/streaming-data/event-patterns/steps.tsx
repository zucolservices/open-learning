"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Camera } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, SAGA, SNAPSHOT_AT, balance, replayed, sagaFrames } from "./model";
import type { Fail, Mode, PatternState } from "./state";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* 1 ─ The passbook ----------------------------------------------------------------------------- */

export function Passbook() {
  const lines = EVENTS.slice(1, 6);
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The passbook"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="text-accent size-4" /> Savings passbook
            </p>
            <div className="flex flex-col gap-1 font-mono text-xs">
              {lines.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * i }}
                  className="border-line grid grid-cols-[4rem_1fr_5rem_5rem] gap-2 border-b border-dashed pb-1"
                >
                  <span className="text-muted">{e.day}</span>
                  <span className="truncate">
                    {e.type === "WithdrawalReversed"
                      ? "Reversal"
                      : e.amount > 0
                        ? "Deposit"
                        : "Withdrawal"}
                  </span>
                  <span className={cn("text-right", e.amount < 0 ? "text-bad" : "text-good")}>
                    {e.amount > 0 ? "+" : ""}
                    {e.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-right">{balance(i + 1).toLocaleString("en-IN")}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-muted text-xs">
            The wrong ₹800 withdrawal on 12 Sep isn&apos;t rubbed out. A reversal line is added on
            13 Sep.
          </p>
        </div>
      }
    >
      <p>
        An old bank passbook never stores just your balance. It stores every deposit and withdrawal,
        in order; the balance is what you get by adding them up. Mistakes are fixed with a new line,
        never an eraser.
      </p>
      <p>
        This module covers three patterns built on that idea.{" "}
        <Term id="event-sourcing">Event sourcing</Term> stores the events as the truth.{" "}
        <Term id="cqrs">CQRS</Term> reads through separate views built from them.{" "}
        <Term id="saga">Sagas</Term> coordinate work across services with events.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rebuild the balance ⭐ ---------------------------------------------------------------------- */

export function Rebuild() {
  const [s, set] = useSceneState<PatternState>();
  const read = replayed(s.upTo, s.snapshot);
  const fromSnap = s.snapshot && s.upTo >= SNAPSHOT_AT;
  return (
    <StepLayout
      eyebrow="Step through"
      title="Rebuild the balance"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {EVENTS.map((e, i) => {
              const applied = i <= s.upTo;
              const viaSnap = fromSnap && i < SNAPSHOT_AT;
              return (
                <div key={i}>
                  {i === SNAPSHOT_AT && s.snapshot && (
                    <div className="border-viz-meta text-viz-meta my-1 flex items-center gap-2 border-t border-dashed pt-1 text-[10px]">
                      <Camera className="size-3" /> Snapshot: balance{" "}
                      {inr(balance(SNAPSHOT_AT - 1))}
                    </div>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => set({ upTo: i })}
                    animate={{ opacity: applied ? 1 : 0.35 }}
                    className={cn(
                      "grid w-full grid-cols-[3.5rem_1fr_5rem] items-center gap-2 rounded border px-2 py-1 text-left font-mono text-[11px]",
                      applied && !viaSnap
                        ? "border-viz-data bg-viz-data/15"
                        : "border-line bg-surface",
                    )}
                  >
                    <span className="text-muted">{e.day}</span>
                    <span className="truncate">{e.type}</span>
                    <span className="text-right">
                      {e.amount
                        ? `${e.amount > 0 ? "+" : ""}${e.amount.toLocaleString("en-IN")}`
                        : ""}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>
          <input
            type="range"
            min={0}
            max={EVENTS.length - 1}
            value={s.upTo}
            onChange={(e) => set({ upTo: Number(e.target.value) })}
            className="accent-accent"
            aria-label="Replay up to"
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.snapshot}
              onChange={(e) => set({ snapshot: e.target.checked })}
              className="accent-accent"
            />
            Start from a snapshot taken after event {SNAPSHOT_AT}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Balance on {EVENTS[s.upTo].day}</p>
              <p className="font-mono text-lg font-semibold">{inr(balance(s.upTo))}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Events replayed</p>
              <p className="font-mono text-lg font-semibold">
                {read} of {s.upTo + 1}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Priya&apos;s account is stored only as events. To know her balance, replay them from the
        start. Drag the slider to replay up to any date: you can answer &ldquo;what was her balance
        on 9 September?&rdquo; for free, and auditors see exactly why.
      </p>
      <p>
        Fowler (2005): &ldquo;The fundamental idea of Event Sourcing is that of ensuring every
        change to the state of an application is captured in an event object&rdquo;. Long histories
        replay slowly, so systems save snapshots and replay only what came after. The cost: event
        formats must be versioned forever, since old events never go away.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Separate the reads ⭐ ------------------------------------------------------------------------ */

export function Cqrs() {
  const [s, set] = useSceneState<PatternState>();
  const [shown, setShown] = useState(s.posted);
  useEffect(() => {
    if (shown === s.posted) return;
    const t = setTimeout(() => setShown(s.posted), 1200);
    return () => clearTimeout(t);
  }, [s.posted, shown]);
  const base = balance(EVENTS.length - 1);
  const writeBal = base + 500 * s.posted;
  const readBal = base + 500 * shown;
  const stale = shown !== s.posted;
  const count = EVENTS.length + s.posted;
  const views: [string, string, string][] = [
    ["Balance view", inr(readBal), "Key-value store, one row per account"],
    [
      "Statement view",
      `${EVENTS.length - 1 + shown} lines`,
      "Rows per month, for the app's history screen",
    ],
    [
      "Fraud features",
      `${shown > 0 ? shown : 0} deposits in the last hour`,
      "Counters for the fraud model",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Separate the reads"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            onClick={() => set({ posted: s.posted + 1 })}
            className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-sm"
          >
            Deposit ₹500
          </button>
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1.4fr]">
            <div className="border-viz-data bg-viz-data/10 rounded-xl border px-3 py-3">
              <p className="text-muted text-[10px]">Write side: event store</p>
              <p className="font-mono text-lg font-semibold">{count} events</p>
              <p className="text-xs">Balance {inr(writeBal)}</p>
            </div>
            <span className="text-muted text-center text-xs">projections →</span>
            <div className="flex flex-col gap-1.5">
              {views.map(([n, v, d]) => (
                <motion.div
                  key={n}
                  animate={{ opacity: stale ? 0.6 : 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    stale ? "border-bad/50 border-dashed" : "border-line bg-surface",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold">{n}</span>
                    <span className="font-mono text-xs">{v}</span>
                  </div>
                  <p className="text-subtle text-[10px]">{d}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <p className={cn("text-sm", stale && "text-bad")}>
            {stale
              ? "Read models are catching up: for a moment the app shows the old balance."
              : "Read models have caught up with the event store."}
          </p>
        </div>
      }
    >
      <p>
        Replaying events on every screen load would be slow. <Term id="cqrs">CQRS</Term> (Command
        Query Responsibility Segregation, named and popularised by Greg Young around 2010) splits
        the model you write to from the models you read from.{" "}
        <Term id="read-model">Read models</Term> are built by projections that consume the events,
        each shaped for one screen or job.
      </p>
      <p>
        Press deposit a few times. Read models are updated after the write, so they are briefly
        stale: eventual consistency. Fowler&apos;s warning: &ldquo;beware that for most systems CQRS
        adds risky complexity&rdquo;. Use it where reads and writes truly differ.
      </p>
    </StepLayout>
  );
}

/* 4 ─ A saga that undoes itself ⭐ ------------------------------------------------------------------ */

const FAILS: [Fail, string][] = [
  ["none", "Nothing fails"],
  ["stock", "Stock"],
  ["payment", "Payment"],
  ["delivery", "Delivery"],
];

const STATE_CLS = {
  todo: "border-line bg-surface text-muted",
  done: "border-good/60 bg-good/15",
  failed: "border-bad bg-bad/20",
  undone: "border-viz-remove border-dashed bg-viz-remove/10 line-through",
  retrying: "border-accent bg-accent-soft",
} as const;

export function Saga() {
  const [s, set] = useSceneState<PatternState>();
  const frames = sagaFrames(s.fail);
  const f = frames[Math.min(s.sagaFrame, frames.length - 1)];
  return (
    <StepLayout
      eyebrow="Step through"
      title="A saga that undoes itself"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Fails at</span>
            <Segmented
              size="sm"
              value={s.fail}
              options={FAILS}
              onChange={(v) => set({ fail: v, sagaFrame: 0 })}
            />
          </div>
          <Segmented
            size="sm"
            value={s.mode}
            options={
              [
                ["orchestration", "Orchestration"],
                ["choreography", "Choreography"],
              ] as [Mode, string][]
            }
            onChange={(v) => set({ mode: v })}
          />
          {s.mode === "orchestration" && (
            <div className="border-viz-compute bg-viz-compute/10 self-center rounded-lg border px-3 py-1 text-xs">
              Order saga orchestrator: sends each command, decides what to undo
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SAGA.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <motion.div
                  layout
                  className={cn(
                    "w-full rounded-lg border px-2 py-2 text-center text-xs",
                    STATE_CLS[f.states[i]],
                  )}
                >
                  <p className="font-semibold">
                    {f.states[i] === "undone" ? step.undo : step.name}
                  </p>
                  <p className="text-subtle text-[10px]">{step.service}</p>
                </motion.div>
                <span className="text-subtle text-[9px]">{step.kind}</span>
              </div>
            ))}
          </div>
          {s.mode === "choreography" && (
            <p className="text-muted text-center text-[10px]">
              No coordinator: each service reacts to the previous one&apos;s event (StockReserved →
              charge; PaymentFailed → release stock).
            </p>
          )}
          <FrameCaption frameKey={`${s.fail}-${s.sagaFrame}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper
            step={Math.min(s.sagaFrame, frames.length - 1)}
            count={frames.length}
            onChange={(n) => set({ sagaFrame: n })}
          />
        </div>
      }
    >
      <p>
        An order touches four services, each with its own database, so no single transaction can
        cover them. A <Term id="saga">saga</Term> (Garcia-Molina and Salem, 1987) is a sequence of
        local transactions; if one fails, <Term id="compensating-action">compensating actions</Term>{" "}
        undo the earlier ones, in reverse.
      </p>
      <p>
        Azure&apos;s guide names three kinds of step: compensable, the{" "}
        <Term id="pivot-transaction">pivot</Term> (point of no return), and retryable steps after
        it. Choose where it fails, then step through. An orchestrator is easier to follow;
        choreography has no central piece but its flow is spread across services.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Tools and traps -------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "Event stores",
    "KurrentDB (EventStoreDB until Event Store became Kurrent in December 2024), Axon Server, Marten on PostgreSQL. They append per entity with optimistic concurrency checks.",
  ],
  [
    "Why not just Kafka?",
    "Kafka keeps events, but can't cheaply read one account's stream or refuse a write because someone else appended first. As Oskar Dudycz puts it: \"You don't have basic guarantees for optimistic concurrency checks.\" Use it to publish events, not as the store.",
  ],
  [
    "Saga orchestrators",
    "Temporal (durable execution; grew from Cadence, created at Uber in 2015), AWS Step Functions, Azure Durable Functions, Camunda, Conductor OSS (Netflix archived the original in December 2023). Google Cloud Workflows can run one too.",
  ],
  [
    "Proof it scales",
    'LMAX (2011): "6 million orders per second on a single thread", in memory, using event sourcing.',
  ],
  [
    "Right to erasure",
    "Events are immutable, but personal data must be deletable. Crypto-shredding encrypts each person's data with their own key, then deletes the key. Common, though its legal standing is debated.",
  ],
  [
    "Four meanings of event-driven",
    "Fowler (2017): event notification, event-carried state transfer, event sourcing and CQRS. Say which one you mean.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools and traps"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
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
        These patterns are powerful and expensive. Every saga step and projection must be{" "}
        <Term id="idempotent">idempotent</Term>, because events get redelivered (module 10).
        Publishing events reliably alongside a database write needs the outbox (module 8).
      </p>
      <p>Most systems need one pattern in one place, not all three everywhere.</p>
    </StepLayout>
  );
}

/* 6 ─ Which pattern? -------------------------------------------------------------------------- */

export function WhichPattern() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which pattern?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-pattern"
            prompt="Which pattern fits each need?"
            categories={[
              { id: "es", label: "Event sourcing" },
              { id: "cqrs", label: "CQRS read model" },
              { id: "saga", label: "Saga" },
              { id: "notify", label: "Event notification" },
            ]}
            items={[
              {
                id: "audit",
                label: "Auditors must see every change to a wallet and its state on any past date",
                category: "es",
                why: "The events are the history; replay to any point.",
              },
              {
                id: "screen",
                label: 'The app needs a fast "last 10 transactions" screen built from the ledger',
                category: "cqrs",
                why: "A projection shaped for that one screen.",
              },
              {
                id: "order",
                label:
                  "An order spans inventory, payments and delivery, each with its own database",
                category: "saga",
                why: "Local transactions plus compensations, instead of one transaction.",
              },
              {
                id: "email",
                label: "Tell the email service an order shipped so it can send a mail",
                category: "notify",
                why: "Just announce it; no state rebuilt, no coordination.",
              },
              {
                id: "search",
                label: "Customer support needs orders searchable by customer name",
                category: "cqrs",
                why: "A search index fed by the events is another read model.",
              },
            ]}
            explanation="Event sourcing stores history, CQRS shapes reads, sagas coordinate writes, and often a plain notification is all you need."
          />
        </div>
      }
    >
      <p>Five needs. Which pattern fits each?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Event sourcing", "Store the changes; state is a replay. Snapshots keep it fast."],
  ["CQRS", "Write once, read through views built for each job, a moment behind."],
  ["Sagas", "Local steps with compensations; a pivot, then retries."],
  ["Use sparingly", "Each adds real complexity. Reach for it only where it pays."],
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
      <p>Next: the capstone, a real-time payments monitor built from everything in this track.</p>
    </StepLayout>
  );
}
