"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { EventState } from "./state";

/* 1 ─ Rewire the checkout ⭐ ------------------------------------------------------------------------ */

interface Svc {
  id: string;
  label: string;
  ms: number; // time a direct call takes
  optional?: boolean;
}

const BASE: Svc[] = [
  { id: "stock", label: "Stock", ms: 40 },
  { id: "email", label: "Email", ms: 120 },
  { id: "loyalty", label: "Loyalty points", ms: 60 },
];
const EXTRA: Svc[] = [
  { id: "analytics", label: "Analytics", ms: 80, optional: true },
  { id: "fraud", label: "Fraud review", ms: 150, optional: true },
  { id: "recs", label: "Recommendations", ms: 90, optional: true },
];

function Diagram({
  wiring,
  svcs,
  emailDown,
}: {
  wiring: EventState["wiring"];
  svcs: Svc[];
  emailDown: boolean;
}) {
  const W = 340;
  const H = 40 + svcs.length * 34;
  const cy = H / 2;
  const busX = 150;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-lg"
      role="img"
      aria-label="How checkout reaches other services"
    >
      <rect
        x={6}
        y={cy - 18}
        width={78}
        height={36}
        rx={8}
        fill="var(--accent-soft)"
        stroke="var(--accent)"
      />
      <text x={45} y={cy + 4} textAnchor="middle" className="fill-fg text-[10px] font-semibold">
        Checkout
      </text>
      {wiring === "events" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect
            x={busX - 8}
            y={14}
            width={16}
            height={H - 28}
            rx={6}
            fill="var(--viz-meta)"
            opacity={0.25}
            stroke="var(--viz-meta)"
          />
          <text x={busX} y={10} textAnchor="middle" className="fill-muted text-[8px]">
            event bus
          </text>
          <line
            x1={84}
            y1={cy}
            x2={busX - 8}
            y2={cy}
            stroke="var(--viz-meta)"
            strokeWidth={1.5}
            markerEnd="url(#ev-arr)"
          />
          <text x={112} y={cy - 5} textAnchor="middle" className="fill-muted text-[7px]">
            OrderPlaced
          </text>
        </motion.g>
      )}
      {svcs.map((s, i) => {
        const y = 24 + i * 34 + 10;
        const down = s.id === "email" && emailDown;
        return (
          <motion.g key={s.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <motion.path
              d={
                wiring === "calls"
                  ? `M84,${cy} C140,${cy} 170,${y} 226,${y}`
                  : `M${busX + 8},${y} L226,${y}`
              }
              fill="none"
              stroke={
                down ? "var(--bad)" : wiring === "calls" ? "var(--line-strong)" : "var(--viz-meta)"
              }
              strokeWidth={1.3}
              strokeDasharray={down ? "3 3" : undefined}
              markerEnd="url(#ev-arr)"
            />
            <rect
              x={228}
              y={y - 12}
              width={106}
              height={24}
              rx={6}
              fill={down ? "var(--surface)" : "var(--surface)"}
              stroke={down ? "var(--bad)" : s.optional ? "var(--good)" : "var(--line-strong)"}
            />
            <text
              x={281}
              y={y + 3.5}
              textAnchor="middle"
              className={cn("text-[9px]", down ? "fill-muted" : "fill-fg")}
            >
              {s.label}
              {down ? " (down)" : ""}
            </text>
          </motion.g>
        );
      })}
      <defs>
        <marker
          id="ev-arr"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--line-strong)" />
        </marker>
      </defs>
    </svg>
  );
}

