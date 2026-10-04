"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { RECEIVERS, run, type Channel } from "./model";
import type { MsgState } from "./state";

/* 1 ─ The post room ------------------------------------------------------------------------------- */

const SLOTS: [string, string, string][] = [
  ["Pigeonhole", "Message channel", "Where messages wait to be collected."],
  ["Envelope", "Message", "A header (address, ID) and a body."],
  ["Clerks", "Endpoints", "Code that sends or receives on behalf of an application."],
];

export function PostRoom() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The post room"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SLOTS.map(([a, b, d], i) => (
            <motion.div
              key={a}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[6.5rem_1.5rem_8rem_1fr] items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span>{a}</span>
              <span className="text-muted">→</span>
              <span className="text-accent font-mono text-xs">{b}</span>
              <span className="text-muted text-xs">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A big office has a post room. Letters go into pigeonholes; someone collects them later. The
        sender doesn&apos;t wait at the door, and the receiver doesn&apos;t need to be in when the
        letter arrives.
      </p>
      <p>
        Messaging works the same way, with a small vocabulary from Hohpe and Woolf that hasn&apos;t
        changed in twenty years. Applications write to and read from a{" "}
        <Term id="message-channel">message channel</Term>; learn the handful of channel and message
        types and every broker on the market makes sense.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Channels in action ⭐ ----------------------------------------------------------------------- */

