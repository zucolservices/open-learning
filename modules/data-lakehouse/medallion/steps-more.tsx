"use client";

import { motion } from "motion/react";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Term } from "@/toolkit/glossary/term";

/* 7 ─ The toolbox ------------------------------------------------------------------------------ */

const GROUPS: { title: string; blurb: string; tools: [string, string][] }[] = [
  {
    title: "Transform",
    blurb: "Write the logic that turns one layer into the next.",
    tools: [
      [
        "dbt",
        "Each model is a SELECT; ref() builds the DAG. Data tests and unit tests. The new Rust-based engine (formerly Fusion) went GA as dbt v2 in September 2026.",
      ],
      [
        "Spark",
        "Python or SQL jobs, for anything from simple cleaning to heavy joins and streaming.",
      ],
      [
        "Lakeflow pipelines",
        "Databricks' declarative pipelines (formerly Delta Live Tables), with expectations. The open-source core became Spark Declarative Pipelines in Spark 4.1; expectations stay Databricks-only.",
      ],
    ],
  },
  {
    title: "Orchestrate",
    blurb: "Decide what runs when, retry failures, run backfills.",
    tools: [
      [
        "Apache Airflow",
        "DAGs of tasks on a schedule. Airflow 3 runs backfills from the scheduler (UI, API or CLI), renamed datasets to assets, and no longer catches up on missed runs by default.",
      ],
      [
        "Dagster",
        "Built around assets (the tables you want to exist), with partitions, backfills and asset checks for data quality.",
      ],
    ],
  },
  {
    title: "Check quality",
    blurb: "Catch bad data before anyone reports on it.",
    tools: [
      [
        "dbt data tests",
        "Four built in: unique, not_null, accepted_values and relationships, plus your own SQL.",
      ],
      ["GX Core", "Great Expectations' open-source Python library of data checks."],
      ["Soda Core", "An open-source library and CLI for checking data against data contracts."],
    ],
  },
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The toolbox"
      title="Who does what"
      stage={
        <div className="grid flex-1 content-center gap-4">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * gi }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              <p className="font-semibold">{g.title}</p>
              <p className="text-muted text-xs">{g.blurb}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {g.tools.map(([n, d]) => (
                  <div key={n} className="bg-bg/40 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium">{n}</p>
                    <p className="text-muted mt-0.5 text-xs">{d}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The medallion layers describe <em>how trustworthy</em> data is, not which tool made it. Any
        of these can build any layer.
      </p>
      <p>
        Three layers is the simplest form. Real setups often add a landing zone before bronze, or
        several gold layers, one per domain (finance, marketing).
      </p>
      <p className="text-muted text-sm">
        Whatever the tools, a scheduler or <Term id="dag">DAG</Term> decides the order, and every
        job should be safe to rerun.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Bronze keeps what arrived",
    "Raw, append-only, plus when and where it came from. It's your undo button.",
  ],
  [
    "Silver makes it correct",
    "Types, standard values, one row per thing, rules checked once for everyone.",
  ],
  ["Gold answers questions", "Aggregates and models shaped for a dashboard, a team or a model."],
  [
    "Rules need a plan for failure",
    "Warn, drop, fail or quarantine: choose per rule, and watch the metrics.",
  ],
  [
    "Declare dependencies",
    "Say what each table reads; the tool works out the order and the parallelism.",
  ],
  [
    "Rerun without fear",
    "Replace a period's output (or MERGE on keys) so retries and backfills are safe, and rebuild downstream too.",
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
      <p>You can now design a pipeline that&apos;s easy to trust and easy to repair.</p>
      <p>
        Next: <em>query engines</em>, the software that actually reads these tables when someone
        runs a query.
      </p>
    </StepLayout>
  );
}
