"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHECKS, SCENARIOS, diff, run } from "./model";
import type { ReconState } from "./state";

/* 1 ─ Cashing up the till ------------------------------------------------------------------------- */

export function Till() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Cashing up the till"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Count the receipts", "142 receipts, 142 sales on the till roll. Quick."],
            ["Total the cash", "£3,410.50 in the drawer, £3,410.50 on the roll. Quick."],
            ["Only if they disagree…", "go through the receipts one by one to find the wrong one."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * i }}
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
        At closing time a shopkeeper doesn&apos;t re-check every sale. They count, then total, and
        only dig into individual receipts when the totals disagree.
      </p>
      <p>
        <Term id="reconciliation">Reconciliation</Term> proves that a copy of data matches its
        source the same way: cheap <Term id="control-total">control totals</Term> first, row-by-row
        comparison only where they disagree. Auditors have used counts, control totals and matching
        as completeness checks for decades.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Reconcile a copy ⭐ ------------------------------------------------------------------------- */

export function Reconcile() {
  const [s, set] = useSceneState<ReconState>();
  const ran = s.ran ?? [];
  const sc = SCENARIOS.find((x) => x.id === s.scenario)!;
  const rows = diff(s.scenario, s.tol);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Reconcile a copy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {SCENARIOS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.scenario === x.id}
                onClick={() => set({ scenario: x.id, ran: [] })}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px]",
                  s.scenario === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            12 orders in the source database, copied to the warehouse. The fault is hidden until you
            check.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CHECKS.map((c) => {
              const done = ran.includes(c.id);
              const r = run(c.id, s.scenario, s.tol);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => !done && set({ ran: [...ran, c.id] })}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-xs",
                    !done
                      ? "border-line bg-surface hover:bg-surface-2"
                      : r.ok
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10",
                  )}
                >
                  <span className="flex items-baseline justify-between">
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-muted text-[10px]">{c.cost}</span>
                  </span>
                  <span className="text-muted block font-mono text-[11px]">
                    {done
                      ? `${r.ok ? "✓ match" : "✗ differ"}${r.detail ? ` · ${r.detail}` : ""}`
                      : "run check"}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">tolerance on amounts</span>
            {[0, 0.01].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.tol === t}
                onClick={() => set({ tol: t })}
                className={cn(
                  "rounded-md border px-2 py-0.5 font-mono",
                  s.tol === t ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {t === 0 ? "exact" : "± 0.01"}
              </button>
            ))}
          </label>
          {ran.includes("rows") && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-xl border p-2 text-[11px]"
            >
              {rows.length === 0 ? (
                <p className="text-good">Every row matches.</p>
              ) : (
                rows.slice(0, 6).map((r, i) => (
                  <p key={`${r.id}-${i}`} className="font-mono">
                    <span className="text-bad">{r.kind}</span> · {r.id}
                    {r.a !== undefined && ` · source ${r.a}`}
                    {r.b !== undefined && ` · copy ${String(r.b).slice(0, 14)}`}
                  </p>
                ))
              )}
              {rows.length > 6 && <p className="text-muted">…and {rows.length - 6} more</p>}
            </motion.div>
          )}
          {ran.length === CHECKS.length && (
            <p className="text-muted text-[11px]">What happened: {sc.story}</p>
          )}
        </div>
      }
    >
      <p>
        Pick a hidden fault and run the checks, cheapest first. Notice which faults slip past each
        check: a lost row plus a doubled one leaves the count at 12; swapped amounts keep count and
        sum identical.
      </p>
      <p>
        Matching counts don&apos;t mean matching data. And for floats, decide a tolerance up front:
        storing money as a decimal or in whole cents lets you compare exactly.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Finding the needle -------------------------------------------------------------------------- */

const SEGMENTS = 16;
const BAD = 11;