export function Channels() {
  const [s, set] = useSceneState<MsgState>();
  const r = run(s.channel, s.poison, s.dup, s.idem);
  const names = RECEIVERS[s.channel];
  const toggle = (k: "poison" | "dup" | "idem", label: string) => (
    <button
      type="button"
      aria-pressed={s[k]}
      onClick={() => set({ [k]: !s[k] } as Partial<MsgState>)}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px]",
        s[k] ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
      )}
    >
      {label}
    </button>
  );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Channels in action"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Channel>
            size="sm"
            value={s.channel}
            onChange={(channel) => set({ channel })}
            options={[
              ["p2p", "Point-to-point"],
              ["pubsub", "Publish-subscribe"],
            ]}
          />
          <div className="flex flex-wrap gap-1.5">
            {toggle("poison", "A malformed message")}
            {toggle("dup", "A duplicate delivery")}
            {s.dup && toggle("idem", "Idempotent receivers")}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted mr-1 text-[10px]">sent:</span>
            {[1, 2, 3, 4, 5, 6].map((m) => (
              <span
                key={m}
                className="border-viz-data bg-viz-data/15 rounded px-1.5 font-mono text-[10px]"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {names.map((n, i) => (
              <div
                key={n}
                className="border-line bg-surface flex min-h-28 flex-col gap-1 rounded-lg border px-2 py-2"
              >
                <p className="text-xs font-semibold">{n}</p>
                {r.columns[i].map((d, k) => (
                  <motion.span
                    key={`${s.channel}-${i}-${k}-${d.msg}-${d.note ?? ""}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * k }}
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px]",
                      d.tone === "bad"
                        ? "bg-bad/15 text-bad"
                        : d.tone === "muted"
                          ? "bg-surface-2 text-subtle line-through"
                          : "bg-viz-data/15",
                    )}
                  >
                    {d.msg}
                    {d.note ? ` · ${d.note}` : ""}
                  </motion.span>
                ))}
              </div>
            ))}
            <div className="border-bad/40 bg-bad/5 flex flex-col gap-1 rounded-lg border border-dashed px-2 py-2">
              <p className="text-bad text-xs font-semibold">Dead letters</p>
              {r.dead.map((m) => (
                <span
                  key={m}
                  className="bg-bad/15 text-bad rounded px-1.5 py-0.5 font-mono text-[10px]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {r.log.map((l) => (
              <motion.p
                key={l}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted text-xs"
              >
                {l}
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A <Term id="point-to-point-channel">point-to-point channel</Term> &ldquo;ensures that only
        one receiver will receive a particular message&rdquo;. Put several workers on it and they
        become <Term id="competing-consumers">competing consumers</Term>, sharing the load. A{" "}
        <Term id="pub-sub">publish-subscribe</Term> channel &ldquo;delivers a copy of a particular
        event to each receiver.&rdquo;
      </p>
      <p>
        Now add trouble. A message nobody can process goes to a{" "}
        <Term id="dead-letter-queue">dead-letter queue</Term> after a few tries (you choose how
        many). And because reliable delivery means &ldquo;stored until acknowledged&rdquo;, a
        message can arrive twice; an <Term id="idempotent-receiver">idempotent receiver</Term> can
        safely receive the same message more than once.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Commands, documents, events ----------------------------------------------------------------- */

const KINDS: [string, string, string][] = [
  ["Command message", "“Do this.”", "ChargeCard { orderId: 1042, amount: 249.00 }"],
  [
    "Document message",
    "“Here's the data; decide what to do.”",
    "Customer { id: 81, name: …, addresses: [ … ] }",
  ],
  ["Event message", "“This happened.”", "OrderShipped { orderId: 1042, at: 14:05 }"],
];

export function MessageKinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Commands, documents, events"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {KINDS.map(([t, gist, ex], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-accent text-xs">{gist}</p>
              </div>
              <p className="text-muted mt-1 font-mono text-[11px]">{ex}</p>
            </motion.div>
          ))}
          <Code>{`request: { id: "r-77", replyTo: "credit-replies", body: CheckCredit{...} }
reply:   { correlationId: "r-77", body: CreditOk{ limit: 50000 } }`}</Code>
        </div>
      }
    >
      <p>
        Hohpe and Woolf noticed there&apos;s no special message type for any of these: &ldquo;a
        Command Message is simply a regular message that happens to contain a command.&rdquo; The
        difference is intent. A command tells the receiver what to do; a document just passes data;
        an event announces something, and its timing often matters more than its contents.
      </p>
      <p>
        Need an answer back? Request-reply uses two channels, and a{" "}
        <Term id="correlation-id">correlation ID</Term> in the reply says which request it answers.
      </p>
    </StepLayout>
  );
}

/* 4 ─ In today's tools ---------------------------------------------------------------------------- */

const TOOLS: [string, string, string, string][] = [
  [
    "Amazon",
    "SQS queue",
    "SNS topic fanning out to SQS queues",
    "SQS dead-letter queue (maxReceiveCount)",
  ],
  ["Azure", "Service Bus queue", "Service Bus topic + subscriptions", "$deadletterqueue subqueue"],
  [
    "Google Cloud",
    "One Pub/Sub subscription, many subscribers",
    "One topic, several subscriptions",
    "Dead-letter topic, set on the subscription",
  ],
  [
    "RabbitMQ",
    "A queue (via the default exchange)",
    "Fanout or topic exchange",
    "Dead-letter exchange",
  ],
  ["Kafka", "One consumer group", "Several consumer groups", "Usually a separate error topic"],
];

export function Today() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="In today's tools"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, p2p, ps, dl], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p>
                <span className="text-subtle">Point-to-point: </span>
                {p2p}
              </p>
              <p>
                <span className="text-subtle">Publish-subscribe: </span>
                {ps}
              </p>
              <p className="text-muted">
                <span className="text-subtle">Dead letters: </span>
                {dl}
              </p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every major broker implements the same patterns under different names. Two details worth
        knowing: RabbitMQ publishers send to exchanges, never straight to queues, and Kafka is a log
        rather than a queue; a single <Term id="consumer-group">consumer group</Term> behaves like a
        point-to-point channel, several groups like publish-subscribe.
      </p>
      <p>
        One subtlety: in the book, the messaging system moves undeliverable messages to a
        dead-letter channel, and receivers move messages that make no sense to an &ldquo;invalid
        message channel&rdquo;. Cloud dead-letter queues blend the two.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of message? ---------------------------------------------------------------------- */

export function WhichMessage() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of message?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-message"
            prompt="Is each a command, a document or an event message?"
            categories={[
              { id: "command", label: "Command" },
              { id: "document", label: "Document" },
              { id: "event", label: "Event" },
            ]}
            items={[
              {
                id: "charge",
                label: "ChargeCard { orderId, amount }",
                category: "command",
                why: "Tells the receiver to do something.",
              },
              {
                id: "invoice",
                label: "GenerateInvoice { orderId }",
                category: "command",
                why: "An instruction.",
              },
              {
                id: "pricelist",
                label: "The full monthly price list, 4,000 items",
                category: "document",
                why: "Data handed over; the receiver decides what to do.",
              },
              {
                id: "shipped",
                label: "OrderShipped { orderId, at }",
                category: "event",
                why: "Announces that something happened.",
              },
              {
                id: "updated",
                label: "PriceListUpdated { version: 12 }",
                category: "event",
                why: "A notification; receivers fetch details if they care.",
              },
            ]}
            explanation="Commands are imperative ('do X'), documents carry data, events are past tense ('X happened')."
          />
        </div>
      }
    >
      <p>Classify the messages.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Channels", "Point-to-point shares work; publish-subscribe copies to everyone."],
  ["Message intent", "Command, document or event."],
  ["Dead letters", "Move what can't be processed aside, then look at it."],
  ["Duplicates happen", "Make receivers idempotent."],
  ["Same patterns everywhere", "SQS, Service Bus, Pub/Sub, RabbitMQ, Kafka."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Next: what happens between sender and receiver, when messages need routing, splitting,
        combining or reshaping on the way.
      </p>
    </StepLayout>
  );
}
