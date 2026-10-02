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
  "idempotent-producer": {
    term: "Idempotent producer",
    definition:
      "A Kafka producer that tags each batch with its producer ID and a sequence number, so the broker can drop retried duplicates. On by default since Kafka 3.0; it only lasts one producer session.",
    module: "delivery-guarantees",
  },
  "kafka-transaction": {
    term: "Kafka transaction",
    definition:
      "Writes to several partitions, plus the consumer offsets they came from, committed or aborted together. Consumers set to read_committed see only committed data. The basis of exactly-once inside Kafka.",
    module: "delivery-guarantees",
  },
  "idempotent-consumer": {
    term: "Idempotent consumer",
    definition:
      "A consumer whose effect is the same if it receives an event twice, usually by recording the IDs it has handled or using upserts. The portable way to cope with at-least-once delivery.",
    module: "delivery-guarantees",
  },
  "stateless-operation": {
    term: "Stateless operation",
    definition:
      "A stream processing step that handles each event on its own, without remembering earlier ones: filter, map, mask, route. Easy to run in parallel and to restart.",
    module: "stateless-processing",
  },
  "processor-topology": {
    term: "Topology",
    definition:
      "The graph of processing steps a stream application runs: source topics, operators such as filter and map, and sink topics. Kafka Streams calls it a processor topology; Flink a job graph.",
    module: "stateless-processing",
  },
  repartition: {
    term: "Repartition",
    definition:
      "Rewriting a stream to an internal topic under a new key so that events with the same new key meet in the same partition before grouping or joining. Triggered by changing the key.",
    module: "stateless-processing",
  },
  "event-time": {
    term: "Event time",
    definition:
      "When something actually happened, usually a timestamp inside the event. Results computed by event time are correct even when events arrive late or out of order.",
    module: "event-time",
  },
  "processing-time": {
    term: "Processing time",
    definition:
      "When the processing system sees an event, by its own clock. Simple and fast, but results depend on delays and change if the same data is replayed.",
    module: "event-time",
  },
  watermark: {
    term: "Watermark",
    definition:
      "A stream processor's running estimate of how far event time has progressed: a watermark of X claims all events before X have arrived. Windows are finalised when it passes their end; later events are late.",
    module: "event-time",
  },
  "stream-window": {
    term: "Window",
    definition:
      "A finite slice of an endless stream, usually by event time, over which a count, sum or other aggregate is computed. Types: tumbling, hopping, sliding and session.",
    module: "windows",
  },
  "tumbling-window": {
    term: "Tumbling window",
    definition:
      "Fixed-size, non-overlapping windows placed back to back, such as every 10 minutes. Each event falls in exactly one.",
    module: "windows",
  },
  "hopping-window": {
    term: "Hopping window",
    definition:
      "Fixed-size windows that start more often than their size, so they overlap: 10-minute windows every 5 minutes put each event in two. Flink, Spark and Beam call these sliding windows.",
    module: "windows",
  },
  "session-window": {
    term: "Session window",
    definition:
      "A window per key that groups events until there's a gap of inactivity longer than a set time, so its length varies. Suits user visits.",
    module: "windows",
  },
  "state-store": {
    term: "State store",
    definition:
      "Where a stream processor keeps memory between events (counts, windows, join tables), usually on local disk or in memory next to the code, backed up so it survives crashes. Kafka Streams uses RocksDB plus a compacted changelog topic.",
    module: "state-joins",
  },
  "stream-table-duality": {
    term: "Stream–table duality",
    definition:
      "A stream of changes can be replayed into a table (the latest value per key), and a table's changes can be read as a stream. Kafka's KStream and KTable are two views of the same data.",
    module: "state-joins",
  },
  "stream-table-join": {
    term: "Stream–table join",
    definition:
      "Enriching each stream event with a lookup in a table, such as adding a customer's tier to a payment. Only stream events trigger output; table updates just change the lookup.",
    module: "state-joins",
  },
  "stream-stream-join": {
    term: "Stream–stream join",
    definition:
      "Matching events from two streams with the same key that occur within a time window of each other, such as a payment and a login within five minutes. Both sides are kept in state for the window.",
    module: "state-joins",
  },
  checkpoint: {
    term: "Checkpoint (stream processing)",
    definition:
      "A consistent snapshot of a streaming job's state together with its position in each input, taken automatically while the job runs. After a crash the job restores it and replays input from those positions.",
    module: "checkpoints",
  },
  "checkpoint-barrier": {
    term: "Checkpoint barrier",
    definition:
      "A marker Flink injects into the data streams. It flows in line with the records; each operator snapshots its state when the barrier passes, so all snapshots describe the same point in the input.",
    module: "checkpoints",
  },
  "transactional-sink": {
    term: "Transactional sink",
    definition:
      "An output that writes each checkpoint's results in a transaction and commits only when the checkpoint completes, so results are never visible twice after a restore. Flink's Kafka sink in EXACTLY_ONCE mode works this way.",
    module: "checkpoints",
  },
  "continuous-query": {
    term: "Continuous query",
    definition:
      "A query over a stream that never finishes: its result keeps updating as new events arrive. Flink SQL calls the inputs and outputs dynamic tables.",
    module: "streaming-sql",
  },
  "materialized-view": {
    term: "Materialised view",
    definition:
      "A stored query result. In streaming systems it is maintained incrementally, applying each change instead of recomputing, so it stays close to up to date: ksqlDB tables, RisingWave and Materialize views, Flink materialized tables.",
    module: "streaming-sql",
  },
} satisfies Record<string, GlossaryEntry>;
