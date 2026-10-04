"use client";

import { motion } from "motion/react";
import { Check, Database, FileText, Mail, Minus, Phone, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OUTCOMES, SITUATIONS, STYLES, type Style } from "./model";
import type { StyleState } from "./state";

const ICONS = { file: FileText, db: Database, rpc: Phone, msg: Mail };

/* 1 ─ Four ways to pass a message ----------------------------------------------------------------- */

const ANALOGY: [Style, string, string][] = [
  ["file", "Post a letter", "Slow, but nobody needs to be in at the same time."],
  [
    "db",
    "Share one notebook",
    "Everyone sees changes at once, and everyone must agree how to write in it.",
  ],
  ["rpc", "Phone them", "Instant, if they pick up."],
  ["msg", "Leave it in their letterbox", "Delivered quickly; they collect it when they're back."],
];

export function FourWays() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Four ways to pass a message"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {ANALOGY.map(([k, t, d], i) => {
            const Icon = ICONS[k];
            return (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
              >
                <Icon className="text-accent mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-muted text-xs">{d}</p>
                  <p className="text-accent mt-1 font-mono text-[11px]">≈ {STYLES[k].name}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      }
    >
      <p>
        You need to tell a colleague in another building something. You could post a letter, write
        it in a notebook you both use, phone them, or drop a note in their letterbox. Each works;
        each fails differently.
      </p>
      <p>
        Gregor Hohpe and Bobby Woolf&apos;s <Term id="eip">Enterprise Integration Patterns</Term>{" "}
        (2003) names the same four <Term id="integration-style">integration styles</Term> for
        systems: file transfer, shared database, remote procedure invocation and messaging, in
        &ldquo;increasing order of sophistication&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Connect it, then break it ⭐ ---------------------------------------------------------------- */