export function Rewire() {
  const [s, set] = useSceneState<EventState>();
  const svcs = [...BASE, ...EXTRA.filter((e) => s.added.includes(e.id))];
  const calls = s.wiring === "calls";
  const latency = calls ? 50 + svcs.reduce((a, x) => a + x.ms, 0) : 50 + 10;
  const edits = calls ? s.added.length : 0;
  const outcome = s.emailDown
    ? calls
      ? {
          ok: false,
          text: "Checkout calls Email, Email times out, and the order fails. A broken email service now stops people buying.",
        }
      : {
          ok: true,
          text: "Checkout doesn't notice. OrderPlaced waits in Email's queue, and confirmations go out when it recovers.",
        }
    : calls
      ? {
          ok: s.added.length === 0,
          text: s.added.length
            ? `Each new service meant editing and redeploying Checkout (${s.added.length} change${s.added.length > 1 ? "s" : ""}), and every call adds to the customer's wait.`
            : "Works. But Checkout knows about every service that cares about orders.",
        }
      : {
          ok: true,
          text: s.added.length
            ? "New services subscribed to OrderPlaced. Checkout wasn't touched."
            : "Checkout announces what happened; it no longer knows who's listening.",
        };
  return (
    <StepLayout
      eyebrow="Build & connect"
      title="Rewire the checkout"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.wiring}
            options={[
              ["calls", "Direct calls"],
              ["events", "Publish an event"],
            ]}
            onChange={(v) => set({ wiring: v as EventState["wiring"] })}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {EXTRA.map((e) => {
              const on = s.added.includes(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() =>
                    set({ added: on ? s.added.filter((x) => x !== e.id) : [...s.added, e.id] })
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs",
                    on ? "border-good/50 bg-good/10" : "border-line hover:bg-surface-2",
                  )}
                >
                  {on ? "✓ " : "+ "}
                  {e.label}
                </button>
              );
            })}
            <label className="ml-auto flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.emailDown}
                onChange={(e) => set({ emailDown: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Email service is down
            </label>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <Diagram wiring={s.wiring} svcs={svcs} emailDown={s.emailDown} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Checkout waits" value={`${latency} ms`} bad={latency > 400} />
            <Stat label="Checkout changes" value={String(edits)} bad={edits > 0} />
            <Stat
              label="If Email is down"
              value={calls ? "orders fail" : "email is late"}
              bad={calls}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.wiring}${s.emailDown}${s.added.length}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                outcome.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {outcome.text}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        When you get engaged, you could phone every relative one by one, waiting on the line for
        each. Or you post once in the family group, and whoever cares reacts in their own time.
      </p>
      <p>
        Brewline&apos;s checkout phones everyone: it calls Stock, Email and Loyalty directly. Add
        more services, and take Email down. Then switch Checkout to publishing an{" "}
        <Term id="event">event</Term>, &ldquo;OrderPlaced&rdquo;, that services{" "}
        <Term id="pub-sub">subscribe</Term> to.
      </p>
      <p className="text-muted text-sm">
        Checkout still charges the card directly before replying: the customer needs that answer
        now. Events are for work that can happen after.
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

/* 2 ─ Checkpoint: commands vs events ---------------------------------------------------------------- */

export function CommandOrEvent() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Command or event?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="command-or-event"
            prompt="A command asks one service to do something (it may say no). An event states a fact that already happened. Which is each message?"
            categories={[
              { id: "command", label: "Command" },
              { id: "event", label: "Event" },
            ]}
            items={[
              {
                id: "reserve",
                label: "ReserveStock",
                category: "command",
                why: "An instruction to the stock service, which can refuse.",
              },
              {
                id: "placed",
                label: "OrderPlaced",
                category: "event",
                why: "Past tense: it already happened, and anyone may react.",
              },
              {
                id: "send",
                label: "SendReceiptEmail",
                category: "command",
                why: "It tells one specific service what to do.",
              },
              {
                id: "captured",
                label: "PaymentCaptured",
                category: "event",
                why: "A fact. The payment service doesn't care who listens.",
              },
              {
                id: "address",
                label: "CustomerAddressChanged",
                category: "event",
                why: "A fact other services might copy or react to.",
              },
              {
                id: "refund",
                label: "RefundPayment",
                category: "command",
                why: "Imperative, aimed at the payment service.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The naming habit helps: commands are imperative (&ldquo;do this&rdquo;), events are past
        tense (&ldquo;this happened&rdquo;).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four meanings of "event-driven" ------------------------------------------------------------- */

const LEDGER: [string, number][] = [
  ["AccountOpened", 0],
  ["Deposited ₹2,000", 2000],
  ["Withdrew ₹500", -500],
  ["Deposited ₹1,200", 1200],
  ["Withdrew ₹300", -300],
  ["Fee ₹50", -50],
];

const STYLES: Record<
  EventState["style"],
  { label: string; title: string; text: string; plus: string; minus: string; code: string }
> = {
  notification: {
    label: "Notification",
    title: "Event notification",
    text: "The event just says something happened, with an ID. Anyone who needs details asks the source.",
    plus: "Tiny events; the source stays the owner of the data.",
    minus: "Consumers call back for details, which recreates some coupling and load.",
    code: '{ "type": "OrderPlaced", "orderId": "o-7731" }',
  },
  state: {
    label: "State transfer",
    title: "Event-carried state transfer",
    text: "The event carries the data consumers need, so they can keep their own copy and never call back.",
    plus: "Consumers keep working even if the source is down.",
    minus: "Bigger events; copies of data everywhere, eventually consistent.",
    code: '{ "type": "OrderPlaced", "orderId": "o-7731",\n  "customer": { "id": "c-12", "email": "…" },\n  "items": [ … ], "total": 1499 }',
  },
  sourcing: {
    label: "Event sourcing",
    title: "Event sourcing",
    text: "The events are the database. Current state is worked out by replaying them, so you can rebuild the past at any point.",
    plus: "A complete audit trail; answer 'what did it look like on Tuesday?'.",
    minus: "Harder to query and to change; old events live forever.",
    code: "balance = events.reduce(apply, 0)",
  },
  cqrs: {
    label: "CQRS",
    title: "CQRS (separate reads from writes)",
    text: "Writes go to one model; reads come from separate models shaped for each screen, kept up to date by events.",
    plus: "Each read model is fast and simple for its job.",
    minus: "More moving parts; read models lag slightly behind writes.",
    code: "write: PlaceOrder → orders\nevents → 'my orders' view, 'sales by day' view",
  },
};

export function FourMeanings() {
  const [s, set] = useSceneState<EventState>();
  const st = STYLES[s.style];
  const balance = LEDGER.slice(0, s.replay + 1).reduce((a, [, v]) => a + v, 0);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four things called “event-driven”"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.style}
            options={(Object.keys(STYLES) as EventState["style"][]).map(
              (k) => [k, STYLES[k].label] as [string, string],
            )}
            onChange={(v) => set({ style: v as EventState["style"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.style}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="border-line bg-surface rounded-xl border px-4 py-3">
                <p className="font-semibold">{st.title}</p>
                <p className="text-muted mt-1 text-sm">{st.text}</p>
              </div>
              {s.style === "sourcing" ? (
                <div className="border-line bg-surface rounded-xl border p-3">
                  <div className="space-y-1">
                    {LEDGER.map(([e], i) => (
                      <div
                        key={e}
                        className={cn(
                          "rounded-md border px-2 py-1 font-mono text-[11px] transition",
                          i <= s.replay
                            ? "border-viz-meta/50 bg-viz-meta/10"
                            : "border-line text-subtle",
                        )}
                      >
                        {i + 1}. {e}
                      </div>
                    ))}
                  </div>
                  <label className="mt-3 flex items-center gap-3 text-xs">
                    <span className="text-muted shrink-0">Replay up to</span>
                    <input
                      type="range"
                      min={0}
                      max={LEDGER.length - 1}
                      value={s.replay}
                      onChange={(e) => set({ replay: Number(e.target.value) })}
                      className="flex-1 accent-[var(--accent)]"
                      aria-label="Replay up to event"
                    />
                    <span className="font-mono">balance ₹{balance.toLocaleString("en-IN")}</span>
                  </label>
                </div>
              ) : (
                <Code>{st.code}</Code>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                <p className="border-good/40 bg-good/10 rounded-xl border px-3 py-2 text-xs">
                  {st.plus}
                </p>
                <p className="border-bad/40 bg-bad/10 rounded-xl border px-3 py-2 text-xs">
                  {st.minus}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Martin Fowler pointed out that people mean four different things by
        &ldquo;event-driven&rdquo;. Mixing them up causes a lot of confused design meetings.
      </p>
      <p>
        Most systems use the first two. <Term id="event-sourcing">Event sourcing</Term> and{" "}
        <Term id="cqrs">CQRS</Term> are powerful but add real complexity, so use them where their
        benefits matter (such as ledgers and audit trails).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Change the event, break the consumers ⭐ ------------------------------------------------------ */

const CHANGES: Record<
  EventState["change"],
  { label: string; after: string; breaks: string[]; why: string }
> = {
  "add-optional": {
    label: "Add an optional field",
    after:
      '{ "orderId": "o-7731", "email": "…", "total": 1499,\n  "currency": "INR" }   // new, with a default',
    breaks: [],
    why: "Old consumers ignore the field they don't know; new ones use the default when it's missing. Safe in both directions.",
  },
  remove: {
    label: "Remove a field",
    after: '{ "orderId": "o-7731", "total": 1499 }   // "email" removed',
    breaks: ["email"],
    why: "The email consumer still expects 'email' and can't send receipts.",
  },
  rename: {
    label: "Rename a field",
    after: '{ "orderId": "o-7731", "email": "…", "amount": 1499 }   // was "total"',
    breaks: ["loyalty", "analytics"],
    why: "To old consumers, a rename is a removal plus an unknown new field: 'total' has vanished.",
  },
  type: {
    label: "Change a type",
    after: '{ "orderId": "o-7731", "email": "…", "total": "₹1,499" }   // number → text',
    breaks: ["loyalty", "analytics"],
    why: "Consumers doing arithmetic on 'total' now get text and fail.",
  },
};

const CONSUMERS = [
  { id: "email", label: "Email", reads: "email" },
  { id: "loyalty", label: "Loyalty", reads: "total" },
  { id: "analytics", label: "Analytics", reads: "orderId, total" },
];

export function SchemaChange() {
  const [s, set] = useSceneState<EventState>();
  const c = CHANGES[s.change];
  const rejected = s.registry && c.breaks.length > 0;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Change the event, break the consumers"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {(Object.keys(CHANGES) as EventState["change"][]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ change: k })}
                className={cn(
                  "rounded-xl border px-2 py-1.5 text-xs",
                  s.change === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {CHANGES[k].label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.registry}
              onChange={(e) => set({ registry: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Check new schemas in a schema registry before publishing
          </label>
          <Code>{c.after}</Code>
          <div className="grid gap-2 sm:grid-cols-3">
            {CONSUMERS.map((k) => {
              const broken = !rejected && c.breaks.includes(k.id);
              return (
                <motion.div
                  key={k.id + s.change + s.registry}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    broken ? "border-bad/50 bg-bad/10" : "border-good/40 bg-good/10",
                  )}
                >
                  <p className="text-sm font-semibold">{k.label}</p>
                  <p className="text-muted text-[10px]">reads {k.reads}</p>
                  <p className="mt-1 text-xs">
                    {broken
                      ? "Broken"
                      : rejected
                        ? "Unaffected: change was blocked"
                        : "Still working"}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.change}${s.registry}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                rejected
                  ? "border-viz-compute/40 bg-viz-compute/10"
                  : c.breaks.length
                    ? "border-bad/40 bg-bad/10"
                    : "border-good/40 bg-good/10",
              )}
            >
              {rejected
                ? "The registry rejected the new schema as incompatible, so the producer's deploy failed in testing instead of breaking consumers in production. Ship it as a new, versioned event instead, and migrate consumers."
                : c.why}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Once other teams consume your event, its shape is a contract. You can&apos;t see who reads
        it, so a careless change breaks services you&apos;ve never heard of.
      </p>
      <p>
        Try each change. Then turn on a <Term id="schema-registry">schema registry</Term>, which
        checks every new version against the old one.
      </p>
      <p className="text-muted text-sm">
        Registries have compatibility modes. Confluent&apos;s default, BACKWARD, assumes consumers
        upgrade first; FORWARD assumes producers do; FULL checks both. This example is FULL.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: when not to use events ------------------------------------------------------------ */

export function WhenNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Event or call?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="event-or-call"
            prompt="After 'Pay', the checkout page must show either 'Payment approved' or 'Card declined'. How should checkout talk to the payment service?"
            options={[
              {
                id: "call",
                label: "A direct request, waiting for the answer",
                correct: true,
                feedback:
                  "Right. The customer is waiting for this exact answer, so ask and wait (with a timeout and an idempotency key).",
              },
              {
                id: "event",
                label: "Publish OrderPlaced and let payment react",
                feedback:
                  "Then checkout has no answer to show. Events suit work nobody is waiting on.",
              },
              {
                id: "poll",
                label: "Publish an event, then poll a database until the result appears",
                feedback:
                  "It works, but it's a slow, complicated way to do a request and response.",
              },
              {
                id: "email",
                label: "Publish an event; email the result later",
                feedback: "Customers expect to know on the spot whether their card went through.",
              },
            ]}
            explanation="Use events when the producer doesn't need an answer. Use a request when it does. Most real systems mix both."
          />
        </div>
      }
    >
      <p>Events are a tool, not a religion.</p>
    </StepLayout>
  );
}

/* 6 ─ Landscape ------------------------------------------------------------------------------------ */

const TOOLS: [string, string][] = [
  [
    "AWS",
    "EventBridge event buses and rules (with a schema registry), EventBridge Pipes for point-to-point, SNS topics fanning out to SQS queues.",
  ],
  [
    "Azure",
    "Event Grid (push or pull, CloudEvents, MQTT), Service Bus topics, Event Hubs with a schema registry.",
  ],
  ["Google Cloud", "Eventarc (delivers CloudEvents), Pub/Sub topics and subscriptions."],
  ["Open source", "Kafka with a schema registry (Confluent, Apicurio); NATS; RabbitMQ exchanges."],
  [
    "CloudEvents",
    "A CNCF standard envelope for events (id, source, specversion, type), graduated in 2024.",
  ],
  [
    "AsyncAPI",
    "Like OpenAPI, but for event-driven APIs: documents channels and message schemas (v3.1).",
  ],
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Event plumbing you'll meet"
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
        Every cloud offers an event router and a pub/sub service; standards help events travel
        between them.
      </p>
      <p className="text-muted text-sm">
        Whatever you pick, add a correlation ID to every event so you can trace one order across
        services. Following a flow is the hard part of event-driven systems (more in Observability).
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Announce, don't instruct", "Events state facts; any number of services can react."],
  ["Loose coupling", "Add consumers without touching the producer; failures stay contained."],
  ["Four flavours", "Notification, state transfer, event sourcing, CQRS: know which you mean."],
  ["Events are contracts", "Evolve them compatibly; check with a schema registry."],
  ["Requests still matter", "If someone waits for the answer, make a call."],
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
      <p>That completes asynchronous systems.</p>
      <p>
        Next chapter: reliability, starting with what &ldquo;99.9% available&rdquo; really means.
      </p>
    </StepLayout>
  );
}
