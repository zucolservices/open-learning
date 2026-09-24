"use client";

import { motion } from "motion/react";
import { StepLayout } from "@/toolkit/layout/step-layout";

/* 7 ─ The toolbox ------------------------------------------------------------------------------ */

const GROUPS: { title: string; tools: [string, string][] }[] = [
  {
    title: "Semantic layers",
    tools: [
      [
        "dbt Semantic Layer",
        "Powered by MetricFlow, open source (Apache 2.0) since October 2025; the hosted service is paid.",
      ],
      ["Cube", "Open-source semantic layer with caching and APIs for BI and apps."],
      ["LookML", "Looker's modelling language for metrics and dimensions."],
      ["Metric views / semantic views", "Built into Databricks Unity Catalog and Snowflake."],
      [
        "Apache Ossie",
        "Formerly Open Semantic Interchange (OSI): a shared format for moving definitions between tools.",
      ],
    ],
  },
  {
    title: "Fast dashboards",
    tools: [
      [
        "Power BI Direct Lake",
        "In Microsoft Fabric, loads Delta tables from OneLake into memory without an import copy.",
      ],
      ["BigQuery BI Engine", "In-memory cache that speeds up BI queries."],
      ["Gold aggregates", "Pre-computed tables and materialised views, on any platform."],
    ],
  },
  {
    title: "Features for ML",
    tools: [
      ["Feast", "Open-source feature store with point-in-time joins."],
      [
        "Databricks Feature Engineering",
        "Feature tables in Unity Catalog; online store on Lakebase (Postgres).",
      ],
      [
        "SageMaker Feature Store",
        "Offline store in your S3 bucket (Glue or Iceberg format), plus an online store.",
      ],
      [
        "Google Cloud feature store",
        "Uses BigQuery tables as the offline store (now under Agent Platform).",
      ],
    ],
  },
  {
    title: "Vector search",
    tools: [
      [
        "Databricks AI Search",
        "Formerly Vector Search; indexes sync from Delta tables using the change feed.",
      ],
      ["BigQuery vector search", "VECTOR_SEARCH and vector indexes inside BigQuery."],
      [
        "Snowflake Cortex Search",
        "Managed hybrid (vector + keyword) search; embeddings handled for you.",
      ],
      [
        "Amazon S3 Vectors",
        "Vector buckets and indexes in S3 (GA December 2025), for cheap, less frequent queries.",
      ],
      [
        "pgvector · Lance",
        "Vector search in Postgres; Lance, an open columnar format for multimodal AI data.",
      ],
    ],
  },
  {
    title: "Apps and operations",
    tools: [
      [
        "Lakebase · hybrid tables",
        "Managed Postgres in Databricks; row-store hybrid tables in Snowflake, for fast lookups.",
      ],
      [
        "Reverse ETL",
        "Push gold data into CRMs and ad tools: Fivetran Activations (formerly Census), Hightouch.",
      ],
    ],
  },
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The toolbox"
      title="Who serves what"
      stage={
        <div className="grid flex-1 content-center gap-3">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * gi }}
              className="border-line bg-surface rounded-xl border p-3"
            >
              <p className="text-sm font-semibold">{g.title}</p>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {g.tools.map(([n, d]) => (
                  <p key={n} className="text-xs">
                    <span className="font-medium">{n}</span>
                    <span className="text-muted">: {d}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each serving layer has open-source options and versions built into the big platforms. This
        corner of the landscape changes fast: several of these names changed in the past year.
      </p>
      <p className="text-muted text-sm">
        Whatever you pick, the rule from this module holds: gold tables stay the source of truth,
        and every layer here is rebuilt from them.
      </p>
    </StepLayout>
  );
}
