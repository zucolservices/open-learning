"use client";

import { motion } from "motion/react";
import { NotebookPen, Zap } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CRASHES, crash, type Crash, type Mode } from "./model";
import type { WalState } from "./state";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* 1 ─ The shop's day book ------------------------------------------------------------------------- */

export function DayBook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The shop's day book"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "1. Write it in the day book",
              "“4:12 pm: sold 2 kg rice to Mrs Rao, ₹180.” One line, at the end, in ink.",
            ],
            [
              "2. Update the ledgers later",
              "Stock book, customer accounts, cash book: when there's a quiet moment.",
            ],
            [
              "3. After a blackout",
              "Read the day book from the last tidy point and redo anything the ledgers missed.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2"
            >
              <NotebookPen className="text-accent mt-0.5 size-4 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">{t}</span>
                <span className="text-muted text-xs">{d}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A shopkeeper can&apos;t update five ledgers for every sale during the evening rush. So every
        sale goes first into a day book: one quick line at the end. The ledgers catch up later, and
        if the lights go out, the day book says what still needs doing.
      </p>
      <p>
        Databases do exactly this with a <Term id="wal">write-ahead log</Term>. PostgreSQL&apos;s
        docs state the rule: changes to data files &ldquo;must be written only after those changes
        have been logged, that is, after WAL records describing the changes have been flushed to
        permanent storage.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pull the plug ⭐ ---------------------------------------------------------------------------- */

export function PullPlug() {
  const [s, set] = useSceneState<WalState>();
  const r = crash(s.mode, s.crash);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pull the plug"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Mode>
              size="sm"
              value={s.mode}
              onChange={(mode) => set({ mode })}
              options={[
                ["nolog", "No log: write pages directly"],
                ["wal", "Write-ahead log"],
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Zap className="text-bad size-4" />
            {(Object.keys(CRASHES) as Crash[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={s.crash === c}
                onClick={() => set({ crash: c })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.crash === c ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {CRASHES[c]}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">On disk at the crash</p>
              <p className="font-mono text-xs">Asha {inr(r.disk.asha)}</p>
              <p className="font-mono text-xs">Ravi {inr(r.disk.ravi)}</p>
              <p className="text-muted mt-1 text-[10px]">total {inr(r.disk.asha + r.disk.ravi)}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 sm:col-span-2">
              <p className="text-muted text-[10px]">Log on disk</p>
              {r.log.length === 0 ? (
                <p className="text-subtle text-xs">(no log)</p>
              ) : (
                r.log.map((l) => (
                  <p key={l} className="font-mono text-[10px]">
                    {l}
                  </p>
                ))
              )}
            </div>
          </div>
          <motion.div
            key={s.mode + s.crash}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            <p className="text-xs font-semibold">
              After restart: Asha {inr(r.recovered.asha)} · Ravi {inr(r.recovered.ravi)} · total{" "}
              {inr(r.recovered.asha + r.recovered.ravi)}
            </p>
            <p className="text-sm">{r.verdict}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Asha sends Ravi ₹500. Illustrative balances and log records.
          </p>
        </div>
      }
    >
      <p>
        Asha sends Ravi ₹500, which means changing two pages. Pull the power at three different
        moments, with and without a log, and see what&apos;s left after the restart.
      </p>
      <p>
        With a log, a commit only has to flush one small sequential record. After a crash the
        database replays the log, what PostgreSQL calls &ldquo;roll-forward recovery, also known as
        REDO&rdquo;, and changes from transactions that never committed are not kept. The classic
        recipe, ARIES (1992), runs three passes: analysis, redo and undo.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoints and torn pages ------------------------------------------------------------------ */

export function Checkpoints() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Checkpoints and torn pages"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex h-10 items-stretch overflow-hidden rounded-lg">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "border-bg flex-1 border-r",
                  i === 12 ? "bg-viz-meta/70" : i > 12 ? "bg-accent/50" : "bg-viz-idle/30",
                )}
              />
            ))}
          </div>
          <p className="text-muted text-[10px]">
            The log over time. Purple: the last checkpoint. Blue: what recovery must replay. Grey:
            no longer needed.
          </p>
          <Code>{`checkpoint_timeout = 5min    # PostgreSQL defaults
max_wal_size       = 1GB
full_page_writes   = on`}</Code>
        </div>
      }
    >
      <p>
        Replaying a whole year of log after a crash would take forever. So every few minutes the
        database takes a <Term id="checkpoint">checkpoint</Term>: a point at which, in
        PostgreSQL&apos;s words, &ldquo;the heap and index data files have been updated with all
        information written before that checkpoint&rdquo;. Recovery starts from there. More frequent
        checkpoints mean faster recovery but more writing.
      </p>
      <p>
        One more danger: a crash in the middle of writing an 8 kB page can leave it half old, half
        new. PostgreSQL writes a full copy of each page to the log the first time it changes after a
        checkpoint; InnoDB keeps a doublewrite buffer for the same reason.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Speed versus safety ------------------------------------------------------------------------- */

const SETTINGS: [string, string, string][] = [
  [
    "synchronous_commit = on",
    "The default: a commit waits until its log record is on disk.",
    "border-good/40 bg-good/5",
  ],
  [
    "synchronous_commit = off",
    "Commits return before the flush. A crash may lose the most recent transactions, but PostgreSQL describes the risk as “data loss, not data corruption”.",
    "border-viz-compute/40 bg-viz-compute/5",
  ],
  [
    "fsync = off",
    "Never wait for the disk at all. The docs warn it “can result in unrecoverable data corruption”. Only for throwaway data.",
    "border-bad/40 bg-bad/5",
  ],
];

export function Tradeoffs() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Speed versus safety"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SETTINGS.map(([t, d, cls], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className={cn("rounded-lg border px-3 py-2", cls)}
            >
              <p className="font-mono text-xs font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <p className="text-muted text-[11px]">
            Elsewhere: InnoDB keeps a redo log for recovery and undo logs for rolling back. SQLite
            uses a rollback journal by default; in WAL mode, readers and a single writer can work at
            the same time.
          </p>
        </div>
      }
    >
      <p>
        Waiting for the disk on every commit is the main cost of durability. Some settings trade it
        away, and the difference between them matters enormously.
      </p>
      <p>
        Losing the last second of commits might be acceptable for page-view counters. Corrupting the
        database never is. Every log record also gets a <Term id="lsn">log sequence number</Term>, a
        position that only increases, which replicas use too (module 18).
      </p>
    </StepLayout>
  );
}

