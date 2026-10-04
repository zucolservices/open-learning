"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NESTED, WIDTHS, fmtGB, measure, type Shape, type Store } from "./model";
import type { WideState } from "./state";

/* 1 ─ Everything on one page ---------------------------------------------------------------------- */

export function Catalogue() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Everything on one page"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The index and the chapters",
              "Look up a word in the index, turn to the page, then to the glossary. Three places, but each fact once.",
            ],
            [
              "The cheat sheet",
              "Everything you need for the exam on one page. Quick to use; rewrite it whenever anything changes.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-4"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A textbook keeps each fact in one place and sends you between index, chapter and glossary. A
        cheat sheet copies everything onto one page: fast to read, a pain to keep up to date.
      </p>
      <p>
        <Term id="one-big-table">One big table</Term> (OBT) is the cheat sheet: the fact table with
        every dimension attribute copied onto each row, so no joins are needed. On modern{" "}
        <Term id="columnar-storage">columnar</Term> warehouses that old trade-off looks different.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Star or one big table? ⭐ ------------------------------------------------------------------- */

export function WideSim() {
  const [s, set] = useSceneState<WideState>();
  const width = WIDTHS[s.width];
  const m = measure(s.shape, s.store, width);
  const ref = Math.max(measure("obt", "row", width).storage, measure("star", "row", width).storage);
  const bar = (v: number) => `${Math.max(1, (v / ref) * 100)}%`;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Star or one big table?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-24">model</span>
              {(
                [
                  ["star", "star schema"],
                  ["obt", "one big table"],
                ] as [Shape, string][]
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={s.shape === k}
                  onClick={() => set({ shape: k })}
                  className={cn(
                    "rounded-md border px-2 py-0.5",
                    s.shape === k ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-24">storage</span>
              {(
                [
                  ["row", "row-oriented"],
                  ["column", "columnar"],
                ] as [Store, string][]
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={s.store === k}
                  onClick={() => set({ store: k })}
                  className={cn(
                    "rounded-md border px-2 py-0.5",
                    s.store === k ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-24">total columns</span>
              {WIDTHS.map((w, i) => (
                <button
                  key={w}
                  type="button"
                  aria-pressed={s.width === i}
                  onClick={() => set({ width: i })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono",
                    s.width === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          <Code>
            {s.shape === "star"
              ? `SELECT d.month, p.category, SUM(f.amount)
FROM fact_sales f
JOIN dim_date d USING (date_key)
JOIN dim_product p USING (product_key)
GROUP BY 1, 2`
              : `SELECT month, category, SUM(amount)
FROM sales_obt
GROUP BY 1, 2`}
          </Code>
          <div className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-3 py-3 text-xs">
            {[
              ["data read by this query", m.read],
              ["storage", m.storage],
            ].map(([l, v]) => (
              <div
                key={l as string}
                className="grid grid-cols-[9rem_1fr_4.5rem] items-center gap-2"
              >
                <span className="text-muted">{l as string}</span>
                <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: bar(v as number) }}
                    className="bg-viz-data h-full"
                  />
                </div>
                <span className="text-right font-mono">{fmtGB(v as number)}</span>
              </div>
            ))}
            <p className="mt-1">
              joins: <span className="font-mono font-semibold">{m.joins}</span> · renaming a product
              category updates <span className="font-mono font-semibold">{m.renameRows}</span>
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            100 million sales; the query uses 3 columns. Sizes and compression illustrative.
          </p>
        </div>
      }
    >
      <p>
        A row store reads whole rows, so a wide table drags every column off disk. A column store
        keeps each column together and reads only the ones a query needs, as the 2005 C-Store paper
        argued, and repeated values compress well. Try a 200-column OBT on each.
      </p>
      <p>
        On columnar warehouses, OBT avoids joins for little extra reading. A 2022 Fivetran benchmark
        on TPC-DS data found it about 25–50% faster than a star on Redshift, Snowflake and BigQuery,
        at the cost of more storage.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Nested and repeated fields ------------------------------------------------------------------ */

export function Nested() {
  const [s, set] = useSceneState<WideState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Nested and repeated fields"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              [true, "nested: one row per order"],
              [false, "flattened: one row per line"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.nested === v}
                onClick={() => set({ nested: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.nested === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          {s.nested ? (
            <Code>{NESTED}</Code>
          ) : (
            <div className="border-line overflow-x-auto rounded-lg border font-mono text-[11px]">
              {[
                ["order_id", "date", "customer_city", "product", "qty", "amount"],
                ["O-1", "2026-03-02", "Pune", "Chai", "2", "240"],
                ["O-1", "2026-03-02", "Pune", "Samosa", "1", "60"],
                ["O-2", "2026-03-05", "Kochi", "Coffee", "1", "150"],
              ].map((r, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-6 gap-2 px-3 py-1",
                    i === 0 ? "bg-surface-2 font-semibold" : "border-line border-t",
                  )}
                >
                  {r.map((c, j) => (
                    <span key={j} className={cn(i > 0 && j < 3 && r[0] === "O-1" && "text-bad")}>
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
          <p className="text-muted text-xs">
            {s.nested
              ? "The order's details appear once; its lines live inside it as an array."
              : "Order details repeat on every line (in red): easy to double-count if you sum an order-level number."}
          </p>
        </div>
      }
    >
      <p>
        Google&apos;s BigQuery docs recommend a middle way: denormalise with{" "}
        <Term id="nested-fields">nested and repeated fields</Term> (STRUCT and ARRAY) where data is
        naturally parent and child, like an order and its lines. Fully flattening can add shuffling.
      </p>
      <p>
        The same page is honest about limits: a star schema is already optimised for analytics, so
        denormalising further &ldquo;might not&rdquo; make a big difference.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What it costs ------------------------------------------------------------------------------- */

export function TradeOffs() {
  const cards: [string, string][] = [
    ["Updates are expensive", "A category rename touches millions of rows instead of one."],
    [
      "History gets baked in",
      "Which version of the customer's city did you copy onto each row? Decide deliberately (module 11).",
    ],
    [
      "Grain mistakes hide",
      "Mixing order-level and line-level numbers in one table double-counts quietly.",
    ],
    [
      "Build it from a model",
      "OBTs usually sit on top of a star or dbt marts, rebuilt automatically, not instead of them.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What it costs"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {cards.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Wide tables are fast to query and easy to understand: one table, every column. The cost
        moves to whoever builds and refreshes them.
      </p>
      <p>
        The benchmark&apos;s own author noted the storage cost of duplicating every dimension
        &ldquo;could be too high&rdquo; at scale. Treat one test as a hint, and measure on your own
        data.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Faster dashboards --------------------------------------------------------------------------- */

export function DashboardChoice() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Faster dashboards"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="faster-dashboards"
            prompt="A team's sales star schema on a columnar warehouse works well, but one busy dashboard runs the same five-join query hundreds of times a day. What's a sensible next step?"
            options={[
              {
                id: "replace",
                label: "Replace the star with one big table and stop maintaining dimensions",
                feedback: "You'd lose conformed dimensions and make every change expensive.",
              },
              {
                id: "build",
                label:
                  "Build a wide table from the star for that dashboard, refreshed automatically",
                correct: true,
                feedback:
                  "The star stays the source of truth; the wide table is a fast, rebuildable copy for a known workload.",
              },
              {
                id: "normalise",
                label: "Normalise the dimensions further",
                feedback: "More joins, not fewer.",
              },
              {
                id: "row",
                label: "Move the data to a row-oriented database",
                feedback:
                  "Wide tables are slow on row stores; columnar storage is what makes them cheap.",
              },
            ]}
            explanation="OBT is a good serving layer for known questions, built on top of a model rather than replacing it."
          />
        </div>
      }
    >
      <p>Choose the move.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One big table", "Facts and every attribute on each row; no joins."],
  ["Columnar changes the maths", "Only the columns used are read; repeats compress."],
  ["Often faster", "One 2022 benchmark: 25–50%; measure your own."],
  ["Nested fields", "Parent and child together without full flattening."],
  ["Build it from a model", "A serving layer, not a replacement."],
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
      <p>Next: defining metrics once, in a semantic layer, so every tool gets the same numbers.</p>
    </StepLayout>
  );
}
