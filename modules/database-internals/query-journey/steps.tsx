"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { run } from "./model";
import type { QjState } from "./state";

/* 2 ─ Same query, four ways ⭐ -------------------------------------------------------------------- */

export function TryIt() {
  const [s, set] = useSceneState<QjState>();
  const r = run(s.index, s.warm);
  const worst = 900;
  const toggle = (on: boolean, label: string, onClick: () => void) => (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs",
        on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
      )}
    >
      {on ? "✓ " : ""}
      {label}
    </button>
  );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same query, four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="bg-surface-2 rounded-lg px-3 py-2 font-mono text-[11px]">
            SELECT name FROM customers WHERE city = &apos;Pune&apos;;
          </p>
          <div className="flex flex-wrap gap-1.5">
            {toggle(s.index, "Index on city", () => set({ index: !s.index }))}
            {toggle(s.warm, "Pages already in memory", () => set({ warm: !s.warm }))}
          </div>
          <div>
            <p className="text-muted mb-1 font-mono text-[10px]">plan chosen</p>
            <Code>{r.plan}</Code>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Pages touched", r.pages.toLocaleString("en-IN")],
              ["Read from storage", r.fromDisk.toLocaleString("en-IN")],
              ["Time", `${r.ms} ms`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface-2 h-3 overflow-hidden rounded-full">
            <motion.div
              animate={{ width: `${Math.max(1, (r.ms / worst) * 100)}%` }}
              className={cn("h-full rounded-full", r.ms > 100 ? "bg-bad/60" : "bg-good/60")}
            />
          </div>
          <p className="text-sm">{r.why}</p>
          <p className="text-subtle text-[10px]">
            Illustrative: 2 million customers in about 25,000 pages of 8 kB; 1,800 live in Pune.
          </p>
        </div>
      }
    >
      <p>
        The same query, four ways: with or without an <Term id="index">index</Term> on city, and
        with the table&apos;s pages already in memory or not. Try all four combinations.
      </p>
      <p>
        The answer is identical every time. What changes is how much work the database does to find
        it, and that difference, 6 ms against 900 ms, is what the rest of this track explains.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Processes, threads and files ---------------------------------------------------------------- */

const ARCH: [string, string, string][] = [
  [
    "PostgreSQL",
    "A process per connection",
    "“PostgreSQL implements a ‘process per user’ client/server model”: the main server process starts a new backend for each connection. Pages are usually 8 kB.",
  ],
  [
    "MySQL (InnoDB)",
    "A thread per connection, by default",
    "Each client connection gets a dedicated thread, reused from a cache. Pages are 16 KB by default.",
  ],
  [
    "SQLite",
    "No server at all",
    "A library inside your app that reads and writes a single file. Pages are 4096 bytes by default.",
  ],
];

export function WhoIsWho() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Processes, threads and files"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ARCH.map(([t, k, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">
                {t} <span className="text-accent text-xs font-normal">· {k}</span>
              </p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The journey is the same everywhere, but the buildings differ. A database server can give
        each connection its own process or its own thread; SQLite skips the server entirely.
      </p>
      <p>
        These choices have consequences you&apos;ll meet later: why PostgreSQL deployments use a
        connection pooler, why SQLite allows only one writer at a time, and why page size affects
        how much each read brings in. All these defaults can be changed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which databases? ---------------------------------------------------------------------------- */

const RANK: [string, number][] = [
  ["Oracle", 1119.79],
  ["MySQL", 837.96],
  ["Microsoft SQL Server", 694.47],
  ["PostgreSQL", 688.75],
  ["MongoDB", 374.64],
];

export function Popular() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Which databases?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-[10px]">DB-Engines popularity score, October 2026</p>
            {RANK.map(([n, v], i) => (
              <div key={n} className="grid grid-cols-[9rem_1fr_3.5rem] items-center gap-2 text-xs">
                <span>{n}</span>
                <div className="bg-surface-2 h-3 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(v / 1120) * 100}%` }}
                    transition={{ delay: 0.06 * i }}
                    className="bg-accent/70 h-full rounded-full"
                  />
                </div>
                <span className="font-mono">{Math.round(v)}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">55.6%</p>
              <p className="text-muted text-[11px]">
                of Stack Overflow&apos;s 2025 respondents use PostgreSQL, the most of any database
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">1 trillion+</p>
              <p className="text-muted text-[11px]">
                SQLite databases in use, by its developers&apos; estimate
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        DB-Engines measures popularity (searches, jobs, discussions), not how many systems run each
        database. Developers&apos; own answers tell a different story: PostgreSQL leads Stack
        Overflow&apos;s 2025 survey.
      </p>
      <p>
        And the most deployed database is probably in your pocket: SQLite calls itself the most
        widely deployed and used database engine, inside phones, browsers and apps. This track uses
        PostgreSQL for most examples and shows where others differ.
      </p>
    </StepLayout>
  );
}

/* 5 ─ In what order? ------------------------------------------------------------------------------ */

export function StageOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In what order?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="stage-order"
            prompt="Put the stages a query passes through in order."
            items={[
              { id: "conn", label: "The connection's backend receives the SQL text" },
              { id: "parse", label: "The parser checks the syntax and builds a tree" },
              { id: "rewrite", label: "The rewriter expands any views" },
              { id: "plan", label: "The planner estimates costs and picks a plan" },
              {
                id: "exec",
                label: "The executor runs the plan, reading pages through the buffer pool",
              },
            ]}
            explanation="Text, then a tree, then views expanded, then a costed plan, then execution against pages in memory or on disk."
          />
        </div>
      }
    >
      <p>Drag the stages into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["SQL says what, not how", "The database chooses the how."],
  ["Parse, rewrite, plan, execute", "The same journey in every engine."],
  ["The planner estimates costs", "And picks the cheapest route it finds."],
  ["Everything moves in pages", "8 kB, 16 KB or 4 KB at a time."],
  ["Memory first", "The buffer pool avoids slow storage."],
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
      <p>Next: just how slow storage is compared with memory, and why that shapes everything.</p>
    </StepLayout>
  );
}
