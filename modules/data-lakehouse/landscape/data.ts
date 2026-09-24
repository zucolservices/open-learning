/** The Rosetta stone: one architecture, six ways to build it (names verified September 2026). */

export const PLATFORMS = [
  { id: "aws", label: "AWS" },
  { id: "gcp", label: "Google Cloud" },
  { id: "azure", label: "Azure & Fabric" },
  { id: "databricks", label: "Databricks" },
  { id: "snowflake", label: "Snowflake" },
  { id: "oss", label: "Open source" },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];

export const BLOCKS: {
  id: string;
  label: string;
  stage: "ingest" | "store" | "process" | "serve" | "govern";
}[] = [
  { id: "cdc", label: "Database changes (CDC)", stage: "ingest" },
  { id: "streaming", label: "Event streams", stage: "ingest" },
  { id: "storage", label: "Object storage", stage: "store" },
  { id: "tables", label: "Tables", stage: "store" },
  { id: "catalog", label: "Catalog", stage: "store" },
  { id: "spark", label: "Pipelines (Spark & co.)", stage: "process" },
  { id: "orchestration", label: "Orchestration", stage: "process" },
  { id: "sql", label: "SQL engine / warehouse", stage: "serve" },
  { id: "bi", label: "BI & dashboards", stage: "serve" },
  { id: "governance", label: "Access control & governance", stage: "govern" },
];

export const ROSETTA: Record<string, Record<PlatformId, string>> = {
  cdc: {
    aws: "AWS DMS",
    gcp: "Datastream",
    azure: "Fabric mirroring · Copy job",
    databricks: "Lakeflow Connect",
    snowflake: "Partner connectors",
    oss: "Debezium",
  },
  streaming: {
    aws: "Kinesis · MSK · Data Firehose",
    gcp: "Pub/Sub · Managed Kafka",
    azure: "Event Hubs · Eventstreams",
    databricks: "Structured Streaming",
    snowflake: "Snowpipe Streaming",
    oss: "Apache Kafka",
  },
  storage: {
    aws: "Amazon S3",
    gcp: "Cloud Storage",
    azure: "ADLS Gen2 · OneLake",
    databricks: "Your cloud's storage",
    snowflake: "Managed, or your bucket",
    oss: "Ceph RGW · SeaweedFS · Garage",
  },
  tables: {
    aws: "S3 Tables (Iceberg)",
    gcp: "Iceberg managed tables",
    azure: "Delta (+ Iceberg view)",
    databricks: "Delta (+ Iceberg)",
    snowflake: "Iceberg tables",
    oss: "Iceberg · Delta · Hudi · Paimon",
  },
  catalog: {
    aws: "Glue Data Catalog",
    gcp: "Lakehouse runtime catalog",
    azure: "OneLake catalog · Unity Catalog",
    databricks: "Unity Catalog",
    snowflake: "Horizon · Open Catalog",
    oss: "Polaris · Lakekeeper · Nessie",
  },
  spark: {
    aws: "EMR · Glue",
    gcp: "Managed Spark · Dataflow",
    azure: "Databricks · Fabric Spark",
    databricks: "Databricks Spark (Photon)",
    snowflake: "Snowpark",
    oss: "Apache Spark · Flink",
  },
  orchestration: {
    aws: "MWAA · Step Functions",
    gcp: "Managed Airflow · Dataform",
    azure: "Data Factory · Airflow job",
    databricks: "Lakeflow Jobs",
    snowflake: "Tasks",
    oss: "Airflow · Dagster",
  },
  sql: {
    aws: "Athena · Redshift",
    gcp: "BigQuery",
    azure: "Fabric Warehouse · Databricks SQL",
    databricks: "Databricks SQL",
    snowflake: "Snowflake warehouses",
    oss: "Trino · StarRocks · DuckDB",
  },
  bi: {
    aws: "Quick Sight",
    gcp: "Looker",
    azure: "Power BI",
    databricks: "Dashboards · Genie",
    snowflake: "Partner BI tools",
    oss: "Superset · Metabase",
  },
  governance: {
    aws: "Lake Formation",
    gcp: "BigQuery security · Knowledge Catalog",
    azure: "OneLake security · Purview",
    databricks: "Unity Catalog",
    snowflake: "Horizon",
    oss: "Apache Ranger",
  },
};
