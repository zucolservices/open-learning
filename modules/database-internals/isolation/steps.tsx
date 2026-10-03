"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LEVELS, SCENARIOS, run, type Level, type Scenario } from "./model";
import type { IsoState } from "./state";

/* 2 ─ Collide two transactions ⭐ ----------------------------------------------------------------- */

export function Collide() {
  const [s, set] = useSceneState<IsoState>();
  const r = run(s.scenario, s.level);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Collide two transactions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(SCENARIOS) as Scenario[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.scenario === k}
                onClick={() => set({ scenario: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.scenario === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {SCENARIOS[k].name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(LEVELS) as Level[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.level === k}
                onClick={() => set({ level: k })}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[11px]",
                  s.level === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {LEVELS[k]}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{SCENARIOS[s.scenario].setup}</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10px] leading-snug">
            <p className="text-accent font-semibold">T1</p>
            <p className="text-viz-compute font-semibold">T2</p>
            {r.lines.map((l, i) => (
              <motion.div
                key={`${s.scenario}-${s.level}-${i}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                style={{ gridRow: i + 2, gridColumn: l.t }}
                className={cn(
                  "rounded-md border px-2 py-1",
                  l.bad ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="break-words">{l.sql}</p>
                {l.out && (
                  <p className={cn("mt-0.5", l.bad ? "text-bad" : "text-muted")}>→ {l.out}</p>
                )}
              </motion.div>
            ))}
          </div>
          <motion.p
            key={s.scenario + s.level}
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
            Time runs downwards. Both run inside BEGIN … COMMIT at the chosen level unless marked.
            PostgreSQL behaviour; illustrative values.
          </p>
        </div>
      }
    >
      <p>
        Pick a glitch and an isolation level, and watch two transactions run side by side. Try each
        glitch at every level and find the lowest level that stops it.
      </p>
      <p>
        PostgreSQL&apos;s repeatable read is <Term id="snapshot-isolation">snapshot isolation</Term>
        : each transaction sees the database as it was when it started. Its serializable level adds
        checks on top, a technique called <Term id="ssi">serializable snapshot isolation</Term>.
        Write skew is the glitch that separates the two.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Every database picks a default -------------------------------------------------------------- */

const DEFAULTS: [string, string, string][] = [
  ["PostgreSQL", "Read committed", "Asking for read uncommitted gives read committed."],
  ["MySQL (InnoDB)", "Repeatable read", "One level stricter by default than the others here."],
  [
    "SQL Server",
    "Read committed",
    "Uses locks by default; switch on READ_COMMITTED_SNAPSHOT and readers use row versions instead.",
  ],
  [
    "Azure SQL Database",
    "Read committed, with snapshots",
    "READ_COMMITTED_SNAPSHOT is on by default.",
  ],
  [
    "Oracle",
    "Read committed",
    "Its SERIALIZABLE level is really snapshot isolation (Fekete et al., 2005), so write skew can still happen.",
  ],
];

export function Defaults() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Every database picks a default"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DEFAULTS.map(([db, lv, d], i) => (
            <motion.div
              key={db}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[9rem_1fr]"
            >
              <p className="text-sm font-semibold">{db}</p>
              <div>
                <p className="text-accent font-mono text-xs">{lv}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Almost nobody runs serializable by default: it costs more and some transactions have to be
        retried. So most applications run at read committed and handle the risky spots themselves.
      </p>
      <p>
        The same name can mean different things in different databases. Read the documentation for
        yours, and when correctness matters, test: in 2020 Jepsen found PostgreSQL&apos;s
        serializable level could let a rare anomaly through in versions 9.5 to 13. It was fixed in
        the August 2020 releases (12.4 and others).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fixing a race ------------------------------------------------------------------------------- */

const FIXES: { t: string; code: string; d: string }[] = [
  {
    t: "Let the database do the arithmetic",
    code: "UPDATE tickets SET remaining = remaining - 1\n  WHERE remaining > 0;",
    d: "One statement reads and writes the row together, so there's no stale value to overwrite. Fixes the ticket race at read committed.",
  },
  {
    t: "Lock what you read",
    code: "SELECT remaining FROM tickets FOR UPDATE;",
    d: "FOR UPDATE locks the rows it returns until your transaction ends, so the other buyer waits. It can only lock rows that exist, so it won't stop races over rows that haven't been inserted yet.",
  },
  {
    t: "Run serializable and retry",
    code: "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n-- on a serialization error: start again",
    d: "Catches write skew and everything else. The price is retries, which your code must handle.",
  },
];

export function Fixes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fixing a race"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FIXES.map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{f.t}</p>
              <Code>{f.code}</Code>
              <p className="text-muted text-xs">{f.d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Three common fixes, from the most targeted to the most general. The{" "}
        <Term id="lost-update">lost update</Term> has easy fixes; write skew usually needs
        serializable or a carefully chosen lock.
      </p>
      <p>
        PostgreSQL&apos;s advice for repeatable read and serializable alike: &ldquo;applications
        using this level must be prepared to retry transactions due to serialization
        failures.&rdquo; Retry the whole transaction from the beginning, not just the statement that
        failed.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Name the anomaly ---------------------------------------------------------------------------- */

export function NameIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the anomaly"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="name-the-anomaly"
            prompt="Which glitch is each story?"
            categories={[
              { id: "dirty", label: "Dirty read" },
              { id: "nonrep", label: "Non-repeatable" },
              { id: "lost", label: "Lost update" },
              { id: "skew", label: "Write skew" },
            ]}
            items={[
              {
                id: "refund",
                label: "A dashboard shows a refund that is then rolled back",
                category: "dirty",
                why: "It read uncommitted data.",
              },
              {
                id: "report",
                label: "A report reads a price twice and gets two different values",
                category: "nonrep",
                why: "Another transaction committed a change in between.",
              },
              {
                id: "likes",
                label: "Two people like a post at once; the count goes up by one",
                category: "lost",
                why: "Both read the same count and wrote back count + 1.",
              },
              {
                id: "stock",
                label: "Two warehouse workers set the same stock level from stale reads",
                category: "lost",
                why: "The second write silently replaced the first.",
              },
              {
                id: "rooms",
                label:
                  "Two bookings each check a room is free, then insert overlapping reservations",
                category: "skew",
                why: "Each read the same state and wrote different rows.",
              },
              {
                id: "doctors",
                label: "Two doctors both go off call, leaving none",
                category: "skew",
                why: "The classic write skew: different rows, a shared rule.",
              },
            ]}
            explanation="Dirty read: saw uncommitted data. Non-repeatable read: a row changed under you. Lost update: same row, one write overwrote another. Write skew: different rows, a rule broken."
          />
        </div>
      }
    >
      <p>
        Lost update and <Term id="write-skew">write skew</Term> look alike. The difference: do both
        transactions write the same row, or different rows?
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Isolation is a dial", "More overlap is faster but lets more glitches through."],
  [
    "Know your default",
    "Read committed in PostgreSQL, Oracle and SQL Server; repeatable read in InnoDB.",
  ],
  ["Snapshots", "Repeatable read in PostgreSQL is snapshot isolation; it still allows write skew."],
  ["Serializable means retries", "Catch serialization errors and rerun the whole transaction."],
  ["Targeted fixes", "Atomic UPDATEs and FOR UPDATE handle many races at read committed."],
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
        Next: two ways databases enforce isolation. Locks make transactions wait their turn; module
        17&apos;s multi-versioning lets readers and writers pass each other.
      </p>
    </StepLayout>
  );
}
