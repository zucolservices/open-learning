import type { GlossaryEntry } from "./types";

/** Streaming Data Systems track glossary. `module` slugs refer to this track. */
export const streamingData = {
  "bounded-data": {
    term: "Bounded data",
    definition:
      "A dataset with an end, such as yesterday's payments or a file: you can read all of it and then compute an answer. Batch processing works on bounded data.",
    module: "batch-vs-streams",
  },
  "unbounded-data": {
    term: "Unbounded data",
    definition:
      "Data that keeps arriving with no end, such as payments, clicks or sensor readings. Stream processing is designed for it (Tyler Akidau: an engine \u201cdesigned with infinite data sets in mind\u201d).",
    module: "batch-vs-streams",
  },
  "lambda-architecture": {
    term: "Lambda architecture",
    definition:
      "Running two pipelines side by side: a slow, complete batch layer and a fast, approximate real-time layer, merged when queried. Described by Nathan Marz in 2011; costly because the logic is written twice.",
    module: "batch-vs-streams",
  },
  "kappa-architecture": {
    term: "Kappa architecture",
    definition:
      "One streaming pipeline only; to recompute, replay the retained log through a new version of the job. Proposed by Jay Kreps in 2014.",
    module: "batch-vs-streams",
  },
  event: {
    term: "Event (record, message)",
    definition:
      "A record that something happened, such as a payment. In Kafka it has a key, a value, a timestamp and optional headers. Events state facts, so they aren't changed once written.",
    module: "events-logs-topics",
  },
  "append-only-log": {
    term: "Append-only log",
    definition:
      "An ordered sequence of records where new ones are only added at the end and old ones are never changed. Readers track their own position in it and can re-read. The core data structure of Kafka and its relatives.",
    module: "events-logs-topics",
  },
  topic: {
    term: "Topic",
    definition:
      "A named log of related events, such as payments, that producers write to and consumers read from. Kafka keeps events for the topic's retention period whether or not they've been read.",
    module: "events-logs-topics",
  },
  producer: {
    term: "Producer",
    definition: "A program that writes (appends) events to a topic.",
    module: "events-logs-topics",
  },
  consumer: {
    term: "Consumer",
    definition:
      "A program that reads events from a topic, keeping track of its own position (offset). Many consumers can read the same topic independently.",
    module: "events-logs-topics",
  },
  "stream-partition": {
    term: "Partition (stream)",
    definition:
      "One of the ordered logs a topic is split into, so it can be spread across machines and read in parallel. Order is guaranteed within a partition, not across partitions. Kinesis calls them shards.",
    module: "partitions-ordering",
  },
  "partition-key": {
    term: "Partition key",
    definition:
      "The part of an event used to choose its partition: Kafka hashes it (murmur2) and takes the remainder by the partition count. Events with the same key land in the same partition, in order.",
    module: "partitions-ordering",
  },
  "hot-partition": {
    term: "Hot partition (hot key)",
    definition:
      "A partition that gets far more traffic than the others because one key, such as a huge merchant, is a large share of events. Adding partitions doesn't help, since a key always maps to one partition.",
    module: "partitions-ordering",
  },
  "committed-offset": {
    term: "Committed offset",
    definition:
      "The position a consumer group has saved for a partition: the next record to read. After a crash or rebalance, reading resumes from here. Kafka stores it in the internal __consumer_offsets topic.",
    module: "consumer-groups",
  },
  rebalance: {
    term: "Rebalance",
    definition:
      "Reassigning a topic's partitions among a consumer group's members when one joins, leaves or stops responding. Eager rebalances pause the whole group; cooperative ones move only what changes.",
    module: "consumer-groups",
  },
  "consumer-lag": {
    term: "Consumer lag",
    definition:
      "How far a consumer group is behind on a partition: the newest offset minus the committed offset. Growing lag means events arrive faster than they're processed.",
    module: "consumer-groups",
  },
  "partition-leader": {
    term: "Partition leader",
    definition:
      "The broker that handles all writes (and by default reads) for a partition. Follower brokers copy from it; if it fails, an in-sync follower takes over.",
    module: "replication-durability",
  },
  "in-sync-replicas": {
    term: "In-sync replicas (ISR)",
    definition:
      "The leader plus the followers that are keeping up with it (in Kafka, within 30 seconds by default). Only they can be elected leader without losing committed data.",
    module: "replication-durability",
  },
  acks: {
    term: "acks",
    definition:
      "The producer setting for when a write counts as done: 0 (don't wait), 1 (the leader has it) or all (every in-sync replica has it). Kafka's Java producer defaults to all since version 3.0.",
    module: "replication-durability",
  },
  "min-insync-replicas": {
    term: "min.insync.replicas",
    definition:
      "The fewest in-sync replicas a partition must have to accept acks=all writes. Below it, writes are refused with an error instead of being risked. Recommended: 2 with a replication factor of 3.",
    module: "replication-durability",
  },
  "unclean-leader-election": {
    term: "Unclean leader election",
    definition:
      "Letting a replica that has fallen behind become leader when no in-sync replica is left. The partition comes back sooner but loses the data that replica never copied. Off by default in Kafka (on by default in Amazon MSK without tiered storage).",
    module: "replication-durability",
  },
  "retention-period": {
    term: "Retention",
    definition:
      "How long (retention.ms, 7 days by default) or how much (retention.bytes, per partition, unlimited by default) a topic keeps before deleting its oldest segments, whether or not anyone has read them.",
    module: "retention-compaction",
  },
  "log-segment": {
    term: "Log segment",
    definition:
      "One file of a partition's log. Kafka starts a new segment every 1 GiB or 7 days by default, and deletes or compacts whole closed segments, never the one being written.",
    module: "retention-compaction",
  },
  "log-compaction": {
    term: "Log compaction",
    definition:
      "A cleanup policy that keeps at least the latest record for each key and removes older ones, so a topic behaves like a table of current values. Offsets never change, and order is kept.",
    module: "retention-compaction",
  },
  tombstone: {
    term: "Tombstone",
    definition:
      "A record with a key and a null value, telling a compacted topic to delete that key. The tombstone itself is removed after delete.retention.ms (1 day by default).",
    module: "retention-compaction",
  },
  "tiered-storage": {
    term: "Tiered storage",
    definition:
      "Keeping recent log segments on broker disks and moving older ones to cheap object storage such as S3, where consumers can still read them. Production-ready in Apache Kafka since 3.9.",
    module: "retention-compaction",
  },
  "kafka-protocol": {
    term: "Kafka protocol",
    definition:
      "The wire protocol Kafka clients use to talk to brokers. Platforms that speak it (Redpanda, Amazon MSK, Confluent, Azure Event Hubs' Kafka endpoint, WarpStream…) work with existing Kafka client code, though not always with every feature.",
    module: "platforms-compared",
  },
  "managed-kafka": {
    term: "Managed Kafka",
    definition:
      "Apache Kafka run by a provider (Amazon MSK, Confluent Cloud, Google Managed Service for Apache Kafka, Aiven): they handle brokers, patching and failures; you still choose sizes, topics and partitions.",
    module: "platforms-compared",
  },
  "transaction-log": {
    term: "Transaction log",
    definition:
      "The database's own ordered record of every committed change, kept for crash recovery and replication: MySQL's binlog, PostgreSQL's write-ahead log (WAL). Change data capture reads it.",
    module: "cdc-outbox",
  },
  "replication-slot": {
    term: "Replication slot",
    definition:
      "A PostgreSQL bookmark that keeps write-ahead log on disk until a consumer such as Debezium has read it. A stopped consumer makes it keep growing, which can fill the disk unless max_slot_wal_keep_size is set.",
    module: "cdc-outbox",
  },
  schema: {
    term: "Schema",
    definition:
      "A formal description of an event's shape: its fields, their types and which are optional. Producers write with one and consumers read with one; they needn't be the same version.",
    module: "schemas-evolution",
  },
  "backward-compatible": {
    term: "Backward compatible",
    definition:
      "A schema change where consumers using the new schema can still read data written with the old one, such as adding a field with a default. Upgrade consumers first. Confluent Schema Registry's default.",
    module: "schemas-evolution",
  },
  "forward-compatible": {
    term: "Forward compatible",
    definition:
      "A schema change where consumers still on the old schema can read data written with the new one, such as adding a field old readers ignore. Upgrade producers first. FULL compatibility means both.",
    module: "schemas-evolution",
  },
} satisfies Record<string, GlossaryEntry>;
