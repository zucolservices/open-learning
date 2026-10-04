"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EDGES, NODES, downstream, upstream } from "./model";
import type { LineageState } from "./state";

/* 1 ─ Up the river -------------------------------------------------------------------------------- */

export function River() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Up the river"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg
            viewBox="0 0 420 160"
            className="w-full max-w-lg"
            role="img"
            aria-label="A river with a factory upstream and towns downstream"
          >
            <path
              d="M10 30 C 120 30, 140 80, 220 80 S 330 130, 410 130"
              className="stroke-viz-data fill-none"
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.5}
            />
            <rect x={40} y={4} width={60} height={20} rx={4} className="fill-bad/20 stroke-bad" />
            <text x={70} y={18} textAnchor="middle" className="fill-fg text-[10px]">
              factory
            </text>
            {[
              [200, 56, "town A"],
              [300, 92, "farm"],
              [380, 150, "town B"],
            ].map(([x, y, t]) => (
              <g key={t as string}>
                <rect
                  x={(x as number) - 28}
                  y={(y as number) - 14}
                  width={56}
                  height={20}
                  rx={4}
                  className="fill-surface stroke-line"
                />
                <text
                  x={x as number}
                  y={(y as number) - 1}
                  textAnchor="middle"
                  className="fill-fg text-[10px]"
                >
                  {t}
                </text>
              </g>
            ))}
            <text x={10} y={118} className="fill-muted text-[10px]">
              ← upstream: find the cause
            </text>
            <text x={10} y={134} className="fill-muted text-[10px]">
              downstream: who&apos;s affected →
            </text>
          </svg>
        </div>
      }
    >
      <p>
        When a town&apos;s water turns bad, you walk upstream to find the cause: say, a leaking
        factory. Then you warn everyone downstream of it, not just the town that complained.
      </p>
      <p>
        <Term id="data-lineage">Data lineage</Term> is the map of that river for data: which jobs
        read which datasets and write which others. It answers the two urgent questions of an
        incident: where did it break (root cause), and who else is affected (
        <Term id="impact-analysis">impact analysis</Term>)?
      </p>
    </StepLayout>
  );
}

/* 2 ─ Trace a broken dashboard ⭐ ----------------------------------------------------------------- */

const COLW = 132;
const ROWH = 44;
const pos = (id: string) => {
  const n = NODES.find((x) => x.id === id)!;
  return { x: 8 + n.col * COLW, y: 10 + n.row * ROWH };
};

