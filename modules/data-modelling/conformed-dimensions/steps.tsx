"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  CATS_SALES,
  CATS_STOCK_BAD,
  DIMS,
  PROCESSES,
  SALES_BY_MONTH,
  STOCK_BY_MONTH,
  SUGGESTED,
  WHY,
} from "./model";
import type { BusState } from "./state";

/* 1 ─ One calendar for the whole school ----------------------------------------------------------- */

export function SharedCalendar() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One calendar for the whole school"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Maths department", "Term 1 ends 20 Dec"],
            ["Sports department", "Autumn term ends 18 Dec"],
            ["Office", "Semester A: Sept–Jan"],
          ].map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-bad/40 bg-bad/5 flex justify-between rounded-lg border px-3 py-2 text-xs"
            >
              <span>{d}</span>
              <span className="font-mono">{t}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="border-good bg-good/10 rounded-lg border px-3 py-2 text-center text-xs"
          >
            One shared calendar: everyone&apos;s &ldquo;Term 1&rdquo; means the same dates.
          </motion.div>
        </div>
      }
    >
      <p>
        If every department in a school kept its own calendar with its own term names, nobody could
        compare attendance with exam results by term. A shared calendar fixes it: same names, same
        dates.
      </p>
      <p>
        A warehouse has the same need. When two fact tables use a{" "}
        <Term id="conformed-dimension">conformed dimension</Term>, with the same column names and
        the same values, their results line up on one report. Kimball calls this &ldquo;the essence
        of integration&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fill in the bus matrix ⭐ ------------------------------------------------------------------- */

