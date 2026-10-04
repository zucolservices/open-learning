"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HYBRIDS, MOVE_DATE, PURCHASES, view, type ScdType } from "./model";
import type { ScdState } from "./state";

/* 1 ─ The old address ----------------------------------------------------------------------------- */

export function Address() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The old address"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Cross it out",
              "The old address is gone. Last year's Christmas card list now says she lived in Mumbai all along.",
            ],
            [
              "Write a new line, with dates",
              "Pune until June, Mumbai from July. Every old letter still matches where it was sent.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i ? "border-good bg-good/10" : "border-bad/50 bg-bad/5",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        When a friend moves, you can cross out the old address in your book, or add a new line with
        the date she moved. Crossing out is simpler; the dated line remembers where she used to be.
      </p>
      <p>
        Dimension attributes change too: customers move, products change category, staff change
        team. Kimball introduced <Term id="scd">slowly changing dimensions</Term> in 1996 as a set
        of numbered ways to handle it. &ldquo;Slowly&rdquo; because the changes arrive far less
        often than facts.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Asha moves to Mumbai ⭐ --------------------------------------------------------------------- */

export function Move() {
  const [s, set] = useSceneState<ScdState>();
  const v = view(s.t, s.moved);
  const max = Math.max(...v.report.map(([, n]) => n), 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Asha moves to Mumbai"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {([0, 1, 2, 3] as ScdType[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.t === t}
                onClick={() => set({ t })}
                className={cn(
                  "rounded-md border px-3 py-1",
                  s.t === t ? "border-accent bg-accent-soft font-semibold" : "border-line",
                )}
              >
                Type {t}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={s.moved}
              onClick={() => set({ moved: !s.moved })}
              className={cn(
                "ml-auto rounded-full border px-3 py-1",
                s.moved ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              {s.moved ? "✓ moved on 1 July" : "make her move (1 July)"}
            </button>
          </div>
          <div className="border-line overflow-x-auto rounded-lg border">
            <p className="bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-semibold">
              dim_customer
            </p>
            <table className="w-full font-mono text-[10px]">
              <thead>
                <tr>
                  {v.head.map((h) => (
                    <th key={h} className="text-muted px-2 text-left font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {v.rows.map((r) => (
                  <motion.tr
                    key={r.join()}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-line border-t"
                  >
                    {r.map((c, j) => (
                      <td key={j} className="px-2 py-0.5 whitespace-nowrap">
                        {c}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">
              REPORT: Asha&apos;s 2026 purchases by city
            </p>
            {v.report.map(([c, n]) => (
              <div key={c} className="grid grid-cols-[8rem_1fr_4rem] items-center gap-2 text-xs">
                <span>{c}</span>
                <div className="bg-surface-2 h-2.5 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: `${(n / max) * 100}%` }}
                    className="bg-viz-data h-full"
                  />
                </div>
                <span className="text-right font-mono">₹{n.toLocaleString("en-IN")}</span>
              </div>
            ))}
            <p className="text-muted mt-1 text-[11px]">{v.reportNote}</p>
          </div>
          {s.moved && (
            <motion.p
              key={s.t}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-xs", v.good ? "text-good" : "text-muted")}
            >
              {v.verdict}
            </motion.p>
          )}
          <p className="text-subtle text-[10px]">
            Purchases: {PURCHASES.map((p) => `${p.date.slice(5)} ₹${p.amount}`).join(" · ")}.
            Made-up data.
          </p>
        </div>
      }
    >
      <p>
        Asha bought ₹5,000 of things while living in Pune and ₹3,000 after moving to Mumbai on 1
        July. Make her move, then compare the four classic types.
      </p>
      <p>
        Type 1 overwrites, so it&apos;s always current but rewrites the past. Type 2 adds a new row
        with its own <Term id="surrogate-key">surrogate key</Term>, so each sale keeps the city it
        happened in. Type 0 never changes; type 3 keeps one previous value in an extra column.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How type 2 works ---------------------------------------------------------------------------- */

export function TypeTwo() {
  const [s, set] = useSceneState<ScdState>();
  const city = s.asOf < MOVE_DATE ? "Pune (key 101)" : "Mumbai (key 102)";
  return (
    <StepLayout
      eyebrow="Explore"
      title="How type 2 works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`-- a change arrives: close the current row …
UPDATE dim_customer SET valid_to = '2026-07-01', is_current = 'N'
WHERE customer_id = 'C-17' AND is_current = 'Y';
-- … and add the new version with a new surrogate key
INSERT INTO dim_customer VALUES
  (102, 'C-17', 'Asha', 'Mumbai', '2026-07-01', '9999-12-31', 'Y');`}</Code>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted">which version was in effect on</span>
            {PURCHASES.map((p) => (
              <button
                key={p.date}
                type="button"
                aria-pressed={s.asOf === p.date}
                onClick={() => set({ asOf: p.date })}
                className={cn(
                  "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                  s.asOf === p.date ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {p.date}
              </button>
            ))}
          </div>
          <motion.p
            key={s.asOf}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-xs"
          >
            valid_from ≤ {s.asOf} &lt; valid_to → {city}
          </motion.p>
        </div>
      }
    >
      <p>
        A type 2 dimension adds at least three columns: when the row became valid, when it stopped,
        and a current-row flag. Kimball&apos;s rules: one row&apos;s end equals the next row&apos;s
        start, with no gaps, and the current row ends at a far-future date.
      </p>
      <p>
        The customer id ties the versions together. The fact table stores the surrogate key of the
        version in effect when the sale was loaded, so history is fixed at load time.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Types 4 to 7 -------------------------------------------------------------------------------- */

export function Hybrids() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Types 4 to 7"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {HYBRIDS.map(([t, d], i) => (
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
        Types 1 to 3 date from 1996. Types 0 and 4 to 7 were given numbers in 2013, in the third
        edition of The Data Warehouse Toolkit, for techniques described earlier but never labelled.
        The name type 6 came from an HP engineer in 2000: a type 2 row with a type 3 column
        overwritten as type 1.
      </p>
      <p>
        Watch out: some websites use &ldquo;type 4&rdquo; for a separate history table. In
        Kimball&apos;s numbering it&apos;s the mini-dimension.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which type? --------------------------------------------------------------------------------- */

export function WhichScd() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which type?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-scd"
            prompt="Which SCD type fits each need?"
            categories={[
              { id: "0", label: "Type 0" },
              { id: "1", label: "Type 1" },
              { id: "2", label: "Type 2" },
              { id: "3", label: "Type 3" },
            ]}
            items={[
              {
                id: "signup",
                label: "A customer's original sign-up channel, which must never change",
                category: "0",
                why: "Retain the original.",
              },
              {
                id: "typo",
                label: "Fix a misspelt product name",
                category: "1",
                why: "A correction: nobody needs the old spelling.",
              },
              {
                id: "rep",
                label: "Sales by the region each rep was in at the time of the sale",
                category: "2",
                why: "Needs the version in effect then.",
              },
              {
                id: "reorg",
                label: "After a reorganisation, report this year by both old and new territories",
                category: "3",
                why: "Current and previous value side by side.",
              },
              {
                id: "move",
                label: "Revenue by the city customers lived in when they bought",
                category: "2",
                why: "Full history, row per version.",
              },
            ]}
            explanation="Type 0 never changes, type 1 overwrites, type 2 adds a dated row, type 3 keeps the previous value in a column."
          />
        </div>
      }
    >
      <p>Sort the needs.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Type 1: overwrite", "Current only; history destroyed."],
  ["Type 2: add a row", "Surrogate key per version; valid_from/valid_to/current."],
  ["Type 3: add a column", "One previous value, an alternate reality."],
  ["Type 0: retain original", "Never changes."],
  ["4–7: hybrids", "Mini-dimensions and as-was plus as-is."],
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
        Next chapter: other approaches to the warehouse, starting with the Inmon and Kimball debate.
      </p>
    </StepLayout>
  );
}
