"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import type { EnginesState } from "./state";

/* 7 ─ Same tables, many engines ------------------------------------------------------------------ */

type Group = "oss" | "single" | "managed";

const ENGINES: {
  id: string;
  name: string;
  group: Group;
  runs: string;
  formats: string;
  tricks: string;
  goodFor: string;
}[] = [
  {
    id: "spark",
    name: "Apache Spark",
    group: "oss",
    runs: "A driver plans; executors on a cluster run tasks. Batch, streaming and ML in one engine.",
    formats: "Reads and writes Delta, Iceberg and Hudi.",
    tricks:
      "Catalyst optimiser, adaptive query execution (on by default since 3.2), vectorised Parquet reader. Native C++/Rust accelerators: Photon (Databricks), Gluten with Velox, Comet with DataFusion.",
    goodFor: "Large pipelines and heavy transformations.",
  },
  {
    id: "trino",
    name: "Trino",
    group: "oss",
    runs: "A coordinator plans; workers stream data between stages in memory. Formerly PrestoSQL (renamed 2020); Presto continues separately.",
    formats: "Iceberg and Delta read/write; Hudi read-only. Plus dozens of other sources.",
    tricks:
      "Dynamic filtering for joins, cost-based optimiser with table statistics, optional file-system cache.",
    goodFor: "Interactive SQL across the lake and other databases at once.",
  },
  {
    id: "flink",
    name: "Apache Flink",
    group: "oss",
    runs: "Streaming-first: a batch job is just a stream that ends.",
    formats: "Iceberg, Paimon and Hudi sinks and sources.",
    tricks: "Stateful, exactly-once processing of unbounded streams.",
    goodFor: "Continuous pipelines that keep tables fresh.",
  },
  {
    id: "starrocks",
    name: "StarRocks",
    group: "oss",
    runs: "MPP analytics database with a fully vectorised engine and cost-based optimiser.",
    formats: "External catalogs for Iceberg, Hudi, Delta and Hive tables.",
    tricks: "Data cache in memory and on local disk; its own fast native tables too.",
    goodFor: "Low-latency dashboards straight on lake tables.",
  },
  {
    id: "dremio",
    name: "Dremio",
    group: "oss",
    runs: "Distributed engine built on Apache Arrow's in-memory columnar format.",
    formats: "Strong Iceberg focus; also reads Delta. Co-developed Apache Polaris with Snowflake.",
    tricks: "Reflections (pre-computed copies it picks automatically) and a results cache.",
    goodFor: "Self-service BI on the lake.",
  },
  {
    id: "duckdb",
    name: "DuckDB",
    group: "single",
    runs: "In-process: a library inside your Python, app or browser. One machine, no server.",
    formats:
      "Iceberg: read by path, read/write via a REST catalog. Delta via delta-kernel-rs (reads, appends). Also its own DuckLake format.",
    tricks: "Vectors of 2,048 values, parallel across all your cores.",
    goodFor: "Laptop analysis, tests, embedded analytics: surprisingly large data on one machine.",
  },
  {
    id: "athena",
    name: "Amazon Athena",
    group: "managed",
    runs: "Serverless SQL; engine v3 is built on Trino and Presto.",
    formats: "Reads and writes Iceberg; also reads Delta and Hudi tables.",
    tricks: "Pay per data scanned: $5 per TB, 10 MB minimum per query. Optional result reuse.",
    goodFor: "Occasional queries on AWS without running anything.",
  },
  {
    id: "bigquery",
    name: "Google BigQuery",
    group: "managed",
    runs: "Serverless; descended from Google's Dremel.",
    formats:
      "Apache Iceberg managed tables (formerly BigLake Iceberg tables) plus external tables.",
    tricks:
      "On-demand $6.25 per TiB scanned (first TiB a month free) or reserved capacity; results cached about 24 hours.",
    goodFor: "Analytics on Google Cloud at any scale.",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    group: "managed",
    runs: "Managed warehouses that scale compute separately from storage.",
    formats:
      "Iceberg tables with Snowflake as the catalog, or an external one (Glue, Open Catalog: managed Polaris).",
    tricks: "Result cache, automatic clustering and its own optimisations.",
    goodFor: "Teams already on Snowflake who want open tables.",
  },
  {
    id: "dbsql",
    name: "Databricks SQL",
    group: "managed",
    runs: "SQL warehouses (serverless recommended) running the Photon engine.",
    formats: "Delta first; Iceberg too.",
    tricks: "Photon (vectorised C++), disk cache on workers' SSDs, query result caches.",
    goodFor: "BI and SQL on a Databricks lakehouse.",
  },
];

