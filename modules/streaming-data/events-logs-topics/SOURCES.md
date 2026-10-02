# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m02-facts.md`.

- Kafka docs (4.3) Introduction: "an event has a key, value, timestamp, and optional metadata headers"; also called record or message; example Event key "Alice", value "Made a payment of $200 to Bob", timestamp "Jun. 25, 2020 at 2:06 p.m."; "Events are organized and durably stored in topics"; topics "always multi-producer and multi-subscriber"; "events are not deleted after consumption"; performance "effectively constant with respect to data size". Default retention 7 days (retention.ms 604800000).
- KafkaConsumer javadoc: numerical offset per record in a partition, the consumer's position; offsets not guaranteed consecutive. Design doc: "A consumer can deliberately rewind back to an old offset and re-consume data. This violates the common contract of a queue". offsetsForTimes + seek for time-based replay. Share groups (Kafka 4.x).
- message.max.bytes default 1048588: largest record batch (after compression). message.timestamp.type CreateTime (default) / LogAppendTime.
- Kinesis: shards, records (sequence number, partition key, data), retention 24 h default up to 365 days; record size 1 MiB default, up to 10 MiB (Oct 2025). Pub/Sub: subscription retention default 7 days, max 31; seek to time or snapshot. Event Hubs: "an append-only log… equivalent to a Kafka topic"; offset and sequence number; retention up to 1 day (Basic), 7 (Standard), 90 (Premium/Dedicated). Pulsar: BookKeeper ledgers, cursors; brokers delete acknowledged messages unless retention is configured. Redpanda: single binary, Kafka API compatible, C++.
- SQS: consumers delete messages; retention up to 14 days. RabbitMQ Streams (3.9, Jul 2021): "Consuming from a stream does not remove messages."
- LinkedIn Engineering (25 Jun 2025): over 32T records/day, 17 PB/day, 400K topics (introducing Northguard). PhonePe Tech Blog (31 Oct 2023): Kafka carries "approximately 100 billion events per day".
- The payment events and names in the simulation are illustrative.
