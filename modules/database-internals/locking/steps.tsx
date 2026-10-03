"use client";

import { motion } from "motion/react";
import { ArrowRight, Lock, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEADLOCK, ROWS, replay, type Action, type Row, type Tx } from "./model";
import type { LockState } from "./state";

const TX_CLASS: Record<Tx, string> = {
  1: "border-accent bg-accent-soft text-accent",
  2: "border-viz-compute bg-viz-compute/10 text-viz-compute",
};

/* 1 ─ Two cooks, one knife ------------------------------------------------------------------------ */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Two cooks, one knife"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-3">
            {[
              ["Cook A", "holds the knife", "wants the board"],
              ["Cook B", "holds the board", "wants the knife"],
            ].map(([who, holds, wants], i) => (
              <motion.div
                key={who}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className={cn(
                  "rounded-xl border px-3 py-3 text-center",
                  i === 0 ? TX_CLASS[1] : TX_CLASS[2],
                  i === 1 && "col-start-3",
                )}
              >
                <p className="text-fg text-sm font-semibold">{who}</p>
                <p className="text-muted text-xs">{holds}</p>
                <p className="text-xs">{wants}</p>
              </motion.div>
            ))}
            <div className="text-bad col-start-2 row-start-1 flex flex-col items-center gap-1">
              <ArrowRight className="size-5" />
              <ArrowRight className="size-5 rotate-180" />
            </div>
          </div>
          <p className="text-muted max-w-sm text-center text-xs">
            Each is waiting for something the other holds. Neither will let go first. Without
            someone stepping in, dinner never happens.
          </p>
        </div>
      }
    >
      <p>
        A kitchen with one knife and one chopping board. Cook A picks up the knife and reaches for
        the board; at the same moment Cook B picks up the board and reaches for the knife. Both
        wait, politely, forever.
      </p>
      <p>
        Databases have the same problem. One way to keep transactions apart is a{" "}
        <Term id="lock">lock</Term>: before changing a row, a transaction must hold its lock, and
        anyone else who wants it waits. When two transactions each wait for the other, that&apos;s a{" "}
        <Term id="deadlock">deadlock</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Lock, wait, deadlock ⭐ --------------------------------------------------------------------- */

