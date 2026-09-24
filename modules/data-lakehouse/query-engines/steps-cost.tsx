"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLUMNS, DAYS, TABLE_TB, fmtBytes, scan, type CustFilter, type DateFilter } from "./model";
import type { EnginesState } from "./state";

/** On-demand prices per TB scanned, US regions (see SOURCES.md). */
export const ATHENA_USD_PER_TB = 5;
export const BIGQUERY_USD_PER_TIB = 6.25;

/* 2 ─ Checkpoint: predict the scan ------------------------------------------------------------- */

export function PredictScan() {
  return (
    <StepLayout
      eyebrow="Predict first"
      title="How much does it read?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="predict-scan"
            prompt={`The orders table is ${TABLE_TB} TB, partitioned by day, with ${DAYS} days of data of similar size. A query filters on one month (30 days) and uses every column. Roughly how many GB does it scan?`}
            min={0}
            max={500}
            step={5}
            unit=" GB"
            answer={80}
            tolerance={20}
            explanation={`30 of ${DAYS} days is about 4% of ${TABLE_TB} TB: roughly 80 GB. Partition pruning skipped the other 96% before a single file was opened.`}
          />
        </div>
      }
    >
      <p>
        Guess before you try the calculator in the next step. Filters on the partition column let
        the engine skip whole folders of files.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What makes a query cheap ------------------------------------------------------------------ */

export function BytesCalculator() {
  const [s, set] = useSceneState<EnginesState>();
  const r = scan({
    date: s.date,
    customer: s.customer,
    clustered: s.clustered,
    columns: s.columns,
  });
  const athena = r.bytesTB * ATHENA_USD_PER_TB;
  const bq = (r.bytesTB * 1e12 * BIGQUERY_USD_PER_TIB) / 2 ** 40;
  const where = [
    s.date === "day"
      ? "order_date = DATE '2026-09-12'"
      : s.date === "month"
        ? "order_date >= DATE '2026-09-01' AND order_date < DATE '2026-10-01'"
        : "",
    s.customer === "customer" ? "customer_id = 88" : "",
  ].filter(Boolean);
  const sql = `SELECT ${s.columns === COLUMNS ? "*" : "city, amount, order_date"}\nFROM sales.orders${where.length ? `\nWHERE ${where.join("\n  AND ")}` : ""}`;
  const fmtUsd = (v: number) => (v >= 0.01 ? `$${v.toFixed(2)}` : "< $0.01");

  return (
    <StepLayout
      eyebrow="Simulation"
      title="What makes a query cheap?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-2">
            <Row label="Date filter">
              <Segmented
                size="sm"
                value={s.date}
                options={[
                  ["none", "None"],
                  ["month", "One month"],
                  ["day", "One day"],
                ]}
                onChange={(v) => set({ date: v as DateFilter })}
              />
            </Row>
            <Row label="Customer filter">
              <Segmented
                size="sm"
                value={s.customer}
                options={[
                  ["none", "None"],
                  ["customer", "One customer"],
                ]}
                onChange={(v) => set({ customer: v as CustFilter })}
              />
            </Row>
            <Row label="Columns">
              <Segmented
                size="sm"
                value={String(s.columns)}
                options={[
                  [String(COLUMNS), "SELECT *"],
                  ["3", "3 columns"],
                ]}
                onChange={(v) => set({ columns: Number(v) })}
              />
            </Row>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.clustered}
                onChange={(e) => set({ clustered: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Table is clustered by customer_id
            </label>
          </div>

          <Code>{sql}</Code>

          <div className="grid gap-1.5">
            {r.stages.map((st) => (
              <div
                key={st.label}
                className="grid grid-cols-[8.5rem_1fr_4.5rem] items-center gap-2 text-xs"
              >
                <span className="text-muted">{st.label}</span>
                <div className="bg-surface-2 h-4 overflow-hidden rounded">
                  <motion.div
                    initial={false}
                    animate={{ width: `${Math.max(0.6, Math.pow(st.tb / TABLE_TB, 0.25) * 100)}%` }}
                    className="bg-viz-data h-full rounded"
                  />
                </div>
                <span className="text-right font-mono">{fmtBytes(st.tb)}</span>
                <span />
                <span className="text-subtle col-span-2 -mt-1 text-[10px]">{st.note}</span>
              </div>
            ))}
            <p className="text-subtle text-[10px]">
              Bar lengths use a fourth-root scale so small numbers stay visible.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Scanned"
              value={fmtBytes(r.bytesTB)}
              tone={r.bytesTB > 0.005 ? "bad" : "good"}
            />
            <Stat label="Files opened" value={r.files.toLocaleString("en-IN")} />
            <Stat
              label="Cost per run"
              value={`${fmtUsd(athena)} / ${fmtUsd(bq)}`}
              small="Athena / BigQuery on-demand"
            />
          </div>

          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this model works</summary>
            <p className="mt-2">
              {TABLE_TB} TB table, {DAYS} equal daily partitions of 50 files each, {COLUMNS}{" "}
              equal-sized columns. Unclustered, every file holds every customer, so min/max
              statistics can&apos;t skip anything; clustered, about 1% of files can contain one
              customer. Prices are list on-demand prices per TB (Athena) and per TiB (BigQuery) in
              US regions, ignoring minimums per query.
            </p>
          </details>
        </div>
      }
    >
      <p>
        On pay-per-scan engines like Athena or BigQuery on-demand, the bytes read are the bill. On
        clusters, they&apos;re the wait. Either way, skipping is everything.
      </p>
      <p>
        Try each filter. Then filter on one customer and switch clustering on and off: the same
        query, the same result, very different work.
      </p>
      <p className="text-muted text-sm">
        This is <Term id="data-skipping">data skipping</Term> from the file layout module, seen from
        the engine&apos;s side.
      </p>
    </StepLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted w-28 text-xs">{label}</span>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
  small?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        tone === "bad"
          ? "border-bad/40 bg-bad/5"
          : tone === "good"
            ? "border-good/40 bg-good/5"
            : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <p className="font-mono text-sm">{value}</p>
      {small && <p className="text-subtle text-[9px]">{small}</p>}
    </div>
  );
}
