"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAILURES, run, type Failure } from "./model";
import type { AcidState } from "./state";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* 2 ─ A transfer that fails halfway ⭐ ------------------------------------------------------------ */

export function TryTransfer() {
  const [s, set] = useSceneState<AcidState>();
  const r = run(s.txn, s.failure);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A transfer that fails halfway"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<"no" | "yes">
              size="sm"
              value={s.txn ? "yes" : "no"}
              onChange={(v) => set({ txn: v === "yes" })}
              options={[
                ["no", "Two separate statements"],
                ["yes", "One transaction"],
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FAILURES) as Failure[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={s.failure === f}
                onClick={() => set({ failure: f })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.failure === f
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {FAILURES[f]}
              </button>
            ))}
          </div>
          <Code>{r.steps.join("\n")}</Code>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Asha", inr(r.asha)],
              ["Ravi", inr(r.ravi)],
              ["Total", inr(r.asha + r.ravi)],
            ].map(([l, v], i) => (
              <div
                key={l}
                className={cn(
                  "rounded-lg border px-3 py-1.5",
                  i === 2 && r.asha + r.ravi !== 3000
                    ? "border-bad/50 bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <motion.p
            key={String(s.txn) + s.failure}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {r.note}
          </motion.p>
          <p className="text-subtle text-[10px]">
            Asha starts with ₹2,000, Ravi with ₹1,000. Illustrative.
          </p>
        </div>
      }
    >
      <p>
        Asha sends Ravi ₹500. Run it as two separate statements, then as one transaction, and try
        each kind of failure.
      </p>
      <p>
        PostgreSQL runs each statement in its own transaction unless you say BEGIN, a mode called{" "}
        <Term id="autocommit">autocommit</Term>. That&apos;s fine for one statement and dangerous
        for two that belong together.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Transactions in SQL ------------------------------------------------------------------------- */

export function InSql() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Transactions in SQL"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`BEGIN;
UPDATE accounts SET balance = balance - 100.00 WHERE name = 'Alice';
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100.00 WHERE name = 'Bob';
-- oops ... forget that and use Wally's account
ROLLBACK TO my_savepoint;
UPDATE accounts SET balance = balance + 100.00 WHERE name = 'Wally';
COMMIT;`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good/40 bg-good/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">PostgreSQL</p>
              <p className="text-muted">
                Most schema changes (CREATE TABLE, ALTER TABLE) can be rolled back too. A few
                commands, like CREATE DATABASE, can&apos;t run inside a transaction.
              </p>
            </div>
            <div className="border-viz-compute/40 bg-viz-compute/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">MySQL</p>
              <p className="text-muted">
                Schema changes commit implicitly, before and after; they can&apos;t be part of a
                transaction you roll back.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        This is PostgreSQL&apos;s own tutorial example. BEGIN starts the transaction, COMMIT makes
        it permanent, ROLLBACK throws it away. A savepoint marks a spot you can roll back to without
        losing everything before it.
      </p>
      <p>
        Keep transactions short. An open transaction holds locks and stops cleanup (modules 16 and
        17), so never wait for a user or a slow network call in the middle of one.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Beyond one database ------------------------------------------------------------------------- */

const BEYOND: [string, string][] = [
  [
    "Document databases",
    "MongoDB always made single-document writes atomic; multi-document ACID transactions arrived in version 4.0 (2018) for replica sets and 4.2 for sharded clusters.",
  ],
  [
    "Two-phase commit",
    "PostgreSQL's PREPARE TRANSACTION lets an outside coordinator commit across several databases. It's off by default (max_prepared_transactions = 0) and the docs say it's not intended for application code.",
  ],
  [
    "Across services",
    "Separate services with separate databases can't share one transaction. System Design's module on transactions across services covers sagas and the outbox pattern.",
  ],
];

export function BeyondOne() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Beyond one database"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {BEYOND.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
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
        Inside one database, transactions are cheap and reliable. Stretch them across machines or
        services and they get hard, slow, or impossible.
      </p>
      <p>
        That&apos;s why so much distributed-system design is about avoiding the need for them.
        Module 19 shows how distributed SQL databases bring transactions back, using consensus.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which promise? ------------------------------------------------------------------------------ */

export function WhichLetter() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which promise?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-letter"
            prompt="Which ACID property does each guarantee describe?"
            categories={[
              { id: "a", label: "Atomic" },
              { id: "c", label: "Consistent" },
              { id: "i", label: "Isolated" },
              { id: "d", label: "Durable" },
            ]}
            items={[
              {
                id: "half",
                label: "A failed transfer never leaves money debited but not credited",
                category: "a",
                why: "All or nothing.",
              },
              {
                id: "rollback",
                label: "An error halfway through undoes the earlier statements",
                category: "a",
                why: "Atomicity again.",
              },
              {
                id: "neg",
                label: "A CHECK constraint stops any balance going below zero",
                category: "c",
                why: "The rules hold before and after.",
              },
              {
                id: "peek",
                label: "A report doesn't see a transfer that hasn't committed yet",
                category: "i",
                why: "Others don't see half-done work.",
              },
              {
                id: "power",
                label: "A committed payment is still there after a power cut",
                category: "d",
                why: "Committed means kept.",
              },
              {
                id: "replay",
                label: "The write-ahead log is replayed after a crash",
                category: "d",
                why: "The mechanism behind durability.",
              },
            ]}
            explanation="Atomic: all or nothing. Consistent: rules hold. Isolated: no peeking at unfinished work. Durable: commits survive."
          />
        </div>
      }
    >
      <p>Match each guarantee to its letter.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Atomic", "All the changes or none."],
  ["Consistent", "Constraints plus correct logic."],
  ["Isolated", "How strict is a setting (next module)."],
  ["Durable", "Committed means logged on disk."],
  ["Keep transactions short", "They hold locks and block cleanup."],
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
      <p>Next: what &ldquo;isolated&rdquo; really means when many transactions run at once.</p>
    </StepLayout>
  );
}
