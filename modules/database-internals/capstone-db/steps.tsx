"use client";

import { motion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, START, TARGET, metrics, type Metrics } from "./model";
import type { CapState } from "./state";

function Dashboard({ m }: { m: Metrics }) {
  const tiles: [string, string, boolean][] = [
    ["p99 latency", `${m.p99.toLocaleString("en-IN")} ms`, m.p99 <= TARGET.p99],
    ["Disk used", `${m.disk}%`, m.disk < 70],
    ["Deadlocks / hour", String(m.deadlocks), m.deadlocks === 0],
    ["XIDs before wraparound", `${m.xidLeft.toLocaleString("en-IN")} M`, m.xidLeft > 500],
  ];
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {tiles.map(([l, v, ok]) => (
        <div
          key={l}
          className={cn(
            "rounded-lg border px-2.5 py-1.5",
            ok ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/5",
          )}
        >
          <p className="text-muted text-[10px]">{l}</p>
          <motion.p
            key={v}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className={cn("font-mono text-sm font-semibold", ok ? "text-good" : "text-bad")}
          >
            {v}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

/* 1 ─ Friday evening, payments -------------------------------------------------------------------- */

export function Friday() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Friday evening, payments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Dashboard m={START} />
          <div className="bg-surface-2 rounded-xl px-3 py-2 font-mono text-[10px] leading-relaxed">
            <p className="text-bad">
              #payments-oncall · 18:42 merchants report the dashboard timing out
            </p>
            <p className="text-bad">
              #payments-oncall · 18:55 settlement job: &ldquo;deadlock detected&rdquo; ×3
            </p>
            <p className="text-muted">#infra · 19:03 disk alert on db-primary (86%)</p>
          </div>
          <Code>{`-- already switched on (in shared_preload_libraries):
pg_stat_statements   -- time spent per query
auto_explain         -- logs plans of slow statements`}</Code>
        </div>
      }
    >
      <p>
        You look after the PostgreSQL database behind a payments app: merchants, payments, refunds
        and nightly settlement. It&apos;s Friday evening and everything is slow at once.
      </p>
      <p>
        Good news: someone switched on <Term id="pg-stat-statements">pg_stat_statements</Term>,
        which tracks &ldquo;planning and execution statistics of all SQL statements&rdquo;, and
        auto_explain, which logs the plans of slow statements &ldquo;without having to run EXPLAIN
        by hand&rdquo;. You have evidence. Time to read it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Five problems ⭐ ---------------------------------------------------------------------------- */

export function Investigate() {
  const [s, set] = useSceneState<CapState>();
  const solved = s.solved ?? [];
  const tried = s.tried ?? [];
  const i = Math.min(s.current ?? 0, CASES.length - 1);
  const c = CASES[i];
  const done = solved.includes(c.id);
  const m = metrics(solved);
  const lastTried = [...tried].reverse().find((t) => t.startsWith(c.id + ":"));
  const lastOpt = lastTried && c.options.find((o) => `${c.id}:${o.id}` === lastTried);
  const pick = (oid: string) => {
    const o = c.options.find((x) => x.id === oid)!;
    set({
      tried: [...tried, `${c.id}:${oid}`],
      solved: o.correct && !done ? [...solved, c.id] : solved,
    });
  };
  return (
    <StepLayout
      eyebrow="Fix the problems"
      title="Five problems"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Dashboard m={m} />
          <div className="flex flex-wrap gap-1">
            {CASES.map((k, j) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={i === j}
                onClick={() => set({ current: j })}
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-1 text-[11px]",
                  i === j
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {solved.includes(k.id) && <Check className="text-good size-3" />}
                Case {j + 1}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="text-subtle text-[10px]">{c.module}</p>
            </div>
            <p className="text-muted text-xs">{c.symptom}</p>
            <Code>{c.evidence}</Code>
            {!done ? (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold">What&apos;s the cause?</p>
                {c.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => pick(o.id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-left text-xs",
                      tried.includes(`${c.id}:${o.id}`)
                        ? "border-bad/40 text-muted line-through"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
                {lastOpt && !lastOpt.correct && (
                  <p className="text-bad text-xs">{lastOpt.feedback}</p>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-good text-xs">✓ {c.options.find((o) => o.correct)!.feedback}</p>
                <Code>{c.fix}</Code>
                {i < CASES.length - 1 && (
                  <button
                    type="button"
                    onClick={() => set({ current: i + 1 })}
                    className="bg-accent text-accent-fg self-start rounded-md px-3 py-1.5 text-xs font-medium"
                  >
                    Next case
                  </button>
                )}
              </motion.div>
            )}
          </div>
          {solved.length === CASES.length && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-good text-sm">
                All five fixed: p99 back to {m.p99} ms, disk at {m.disk}%, no deadlocks, and
                wraparound far away.
              </p>
              <button
                type="button"
                onClick={() => set({ current: 0, solved: [], tried: [] })}
                className="text-muted flex shrink-0 items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Replay
              </button>
            </div>
          )}
          <p className="text-subtle text-[10px]">A fictional system; all numbers illustrative.</p>
        </div>
      }
    >
      <p>
        Work through the five cases. For each, read the evidence, name the cause, and apply the fix.
        Wrong guesses cost nothing; the feedback says why.
      </p>
      <p>
        Notice how they connect: the forgotten transaction behind the bloat also held back the
        freezing that prevents <Term id="xid-wraparound">wraparound</Term>. Fix causes, not
        symptoms, and several alarms go quiet at once.
      </p>
    </StepLayout>
  );
}

/* 3 ─ It happened for real ------------------------------------------------------------------------ */

const ECHOES: { t: string; when: string; d: string }[] = [
  {
    t: "Sentry",
    when: "20 July 2015",
    d: "Down for most of the US working day when PostgreSQL's wraparound protection kicked in. The team wrote: unless you accept data loss, “your only option is to stop accepting writes and vacuum the relations.”",
  },
  {
    t: "Mandrill (Mailchimp)",
    when: "February 2019",
    d: "Autovacuum on one busy shard fell behind; at 05:35 UTC on 4 February its transaction IDs hit the limit and the database went into safety shutdown.",
  },
  {
    t: "GitHub (MySQL)",
    when: "12 March 2021",
    d: "A migration flipped an index's column order to speed up one query. A generated query depended on the old order, fell back to a full table scan, and timeouts cascaded for an hour and ten minutes.",
  },
];

export function Echoes() {
  return (
    <StepLayout
      eyebrow="Real incidents"
      title="It happened for real"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ECHOES.map((e, i) => (
            <motion.div
              key={e.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">
                {e.t}{" "}
                <span className="text-muted font-mono text-[11px] font-normal">· {e.when}</span>
              </p>
              <p className="text-muted text-xs">{e.d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        None of these problems are exotic. Two well-known companies were taken down by transaction
        ID wraparound, and a third by an index change that pushed a query onto a full scan.
      </p>
      <p>
        The common lesson: watch the slow-moving numbers (oldest transaction age, table size,
        estimate versus actual rows) before they become outages, and test schema changes against the
        queries that use them.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which tool? --------------------------------------------------------------------------------- */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-tool"
            prompt="Which PostgreSQL tool answers each question first?"
            categories={[
              { id: "stmts", label: "pg_stat_statements" },
              { id: "explain", label: "EXPLAIN ANALYZE" },
              { id: "activity", label: "pg_stat_activity / pg_locks" },
              { id: "age", label: "age(datfrozenxid)" },
            ]}
            items={[
              {
                id: "top",
                label: "Which queries use the most database time overall?",
                category: "stmts",
                why: "It aggregates time per normalised statement.",
              },
              {
                id: "why",
                label: "Why is this particular query slow?",
                category: "explain",
                why: "The real plan, with estimated and actual rows.",
              },
              {
                id: "estimate",
                label: "Are the planner's row estimates wrong?",
                category: "explain",
                why: "Compare rows= with actual rows= on each node.",
              },
              {
                id: "waiting",
                label: "Who is waiting for whom right now?",
                category: "activity",
                why: "Sessions, their state, and the locks they hold or want.",
              },
              {
                id: "idle",
                label: "Is a session sitting idle in a transaction?",
                category: "activity",
                why: "pg_stat_activity shows each session's state and transaction start.",
              },
              {
                id: "wrap",
                label: "How close is the database to wraparound?",
                category: "age",
                why: "Transaction age since the last freeze, per database.",
              },
            ]}
            explanation="Find where time goes (pg_stat_statements), understand one query (EXPLAIN ANALYZE), see live contention (pg_stat_activity, pg_locks), and watch the slow clocks (transaction age)."
          />
        </div>
      }
    >
      <p>
        Four tools cover most investigations. Know which question each answers and you&apos;ll
        rarely be stuck.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What you can do now ------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Follow a query", "Parse, plan, execute; pages, buffer pool and disk."],
  ["Read a plan", "Indexes, joins and estimates explain most slowness."],
  ["Reason about transactions", "WAL, isolation, locks and MVCC."],
  ["Scale it out", "Replication, consensus and distributed SQL."],
  ["Run it", "Vacuum, wraparound, timeouts and the right tools."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Track complete"
      title="What you can do now"
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
        That&apos;s the whole journey of a query, from the SQL you type to bytes on disk and copies
        on other continents. The next time a database is slow, you know where to look.
      </p>
      <p>
        Related tracks: System Design for the architecture around databases, and Data Lakehouse for
        how analytical storage makes the opposite trade-offs.
      </p>
    </StepLayout>
  );
}
