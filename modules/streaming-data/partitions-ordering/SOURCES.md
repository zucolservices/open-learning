# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m03-facts.md`.

- Kafka 4.3 Introduction: "Topics are partitioned, meaning a topic is spread over a number of "buckets" located on different Kafka brokers… Events with the same event key (e.g., a customer or vehicle ID) are written to the same partition, and Kafka guarantees that any consumer of a given topic-partition will always read that partition's events in exactly the same order as they were written."
- BuiltInPartitioner.partitionForKey: Utils.toPositive(Utils.murmur2(serializedKey)) % numPartitions. murmur2.ts is a port of Utils.murmur2, verified against Kafka's UtilsTest vectors ("21" → −973932308, "foobar" → −790332482, "abc" → 479470107, …).
- Null keys: sticky partitioning (KIP-480, Kafka 2.4); uniform sticky / adaptive partitioning (KIP-794, Kafka 3.3); DefaultPartitioner and UniformStickyPartitioner removed in 4.0.
- Adding partitions: "messages with the same key may be routed to different partitions after the expansion… Kafka will not attempt to automatically redistribute existing data." "Kafka does not currently support reducing the number of partitions for a topic."
- Idempotent producer default since 3.0 (KIP-679); ordering preserved with up to 5 in-flight requests. librdkafka default partitioner: CRC32 (murmur2_random matches Java).
- Amazon MSK partitions per broker (replicas included): 1,000 for m5.large/xlarge, 4,000 for m5.4xlarge+. Kinesis: MD5 of partition key to 128-bit hash ranges; 1 MB/s or 1,000 records/s writes per shard; "hot or cold shards"; on-demand record distribution AUTO. Pub/Sub ordering keys: 1 MBps per key, "hot key", ordering enabled on the subscription. Event Hubs: up to 32 partitions (Basic/Standard), fixed at creation except Premium/Dedicated. Pulsar Key_Shared.
- Order events, lags, merchant traffic shares and partition counts in the simulations are illustrative; partition placement uses the real hash.
