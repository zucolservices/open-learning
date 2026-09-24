"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { frames, type Svc, type SvcState } from "./frames";
import type { TxState } from "./state";

/* 1 ─ One order, three databases ⭐ -------------------------------------------------------------- */

const SVC_LABEL: Record<Svc, string> = {
  coordinator: "Coordinator",
  payment: "Payment",
  stock: "Stock",
  shipping: "Shipping",
};

const STATE_STYLE: Record<SvcState, string> = {
  idle: "border-line bg-surface",
  working: "border-accent bg-accent-soft",
  prepared: "border-viz-compute/60 bg-viz-compute/10",
  done: "border-good/50 bg-good/10",
  failed: "border-bad bg-bad/10",
  blocked: "border-bad/60 bg-bad/5",
  undone: "border-line bg-surface-2",
  down: "border-line border-dashed opacity-40",
};

const STATE_TEXT: Record<SvcState, string> = {
  idle: "waiting",
  working: "running",
  prepared: "prepared (locked)",
  done: "committed",
  failed: "failed",
  blocked: "in doubt, locked",
  undone: "undone",
  down: "crashed",
};

export function TwoWays() {
  const [s, set] = useSceneState<TxState>();
  const fs = frames(s.approach, s.failure);
  const step = Math.min(s.frame, fs.length - 1);
  const f = fs[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="One order, three databases"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.approach}
            options={[
              ["2pc", "Two-phase commit"],
              ["saga", "Saga"],
            ]}
            onChange={(v) => set({ approach: v as TxState["approach"], frame: 0 })}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Inject a failure</span>
            <Segmented
              size="sm"
              value={s.failure}
              options={[
                ["none", "None"],
                ["stock", "Out of stock"],
                ["coordinator", "Coordinator crashes"],
              ]}
              onChange={(v) => set({ failure: v as TxState["failure"], frame: 0 })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(SVC_LABEL) as Svc[]).map((k) => (
              <motion.div
                key={k}
                layout
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-center transition",
                  STATE_STYLE[f.states[k]],
                )}
              >
                <p className="text-xs font-semibold">
                  {k === "coordinator" && s.approach === "saga" ? "Orchestrator" : SVC_LABEL[k]}
                </p>
                <p className="text-muted text-[10px]">{STATE_TEXT[f.states[k]]}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs">
            Customer sees: <span className="font-mono">{f.customer}</span>
          </p>
          <Stepper step={step} count={fs.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.approach}${s.failure}${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Booking a holiday means a flight, a hotel and a car from three different companies.
        There&apos;s no single &ldquo;undo&rdquo; button: if the hotel falls through, you cancel the
        flight yourself.
      </p>
      <p>
        Brewline&apos;s order for a coffee machine is the same: payment, stock and shipping each
        have their own database, so no single transaction covers them all. Two classic answers:{" "}
        <Term id="two-phase-commit">two-phase commit</Term> and the <Term id="saga">saga</Term>. Run
        both, then inject failures.
      </p>
      <p className="text-muted text-sm">
        Databases like Spanner and CockroachDB do two-phase commit internally, with a replicated
        coordinator so a crash doesn&apos;t block. Across separate services, sagas are the usual
        choice.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Checkpoint: compensation is not undo ------------------------------------------------------ */

export function CompensateCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Compensation is not undo"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="compensate"
            prompt="A saga's second step sent the customer an email: 'Your machine ships tomorrow!'. Step three then fails. What's the compensating action for the email?"
            options={[
              {
                id: "correction",
                label: "Send a follow-up email explaining the order was cancelled and refunded",
                correct: true,
                feedback:
                  "Right. You can't unsend an email; compensation is a new, visible action that makes things right.",
              },
              {
                id: "unsend",
                label: "Recall the email",
                feedback:
                  "Email can't be reliably recalled. Compensations must be real, forward actions.",
              },
              {
                id: "nothing",
                label: "Nothing: the refund is enough",
                feedback:
                  "The customer would still expect a delivery. Every visible effect needs a compensation (or a design that avoids it).",
              },
              {
                id: "retry",
                label: "Retry step three until it works",
                feedback:
                  "Sometimes the right choice for retryable steps, but not when the step can't succeed (no stock).",
              },
            ]}
            explanation="Order saga steps so irreversible actions (emails, shipping) come after the steps that can fail, and design each compensation as a real business action."
          />
        </div>
      }
    >
      <p>Sagas trade locks for visible in-between states.</p>
    </StepLayout>
  );
}

/* 3 ─ The dual write ⭐ -------------------------------------------------------------------------- */

const CRASHES: [TxState["crash"], string][] = [
  ["after-db", "Crash after saving the order"],
  ["after-publish", "Publish, then the save fails"],
  ["twice", "The event is delivered twice"],
];

function outcome(crash: TxState["crash"], outbox: boolean, dedupe: boolean) {
  if (crash === "after-db")
    return outbox
      ? {
          ok: true,
          db: "order #7 + outbox row (one transaction)",
          bus: "OrderPlaced #7 (published by the relay)",
          stock: "reserved once",
          text: "The relay finds the outbox row and publishes it, however late. No event is lost.",
        }
      : {
          ok: false,
          db: "order #7",
          bus: "(nothing)",
          stock: "never reserved",
          text: "The order was saved but the event never sent. Stock is never reserved; the order sits forever.",
        };
  if (crash === "after-publish")
    return outbox
      ? {
          ok: true,
          db: "(nothing: rolled back)",
          bus: "(nothing)",
          stock: "untouched",
          text: "With an outbox, events are only published from committed rows. A failed save means no event.",
        }
      : {
          ok: false,
          db: "(nothing: the save failed)",
          bus: "OrderPlaced #7",
          stock: "reserved for an order that doesn't exist",
          text: "The event went out, then the save failed: stock is reserved for a phantom order.",
        };
  // twice
  if (dedupe)
    return {
      ok: true,
      db: "order #7 + outbox row",
      bus: "OrderPlaced #7 ×2",
      stock: "reserved once",
      text: "The consumer records each message ID it has processed (in the same transaction as its work) and ignores the repeat.",
    };
  return {
    ok: false,
    db: "order #7 + outbox row",
    bus: "OrderPlaced #7 ×2",
    stock: "reserved twice",
    text: "Relays and brokers deliver at least once. Without deduplication, the consumer does the work twice.",
  };
}