export function Bisect() {
  const [s, set] = useSceneState<ReconState>();
  const depth = s.depth ?? 0;
  const size = SEGMENTS / 2 ** depth;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Finding the needle"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-0.5">
            {Array.from({ length: SEGMENTS }, (_, i) => {
              const seg = Math.floor(i / size);
              const badSeg = Math.floor(BAD / size);
              const ruledOut =
                depth > 0 && Math.floor(i / (size * 2)) !== Math.floor(BAD / (size * 2));
              return (
                <div
                  key={i}
                  className={cn(
                    "flex h-12 flex-1 items-end justify-center rounded-sm pb-1 font-mono text-[9px]",
                    ruledOut
                      ? "bg-good/15 text-good"
                      : seg === badSeg
                        ? "bg-bad/25 text-bad"
                        : "bg-good/30 text-good",
                    i % size === 0 && i > 0 && !ruledOut && "ml-1",
                  )}
                >
                  {depth === 4 && i === BAD ? "row" : ""}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">
              {depth === 0
                ? "1 checksum per side: differs."
                : depth < 4
                  ? "Split the differing part in two and checksum both halves: one matches and is ruled out."
                  : "Down to the rows: fetch and compare just these."}
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                onClick={() => set({ depth: 0 })}
                className="border-line rounded-md border px-2 py-1"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={depth >= 4}
                onClick={() => set({ depth: depth + 1 })}
                className="border-accent bg-accent-soft rounded-md border px-2 py-1 disabled:opacity-40"
              >
                Split
              </button>
            </span>
          </div>
          <Code>{`-- on each side, for one key range
select count(*), sum(hash(id, amount, status))
from orders where id between 1 and 500000`}</Code>
        </div>
      }
    >
      <p>
        Across two different databases you can&apos;t simply join. The trick is hash and bisect:
        checksum a key range on both sides; if the checksums match, move on; if not, split that
        range and repeat, down to the rows.
      </p>
      <p>
        When little has changed, the cost is close to running a count on each side. A matching hash
        is very strong evidence, though not mathematical proof.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools and tolerances ------------------------------------------------------------------------ */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools and tolerances"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`-- same database: one full outer join tells all
select coalesce(s.id, t.id) as id,
  case when t.id is null then 'only in source'
       when s.id is null then 'only in copy'
       else 'changed' end as status
from source_orders s
full outer join warehouse_orders t on s.id = t.id
where s.id is null or t.id is null
   or s.amount <> t.amount`}</Code>
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            {[
              [
                "dbt-audit-helper",
                "compare_and_classify_relation_rows labels rows identical, modified, added or removed.",
              ],
              [
                "reladiff",
                "Cross-database hash-and-bisect; the fork of Datafold's data-diff, archived in 2024.",
              ],
              [
                "AWS DMS validation",
                "Compares migrated tables row by row; needs a primary key or unique index.",
              ],
              ["Google DVT", "Open-source Data Validation Tool: counts, sums and row hashes."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Inside one database, a full outer join on the key finds rows only on one side and rows that
        differ. Across databases, use a hash-and-bisect tool or a migration service&apos;s
        validation.
      </p>
      <p>
        Floating point isn&apos;t exact (0.1 + 0.1 + 0.1 isn&apos;t quite 0.3), so agree a tolerance
        with the business and write it down; there&apos;s no universal right number.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which check catches it? --------------------------------------------------------------------- */

export function WhichCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which check catches it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-check"
            prompt="What's the cheapest check that would catch each fault?"
            categories={[
              { id: "count", label: "Row count" },
              { id: "sum", label: "Sum of amount" },
              { id: "rows", label: "Row-level diff" },
            ]}
            items={[
              {
                id: "half",
                label: "Half of yesterday's rows never arrived",
                category: "count",
                why: "The count drops.",
              },
              {
                id: "cents",
                label: "Amounts were loaded in cents instead of euros",
                category: "sum",
                why: "Same rows, 100× the total.",
              },
              {
                id: "status",
                label: "Every 'shipped' became 'placed'",
                category: "rows",
                why: "Counts and amounts are untouched.",
              },
              {
                id: "dup",
                label: "One order loaded twice, another missing, same amount",
                category: "rows",
                why: "Count and sum both still match.",
              },
              {
                id: "extra",
                label: "A test order was copied into production",
                category: "count",
                why: "One extra row.",
              },
            ]}
            explanation="Counts catch missing or extra rows; sums catch changed amounts; only a row-level diff catches changes that leave totals intact. Run cheap checks first, diff where they disagree, and diff regularly for high-stakes data."
          />
        </div>
      }
    >
      <p>Sort the faults.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Totals first", "Count, sum, hash totals: cheap and quick."],
  ["Then rows", "Diff only where totals disagree."],
  ["Counts can lie", "A loss and a duplicate cancel out."],
  ["Hash and bisect", "Find differences across databases cheaply."],
  ["Agree tolerances", "Or store money as decimals."],
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
      <p>Next: data that arrives late or out of order, and loads you can safely run twice.</p>
    </StepLayout>
  );
}
