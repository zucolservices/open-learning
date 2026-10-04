"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  ATTENDED,
  BALANCES,
  DAYS,
  MARGINS,
  STUDENTS,
  accumulating,
  snapshots,
  transactions,
} from "./model";
import type { FTState } from "./state";

/* 1 ─ Three ways to keep score -------------------------------------------------------------------- */

export function BankStatement() {
  const rows: [string, string][] = [
    ["The statement lines", "Every deposit and payment, as it happens."],
    ["The month-end balance", "One number per month, whether or not anything happened."],
    [
      "The loan tracker",
      "One line per loan: applied, approved, paid out, each date filled in as it comes.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Three ways to keep score"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Your bank keeps three kinds of record. A line for every transaction. A balance at the end of
        each month. And for a loan application, one line that gets updated as each step happens.
      </p>
      <p>
        Kimball names the same three kinds of fact table:{" "}
        <Term id="transaction-fact">transaction</Term>,{" "}
        <Term id="periodic-snapshot">periodic snapshot</Term> and{" "}
        <Term id="accumulating-snapshot">accumulating snapshot</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One process, three fact tables ⭐ ----------------------------------------------------------- */

function Cell({ v, hot }: { v: string | number | null; hot?: boolean }) {
  return (
    <td className={cn("px-2 py-0.5", v === null && "text-subtle", hot && "bg-accent-soft")}>
      {v === null ? "—" : v}
    </td>
  );
}

export function ThreeTables() {
  const [s, set] = useSceneState<FTState>();
  const tx = transactions(s.day);
  const snap = snapshots(s.day);
  const acc = accumulating(s.day);
  const views: [FTState["view"], string, number][] = [
    ["tx", "Transaction", tx.length],
    ["snap", "Periodic snapshot", snap.length],
    ["acc", "Accumulating snapshot", acc.length],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One process, three fact tables"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted">day</span>
            <input
              type="range"
              min={1}
              max={DAYS}
              value={s.day}
              onChange={(e) => set({ day: Number(e.target.value) })}
              className="flex-1 accent-accent"
              aria-label="Day"
            />
            <span className="w-10 font-mono font-semibold">{s.day}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {views.map(([k, l, n]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.view === k}
                onClick={() => set({ view: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.view === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l} <span className="text-muted font-mono">· {n} rows</span>
              </button>
            ))}
          </div>
          <div className="border-line min-h-44 overflow-x-auto rounded-lg border">
            <table className="w-full font-mono text-[11px]">
              {s.view === "tx" && (
                <>
                  <thead className="bg-surface-2">
                    <tr>
                      {["day", "order", "event", "amount"].map((h) => (
                        <th key={h} className="px-2 py-1 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tx.map((r) => (
                      <motion.tr
                        key={`${r.day}${r.order}${r.event}`}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn("border-line border-t", r.day === s.day && "bg-accent-soft")}
                      >
                        <Cell v={r.day} />
                        <Cell v={r.order} />
                        <Cell v={r.event} />
                        <Cell v={r.amount || ""} />
                      </motion.tr>
                    ))}
                  </tbody>
                </>
              )}
              {s.view === "snap" && (
                <>
                  <thead className="bg-surface-2">
                    <tr>
                      {["day", "open orders", "open value (₹)"].map((h) => (
                        <th key={h} className="px-2 py-1 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {snap.map((r) => (
                      <motion.tr
                        key={r.day}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn("border-line border-t", r.day === s.day && "bg-accent-soft")}
                      >
                        <Cell v={r.day} />
                        <Cell v={r.open} />
                        <Cell v={r.value} />
                      </motion.tr>
                    ))}
                  </tbody>
                </>
              )}
              {s.view === "acc" && (
                <>
                  <thead className="bg-surface-2">
                    <tr>
                      {["order", "placed", "packed", "shipped", "delivered", "days to ship"].map(
                        (h) => (
                          <th key={h} className="px-2 py-1 text-left font-semibold">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {acc.map((r) => (
                      <motion.tr
                        key={r.order}
                        layout
                        className={cn(
                          "border-line border-t",
                          r.changedToday && "outline-accent outline outline-1",
                        )}
                      >
                        <Cell v={r.order} />
                        <Cell v={r.placed} />
                        <Cell v={r.packed} />
                        <Cell v={r.shipped} />
                        <Cell v={r.delivered} />
                        <Cell v={r.lag} />
                      </motion.tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
          <p className="text-muted text-xs">
            {s.view === "tx" &&
              "A row for each event, only when something happens. Rows are added, never changed."}
            {s.view === "snap" &&
              "A row for every day, even quiet ones. The grain is the period, not the event."}
            {s.view === "acc" &&
              "A row per order, revisited and updated as each milestone happens (outlined: changed today)."}
          </p>
          <p className="text-subtle text-[10px]">Three made-up orders over a week.</p>
        </div>
      }
    >
      <p>
        Three orders go through placed, packed, shipped and delivered over a week. Drag the day and
        switch between the three ways of storing the same process.
      </p>
      <p>
        Transaction tables are the most detailed. Periodic snapshots make &ldquo;how many orders
        were open on day 4?&rdquo; trivial. Accumulating snapshots make &ldquo;how long does
        shipping take?&rdquo; trivial, and are the only kind whose rows are updated.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What can you add up? ------------------------------------------------------------------------ */

export function Additivity() {
  const [s, set] = useSceneState<FTState>();
  const balSum = BALANCES.reduce((a, [, v]) => a + v, 0);
  const avgOfPct = (MARGINS.reduce((a, m) => a + m.profit / m.sales, 0) / MARGINS.length) * 100;
  const truePct =
    (MARGINS.reduce((a, m) => a + m.profit, 0) / MARGINS.reduce((a, m) => a + m.sales, 0)) * 100;
  const tabs: [FTState["add"], string][] = [
    ["sales", "Sales amount"],
    ["balance", "Account balance"],
    ["margin", "Profit margin %"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What can you add up?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.add === k}
                onClick={() => set({ add: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.add === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <motion.div
            key={s.add}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
          >
            {s.add === "sales" && (
              <>
                <p className="text-good text-sm font-semibold">Additive</p>
                <p className="text-muted mt-1">
                  Sum across products, stores and days: every sum means something.
                </p>
              </>
            )}
            {s.add === "balance" && (
              <>
                <p className="text-sm font-semibold text-accent">Semi-additive</p>
                <p className="mt-1 font-mono">
                  {BALANCES.map(([m, v]) => `${m} ₹${v.toLocaleString("en-IN")}`).join(" · ")}
                </p>
                <p className="mt-1">
                  Sum over months:{" "}
                  <span className="text-bad font-mono">₹{balSum.toLocaleString("en-IN")}</span>{" "}
                  (nobody had that). Average over time:{" "}
                  <span className="text-good font-mono">
                    ₹{(balSum / BALANCES.length).toLocaleString("en-IN")}
                  </span>
                  . Summing across accounts on one day is fine.
                </p>
              </>
            )}
            {s.add === "margin" && (
              <>
                <p className="text-bad text-sm font-semibold">Non-additive</p>
                <p className="mt-1 font-mono">
                  {MARGINS.map((m) => `${m.store} ${(m.profit / m.sales) * 100}%`).join(" · ")}
                </p>
                <p className="mt-1">
                  Average of the percentages:{" "}
                  <span className="text-bad font-mono">{avgOfPct}%</span>. Sum profit and sales,
                  then divide: <span className="text-good font-mono">{truePct}%</span>. Store the
                  parts, not the ratio.
                </p>
              </>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Facts differ in what you can sum. <Term id="additive-fact">Additive</Term> facts, like
        sales, add up across every dimension. <Term id="semi-additive-fact">Semi-additive</Term>{" "}
        ones, like balances, add across some dimensions but not time. Ratios are non-additive.
      </p>
      <p>Kimball&apos;s advice for ratios: store the additive parts and divide at the end.</p>
    </StepLayout>
  );
}

/* 4 ─ Facts with no numbers ----------------------------------------------------------------------- */

export function Factless() {
  const [s, set] = useSceneState<FTState>();
  const went = ATTENDED[s.cls] ?? [];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Facts with no numbers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {Object.keys(ATTENDED).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={s.cls === d}
                onClick={() => set({ cls: d })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.cls === d ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {d}&apos;s class
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              ["Coverage", STUDENTS, "enrolled"],
              ["Activity", went, "attended"],
              ["Coverage − activity", STUDENTS.filter((x) => !went.includes(x)), "absent"],
            ].map(([t, list, l], i) => (
              <div
                key={t as string}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  i === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">{t as string}</p>
                <p className="text-muted text-[10px]">{l as string}</p>
                {(list as string[]).map((n) => (
                  <p key={n} className="font-mono">
                    {n}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Some events have nothing to measure: a student attended a class. A{" "}
        <Term id="factless-fact">factless fact table</Term> still records the row (date, student,
        class, teacher) and you count rows.
      </p>
      <p>
        It can also show what didn&apos;t happen. Keep a coverage table of everything that could
        happen, subtract the activity, and what&apos;s left is who was absent.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of fact table? ------------------------------------------------------------------- */

export function WhichType() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of fact table?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-fact-table"
            prompt="Which kind of fact table fits each?"
            categories={[
              { id: "tx", label: "Transaction" },
              { id: "snap", label: "Periodic" },
              { id: "acc", label: "Accumulating" },
              { id: "less", label: "Factless" },
            ]}
            items={[
              {
                id: "scan",
                label: "Every item scanned at a till",
                category: "tx",
                why: "One row per event.",
              },
              {
                id: "bal",
                label: "Each account's balance at every month end",
                category: "snap",
                why: "One row per account per period.",
              },
              {
                id: "mort",
                label: "Each mortgage application, with dates for applied, approved and funded",
                category: "acc",
                why: "A pipeline with milestones.",
              },
              {
                id: "stock",
                label: "Daily stock level of each product in each warehouse",
                category: "snap",
                why: "A level measured every day.",
              },
              {
                id: "claim",
                label: "Each insurance claim from filing to settlement",
                category: "acc",
                why: "One row updated as it progresses.",
              },
              {
                id: "attend",
                label: "Which students attended which class",
                category: "less",
                why: "An event with nothing to measure.",
              },
            ]}
            explanation="Events: transaction. Levels at regular intervals: periodic snapshot. Pipelines with milestones: accumulating snapshot. Events with no numbers: factless."
          />
        </div>
      }
    >
      <p>Sort the cases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Transaction", "One row per event; sparse; never updated."],
  ["Periodic snapshot", "One row per thing per period; dense."],
  ["Accumulating snapshot", "One row per pipeline instance; updated at each milestone."],
  ["Additivity", "Additive, semi-additive (not over time), non-additive."],
  ["Factless", "Rows with only keys; coverage − activity = what didn't happen."],
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
        Next: sharing dimensions across many fact tables, with conformed dimensions and the bus
        matrix.
      </p>
    </StepLayout>
  );
}