export function Sandbox() {
  const [s, set] = useSceneState<LockState>();
  const actions = s.actions ?? [];
  const w = replay(actions);
  const add = (a: Action) => set({ actions: [...actions, a] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Lock, wait, deadlock"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2">
            {([1, 2] as Tx[]).map((t) => {
              const st = w.status[t];
              const live = st === "running";
              return (
                <div key={t} className="border-line bg-surface rounded-xl border px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className={cn("font-mono text-sm font-semibold", TX_CLASS[t].split(" ")[2])}>
                      T{t}
                    </p>
                    <span
                      className={cn(
                        "text-[10px]",
                        st === "waiting" && "text-fg font-semibold",
                        st === "aborted" && "text-bad",
                        st === "committed" && "text-good",
                        st === "running" && "text-muted",
                      )}
                    >
                      {st}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1">
                    {(Object.keys(ROWS) as Row[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        disabled={!live || w.holder[r] === t}
                        onClick={() => add(`${t}:${r}`)}
                        className="border-line hover:bg-surface-2 rounded-md border px-2 py-1 text-left text-[11px] disabled:opacity-40"
                      >
                        UPDATE {ROWS[r]}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={!live}
                      onClick={() => add(`${t}:commit`)}
                      className="border-line hover:bg-surface-2 rounded-md border px-2 py-1 text-left text-[11px] disabled:opacity-40"
                    >
                      COMMIT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROWS) as Row[]).map((r) => {
              const h = w.holder[r];
              const waiter = ([1, 2] as Tx[]).find((t) => w.waitsFor[t] === r);
              return (
                <div
                  key={r}
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    h ? TX_CLASS[h] : "border-line bg-surface",
                  )}
                >
                  <p className="text-fg flex items-center gap-1 text-xs font-semibold">
                    {h && <Lock className="size-3" />} {ROWS[r]}
                  </p>
                  <p className="text-muted text-[10px]">
                    {h ? `locked by T${h}` : "free"}
                    {waiter && ` · T${waiter} waiting`}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="bg-surface-2 min-h-24 rounded-xl px-3 py-2 font-mono text-[10px] leading-relaxed">
            {w.log.length === 0 && (
              <p className="text-subtle">Click an UPDATE for either transaction to begin.</p>
            )}
            {w.log.map((l, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  l.bad && "text-bad",
                  l.good && "text-good",
                  !l.bad && !l.good && (l.tx === 0 ? "text-muted italic" : "text-fg"),
                )}
              >
                {l.text}
              </motion.p>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => set({ actions: DEADLOCK })}
              className="border-line hover:bg-surface-2 rounded-md border px-2.5 py-1 text-xs"
            >
              Show me a deadlock
            </button>
            {actions.length > 0 && (
              <button
                type="button"
                onClick={() => set({ actions: [] })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
        </div>
      }
    >
      <p>
        Two transfers between the same two accounts. Each UPDATE locks the row it changes until the
        transaction ends. Try making T2 update a row T1 holds: it waits. Commit T1 and T2 carries
        on.
      </p>
      <p>
        Now make each take a different row first, then reach for the other&apos;s. PostgreSQL waits{" "}
        <Term id="deadlock-timeout">deadlock_timeout</Term> (1 second by default) before checking,
        finds the cycle and aborts one transaction so the other can finish. Which one it picks is,
        in the docs&apos; words, &ldquo;difficult to predict and should not be relied upon.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two-phase locking --------------------------------------------------------------------------- */

export function TwoPhase() {
  // A lock count rising then falling, drawn as bars.
  const growing = [1, 2, 3, 4];
  const strict = [1, 2, 3, 4, 4, 4, 0];
  const classic = [1, 2, 3, 4, 3, 2, 0];
  return (
    <StepLayout
      eyebrow="Concept"
      title="Two-phase locking"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          {[
            [
              "Two-phase locking",
              classic,
              "Locks are released one by one after the last one is taken.",
            ],
            [
              "Strict two-phase locking",
              strict,
              "Write locks are held until COMMIT, then all released at once.",
            ],
          ].map(([t, bars, d]) => (
            <div key={t as string} className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">{t as string}</p>
              <div className="mt-2 flex h-20 items-end gap-1">
                {(bars as number[]).map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${n * 25}%` }}
                    transition={{ delay: 0.05 * i }}
                    className={cn(
                      "flex-1 rounded-t",
                      i < growing.length ? "bg-accent" : "bg-viz-compute",
                    )}
                  />
                ))}
              </div>
              <div className="text-muted mt-1 flex justify-between text-[10px]">
                <span>growing: take locks</span>
                <span>shrinking: release</span>
              </div>
              <p className="text-muted mt-1 text-xs">{d as string}</p>
            </div>
          ))}
          <p className="text-subtle text-[10px]">Bars: locks held over time (illustrative).</p>
        </div>
      }
    >
      <p>
        In 1976 Eswaran, Gray, Lorie and Traiger at IBM showed a simple rule makes locking safe.{" "}
        <Term id="two-phase-locking">Two-phase locking</Term>: a transaction has a growing phase,
        when it may take new locks, and a shrinking phase; &ldquo;once a lock has been released, the
        transaction cannot request a new one.&rdquo; Follow it and concurrent transactions give the
        same result as some one-at-a-time order.
      </p>
      <p>
        They also noted that update locks should be held to the end of the transaction, so it can be
        undone safely. Holding locks until commit is now called strict two-phase locking, and
        it&apos;s what databases do for writes.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Locks in PostgreSQL ------------------------------------------------------------------------- */

export function InPostgres() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Locks in PostgreSQL"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="text-sm font-semibold">Row locks</p>
            <p className="text-muted">
              FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, FOR KEY SHARE. An ordinary UPDATE takes FOR
              NO KEY UPDATE. &ldquo;They block only writers and lockers to the same row.&rdquo;
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="text-sm font-semibold">Eight table lock modes</p>
            <p className="text-muted">
              From ACCESS SHARE (taken by every SELECT) to ACCESS EXCLUSIVE (taken by DROP TABLE and
              many forms of ALTER TABLE). Only ACCESS EXCLUSIVE blocks a plain SELECT. The word
              &ldquo;row&rdquo; in some mode names is historical: they&apos;re all table locks.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="text-sm font-semibold">Safety valves</p>
            <Code>{`SET lock_timeout = '2s';        -- give up waiting for a lock
SET statement_timeout = '30s';  -- give up on any slow statement
SELECT * FROM pg_locks;         -- who holds and waits for what`}</Code>
            <p className="text-muted mt-1">Both timeouts are off (0) by default.</p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="text-sm font-semibold">Advisory locks</p>
            <p className="text-muted">
              Locks with a meaning your application decides (&ldquo;only one nightly job at a
              time&rdquo;): pg_advisory_lock(42). The database doesn&apos;t enforce what they
              protect; your code must use them consistently.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Here&apos;s the good news: in PostgreSQL, ordinary reads take no row locks at all.
        Multi-versioning (module 17) means &ldquo;reading never blocks writing and writing never
        blocks reading.&rdquo; Locks matter where writers meet writers, and around schema changes.
      </p>
      <p>
        A migration that takes ACCESS EXCLUSIVE on a busy table blocks every query on it while it
        runs, which is why <code>lock_timeout</code> is worth setting before one.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Other engines ------------------------------------------------------------------------------- */

const ENGINES: [string, string][] = [
  [
    "MySQL (InnoDB)",
    "Deadlock detection is on by default. It tries to roll back a small transaction, measured by rows inserted, updated or deleted. SHOW ENGINE INNODB STATUS shows the latest deadlock.",
  ],
  [
    "InnoDB gap locks",
    "At its default repeatable read level, locking reads and updates also lock the gaps between index entries (a next-key lock), so no one can insert a phantom row into a range you've searched.",
  ],
  [
    "SQL Server lock escalation",
    "When one statement holds about 5,000 locks on a table or index, SQL Server may swap them for a single table lock. Less memory, more waiting for everyone else.",
  ],
];

export function Elsewhere() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Other engines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ENGINES.map(([t, d], i) => (
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
        Every engine locks rows for writes, but the details differ. InnoDB&apos;s{" "}
        <Term id="gap-lock">gap locks</Term> explain why it can stop phantoms at repeatable read;{" "}
        <Term id="lock-escalation">lock escalation</Term> explains why a big UPDATE in SQL Server
        can suddenly block a whole table.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Stop the deadlocks -------------------------------------------------------------------------- */

export function AvoidIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Stop the deadlocks"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="avoid-deadlock"
            prompt="A payments service moves money between accounts. A few times a day, two transfers between the same pair of accounts in opposite directions deadlock. What's the best fix?"
            options={[
              {
                id: "order",
                label:
                  "Always update the two accounts in the same order, say lowest account ID first",
                correct: true,
                feedback:
                  "With one global order, a cycle can't form: whoever gets the first lock gets both.",
              },
              {
                id: "timeout",
                label: "Raise deadlock_timeout to 60 seconds",
                feedback:
                  "That only delays detection. The deadlock still happens; both transfers just wait longer.",
              },
              {
                id: "table",
                label: "Lock the whole accounts table for every transfer",
                feedback: "No deadlocks, but only one transfer at a time across the whole system.",
              },
              {
                id: "ignore",
                label: "Nothing: the database resolves deadlocks itself",
                feedback:
                  "It does abort one, but your code must retry it, and avoiding the cycle is better.",
              },
            ]}
            explanation="PostgreSQL's advice: “the best defense against deadlocks is generally to avoid them by being certain that all applications using a database acquire locks on multiple objects in a consistent order.” Keep a retry for the rare ones that remain."
          />
        </div>
      }
    >
      <p>Deadlocks are a design problem first and a database feature second.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Writers lock rows", "Others who want the same row wait until COMMIT or ROLLBACK."],
  ["Two-phase locking", "Grow, then shrink; strict 2PL holds write locks to commit."],
  ["Deadlocks get broken", "The database aborts one; retry it."],
  ["Consistent order", "Take locks in the same order everywhere to avoid cycles."],
  ["Set timeouts", "lock_timeout and statement_timeout are off by default."],
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
        Next: how PostgreSQL, InnoDB and Oracle let readers skip the queue entirely, by keeping
        several versions of each row.
      </p>
    </StepLayout>
  );
}
