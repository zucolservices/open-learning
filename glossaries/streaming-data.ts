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
} satisfies Record<string, GlossaryEntry>;
