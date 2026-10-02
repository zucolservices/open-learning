"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ORDERS, SQL, run, type Kind } from "./engine";
import type { Query, SqlState } from "./state";

/* 1 ─ A scoreboard, not a scorecard ------------------------------------------------------------- */

export function Scoreboard() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A scoreboard, not a scorecard"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">The scorecard</p>
            <p className="text-muted text-sm">
              Ask the scorer after the match and get one answer: India 287 for 6. That&apos;s a
              batch query.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">The stadium scoreboard</p>
            <p className="text-muted text-sm">
              Updates after every ball, all match long. Nobody re-adds the whole innings; it just
              applies each change.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        You don&apos;t need to write Java to process streams. Streaming SQL lets you write an
        ordinary query, such as total orders per customer, and keep it running forever: a{" "}
        <Term id="continuous-query">continuous query</Term>.
      </p>
      <p>
        Its result is a table that keeps changing, a{" "}
        <Term id="materialized-view">materialised view</Term> kept up to date by applying each new
        event rather than recomputing from scratch. Flink&apos;s docs: &ldquo;A continuous query
        never terminates and produces dynamic results&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A query that never finishes ⭐ -------------------------------------------------------------- */

const QUERIES: [Query, string][] = [
  ["count", "Orders per customer"],
  ["sum", "Sales per city"],
  ["filter", "Large orders"],
  ["window", "Orders per 5 minutes"],
];

const KIND_CLS: Record<Kind, string> = {
  "+I": "text-good",
  "-U": "text-bad",
  "+U": "text-good",
  "-D": "text-bad",
};

