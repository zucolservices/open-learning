# Sources (fact-checked 2026-09)

- Apache Kafka KafkaConsumer javadoc: each partition is assigned to one consumer in a group; ordering is per partition. `log.retention.hours` defaults to 168. Kafka 4.0 (Mar 2025) runs without ZooKeeper (KRaft only). KIP-932 share groups: early access in 4.0, preview in 4.1, production-ready in 4.2 (Feb 2026).
- Amazon SQS developer guide: standard queues are at-least-once with best-effort ordering; FIFO queues give exactly-once processing and ordering per message group ID. Visibility timeout defaults to 30 s (max 12 h). Retention defaults to 4 days (60 s–14 days). Max message size is 1 MiB (since Aug 2025). Dead-letter queue via redrive policy `maxReceiveCount`.
- Amazon Kinesis Data Streams quotas: 1 MB/s or 1,000 records/s write and 2 MB/s read per shard; retention 24 h to 365 days.
- Azure Service Bus docs: sessions for FIFO; dead-letter subqueue `$deadletterqueue`; max delivery count defaults to 10. Azure Event Hubs quotas: retention up to 7 days (Standard) or 90 days (Premium, Dedicated); Kafka protocol support.
- Google Cloud Pub/Sub docs: at-least-once by default; exactly-once delivery for pull subscriptions in-region; ordering keys; dead-letter topics (max delivery attempts default 5, range 5–100); ack deadline default 10 s; seek to a timestamp or snapshot. Pub/Sub Lite shuts down 31 Jan 2027, so it is not listed.
- RabbitMQ docs: streams since 3.9 (2021); classic queue mirroring removed in 4.0 (2024) in favour of quorum queues and streams.
- Little's law (L = λW) for the wait-time estimate; see module 2 sources.
