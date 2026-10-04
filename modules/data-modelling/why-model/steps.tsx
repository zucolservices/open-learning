"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CUSTOMERS, MESSY, ORDERS, PRODUCTS, QUESTIONS, type Q } from "./model";
import type { WhyState } from "./state";

/* 2 ─ Same question, two shapes ⭐ ---------------------------------------------------------------- */

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="border-line overflow-x-auto rounded-lg border">
      <table className="w-full font-mono text-[10px]">
        <thead className="bg-surface-2">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-2 py-1 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-line border-t">
              {r.map((c, j) => (
                <td key={j} className="px-2 py-0.5 whitespace-nowrap">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TwoShapes() {
  const [s, set] = useSceneState<WhyState>();
  const q = QUESTIONS[s.q];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same question, two shapes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(QUESTIONS) as Q[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.q === k}
                onClick={() => set({ q: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.q === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {QUESTIONS[k].ask}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {[
              [false, "the spreadsheet"],
              [true, "the modelled tables"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.modelled === v}
                onClick={() => set({ modelled: v as boolean })}
                className={cn(
                  "rounded-md border px-3 py-1 text-xs",
                  s.modelled === v ? "border-accent bg-accent-soft font-semibold" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          {s.modelled ? (
            <motion.div
              key="m"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-2 lg:grid-cols-[1fr_1fr_1.4fr]"
            >
              <div>
                <p className="text-muted mb-1 text-[10px]">customers</p>
                <Table head={["id", "name"]} rows={CUSTOMERS} />
              </div>
              <div>
                <p className="text-muted mb-1 text-[10px]">products</p>
                <Table head={["id", "name", "price"]} rows={PRODUCTS} />
              </div>
              <div>
                <p className="text-muted mb-1 text-[10px]">orders</p>
                <Table head={["id", "order_date", "customer_id", "product_id"]} rows={ORDERS} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Table
                head={["Date", "Customer", "Item", "Amount"]}
                rows={MESSY.map((r) => [r.date, r.customer, r.item, r.amount])}
              />
            </motion.div>
          )}
          <motion.div
            key={`${s.q}-${s.modelled}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-xs",
              s.modelled ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            <p className="text-sm font-semibold">
              {q.ask} <span className="font-mono">{s.modelled ? q.modelled : q.messy}</span>
            </p>
            {s.modelled ? (
              <Code className="mt-2">{q.sql}</Code>
            ) : (
              <ul className="text-muted mt-1 list-disc pl-4">
                {q.messyWhy.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
          </motion.div>
          <p className="text-subtle text-[10px]">
            A made-up café; the spreadsheet answers are what a quick SUM or COUNT DISTINCT would
            give.
          </p>
        </div>
      }
    >
      <p>
        The same eight sales, stored two ways. Ask each question of the spreadsheet, then of the
        modelled tables.
      </p>
      <p>
        The spreadsheet isn&apos;t wrong because spreadsheets are bad. It&apos;s wrong because
        nobody decided what a customer is, what a date looks like, or that each sale is recorded
        once. The model makes those decisions once, so every question benefits.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What does this field mean? ------------------------------------------------------------------ */

const DEFS: [string, string][] = [
  ["Sales", "A customer is anyone who has ever asked for a quote."],
  ["Finance", "A customer is anyone who has paid an invoice."],
  ["Support", "A customer is anyone with an active contract."],
];

export function Meaning() {
  const [s, set] = useSceneState<WhyState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="What does this field mean?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Mars Climate Orbiter, 1999</p>
            <p className="text-muted mt-1">
              One team&apos;s software produced thruster data in pound-force seconds; the navigation
              software expected newton seconds. NASA&apos;s board named the root cause as &ldquo;the
              failure to use metric units in the coding of a ground software file&rdquo;. The
              spacecraft was lost.
            </p>
          </div>
          <p className="text-muted text-xs">Closer to home: three departments, one word.</p>
          <div className="flex flex-wrap gap-1.5">
            {DEFS.map(([d], i) => (
              <button
                key={d}
                type="button"
                aria-pressed={s.def === i}
                onClick={() => set({ def: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.def === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {d}
              </button>
            ))}
          </div>
          <motion.p
            key={s.def}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-sm"
          >
            {DEFS[s.def][1]}
          </motion.p>
        </div>
      }
    >
      <p>
        A column called <code>impulse</code> or <code>customer</code> isn&apos;t enough. A model
        also says what each field means: its unit, its rules, which records count.
      </p>
      <p>
        Ask three departments how many customers you have and you can get three honest, different
        numbers. Writing the definition into the model is how a company ends up with one.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where data lives matters too ---------------------------------------------------------------- */

export function Storage() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where data lives matters too"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ["15,841", "positive cases left out of England's daily figures"],
              ["25 Sep–2 Oct", "2020"],
              ["~65,000", "rows in the old XLS format, per the BBC"],
            ].map(([n, l]) => (
              <div key={n} className="border-line bg-surface rounded-lg border px-2 py-3">
                <p className="text-accent font-mono text-base font-semibold">{n}</p>
                <p className="text-muted text-[10px]">{l}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted">
              Public Health England said some files &ldquo;exceeded the maximum file size&rdquo; its
              system could load. The BBC reported the files used Excel&apos;s old XLS format, which
              holds about 65,000 rows; with several rows per test, each file fitted only about 1,400
              cases. The people tested still got their results; the cases reached contact tracers
              late.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Not every data disaster is a design flaw. In October 2020, thousands of COVID-19 cases were
        left out of England&apos;s daily figures because of how results were moved between systems.
      </p>
      <p>
        It&apos;s a reminder that modelling sits inside a bigger picture: the format, the tools and
        their limits are part of whether the numbers come out right.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Running the shop or understanding it? ------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Running the shop or understanding it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="op-or-analytic"
            prompt="Is each a question for running the business today, or for understanding it over time?"
            categories={[
              { id: "op", label: "Operational" },
              { id: "an", label: "Analytical" },
            ]}
            items={[
              {
                id: "order",
                label: "Has order 4518 been paid?",
                category: "op",
                why: "One record, right now.",
              },
              {
                id: "trend",
                label: "How have weekday sales changed over two years?",
                category: "an",
                why: "Many records over time.",
              },
              {
                id: "stock",
                label: "Is there milk left for the next order?",
                category: "op",
                why: "Current state, to act on now.",
              },
              {
                id: "regulars",
                label: "Which customers came back at least five times last quarter?",
                category: "an",
                why: "A summary across history.",
              },
              {
                id: "address",
                label: "Update Asha's phone number",
                category: "op",
                why: "Changing one record.",
              },
            ]}
            explanation="Operational systems record and change individual things quickly; analytical models summarise lots of history. They are usually modelled differently (module 5)."
          />
        </div>
      }
    >
      <p>
        Models are shaped by the questions they serve. Two broad kinds:{" "}
        <Term id="operational-data">operational</Term> and{" "}
        <Term id="analytical-data">analytical</Term>. Sort these.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A model is an agreement", "What the things are, what we record, how they connect."],
  ["Each fact once", "Customers, dates and prices stored one way."],
  ["Meaning is part of it", "Units, rules, which records count."],
  ["Questions drive design", "Running the business vs understanding it."],
  ["It keeps changing", "Models are refined as the business changes."],
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
      <p>Next: the three levels of a model, from a sketch on a whiteboard to real tables.</p>
    </StepLayout>
  );
}
