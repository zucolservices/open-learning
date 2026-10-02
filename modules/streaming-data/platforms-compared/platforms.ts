/**
 * Platform profiles for the map. x: who runs it (0 you … 2 fully serverless); kafka: speaks the Kafka protocol.
 * Prices are dated list prices (2 Oct 2026); see SOURCES.md.
 */
export interface Platform {
  id: string;
  name: string;
  x: number;
  kafka: "yes" | "partial" | "no";
  /** Label and position on the map, in percent. */
  short: string;
  left: number;
  top: number;
  what: string;
  rows: [string, string][];
}

export const PLATFORMS: Platform[] = [
  {
    id: "kafka",
    short: "Kafka",
    left: 14,
    top: 12,
    name: "Apache Kafka",
    x: 0,
    kafka: "yes",
    what: "The original open-source log (Apache 2.0, latest 4.3). You run the brokers, KRaft controllers, upgrades and disks.",
    rows: [
      ["Ordering unit", "Partition"],
      ["Keeps events", "As long as you configure, forever with tiered storage"],
      ["Price", "Free software; you pay for servers, disks and people"],
      ["India", "Anywhere you can run servers"],
    ],
  },
  {
    id: "redpanda",
    short: "Redpanda",
    left: 30,
    top: 27,
    name: "Redpanda",
    x: 0.35,
    kafka: "yes",
    what: "A Kafka-compatible broker in C++: one binary, Raft per partition, no JVM. Community Edition is source-available (BSL); a Redpanda Cloud Serverless tier exists.",
    rows: [
      ["Ordering unit", "Partition"],
      ["Licence", "BSL 1.1 (becomes Apache 2.0 after four years)"],
      ["Price", "Serverless from $0.10/hour + per-GB (March 2025 list)"],
      ["India", "Serverless in AWS Mumbai"],
    ],
  },
  {
    id: "pulsar",
    short: "Pulsar",
    left: 18,
    top: 82,
    name: "Apache Pulsar",
    x: 0.15,
    kafka: "no",
    what: "Brokers plus BookKeeper storage, built-in multi-tenancy and geo-replication (Apache 2.0, 4.0 LTS). StreamNative sells it managed.",
    rows: [
      ["Ordering unit", "Partition / key (Key_Shared)"],
      ["Keeps events", "Deletes acknowledged messages unless retention is set"],
      ["Protocol", "Its own; Kafka support via StreamNative"],
      ["India", "Self-run anywhere"],
    ],
  },
  {
    id: "msk",
    short: "MSK",
    left: 44,
    top: 12,
    name: "Amazon MSK",
    x: 1,
    kafka: "yes",
    what: "Real Apache Kafka that AWS runs: provisioned brokers (Standard or Express) or MSK Serverless.",
    rows: [
      ["Ordering unit", "Partition"],
      [
        "Price",
        "m7g.large broker $0.1458/hour in Mumbai ($0.204 us-east-1); Serverless $0.79/cluster-hour + per GB in Mumbai",
      ],
      ["Extras", "MSK Connect, tiered storage"],
      ["India", "Mumbai and Hyderabad"],
    ],
  },
  {
    id: "confluent",
    short: "Confluent",
    left: 72,
    top: 12,
    name: "Confluent Cloud",
    x: 1.3,
    kafka: "yes",
    what: "Kafka from its creators' company (IBM-owned since March 2026), on AWS, Google Cloud and Azure, with Flink, connectors and schema registry.",
    rows: [
      ["Ordering unit", "Partition"],
      ["Price", "Standard: $0.75 per eCKU-hour + $0.035–0.05/GB"],
      ["Note", "Freight clusters are cheaper but lack idempotent producers and transactions"],
      ["India", "Freight runs in AWS Mumbai; check other cluster types per region"],
    ],
  },
  {
    id: "gmk",
    short: "Google Kafka",
    left: 58,
    top: 27,
    name: "Google Managed Kafka",
    x: 1.1,
    kafka: "yes",
    what: "Google Cloud's Managed Service for Apache Kafka, generally available since November 2024.",
    rows: [
      ["Ordering unit", "Partition"],
      ["Price", "$0.09 per DCU-hour in us-central1 (1 vCPU + 4 GiB)"],
      ["Replaces", "Pub/Sub Lite, which shuts down on 31 January 2027"],
      ["India", "Mumbai and Delhi"],
    ],
  },
  {
    id: "eventhubs",
    short: "Event Hubs",
    left: 70,
    top: 50,
    name: "Azure Event Hubs",
    x: 1.65,
    kafka: "partial",
    what: "Azure's streaming service, with a Kafka-protocol endpoint on Standard and above.",
    rows: [
      ["Ordering unit", "Partition"],
      [
        "Price",
        "Standard $0.03 per throughput-unit-hour + $0.028 per million events; Premium $1.438 per PU-hour in Central India",
      ],
      [
        "Kafka gaps",
        "Transactions and Kafka Streams still in preview (Premium/Dedicated); gzip only",
      ],
      ["India", "Central India and other Indian regions"],
    ],
  },
  {
    id: "kinesis",
    short: "Kinesis",
    left: 62,
    top: 82,
    name: "Amazon Kinesis",
    x: 1.95,
    kafka: "no",
    what: "AWS's own streaming service: streams split into shards, on-demand or provisioned.",
    rows: [
      ["Ordering unit", "Shard (by partition key)"],
      ["Keeps events", "24 hours, up to 365 days"],
      ["Price", "Shard $0.0175/hour in Mumbai; on-demand writes $0.1023/GB"],
      ["India", "Mumbai (on-demand scales to 200 MB/s by default there)"],
    ],
  },
  {
    id: "pubsub",
    short: "Pub/Sub",
    left: 86,
    top: 82,
    name: "Google Pub/Sub",
    x: 2.25,
    kafka: "no",
    what: "A global, fully serverless messaging service: topics and subscriptions, no partitions to manage.",
    rows: [
      ["Ordering unit", "Ordering key (optional)"],
      ["Keeps events", "Up to 31 days"],
      ["Price", "$40 per TiB after 10 GiB a month free"],
      ["India", "Global service; storage can be pinned to regions"],
    ],
  },
  {
    id: "diskless",
    short: "Diskless",
    left: 86,
    top: 27,
    name: "Diskless Kafka",
    x: 1.45,
    kafka: "yes",
    what: "Kafka-compatible brokers that write straight to object storage: WarpStream (Confluent), AutoMQ, Aiven Inkless (GA February 2026).",
    rows: [
      [
        "Trade-off",
        "Much cheaper storage and no cross-zone replication traffic, for higher latency",
      ],
      ["Upstream", "KIP-1150 accepted, not yet in Apache Kafka"],
      ["Fit", "High-volume logs and analytics feeds"],
      ["India", "Depends on the vendor"],
    ],
  },
];