export function Trace() {
  const [s, set] = useSceneState<LineageState>();
  const inspected = s.inspected ?? [];
  const found = inspected.includes("fx");
  const up = upstream("dash");
  const down = downstream("fx");
  const lit = s.mode === "up" ? new Set([...up, "dash"]) : new Set([...down, "fx"]);
  const last = NODES.find((n) => n.id === inspected[inspected.length - 1]) ?? NODES[0];
  const inspect = (id: string) => !inspected.includes(id) && set({ inspected: [...inspected, id] });
  const hitUses = NODES.filter((n) => n.kind === "use" && down.has(n.id));
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Trace a broken dashboard"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              aria-pressed={s.mode === "up"}
              onClick={() => set({ mode: "up" })}
              className={cn(
                "rounded-md border px-2 py-1",
                s.mode === "up" ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              ← Upstream of the dashboard
            </button>
            <button
              type="button"
              aria-pressed={s.mode === "down"}
              disabled={!found}
              onClick={() => set({ mode: "down" })}
              className={cn(
                "rounded-md border px-2 py-1 disabled:opacity-40",
                s.mode === "down" ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              Downstream of the cause →
            </button>
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-2">
            <svg
              viewBox="0 0 530 190"
              className="w-full min-w-[30rem]"
              role="img"
              aria-label="Lineage graph"
            >
              {EDGES.map(([a, b]) => {
                const p = pos(a);
                const q = pos(b);
                const on = lit.has(a) && lit.has(b);
                return (
                  <path
                    key={`${a}-${b}`}
                    d={`M${p.x + 112} ${p.y + 12} C ${p.x + 124} ${p.y + 12}, ${q.x - 12} ${q.y + 12}, ${q.x} ${q.y + 12}`}
                    className={cn(
                      "fill-none",
                      on ? (s.mode === "up" ? "stroke-accent" : "stroke-bad") : "stroke-line",
                    )}
                    strokeWidth={on ? 1.6 : 1}
                  />
                );
              })}
              {NODES.map((n) => {
                const p = pos(n.id);
                const seen = inspected.includes(n.id);
                return (
                  <g
                    key={n.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${n.label}`}
                    onClick={() => inspect(n.id)}
                    onKeyDown={(e) => e.key === "Enter" && inspect(n.id)}
                    className="cursor-pointer"
                    opacity={lit.has(n.id) ? 1 : 0.35}
                  >
                    <rect x={p.x} y={p.y} width={112} height={24} rx={5} className="fill-surface" />
                    <rect
                      x={p.x}
                      y={p.y}
                      width={112}
                      height={24}
                      rx={5}
                      className={cn(
                        (s.mode === "down" && lit.has(n.id)) || (seen && n.bad)
                          ? "fill-bad/15 stroke-bad"
                          : seen
                            ? "fill-good/10 stroke-good"
                            : n.kind === "use"
                              ? "fill-viz-compute/10 stroke-viz-compute"
                              : n.kind === "source"
                                ? "fill-viz-meta/10 stroke-viz-meta"
                                : "fill-viz-data/10 stroke-viz-data",
                      )}
                    />
                    <text
                      x={p.x + 56}
                      y={p.y + 15.5}
                      textAnchor="middle"
                      className="fill-fg font-mono text-[9.5px]"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <motion.div
            key={`${last.id}-${s.mode}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              last.bad ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            {s.mode === "up" ? (
              <>
                <p>
                  <span className="font-mono font-semibold">{last.label}: </span>
                  {last.status}
                </p>
                <p className="text-muted mt-1 text-[11px]">
                  {found
                    ? `Root cause found after inspecting ${inspected.length} nodes. Now switch to downstream.`
                    : "Click upstream nodes (highlighted) to inspect them. Follow the bad ones."}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">fx_rates.csv touches {down.size} things downstream.</p>
                <p className="text-muted mt-1 text-[11px]">
                  Tell the owners of: {hitUses.map((n) => n.label).join(", ")}. The churn model
                  reads fct_revenue too, so it was affected even though nobody complained. The
                  marketing list is safe.
                </p>
              </>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Finance says euro revenue on the dashboard looks 4% off. Walk upstream: click the
        highlighted nodes to see each one&apos;s checks, and follow the trail of bad ones to the
        cause.
      </p>
      <p>
        Once you&apos;ve found it, flip direction. Fixing the dashboard isn&apos;t enough:
        everything downstream of the cause got the same bad data, including things nobody has
        noticed yet.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Column-level lineage ------------------------------------------------------------------------ */

export function Columns() {
  const rows: [string, string, string][] = [
    ["stg_orders.amount", "DIRECT", "the value is computed from it"],
    ["stg_fx_rates.rate", "DIRECT", "multiplied into it"],
    ["stg_orders.currency", "INDIRECT", "used in the join to rates"],
    ["stg_orders.status", "INDIRECT", "filters out cancelled orders"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Column-level lineage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`select o.order_id,
       o.amount * fx.rate as revenue_eur
from stg_orders o
join stg_fx_rates fx on fx.currency = o.currency
where o.status <> 'cancelled'`}</Code>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="text-muted mb-1 text-[10px]">WHAT FEEDS fct_revenue.revenue_eur</p>
            {rows.map(([c, k, why]) => (
              <div
                key={c}
                className="border-line grid grid-cols-[1.4fr_5rem_1.6fr] gap-2 border-t py-1"
              >
                <span className="font-mono">{c}</span>
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    k === "DIRECT" ? "text-accent" : "text-muted",
                  )}
                >
                  {k}
                </span>
                <span className="text-muted">{why}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Table-level lineage says fct_revenue reads stg_orders. Column-level lineage is finer: it
        says exactly which input columns feed each output column.
      </p>
      <p>
        OpenLineage marks the difference as DIRECT (the value is derived from the column) or
        INDIRECT (the column affects which rows appear, through a join, filter or sort). That tells
        you whether renaming status breaks revenue_eur. (It does: indirectly.)
      </p>
    </StepLayout>
  );
}

/* 4 ─ Collecting lineage -------------------------------------------------------------------------- */

export function OpenLineage() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Collecting lineage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`{ "eventType": "COMPLETE",
  "eventTime": "2026-10-04T06:20:11Z",
  "run": { "runId": "0176a8c2-…" },
  "job": { "namespace": "dbt", "name": "fct_revenue" },
  "inputs": [
    { "namespace": "warehouse", "name": "stg_orders" },
    { "namespace": "warehouse", "name": "stg_fx_rates" } ],
  "outputs": [
    { "namespace": "warehouse", "name": "fct_revenue" } ] }`}</Code>
          <div className="grid gap-2 text-xs sm:grid-cols-3">
            {[
              ["Job", "The defined piece of work."],
              ["Run", "One execution of it, with an ID."],
              ["Dataset", "A table or file, by namespace and name."],
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
        <Term id="openlineage">OpenLineage</Term> is an open standard for reporting lineage as
        events: each run emits START and then COMPLETE or FAIL, naming its inputs and outputs, plus
        optional facets such as schema, SQL or column lineage. A backend such as Marquez stitches
        the events into one graph. It began in 2020 and graduated at the Linux Foundation&apos;s LF
        AI &amp; Data in 2023; Airflow, Spark, Flink and dbt can all emit it.
      </p>
      <p>
        Catalogues also capture lineage: Databricks Unity Catalog, Microsoft Purview, Google Cloud
        Knowledge Catalog (formerly Dataplex) and AWS&apos;s SageMaker Catalog, while dbt draws its
        graph from ref() calls. None captures everything; each lists gaps.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Upstream or downstream? --------------------------------------------------------------------- */

export function UpOrDown() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Upstream or downstream?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="up-or-down"
            prompt="Which direction do you walk the lineage graph?"
            categories={[
              { id: "up", label: "Upstream" },
              { id: "down", label: "Downstream" },
            ]}
            items={[
              {
                id: "why",
                label: "Why does the churn score look wrong today?",
                category: "up",
                why: "Looking for a cause.",
              },
              {
                id: "drop",
                label: "Can we drop the legacy_region column?",
                category: "down",
                why: "Who reads it?",
              },
              {
                id: "notify",
                label: "Which teams should we tell about yesterday's bad load?",
                category: "down",
                why: "Impact.",
              },
              {
                id: "source",
                label: "Which source system does this KPI ultimately come from?",
                category: "up",
                why: "Origins.",
              },
              {
                id: "backfill",
                label: "After fixing stg_orders, what needs rebuilding?",
                category: "down",
                why: "Everything it feeds.",
              },
            ]}
            explanation="Walk upstream to find causes and origins; walk downstream to find impact, what to rebuild and who to tell."
          />
        </div>
      }
    >
      <p>Sort the questions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A map of the river", "Which jobs read and write which data."],
  ["Upstream", "Find the root cause."],
  ["Downstream", "Find everyone affected, even the quiet ones."],
  ["Column level", "Direct and indirect dependencies."],
  ["OpenLineage", "An open event standard for collecting it."],
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
      <p>Next: running the whole incident, from first alert to the review afterwards.</p>
    </StepLayout>
  );
}