export function BreakIt() {
  const [s, set] = useSceneState<StyleState>();
  const Icon = ICONS[s.style];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Connect it, then break it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(STYLES) as Style[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.style === k}
                onClick={() => set({ style: k })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  s.style === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {STYLES[k].name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 text-center text-sm">
              CRM
            </div>
            <motion.div
              key={s.style}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="border-accent bg-accent-soft grid size-10 place-items-center rounded-full border"
            >
              <Icon className="text-accent size-5" />
            </motion.div>
            <div className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 text-center text-sm">
              Billing
            </div>
          </div>
          <p className="text-muted text-center text-xs">{STYLES[s.style].how}</p>
          <div className="flex flex-col gap-1.5">
            {OUTCOMES[s.style].map(([v, text], i) => (
              <motion.div
                key={s.style + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2",
                  v === "good"
                    ? "border-good/40 bg-good/5"
                    : v === "bad"
                      ? "border-bad/40 bg-bad/5"
                      : "border-line bg-surface",
                )}
              >
                {v === "good" ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : v === "bad" ? (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <Minus className="text-muted mt-0.5 size-3.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold">{SITUATIONS[i]}</p>
                  <p className="text-muted text-[11px]">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        CRM must tell Billing when a customer changes. Wire it up each way and put it through the
        same four situations. (The first is the book&apos;s own example: the address change that
        reaches billing a day late.)
      </p>
      <p>
        No style wins everywhere. Hohpe and Woolf: &ldquo;The trick is not to choose the one style
        to use always, but to choose the best style for a particular integration opportunity.&rdquo;
        They do lean towards <Term id="messaging">messaging</Term>, the subject of the rest of this
        chapter.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How to choose ------------------------------------------------------------------------------- */

const CRITERIA: [string, string][] = [
  [
    "Do you need to integrate at all?",
    "The first question. A self-contained application avoids the problem entirely.",
  ],
  ["Application coupling", "Each system should be able to change without breaking the others."],
  [
    "Integration simplicity",
    "Change the applications as little as possible; write as little glue as possible.",
  ],
  ["Integration technology", "Special tools cost money and can lock you in."],
  ["Data format", "Both sides must agree a format, or have a translator in between."],
  ["Data timeliness", "How long until the other side knows?"],
  ["Data or functionality", "Do you share facts, or ask the other system to do something?"],
  ["Asynchronicity", "Can the sender carry on without waiting for an answer?"],
];

export function Choosing() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How to choose"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {CRITERIA.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                "rounded-lg border px-3 py-2",
                i === 0 ? "border-accent bg-accent-soft sm:col-span-2" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The book lists the questions to ask before picking a style. The most important is the first;
        the next most important is usually <Term id="coupling">coupling</Term>.
      </p>
      <p>
        A pattern worth noticing: file transfer is loosely coupled but slow; a shared database is
        fast but couples everything to one schema; remote calls share behaviour but tie systems
        together in time. Messaging tries to get the good parts of each.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Then and now -------------------------------------------------------------------------------- */

const NOW: [string, string, string][] = [
  [
    "File transfer",
    "Batch files, FTP",
    "SFTP drops, CSV or Parquet files in object storage, nightly batch jobs",
  ],
  [
    "Shared database",
    "One relational database",
    "A shared reporting database; several apps on one schema (the anti-pattern of module 16)",
  ],
  [
    "Remote procedure invocation",
    "CORBA, COM, Java RMI, SOAP web services",
    "REST, gRPC and GraphQL APIs (see the API Design track)",
  ],
  [
    "Messaging",
    "JMS, MSMQ, TIBCO",
    "RabbitMQ, Kafka, Amazon SQS and SNS, Azure Service Bus, Google Pub/Sub",
  ],
];

export function ThenNow() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Then and now"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {NOW.map(([t, then, now], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">
                <span className="text-subtle">2003 book: </span>
                {then}
              </p>
              <p className="text-xs">
                <span className="text-subtle">Today: </span>
                {now}
              </p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            &ldquo;Today&rdquo; column is our mapping, not the book&apos;s.
          </p>
        </div>
      }
    >
      <p>
        The technologies changed completely in twenty years; the four styles didn&apos;t.
        That&apos;s why the book is still the standard vocabulary.
      </p>
      <p>
        Most real organisations use all four at once, often for the same data. Knowing which is
        which, and what each costs, is the first step to tidying the sprawl from module 1.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which style? -------------------------------------------------------------------------------- */

export function WhichStyle() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which style?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-style"
            prompt="Which integration style is each, or fits each best?"
            categories={[
              { id: "file", label: "File transfer" },
              { id: "db", label: "Shared database" },
              { id: "rpc", label: "Remote call" },
              { id: "msg", label: "Messaging" },
            ]}
            items={[
              {
                id: "statement",
                label: "A bank sends a regulator one statement file each day",
                category: "file",
                why: "Daily is fine, and the file is the contract.",
              },
              {
                id: "reports",
                label: "Two reporting tools query the same sales tables directly",
                category: "db",
                why: "Both depend on one schema.",
              },
              {
                id: "card",
                label: "Checkout must know right now whether a card payment was authorised",
                category: "rpc",
                why: "It needs an answer before it can continue.",
              },
              {
                id: "fanout",
                label: "'Order placed' must reach stock, invoicing and email, even if one is down",
                category: "msg",
                why: "Asynchronous, buffered, and easy to add more receivers.",
              },
            ]}
            explanation="Slow and simple: files. Same data, tightly bound: shared database. Need an answer now: a call. Fire-and-forget to many, even when they're down: messaging."
          />
        </div>
      }
    >
      <p>Match each integration.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Four styles", "File transfer, shared database, remote calls, messaging."],
  ["Each fails differently", "Late data, broken schemas, failed calls, harder debugging."],
  ["Coupling is the cost", "How much one system's change hurts the other."],
  ["Mix them", "Choose per integration point, not once for everything."],
  ["Same ideas, new tools", "The 2003 patterns map onto today's technology."],
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
        Next: the building blocks of messaging: channels, messages and the endpoints between them.
      </p>
    </StepLayout>
  );
}
