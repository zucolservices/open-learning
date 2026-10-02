export type Kind = "olap" | "search" | "warehouse" | "lakehouse";

/** When an event becomes queryable, by path. Seconds; documented defaults or published figures. */
export const LANES: {
  id: string;
  name: string;
  short: string;
  seconds: number;
  label: string;
  kind: Kind;
  note: string;
}[] = [
  {
    id: "es",
    short: "Elasticsearch",
    name: "Elasticsearch / OpenSearch",
    seconds: 1,
    label: "~1 s",
    kind: "search",
    note: "Default index refresh every second.",
  },
  {
    id: "ch",
    short: "ClickHouse",
    name: "ClickHouse (batched inserts)",
    seconds: 1,
    label: "~1 s",
    kind: "olap",
    note: "Rows are visible as soon as an insert finishes; the docs suggest about one insert a second.",
  },
  {
    id: "pinot",
    short: "Pinot / Druid",
    name: "Apache Pinot / Druid",
    seconds: 3,
    label: "seconds",
    kind: "olap",
    note: 'Pinot: queryable "within seconds of publication". Druid: queryable as soon as rows reach a real-time task\'s segment.',
  },
  {
    id: "zomato",
    short: "Zomato, ClickHouse",
    name: "Zomato logs on ClickHouse",
    seconds: 5,
    label: "≤ 5 s",
    kind: "olap",
    note: 'Batches of up to 20,000 messages, "ensuring a maximum lag of 5 seconds" (2023).',
  },
  {
    id: "snowpipe",
    short: "Snowpipe Streaming",
    name: "Snowpipe Streaming",
    seconds: 5,
    label: "as low as 5 s",
    kind: "warehouse",
    note: '"As low as 5 seconds ingest-to-queryable latency."',
  },
  {
    id: "dyn",
    short: "Dynamic table",
    name: "Snowflake dynamic table",
    seconds: 60,
    label: "≥ 60 s",
    kind: "warehouse",
    note: '"The minimum target lag is 60 seconds."',
  },
  {
    id: "redpanda",
    short: "Redpanda Iceberg",
    name: "Redpanda Iceberg Topics",
    seconds: 60,
    label: "1 min",
    kind: "lakehouse",
    note: "Default target lag one minute.",
  },
  {
    id: "iceberg",
    short: "Iceberg Kafka sink",
    name: "Iceberg Kafka Connect sink",
    seconds: 300,
    label: "5 min",
    kind: "lakehouse",
    note: "Default commit interval five minutes.",
  },
  {
    id: "zold",
    short: "Zomato, S3 + Trino",
    name: "Zomato's earlier S3 + Trino attempt",
    seconds: 600,
    label: "5–10 min",
    kind: "lakehouse",
    note: "Files on S3 queried with Trino lagged 5 to 10 minutes behind.",
  },
];

export const MIN_S = 0.5;
export const MAX_S = 2400;

/** Position on a log-scale time axis, 0..1. */
export function pos(seconds: number) {
  return (Math.log(seconds) - Math.log(MIN_S)) / (Math.log(MAX_S) - Math.log(MIN_S));
}
