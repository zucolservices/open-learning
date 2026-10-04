/** The jobs this track covered, and the kinds of tools that do each one. */

export type Col = "open" | "cloud" | "commercial";
export const COLS: { id: Col; label: string }[] = [
  { id: "open", label: "Open source and standards" },
  { id: "cloud", label: "Built into your platform" },
  { id: "commercial", label: "Commercial platforms" },
];

export interface Job {
  id: string;
  label: string;
  module: string;
  tools: Record<Col, string[]>;
}

export const JOBS: Job[] = [
  {
    id: "rules",
    label: "Rules and tests",
    module: "Modules 3, 5",
    tools: {
      open: [
        "dbt data tests",
        "Great Expectations (GX Core)",
        "Deequ / PyDeequ",
        "pandera",
        "Soda Core (source-available)",
      ],
      cloud: [
        "AWS Glue Data Quality (DQDL)",
        "Databricks Lakeflow pipeline expectations",
        "Snowflake data metric functions",
        "Google Knowledge Catalog data quality scans",
        "Microsoft Purview data quality",
      ],
      commercial: ["Soda's platform", "Most observability platforms add rules"],
    },
  },
  {
    id: "contracts",
    label: "Contracts and schemas",
    module: "Modules 8, 9",
    tools: {
      open: [
        "Open Data Contract Standard",
        "datacontract-cli",
        "dbt model contracts",
        "Apicurio Registry",
      ],
      cloud: ["AWS Glue Schema Registry", "Azure Event Hubs Schema Registry"],
      commercial: [
        "Confluent Schema Registry (source-available, plus Confluent Cloud)",
        "Soda contracts",
      ],
    },
  },
  {
    id: "observe",
    label: "Observability and anomalies",
    module: "Modules 12, 13",
    tools: {
      open: ["Elementary", "dbt source freshness"],
      cloud: [
        "Databricks data quality monitoring",
        "AWS Glue DQ anomaly detection",
        "Snowflake data metric functions",
      ],
      commercial: [
        "Monte Carlo",
        "Bigeye",
        "Anomalo",
        "Sifflet",
        "Acceldata",
        "Metaplane (Datadog)",
      ],
    },
  },
  {
    id: "lineage",
    label: "Lineage",
    module: "Module 14",
    tools: {
      open: ["OpenLineage", "Marquez", "dbt's DAG"],
      cloud: [
        "Databricks Unity Catalog",
        "Microsoft Purview",
        "Google Knowledge Catalog",
        "AWS SageMaker Catalog",
      ],
      commercial: ["Lineage inside observability platforms and data catalogues"],
    },
  },
  {
    id: "recon",
    label: "Reconciliation",
    module: "Module 17",
    tools: {
      open: ["dbt-audit-helper", "reladiff", "Google Data Validation Tool"],
      cloud: ["AWS DMS data validation"],
      commercial: ["Datafold"],
    },
  },
  {
    id: "entity",
    label: "Entity resolution",
    module: "Module 16",
    tools: {
      open: ["Splink", "dedupe", "Zingg (AGPL)"],
      cloud: [],
      commercial: ["Master data management suites"],
    },
  },
  {
    id: "ml",
    label: "ML data checks",
    module: "Module 19",
    tools: {
      open: ["TensorFlow Data Validation", "Evidently"],
      cloud: ["Model monitoring in cloud ML platforms"],
      commercial: ["ML observability platforms"],
    },
  },
];

export const EVENTS: [string, string][] = [
  ["Apr 2025", "Datadog acquires Metaplane, a data observability start-up."],
  [
    "Jan 2026",
    "Soda Core 4 leads with data contracts and moves to the Elastic License (source-available).",
  ],
  ["Apr 2026", "Google renames Dataplex Universal Catalog to Knowledge Catalog."],
  [
    "May–Jun 2026",
    "Fivetran becomes steward of GX Core; GX Cloud goes to FICO and closes to the public on 1 June; Fivetran and dbt Labs merge.",
  ],
];