export function Live() {
  const [s, set] = useSceneState<SqlState>();
  const { result, log } = run(s.query, s.n);
  const updating = s.query === "count" || s.query === "sum";
  const shownLog =
    s.encoding === "upsert" && updating
      ? log.filter((c) => c.kind !== "-U").map((c) => ({ ...c, kind: "+U" as Kind }))
      : log;
  return (
    <StepLayout
      eyebrow="Sandbox · simulated engine"
      title="A query that never finishes"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {QUERIES.map(([k, n]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set({ query: k })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px]",
                    s.query === k
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <Code className="text-[10px] whitespace-pre-wrap">{SQL[s.query]}</Code>
            <div className="flex flex-col gap-0.5">
              <p className="text-muted text-[10px]">Orders stream</p>
              {ORDERS.map((o, i) => (
                <p key={i} className={cn("font-mono text-[10px]", i < s.n ? "" : "text-subtle")}>
                  {o.ts.toString().padStart(2, "0")} min · {o.customer} · {o.city} · ₹{o.amount}
                </p>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={s.n >= ORDERS.length}
                onClick={() => set({ n: s.n + 1 })}
                className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
              >
                Next order
              </button>
              <button
                type="button"
                onClick={() => set({ n: 0 })}
                className="border-line flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1 text-[10px]">Materialised view (current result)</p>
              {result.length === 0 && <p className="text-muted text-xs">empty</p>}
              {result.map(([k, row]) => (
                <motion.p key={`${s.query}-${k}-${row}`} className="font-mono text-xs">
                  {row}
                </motion.p>
              ))}
            </div>
            <div className="border-line rounded-xl border px-3 py-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-muted text-[10px]">Changelog it emits ({shownLog.length})</p>
                {updating && (
                  <Segmented
                    size="sm"
                    value={s.encoding}
                    options={[
                      ["retract", "Retract"],
                      ["upsert", "Upsert"],
                    ]}
                    onChange={(v) => set({ encoding: v })}
                  />
                )}
              </div>
              <div className="flex max-h-44 flex-col gap-0.5 overflow-auto">
                {shownLog.map((c, i) => (
                  <motion.p
                    key={`${s.query}-${s.encoding}-${i}`}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-[10px]"
                  >
                    <span className={cn("inline-block w-6 font-semibold", KIND_CLS[c.kind])}>
                      {c.kind}
                    </span>{" "}
                    {c.row}
                  </motion.p>
                ))}
              </div>
            </div>
            <p className="text-muted text-[11px]">
              {updating
                ? "An updating result: each new order retracts the old row (−U) and adds the new one (+U). An upsert sink just overwrites by key instead."
                : s.query === "filter"
                  ? "Append-only: rows are only ever added (+I), so any sink can take it."
                  : "A windowed aggregate: each window's count is emitted once, when the window is complete, as an insert. Here the window closes when an order past its end arrives."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Pick a query and feed it orders one at a time. The left side is what you wrote; the right
        side is what the engine keeps (the view) and what it sends downstream (the changelog).
      </p>
      <p>
        Results come in two kinds. Some only ever add rows; others change rows they already sent. An
        updating result needs a sink that understands updates: in Flink, the plain Kafka connector
        is append-only, while upsert-kafka writes the latest value per key and deletes as tombstones
        (module 6). Non-windowed GROUP BYs keep state for every key forever unless you set a TTL
        (module 14).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Streaming SQL engines --------------------------------------------------------------------- */

const ENGINES: Record<string, { name: string; text: string }> = {
  flink: {
    name: "Flink SQL",
    text: "Continuous queries over “dynamic tables”, with results “semantically equivalent” to running the same query in batch on a snapshot. CREATE MATERIALIZED TABLE keeps a table fresh to a target lag. Offered managed by Confluent Cloud, AWS and Alibaba.",
  },
  ksqldb: {
    name: "ksqlDB",
    text: "SQL over Kafka topics: persistent queries create streams and tables; push queries (EMIT CHANGES) stream changes; pull queries read a view's current state. Fully supported, though Confluent recommends Flink for new work.",
  },
  risingwave: {
    name: "RisingWave",
    text: "A streaming database that speaks the PostgreSQL protocol: create a materialised view in SQL and it stays incrementally up to date, with state on object storage. Apache 2.0.",
  },
  materialize: {
    name: "Materialize",
    text: "Incrementally maintained views built on Differential Dataflow (Frank McSherry), strictly serialisable by default; it now calls itself a live data layer for apps and AI agents. BSL licence, free Community Edition.",
  },
  spark: {
    name: "Spark and Databricks",
    text: "Streaming DataFrames and SQL in micro-batches. Spark 4.1 added open-source Declarative Pipelines, whose materialised views refresh in batches; Databricks adds incremental refresh.",
  },
  warehouses: {
    name: "Warehouses",
    text: "Snowflake Dynamic Tables (GA 2024) refresh to a target lag; BigQuery continuous queries are generally available, with joins and aggregations still in preview.",
  },
};

export function Engines() {
  const [s, set] = useSceneState<SqlState>();
  const e = ENGINES[s.engine] ?? ENGINES.flink;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Streaming SQL engines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(ENGINES).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ engine: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.engine === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
          <motion.div
            key={s.engine}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">{e.name}</p>
            <p className="text-muted mt-1 text-sm">{e.text}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Streaming SQL comes in two flavours: SQL inside a stream processor (Flink SQL, ksqlDB), and
        databases built around incrementally maintained views (RisingWave, Materialize). Warehouses
        are adding their own, refreshed to a freshness target.
      </p>
      <p>
        The trade-offs are the ones from earlier modules: state size, late data, and how updates
        reach sinks.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Append or update? ------------------------------------------------------------------------ */

export function AppendOrUpdate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Append or update?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="append-or-update"
            prompt="Does each continuous query produce an append-only or an updating result?"
            categories={[
              { id: "append", label: "Append-only" },
              { id: "update", label: "Updating" },
            ]}
            items={[
              {
                id: "where",
                label: "SELECT * FROM payments WHERE amount > 10000",
                category: "append",
                why: "Each matching event is added once and never changed.",
              },
              {
                id: "group",
                label: "SELECT merchant, SUM(amount) FROM payments GROUP BY merchant",
                category: "update",
                why: "Every new payment changes its merchant's total.",
              },
              {
                id: "tumble",
                label: "Orders per 10-minute TUMBLE window in Flink SQL",
                category: "append",
                why: "Flink SQL window aggregations emit each window's final result once.",
              },
              {
                id: "topn",
                label: "The 3 biggest orders per city so far",
                category: "update",
                why: "A new large order pushes another out of the top 3.",
              },
              {
                id: "project",
                label: "SELECT order_id, UPPER(city) FROM orders",
                category: "append",
                why: "A per-row transformation; nothing is revisited.",
              },
            ]}
            explanation="If a new event can change a row already emitted, the result is updating and needs an upsert-capable sink."
          />
        </div>
      }
    >
      <p>Five queries. Which change their earlier answers?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["SQL that never finishes", "A continuous query updates its result as events arrive."],
  ["Views kept fresh", "Incremental maintenance applies each change."],
  ["Append vs updating", "Updating results need upsert sinks."],
  ["Same costs underneath", "State, late data and checkpoints still apply."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes processing streams. Next chapter: operating them, starting with what happens
        when events arrive faster than you can handle.
      </p>
    </StepLayout>
  );
}
