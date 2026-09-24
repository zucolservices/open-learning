"use client";

import { motion } from "motion/react";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";

/* 6 ─ Checkpoint: the missing orders ------------------------------------------------------------- */

export function FailoverCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The missing orders"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="missing-orders"
            prompt="The primary database crashed; a replica was promoted automatically within a minute. Next morning, twelve customers have order confirmations for orders that don't exist. What happened?"
            options={[
              {
                id: "async",
                label:
                  "Replication was asynchronous: those orders were confirmed by the old primary but hadn't reached the replica before it crashed",
                correct: true,
                feedback:
                  "Right. Async failover can lose writes that users were already told succeeded. Synchronous (or semi-synchronous) replication to at least one standby prevents it, at some cost in write latency.",
              },
              {
                id: "cache",
                label: "A cache served stale confirmations",
                feedback:
                  "The confirmations were real: the orders were written, then lost with the old primary.",
              },
              {
                id: "split",
                label: "Split brain: both databases took the orders",
                feedback: "Then the orders would exist somewhere. Here they're simply gone.",
              },
              {
                id: "bug",
                label: "The app never saved them",
                feedback: "The customers got confirmations only after the primary committed them.",
              },
            ]}
            explanation="Decide explicitly how much recently confirmed data you can afford to lose on failover (your recovery point), and choose the replication mode to match."
          />
        </div>
      }
    >
      <p>From the failover step-through.</p>
    </StepLayout>
  );
}

/* 7 ─ Managed replication ------------------------------------------------------------------------ */

const MANAGED: [string, string][] = [
  [
    "Amazon RDS Multi-AZ (instance)",
    "A synchronous standby in another zone; failover typically takes 60–120 seconds.",
  ],
  [
    "Amazon RDS Multi-AZ (DB cluster)",
    "Two readable standbys; failover typically under 35 seconds.",
  ],
  [
    "Amazon Aurora",
    "Six copies of the data across three zones; a write needs four to agree, a read three.",
  ],
  ["Google Cloud SQL HA", "A standby with synchronous replication to regional disks."],
  [
    "Azure SQL (Business Critical)",
    "Replicas in the style of SQL Server Always On availability groups.",
  ],
  [
    "PostgreSQL & MySQL",
    "synchronous_commit (up to remote_apply) and quorum standbys; MySQL semi-sync silently falls back to async on timeout. PostgreSQL 19 adds WAIT FOR an LSN, for reading your own writes on a replica.",
  ],
];

export function Managed() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Replication you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {MANAGED.map(([t, d], i) => (
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
        Managed databases handle <Term id="failover">failover</Term> for you, but the trade-offs
        you&apos;ve seen still apply. Check how long failover takes and what can be lost.
      </p>
      <p className="text-muted text-sm">
        &ldquo;Synchronous&rdquo; means different things in different products: confirmed received,
        written to disk, or applied. Read the definition.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Replicas lag", "Usually milliseconds, sometimes much more: design reads with that in mind."],
  ["Protect the writer's view", "Read-your-writes and monotonic reads need routing, not luck."],
  [
    "Sync costs latency, async risks loss",
    "Pick per system; a nearby synchronous standby is a common middle ground.",
  ],
  [
    "Failover is hard",
    "Detecting failure, promoting, and fencing the old leader to avoid split brain.",
  ],
  [
    "Three shapes",
    "Single-leader is the default; multi-leader and leaderless trade simplicity for availability.",
  ],
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
        Replication copies all the data. Next: splitting it up, when it no longer fits on one
        machine.
      </p>
    </StepLayout>
  );
}