const GROUP_LABEL: Record<Group, string> = {
  oss: "Open-source, distributed",
  single: "Single machine",
  managed: "Managed / serverless",
};

export function EngineExplorer() {
  const [s, set] = useSceneState<EnginesState>();
  const shown = ENGINES.filter((e) => s.engineGroup === "all" || e.group === s.engineGroup);
  const e = ENGINES.find((x) => x.id === s.engine) ?? ENGINES[0];
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Same tables, many engines"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.engineGroup}
            options={[
              ["all", "All"],
              ["oss", "Open source"],
              ["single", "Single machine"],
              ["managed", "Managed"],
            ]}
            onChange={(v) => set({ engineGroup: v as EnginesState["engineGroup"] })}
          />
          <div className="flex flex-wrap gap-1.5">
            {shown.map((x) => (
              <motion.button
                key={x.id}
                layout
                type="button"
                onClick={() => set({ engine: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  e.id === x.id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.name}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg font-semibold">{e.name}</p>
                <span className="bg-surface-2 text-muted rounded-full px-2 py-0.5 text-[10px]">
                  {GROUP_LABEL[e.group]}
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm">
                {(
                  [
                    ["How it runs", e.runs],
                    ["Table formats", e.formats],
                    ["Speed tricks", e.tricks],
                    ["Good for", e.goodFor],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="grid gap-0.5 sm:grid-cols-[7.5rem_1fr]">
                    <dt className="text-muted text-xs">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Open format doesn&apos;t mean every feature everywhere: check what each engine can
            write, and which catalogs it can talk to.
          </p>
        </div>
      }
    >
      <p>
        This is the big payoff of open table formats: one copy of the data, and a choice of engines.
        Pipelines in Spark or Flink, dashboards in Trino or StarRocks, a quick look in DuckDB, all
        on the same tables.
      </p>
      <p>
        Under the hood they all do the life-of-a-query steps you just saw. What differs is where
        they run, how you pay, and how much they cache.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Catalog, plan, prune, scan",
    "Every engine looks the table up, plans, skips what it can using metadata, then reads the rest in parallel.",
  ],
  [
    "Reading less beats reading faster",
    "Partition filters, clustering and selecting fewer columns cut the work, and on pay-per-scan engines, the bill.",
  ],
  [
    "Keep filters plain",
    "Wrapping a column in a function can stop the engine from skipping anything.",
  ],
  [
    "Small files hurt",
    "Each file adds metadata, a storage request and a task. Compaction keeps planning cheap.",
  ],
  ["Batches, not rows", "Vectorised execution on columnar data is why modern engines are fast."],
  [
    "Check the plan",
    "EXPLAIN (and EXPLAIN ANALYZE or the Spark UI) shows pushed filters, files read and shuffles.",
  ],
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
        One more thing: engines plan better with statistics, and those often have to be collected on
        purpose (<code>ANALYZE</code>, or Iceberg&apos;s <code>compute_table_stats</code>).
        Spark&apos;s cost-based optimiser is even off by default.
      </p>
      <p>Next: run real SQL on a lakehouse table yourself, right in the browser.</p>
    </StepLayout>
  );
}
