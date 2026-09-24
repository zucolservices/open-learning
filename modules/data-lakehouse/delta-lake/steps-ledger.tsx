"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { DeltaState } from "./state";

/* 1b ─ The big idea: a ledger ------------------------------------------- */

const ENTRIES: { date: string; text: string; amount: number; fix?: boolean; wrong?: boolean }[] = [
  { date: "01 Mar", text: "Opening deposit", amount: 10_000 },
  { date: "05 Mar", text: "Salary", amount: 25_000 },
  { date: "07 Mar", text: "Rent", amount: -12_000 },
  { date: "12 Mar", text: "Groceries", amount: -3_500 },
  { date: "15 Mar", text: "Wrong debit (bank error)", amount: -5_000, wrong: true },
  { date: "16 Mar", text: "Reversal of the wrong debit", amount: 5_000, fix: true },
];

const MAPPING: { id: string; passbook: string; git: string; delta: string }[] = [
  {
    id: "line",
    passbook: "Each line: a deposit or withdrawal",
    git: "Each commit: files changed",
    delta: "Each commit in _delta_log: files added or removed",
  },
  {
    id: "balance",
    passbook: "Balance = all lines added up",
    git: "Working tree = all commits applied",
    delta: "The table = all commits replayed",
  },
  {
    id: "past",
    passbook: "Balance on 12 March: add lines up to that date",
    git: "git checkout <old commit>",
    delta: "Time travel: VERSION AS OF n",
  },
  {
    id: "fix",
    passbook: "Mistakes are never erased; a new line reverses them",
    git: "git revert adds a new commit",
    delta: "RESTORE adds a new commit; history stays",
  },
  {
    id: "summary",
    passbook: "Monthly statement: a summary so you needn't re-add every line",
    git: "(no neat equivalent)",
    delta: "Checkpoint: a summary of the whole table state",
  },
];

const fmt = (n: number) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

export function Ledger() {
  const [s, set] = useSceneState<DeltaState>();
  const upTo = s.ledgerLine;
  const balance = ENTRIES.slice(0, upTo).reduce((sum, e) => sum + e.amount, 0);
  const active = upTo < ENTRIES.length ? "past" : "balance";

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A table that works like a bank passbook"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="grid gap-4">
            <div className="border-line bg-surface rounded-2xl border p-4">
              <p className="text-muted text-xs">Brewline&apos;s bank passbook</p>
              <ol className="mt-3 grid gap-1 font-mono text-xs">
                {ENTRIES.map((e, i) => {
                  const counted = i < upTo;
                  return (
                    <li
                      key={e.date}
                      className={cn(
                        "grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-300",
                        counted ? "bg-viz-meta/10" : "opacity-35",
                      )}
                    >
                      <span className="text-subtle">{e.date}</span>
                      <span
                        className={cn(
                          "truncate font-sans",
                          e.wrong && "text-bad",
                          e.fix && "text-good",
                        )}
                      >
                        {e.text}
                      </span>
                      <span className={e.amount > 0 ? "text-good" : "text-bad"}>
                        {e.amount > 0 ? "+" : "−"}
                        {fmt(e.amount)}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-4">
                <input
                  type="range"
                  min={1}
                  max={ENTRIES.length}
                  value={upTo}
                  onChange={(e) => set({ ledgerLine: Number(e.target.value) })}
                  aria-label="Add up the passbook to this line"
                  className="w-full accent-[var(--viz-meta)]"
                />
                <div className="flex items-baseline justify-between">
                  <span className="text-muted text-xs">Balance on {ENTRIES[upTo - 1].date}</span>
                  <motion.span
                    key={balance}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-semibold tabular-nums"
                  >
                    {fmt(balance)}
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="border-line bg-surface overflow-x-auto rounded-2xl border p-4">
              <table className="w-full min-w-[30rem] text-xs">
                <thead className="text-subtle text-left">
                  <tr>
                    <th className="pb-2 font-medium">Passbook</th>
                    <th className="pb-2 font-medium">Git</th>
                    <th className="text-viz-meta pb-2 font-medium">Delta Lake</th>
                  </tr>
                </thead>
                <tbody>
                  {MAPPING.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-line border-t align-top transition-colors",
                        row.id === active && "bg-viz-meta/10",
                      )}
                    >
                      <td className="text-muted py-2 pr-3">{row.passbook}</td>
                      <td className="text-muted py-2 pr-3 font-mono text-[11px]">{row.git}</td>
                      <td className="py-2 font-medium">{row.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="border-viz-meta/30 bg-viz-meta/10 rounded-xl border px-4 py-3 text-sm">
            Keep this picture in mind. Every screen that follows is this passbook, with{" "}
            <strong>files</strong> instead of rupees.
          </p>
        </div>
      }
    >
      <p>Before any files or JSON, here&apos;s the one idea the whole module rests on.</p>
      <p>
        The real record in a passbook is the list of <strong>transactions</strong>, in order. The
        balance is just what they add up to, so you can work out the balance on any past date. A
        mistake is fixed by adding a new line, never by erasing one.
      </p>
      <p>
        Drag the slider to add up the passbook to different dates. Delta Lake keeps a{" "}
        <Term id="transaction-log">transaction log</Term> of a table in exactly the same way. If you
        use Git, you already know this pattern.
      </p>
    </StepLayout>
  );
}
