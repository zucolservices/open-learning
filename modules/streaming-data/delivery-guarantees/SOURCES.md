# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m10-facts.md`.

- Kafka 4.3 Design > Message Delivery Semantics: at most once, at least once, exactly once definitions; consumer offset-before vs after-processing cases; exactly-once with external systems "generally requires cooperation with such systems"; storing offsets with output.
- Idempotent producer (KIP-98): producer ID + per-partition sequence numbers; idempotence "within a single producer session"; default since 3.0 (effectively 3.0.1/3.1.1/3.2.0 after KAFKA-13598); silently disabled by conflicting acks/retries/in-flight settings unless set explicitly.
- Transactions (KIP-98): transactional.id with fencing; initTransactions, beginTransaction, sendOffsetsToTransaction (Kafka 4.0 requires consumer.groupMetadata()), commitTransaction, abortTransaction; commit/abort markers; isolation.level default read_uncommitted; read_committed stops before the first open transaction (LSO). Aborting doesn't rewind the consumer.
- Kafka Streams: KIP-447 in 2.6 (exactly_once_beta), renamed exactly_once_v2 in 3.0 (KIP-732). KIP-890: part 1 in 3.6, part 2 in 4.0 (epoch bump per transaction; fixes hanging transactions). Jepsen Bufstream report: KAFKA-17754 (delayed EndTxn commits/aborts the next transaction), resolved 2026-08-12 via KIP-890 follow-ups.
- Confluent blog (2017): 3% throughput drop vs ordered at-least-once producer (1 KB messages, 100 ms transactions); idempotence impact negligible; transaction cost per transaction.
- Kinesis: duplicates from producer and consumer retries. Pub/Sub: at-least-once default; exactly-once delivery GA 1 Dec 2022 for pull subscriptions in one region, higher latency, publisher retries still duplicate. Event Hubs: at-least-once; Kafka transactions preview (Premium/Dedicated). SQS FIFO: 5-minute deduplication window. Pulsar: broker deduplication off by default.
- Debezium outbox id header usable "to remove duplicate messages".
- The single-event failure scenarios are a simplified model of these rules.