export function DualWrite() {
  const [s, set] = useSceneState<TxState>();
  const o = outcome(s.crash, s.outbox, s.dedupe);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Save it, and tell everyone"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {CRASHES.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ crash: id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-left text-xs",
                  s.crash === id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.outbox}
                onChange={(e) => set({ outbox: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Transactional outbox
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.dedupe}
                onChange={(e) => set({ dedupe: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Idempotent consumer
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {(
              [
                ["Orders database", o.db],
                ["Message broker", o.bus],
                ["Stock service", o.stock],
              ] as const
            ).map(([k, v]) => (
              <motion.div
                key={k + v}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface rounded-xl border px-3 py-2"
              >
                <p className="text-muted text-[10px]">{k}</p>
                <p className="font-mono text-xs">{v}</p>
              </motion.div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.crash + s.outbox + s.dedupe}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                o.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {o.text}
            </motion.p>
          </AnimatePresence>
          <Code>
            {s.outbox
              ? "BEGIN;\n  INSERT INTO orders ...;\n  INSERT INTO outbox (id, aggregatetype, aggregateid, type, payload) ...;\nCOMMIT;\n-- a relay (polling, or Debezium reading the log) publishes outbox rows"
              : "db.save(order);          // 1\nbroker.publish(event);   // 2: a crash between 1 and 2 loses it"}
          </Code>
        </div>
      }
    >
      <p>
        A service saving an order and announcing it on a message bus is doing a{" "}
        <Term id="dual-write">dual write</Term>: two systems, no shared transaction. A crash in
        between leaves them disagreeing.
      </p>
      <p>
        Try each failure, then the two fixes. The <Term id="outbox">outbox</Term> writes the event
        into the same database, in the same transaction; a separate relay publishes it.
      </p>
      <p className="text-muted text-sm">
        The outbox guarantees the event is sent at least once, so consumers must handle repeats. The
        pair (outbox + idempotent consumer) is the pattern to remember.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------------------- */

export function OutboxCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Exactly once?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="outbox-once"
            prompt="The team adds a transactional outbox and says: 'Now every event is delivered exactly once.' Is that right?"
            options={[
              {
                id: "no",
                label:
                  "No: the outbox makes 'saved' and 'published' happen together, but a relay can still publish an event twice, so consumers must deduplicate",
                correct: true,
                feedback:
                  "Right. The outbox gives at-least-once; exactly-once effects come from idempotent consumers.",
              },
              {
                id: "yes",
                label: "Yes, that's what the outbox guarantees",
                feedback:
                  "The relay may crash after publishing but before marking the row sent, and publish it again.",
              },
              {
                id: "broker",
                label: "Only if the broker is Kafka",
                feedback:
                  "Broker features help inside the broker, but the relay-to-broker and broker-to-consumer steps can still repeat.",
              },
              {
                id: "never",
                label: "No, events may still be lost",
                feedback:
                  "Loss is what the outbox prevents: the event is in the same transaction as the order.",
              },
            ]}
            explanation="Design every consumer to be safe to run twice: record processed message IDs, or make the operation naturally idempotent."
          />
        </div>
      }
    >
      <p>A claim you&apos;ll hear in design reviews.</p>
    </StepLayout>
  );
}

/* 5 ─ Tools --------------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "AWS Step Functions",
    "Standard workflows run each step exactly once for up to a year; Express runs at least once for up to 5 minutes. Tasks it calls still need idempotency.",
  ],
  [
    "Temporal",
    "'Durable execution': workflow code that survives crashes by replaying its history.",
  ],
  [
    "Azure Durable Functions",
    "Orchestrator, activity and entity functions; the Durable Task Scheduler is the recommended backend.",
  ],
  ["Google Cloud Workflows", "YAML or JSON workflows that can wait up to a year."],
  ["Camunda", "BPMN workflows on Zeebe; self-managed production use needs a licence since 8.6."],
  [
    "Debezium outbox router",
    "Reads outbox rows from the database log and routes them to topics per aggregate type.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Saga engines you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Hand-rolled sagas get complicated fast. Workflow engines store each step durably, retry, and
        run compensations for you.
      </p>
      <p className="text-muted text-sm">
        Choreography (services reacting to each other&apos;s events) needs no engine but is harder
        to follow; orchestration puts the flow in one place.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["No transaction spans services", "Each service's database commits on its own."],
  ["2PC blocks", "Prepared participants wait, holding locks, if the coordinator dies."],
  ["Sagas compensate", "Local steps plus compensating actions; in-between states are visible."],
  ["Beware dual writes", "Save and publish together with an outbox."],
  ["At least once, so be idempotent", "Consumers must safely handle the same message twice."],
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
      <p>That completes data at scale.</p>
      <p>Next chapter: asynchronous systems, starting with queues and streams.</p>
    </StepLayout>
  );
}
