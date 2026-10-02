# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m04-facts.md`.

- KafkaConsumer javadoc / design doc: each partition is consumed by exactly one consumer in a group; every group receives all records; committed offset = next record to read, stored in __consumer_offsets. enable.auto.commit true, auto.commit.interval.ms 5000; commitSync/commitAsync. auto.offset.reset latest (default), earliest, none, by_duration:<ISO8601> (KIP-1106, Kafka 4.0).
- Rebalancing: cooperative incremental (KIP-429, CooperativeStickyAssignor, 2.4.0); static membership (KIP-345, group.instance.id, 2.3.0); default partition.assignment.strategy [RangeAssignor, CooperativeStickyAssignor] (eager until Range is removed). KIP-848 consumer protocol GA in 4.0, enabled on brokers, client opt-in with group.protocol=consumer ("The default value is classic"); server assignors uniform and range.
- session.timeout.ms 45 s (KIP-735, 3.0), heartbeat.interval.ms 3 s, max.poll.interval.ms 300 s, max.poll.records 500. A consumer that misses max.poll.interval.ms leaves the group and triggers a rebalance.
- Lag: kafka-consumer-groups.sh --describe LAG = LOG-END-OFFSET − CURRENT-OFFSET (committed); records-lag-max uses the current position, not the committed offset.
- Share groups (KIP-932): early access 4.0, preview 4.1, production-ready 4.2; per-record acknowledgement; record lock 30 s, delivery limit 5.
- Kinesis KCL leases in DynamoDB; enhanced fan-out 2 MB/s per shard per consumer (20 consumers, 50 on On-demand Advantage). Pub/Sub: subscription as the group, ack deadline 10–600 s. Event Hubs consumer groups (Basic 1, Standard 20, Premium 100, Dedicated 1,000), one reader per partition per group recommended, checkpoints via EventProcessorClient to Blob Storage. Pulsar subscription types Exclusive, Failover, Shared, Key_Shared.
- Confluent blog (Sophie Blee-Goldman, 2020) on stop-the-world vs cooperative rebalancing.
- Simulation capacities (30 events/s per consumer), rebalance pause (3 s) and the commit/crash story are illustrative.
