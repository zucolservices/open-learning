"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { Action, MedallionState } from "./state";

/* 2 ─ Checkpoint: which layer? ------------------------------------------------------------------- */

export function LayerSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which layer does it belong in?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="layer-sort"
            prompt="Each job belongs in one layer. Where does each one go?"
            categories={[
              { id: "bronze", label: "Bronze" },
              { id: "silver", label: "Silver" },
              { id: "gold", label: "Gold" },
            ]}
            items={[
              {
                id: "raw",
                label: "Keep the raw JSON payload exactly as received",
                category: "bronze",
                why: "Source fidelity is bronze's one job: it's what lets you replay.",
              },
              {
                id: "meta",
                label: "Add columns for when and from which file a record arrived",
                category: "bronze",
                why: "Ingestion metadata is added on landing, without changing the data.",
              },
              {
                id: "types",
                label: 'Turn "₹1,250.00" into the number 1250.00',
                category: "silver",
                why: "Fixing types and formats is cleaning.",
              },
              {
                id: "dedupe",
                label: "Remove duplicate orders with the same order_id",
                category: "silver",
                why: "Every consumer needs one row per order, so do it once, in silver.",
              },
              {
                id: "rev",
                label: "Revenue per city per day",
                category: "gold",
                why: "An aggregate shaped for a business question.",
              },
              {
                id: "features",
                label: "Features for the churn model",
                category: "gold",
                why: "Built for one specific use, from clean silver data.",
              },
            ]}
            explanation="Bronze keeps what arrived, silver makes it correct and consistent, gold shapes it for a use. Put each rule in the earliest layer that every consumer needs it in."
          />
        </div>
      }
    >
      <p>
        Each layer makes a promise to the people who read it. Bronze promises completeness, silver
        promises correctness, gold promises answers.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Quality gates -------------------------------------------------------------------------- */

type Order = { id: string; amount: number | null; ts: string };

const BATCH: Order[] = [
  { id: "A-201", amount: 320, ts: "2026-09-12 09:02" },
  { id: "A-202", amount: null, ts: "2026-09-12 09:05" },
  { id: "A-203", amount: 1250, ts: "2026-09-12 09:07" },
  { id: "A-204", amount: -50, ts: "2026-09-12 09:11" },
  { id: "A-205", amount: 480, ts: "2026-09-12 09:14" },
  { id: "A-206", amount: 290, ts: "2027-01-01 00:00" },
  { id: "A-207", amount: 640, ts: "2026-09-12 09:20" },
  { id: "A-208", amount: 210, ts: "2026-09-12 09:26" },
];

const amountOk = (o: Order) => o.amount !== null && o.amount > 0;
const tsOk = (o: Order) => o.ts <= "2026-09-12 23:59";

const ACTIONS: [Action, string][] = [
  ["warn", "Warn"],
  ["drop", "Drop"],
  ["fail", "Fail"],
  ["quarantine", "Quarantine"],
];

const ACTION_TEXT: Record<Action, string> = {
  warn: "Keep the row, but count the violation in the pipeline's metrics.",
  drop: "Leave the row out of the table and count it.",
  fail: "Stop the update: nothing from this batch is written.",
  quarantine: "Leave the row out, but copy it to a quarantine table to inspect and fix later.",
};

function clause(name: string, cond: string, a: Action) {
  const suffix =
    a === "drop" || a === "quarantine"
      ? " ON VIOLATION DROP ROW"
      : a === "fail"
        ? " ON VIOLATION FAIL UPDATE"
        : "";
  return `  CONSTRAINT ${name} EXPECT (${cond})${suffix}`;
}