/* 5 ─ After the restart --------------------------------------------------------------------------- */

export function AfterRestart() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="After the restart"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="after-restart"
            prompt="A payment commits and the customer sees 'Payment successful'. One second later the server loses power, before the changed data pages reach disk. synchronous_commit is on. What happens at restart?"
            options={[
              {
                id: "lost",
                label: "The payment is lost; the customer must pay again",
                feedback: "That's what would happen without a write-ahead log.",
              },
              {
                id: "half",
                label: "The data is corrupted and must be restored from backup",
                feedback: "WAL exists precisely to avoid this.",
              },
              {
                id: "redo",
                label: "Recovery replays the committed log record, so the payment is there",
                correct: true,
                feedback:
                  "The commit record reached disk before the success message; redo rebuilds the pages.",
              },
              {
                id: "maybe",
                label: "It depends on luck",
                feedback: "With the log flushed at commit, it's guaranteed.",
              },
            ]}
            explanation="Committed means logged on disk. Data pages can be rebuilt from the log."
          />
        </div>
      }
    >
      <p>The day book has the sale; the ledgers don&apos;t yet.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Log first", "Then change the data pages, later."],
  ["Commit = log on disk", "One small sequential write."],
  ["Recovery replays the log", "Redo committed work; drop the rest."],
  ["Checkpoints bound recovery", "Start from the last one."],
  ["Know the knobs", "Async commit loses data; fsync off corrupts it."],
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
      <p>Next: the promise built on top of the log, all or nothing.</p>
    </StepLayout>
  );
}