export function BusMatrix() {
  const [s, set] = useSceneState<BusState>();
  const cells = new Set(s.cells ?? []);
  const toggle = (k: string) =>
    set({ cells: cells.has(k) ? [...cells].filter((x) => x !== k) : [...cells, k] });
  const [a, b] = s.pair;
  const shared = DIMS.filter((_, j) => SUGGESTED[a][j] && SUGGESTED[b][j]);
  const diffs = PROCESSES.flatMap((p, i) =>
    DIMS.map((d, j) => ({
      k: `${i}-${j}`,
      p,
      d,
      want: SUGGESTED[i][j],
      have: cells.has(`${i}-${j}`),
    })),
  ).filter((x) => x.want !== x.have);
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Fill in the bus matrix"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th />
                  {DIMS.map((d) => (
                    <th key={d} className="text-muted px-1 pb-1 font-normal">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROCESSES.map((p, i) => (
                  <tr key={p}>
                    <td className="pr-2 font-semibold whitespace-nowrap">{p}</td>
                    {DIMS.map((d, j) => {
                      const k = `${i}-${j}`;
                      const on = cells.has(k);
                      const wrong = s.compare && on !== SUGGESTED[i][j];
                      return (
                        <td key={d} className="p-0.5">
                          <button
                            type="button"
                            aria-label={`${p} × ${d}`}
                            aria-pressed={on}
                            onClick={() => toggle(k)}
                            className={cn(
                              "h-7 w-full min-w-8 rounded border",
                              on
                                ? "border-accent bg-accent/40"
                                : "border-line bg-surface hover:bg-surface-2",
                              wrong && "ring-bad ring-2",
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              aria-pressed={s.compare}
              onClick={() => set({ compare: !s.compare })}
              className={cn(
                "rounded-md border px-3 py-1",
                s.compare ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              {s.compare ? "✓ " : ""}compare with a suggested matrix
            </button>
            {s.compare && (
              <span className={diffs.length ? "text-bad" : "text-good"}>
                {diffs.length ? `${diffs.length} cells differ (ringed)` : "Matches the suggestion."}
              </span>
            )}
          </div>
          {s.compare && diffs.length > 0 && (
            <div className="text-muted flex max-h-20 flex-col gap-0.5 overflow-y-auto text-[11px]">
              {diffs.slice(0, 4).map((x) => (
                <p key={x.k}>
                  {x.p} × {x.d}:{" "}
                  {x.want ? "usually linked." : (WHY[`${x.p}|${x.d}`] ?? "usually not linked.")}
                </p>
              ))}
            </div>
          )}
          <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted">Combine</span>
              {PROCESSES.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={a === i}
                  onClick={() => set({ pair: [i, b === i ? a : b] })}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    a === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {p}
                </button>
              ))}
              <span className="text-muted">with</span>
              {PROCESSES.map((p, i) => (
                <button
                  key={p + "b"}
                  type="button"
                  disabled={i === a}
                  aria-pressed={b === i}
                  onClick={() => set({ pair: [a, i] })}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] disabled:opacity-30",
                    b === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-1">
              Shared, conformed dimensions:{" "}
              <span className="font-semibold">{shared.join(", ")}</span>. A combined report can
              group by any attribute of these.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The <Term id="bus-matrix">bus matrix</Term> is Kimball&apos;s planning tool: business
        processes down the side, dimensions across the top, a mark where they connect. Mark the
        cells you think apply, then compare.
      </p>
      <p>
        Read a row to check a process&apos;s dimensions; read a column to see where a dimension must
        be conformed. Teams build one row at a time, and the shared columns are what make each new
        row fit with the last.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Drilling across ----------------------------------------------------------------------------- */

export function DrillAcross() {
  const [s, set] = useSceneState<BusState>();
  const months = ["Jan", "Feb"];
  const salesBy = (m: string) =>
    SALES_BY_MONTH.filter(([x]) => x === m).reduce((t, [, v]) => t + v, 0);
  const stockAvg = (m: string) => {
    const xs = STOCK_BY_MONTH.filter(([x]) => x === m);
    return xs.reduce((t, [, v]) => t + v, 0) / xs.length;
  };
  const stockN = (m: string) => STOCK_BY_MONTH.filter(([x]) => x === m).length;
  const salesN = (m: string) => SALES_BY_MONTH.filter(([x]) => x === m).length;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Drilling across"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              ["drill", "query each, then merge"],
              ["direct", "join the two fact tables"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.join === k}
                onClick={() => set({ join: k as BusState["join"] })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.join === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <Code>
            {s.join === "drill"
              ? `-- 1: sales by month          -- 2: stock by month
SELECT d.month, SUM(revenue)   SELECT d.month, AVG(units)
FROM fact_sales ...            FROM fact_inventory ...
GROUP BY d.month               GROUP BY d.month
-- 3: merge the two answers on month`
              : `SELECT d.month, SUM(s.revenue), AVG(i.units)
FROM fact_sales s
JOIN fact_inventory i ON i.date_month = s.date_month   -- ✗
GROUP BY d.month`}
          </Code>
          <div className="border-line overflow-hidden rounded-lg border font-mono text-xs">
            <div className="bg-surface-2 grid grid-cols-3 px-3 py-1 font-semibold">
              <span>month</span>
              <span>revenue</span>
              <span>avg units on hand</span>
            </div>
            {months.map((m) => (
              <div key={m} className="border-line grid grid-cols-3 border-t px-3 py-1">
                <span>{m}</span>
                <span className={s.join === "direct" ? "text-bad" : "text-good"}>
                  ₹
                  {(s.join === "direct" ? salesBy(m) * stockN(m) : salesBy(m)).toLocaleString(
                    "en-IN",
                  )}
                </span>
                <span className="text-good">{stockAvg(m)}</span>
              </div>
            ))}
          </div>
          {s.join === "direct" && (
            <p className="text-bad text-xs">
              Each sales row matched {stockN("Jan")} stock rows (and each stock row {salesN("Jan")}{" "}
              sales rows): revenue is tripled.
            </p>
          )}
        </div>
      }
    >
      <p>
        To compare sales with stock, Kimball&apos;s method is to{" "}
        <Term id="drill-across">drill across</Term>: query each fact table on its own, grouped by
        the same conformed attributes, then line the answers up. BI tools call it stitching or a
        multipass query.
      </p>
      <p>
        Joining two fact tables directly multiplies rows: every sales row meets every stock row for
        the month.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Same names, same values --------------------------------------------------------------------- */

export function SameValues() {
  const [s, set] = useSceneState<BusState>();
  const stock = s.conform ? CATS_SALES : CATS_STOCK_BAD;
  const all = [...new Set([...CATS_SALES, ...stock])];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same names, same values"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            aria-pressed={s.conform}
            onClick={() => set({ conform: !s.conform })}
            className={cn(
              "self-start rounded-md border px-3 py-1 text-xs",
              s.conform ? "border-good bg-good/15 text-good" : "border-bad bg-bad/10 text-bad",
            )}
          >
            product dimension {s.conform ? "conformed" : "not conformed"}
          </button>
          <div className="border-line overflow-hidden rounded-lg border font-mono text-xs">
            <div className="bg-surface-2 grid grid-cols-3 px-3 py-1 font-semibold">
              <span>category</span>
              <span>sales</span>
              <span>stock</span>
            </div>
            {all.map((c) => (
              <motion.div
                key={c}
                layout
                className={cn(
                  "border-line grid grid-cols-3 border-t px-3 py-1",
                  !(CATS_SALES.includes(c) && stock.includes(c)) && "bg-bad/10",
                )}
              >
                <span>{c}</span>
                <span>{CATS_SALES.includes(c) ? "✓" : "—"}</span>
                <span>{stock.includes(c) ? "✓" : "—"}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">
            A rolled-up version (say, month and brand for a forecast) still conforms if its names
            and values match: a shrunken dimension.
          </p>
        </div>
      }
    >
      <p>
        Conforming isn&apos;t just about sharing a table name. The columns must be named the same
        and hold the same values. If inventory calls chai &ldquo;Hot drinks&rdquo; and sales calls
        it &ldquo;Beverages&rdquo;, the merged report splits into rows that don&apos;t match.
      </p>
      <p>
        Kimball says conformed dimensions are defined once, with the business&apos;s data governance
        people, and reused.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Two rows for one category ------------------------------------------------------------------- */

export function NotConformed() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Two rows for one category"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="not-conformed"
            prompt="A combined sales-and-returns report shows “Electronics” and “ELECTRONICS” as separate rows, each with half the numbers. What's the root cause?"
            options={[
              {
                id: "join",
                label: "The report should join the two fact tables directly",
                feedback: "That would multiply rows, not merge labels.",
              },
              {
                id: "conform",
                label: "The product dimension isn't conformed between the two processes",
                correct: true,
                feedback:
                  "Each process has its own category values. Defining the product dimension once, and reusing it, makes the rows line up.",
              },
              {
                id: "grain",
                label: "The two fact tables have different grains",
                feedback: "Different grains are normal; drilling across handles that.",
              },
              {
                id: "index",
                label: "There's no index on category",
                feedback: "Indexes affect speed, not which rows appear.",
              },
            ]}
            explanation="Drilling across only works when the shared dimension attributes have identical names and values."
          />
        </div>
      }
    >
      <p>Find the cause.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Conformed dimensions", "Same column names, same values, defined once."],
  ["The bus matrix", "Processes × dimensions; build one row at a time."],
  ["Drill across", "Query each fact table, then merge on shared attributes."],
  ["Never join facts to facts", "Rows multiply."],
  ["Shrunken dimensions", "Rolled-up subsets that still conform."],
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
        Next: patterns for awkward dimensions, from junk and role-playing dimensions to hierarchies.
      </p>
    </StepLayout>
  );
}