export function QualityGates() {
  const [s, set] = useSceneState<MedallionState>();
  const checks = [
    {
      key: "actAmount" as const,
      name: "valid_amount",
      cond: "amount > 0",
      ok: amountOk,
      act: s.actAmount,
    },
    {
      key: "actTs" as const,
      name: "not_in_future",
      cond: "order_ts <= current_timestamp()",
      ok: tsOk,
      act: s.actTs,
    },
  ];
  const failed = checks.some((c) => c.act === "fail" && BATCH.some((o) => !c.ok(o)));
  const fate = (o: Order): "ok" | "flagged" | "dropped" | "quarantined" => {
    const broken = checks.filter((c) => !c.ok(o));
    if (broken.some((c) => c.act === "quarantine")) return "quarantined";
    if (broken.some((c) => c.act === "drop")) return "dropped";
    if (broken.length) return "flagged";
    return "ok";
  };
  const fates = BATCH.map((o) => [o, fate(o)] as const);
  const inSilver = failed ? [] : fates.filter(([, f]) => f === "ok" || f === "flagged");
  const quarantined = failed ? [] : fates.filter(([, f]) => f === "quarantined");
  const usesQuarantine = checks.some((c) => c.act === "quarantine");

  return (
    <StepLayout
      eyebrow="Quality gates"
      title="What happens to a bad record?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          {checks.map((c) => (
            <div key={c.key} className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs">
                {c.name}: <span className="text-muted">{c.cond}</span>
              </span>
              <Segmented
                size="sm"
                value={c.act}
                options={ACTIONS}
                onChange={(v) => set({ [c.key]: v as Action })}
              />
            </div>
          ))}

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="text-muted mb-1.5 text-xs">Incoming batch (bronze)</p>
              <div className="grid gap-1">
                {fates.map(([o]) => {
                  const bad = checks.filter((c) => !c.ok(o));
                  return (
                    <div
                      key={o.id}
                      className={cn(
                        "flex justify-between gap-2 rounded-lg border px-2 py-1 font-mono text-[10px]",
                        bad.length ? "border-bad/40 bg-bad/5" : "border-line",
                      )}
                    >
                      <span>
                        {o.id} · {o.amount ?? "null"} · {o.ts}
                      </span>
                      <span className={bad.length ? "text-bad" : "text-subtle"}>
                        {bad.length ? `✗ ${bad.map((b) => b.name).join(", ")}` : "✓"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  "rounded-xl border p-3",
                  failed ? "border-bad/50 bg-bad/10" : "border-tier-silver/50 bg-tier-silver/5",
                )}
              >
                <p className="text-xs font-semibold">
                  silver.orders{" "}
                  <span className="text-muted font-normal">
                    {failed ? "· update failed, nothing written" : `· ${inSilver.length} rows`}
                  </span>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <AnimatePresence initial={false}>
                    {inSilver.map(([o, f]) => (
                      <motion.span
                        key={o.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-[10px]",
                          f === "flagged" ? "bg-bad/15 text-bad" : "bg-surface-2",
                        )}
                      >
                        {o.id}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                {inSilver.some(([, f]) => f === "flagged") && (
                  <p className="text-bad mt-1.5 text-[11px]">
                    Bad rows got through: every report built on silver now includes them.
                  </p>
                )}
              </div>
              {usesQuarantine && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-viz-compute/40 bg-viz-compute/5 rounded-xl border p-3"
                >
                  <p className="text-xs font-semibold">
                    silver.orders_quarantine{" "}
                    <span className="text-muted font-normal">· {quarantined.length} rows</span>
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {quarantined.map(([o]) => (
                      <span
                        key={o.id}
                        className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[10px]"
                      >
                        {o.id}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              <div className="border-line rounded-xl border p-3 text-[11px]">
                <p className="text-muted">Pipeline metrics</p>
                {checks.map((c) => (
                  <p key={c.key} className="font-mono">
                    {c.name}: {BATCH.filter((o) => !c.ok(o)).length} failed ({c.act})
                  </p>
                ))}
              </div>
            </div>
          </div>

          <ul className="text-muted grid gap-0.5 text-xs">
            {[...new Set(checks.map((c) => c.act))].map((a) => (
              <li key={a}>
                <span className="text-fg font-medium capitalize">{a}:</span> {ACTION_TEXT[a]}
              </li>
            ))}
          </ul>

          <Code>
            {[
              "-- Databricks Lakeflow pipelines (SQL)",
              "CREATE OR REFRESH STREAMING TABLE silver_orders (",
              clause(checks[0].name, checks[0].cond, checks[0].act) + ",",
              clause(checks[1].name, checks[1].cond, checks[1].act),
              ") AS SELECT … FROM STREAM(bronze_orders)",
            ].join("\n")}
          </Code>
          {usesQuarantine && (
            <p className="text-subtle text-xs">
              Quarantine isn&apos;t a built-in action: it&apos;s a pattern you build.
              Databricks&apos; version flags rows with <code>is_quarantined</code> and splits them
              into valid and invalid views; others write the failing rows to a separate table.
            </p>
          )}
        </div>
      }
    >
      <p>
        Silver promises correct data, so records that break the rules have to go somewhere. The
        rules are called <Term id="expectation">expectations</Term> (or data tests), and each one
        says what to do on failure. The code below is Databricks&apos; syntax; dbt data tests check
        a table after it&apos;s built and warn or fail, rather than dropping rows.
      </p>
      <p>
        Try each action on both rules. Watch where the three bad rows end up, and what happens to
        the good five.
      </p>
      <p className="text-muted text-sm">
        There&apos;s no single right answer. A wrong amount would corrupt revenue, so dropping or
        quarantining it is common. A future date might mean a clock bug upstream worth failing
        loudly for.
      </p>
    </StepLayout>
  );
}
