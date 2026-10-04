"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTRS, FACTS, PRODUCTS, query, sql, type Attr, type Measure } from "./model";
import type { StarState } from "./state";

/* 1 ─ The receipt --------------------------------------------------------------------------------- */

export function Receipt() {
  const lines: [string, string, boolean][] = [
    ["Sat 7 Mar 2026, 10:42", "when", false],
    ["Café Pune, FC Road", "where", false],
    ["Chai × 2", "what", false],
    ["₹240", "how much", true],
    ["Member: Asha R.", "who", false],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The receipt"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-64 rounded-lg border px-4 py-3 font-mono text-xs shadow-sm">
            {lines.map(([t, tag, num], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="flex items-center justify-between py-1"
              >
                <span className={cn(num && "text-accent font-semibold")}>{t}</span>
                <span
                  className={cn(
                    "rounded px-1.5 text-[9px]",
                    num ? "bg-accent-soft text-accent" : "bg-viz-data/15 text-muted",
                  )}
                >
                  {tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every receipt has the same parts. Numbers you can add up: quantity, amount. And context:
        when, where, what, who. Analysts want to add up the numbers, sliced by any of the context.
      </p>
      <p>
        A dimensional model stores exactly that. The numbers are <Term id="fact">facts</Term>, one
        row per event, in a <Term id="fact-table">fact table</Term>. The context lives in{" "}
        <Term id="dimension-table">dimension tables</Term>. Kimball calls dimensions the &ldquo;who,
        what, where, when, why, and how&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Slice the star ⭐ --------------------------------------------------------------------------- */

const DIM_POS: Record<string, [number, number]> = {
  date: [60, 30],
  store: [260, 30],
  product: [60, 150],
  customer: [260, 150],
};

export function SliceStar() {
  const [s, set] = useSceneState<StarState>();
  const by = s.by ?? [];
  const rows = query(s.measure, by, s.cat);
  const max = Math.max(...rows.map((r) => r.v), 1);
  const toggle = (a: Attr) =>
    set({ by: by.includes(a) ? by.filter((x) => x !== a) : [...by, a].slice(-2) });
  const used = new Set([
    ...by.map((a) => a.split(".")[0]),
    ...(s.cat !== "all" ? ["product"] : []),
  ]);
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Slice the star"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
            <svg
              viewBox="0 0 320 180"
              className="w-full"
              role="img"
              aria-label="A star schema: fact_sales linked to date, store, product and customer dimensions"
            >
              {Object.entries(DIM_POS).map(([d, [x, y]]) => (
                <line
                  key={d}
                  x1={160}
                  y1={90}
                  x2={x}
                  y2={y}
                  className={used.has(d) ? "stroke-accent" : "stroke-line-strong"}
                  strokeWidth={used.has(d) ? 1.8 : 1}
                />
              ))}
              <rect x={115} y={70} width={90} height={40} rx={6} className="fill-surface" />
              <rect
                x={115}
                y={70}
                width={90}
                height={40}
                rx={6}
                className="fill-accent/15 stroke-accent"
                strokeWidth={1.4}
              />
              <text
                x={160}
                y={86}
                textAnchor="middle"
                className="fill-fg font-mono text-[9px] font-semibold"
              >
                fact_sales
              </text>
              <text x={160} y={99} textAnchor="middle" className="fill-muted font-mono text-[7px]">
                quantity · revenue
              </text>
              {Object.entries(DIM_POS).map(([d, [x, y]]) => (
                <g key={d}>
                  <rect
                    x={x - 40}
                    y={y - 14}
                    width={80}
                    height={28}
                    rx={5}
                    className="fill-surface"
                  />
                  <rect
                    x={x - 40}
                    y={y - 14}
                    width={80}
                    height={28}
                    rx={5}
                    className={cn(
                      used.has(d)
                        ? "fill-viz-data/20 stroke-viz-data"
                        : "fill-surface stroke-line-strong",
                    )}
                  />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    className="fill-fg font-mono text-[8px]"
                  >
                    dim_{d}
                  </text>
                </g>
              ))}
            </svg>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted w-16">measure</span>
                {(["revenue", "quantity"] as Measure[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={s.measure === m}
                    onClick={() => set({ measure: m })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                      s.measure === m ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    SUM({m})
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted w-16">group by</span>
                {ATTRS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={by.includes(a)}
                    onClick={() => toggle(a)}
                    className={cn(
                      "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                      by.includes(a) ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted w-16">filter</span>
                {["all", ...new Set(PRODUCTS.map((p) => p.category))].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={s.cat === c}
                    onClick={() => set({ cat: c })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px]",
                      s.cat === c ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {c === "all" ? "all products" : c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            <Code>{sql(s.measure, by, s.cat)}</Code>
            <div className="border-line bg-surface flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border px-3 py-2">
              {rows.map((r) => (
                <div
                  key={r.keys.join("|") || "all"}
                  className="grid grid-cols-[1fr_2fr_auto] items-center gap-2 text-[11px]"
                >
                  <span className="truncate">{r.keys.join(" · ") || "total"}</span>
                  <div className="bg-surface-2 h-2 overflow-hidden rounded">
                    <motion.div
                      animate={{ width: `${(r.v / max) * 100}%` }}
                      className="bg-viz-data h-full"
                    />
                  </div>
                  <span className="font-mono">
                    {s.measure === "revenue" ? `₹${r.v.toLocaleString("en-IN")}` : r.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            {FACTS.length} made-up fact rows; dim_customer is drawn but not used here. Group by up
            to two attributes.
          </p>
        </div>
      }
    >
      <p>
        A <Term id="star-schema">star schema</Term>: the fact table in the middle, one line to each
        dimension. Pick a measure, group by up to two attributes and filter by category. The SQL and
        the results update as you go.
      </p>
      <p>
        Every question has the same shape: join the dimensions you need, filter and group on their
        attributes, and sum the facts. That predictability is the point.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why a star? --------------------------------------------------------------------------------- */

const ER_TABLES = [
  "orders",
  "order_lines",
  "customers",
  "addresses",
  "cities",
  "regions",
  "products",
  "categories",
  "suppliers",
  "stores",
  "staff",
  "payments",
  "promotions",
  "calendar",
];

export function WhyStars() {
  const [s, set] = useSceneState<StarState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why a star?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              [true, "the source system's model"],
              [false, "the star"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.er === v}
                onClick={() => set({ er: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.er === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <motion.div
            key={String(s.er)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-40 flex-wrap content-center justify-center gap-1.5"
          >
            {s.er
              ? ER_TABLES.map((t, i) => (
                  <span
                    key={t}
                    className="border-line bg-surface rounded-md border px-2 py-1 font-mono text-[10px]"
                    style={{ transform: `rotate(${((i * 37) % 9) - 4}deg)` }}
                  >
                    {t}
                  </span>
                ))
              : ["dim_date", "dim_store", "fact_sales", "dim_product", "dim_customer"].map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "rounded-md border px-3 py-2 font-mono text-[11px]",
                      t.startsWith("fact")
                        ? "border-accent bg-accent-soft"
                        : "border-viz-data bg-viz-data/10",
                    )}
                  >
                    {t}
                  </span>
                ))}
          </motion.div>
          <p className="text-muted text-center text-xs">
            {s.er
              ? "Fourteen tables, many paths between them. Which joins give the right answer?"
              : "Five tables, one way in: every dimension joins straight to the facts."}
          </p>
        </div>
      }
    >
      <p>
        Kimball&apos;s argument, in his 1997 &ldquo;Dimensional Modeling Manifesto&rdquo;: business
        users &ldquo;cannot understand or remember an ER model&rdquo;. A star is a predictable
        shape, and every dimension is an equal entry point into the facts.
      </p>
      <p>
        Analytical queries rarely fetch one row; they add up thousands or millions. Dimensions are
        denormalised on purpose (category sits right on the product row), so there are few joins.
        Whether that&apos;s fast in practice also depends on the engine.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who came up with it? ------------------------------------------------------------------------ */

export function History() {
  const items: [string, string][] = [
    [
      "Early 1980s",
      "Market-research firms such as A.C. Nielsen and IRI already organised data as facts and dimensions, Kimball notes.",
    ],
    ["Early relational days", "The “star join” term dates from the earliest relational databases."],
    ["1996", "Ralph Kimball's The Data Warehouse Toolkit gathers and names the techniques."],
    ["2013", "Third edition, with Margy Ross: The Definitive Guide to Dimensional Modeling."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who came up with it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([y, t], i) => (
            <motion.div
              key={y}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{y}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Kimball is the name most tied to star schemas, but his own site says he didn&apos;t invent
        facts and dimensions. What he did was build the vocabulary and the toolkit: conformed
        dimensions, slowly changing dimensions, snapshots and more, all coming up in this chapter.
      </p>
      <p>
        A star schema is the relational form of a dimensional model; an OLAP cube is the
        multidimensional form.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Fact or dimension? -------------------------------------------------------------------------- */

export function FactOrDim() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fact or dimension?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fact-or-dim"
            prompt="Where does each column belong in a retail sales star?"
            categories={[
              { id: "fact", label: "Fact" },
              { id: "dim", label: "Dimension" },
              { id: "no", label: "Doesn't belong" },
            ]}
            items={[
              {
                id: "qty",
                label: "Quantity sold",
                category: "fact",
                why: "A number measured at each sale.",
              },
              {
                id: "amount",
                label: "Sale amount",
                category: "fact",
                why: "Adds up across sales.",
              },
              {
                id: "cat",
                label: "Product category",
                category: "dim",
                why: "Context you group by.",
              },
              { id: "city", label: "Store city", category: "dim", why: "Where the sale happened." },
              {
                id: "salary",
                label: "Store manager's salary",
                category: "no",
                why: "Not measured by a sale; Kimball's own example of what to leave out.",
              },
              {
                id: "weekday",
                label: "Day of the week",
                category: "dim",
                why: "When: an attribute of the date dimension.",
              },
            ]}
            explanation="Facts are numbers measured by the event; dimensions describe its context. Anything not measured by the event belongs in another star."
          />
        </div>
      }
    >
      <p>Sort the columns.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Facts", "Numbers from an event, one row per event."],
  ["Dimensions", "Who, what, where, when: wide, flat, descriptive."],
  ["Star schema", "Facts in the middle, dimensions around, linked by keys."],
  ["One query shape", "Join, filter and group by dimensions; sum facts."],
  ["Kimball named it", "He didn't invent it; he built the toolkit."],
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
      <p>Next: the most important decision in any star, what one row of the fact table means.</p>
    </StepLayout>
  );
}
