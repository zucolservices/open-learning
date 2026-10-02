# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m14-facts.md`.

- Kafka Streams 4.3 core concepts: stream–table duality (stream as a table's changelog; table as a snapshot). Architecture: RocksDB "the default storage engine for persistent stores", in-memory stores available; changelog topics with log compaction; num.standby.replicas default 0 (1 recommended). DSL joins: KStream–KStream (JoinWindows), KStream–KTable ("Only input records for the left side (stream) trigger the join"), KStream–GlobalKTable (no co-partitioning; "not a temporal join"), KTable–KTable incl. foreign-key joins (2.4, KIP-213; inner/left); co-partitioning requirement; versioned state stores and timestamped stream–table joins (3.5, KIP-889/KIP-914); join grace (3.6, KIP-923).
- Flink 2.3: keyed state (ValueState, ListState, MapState); default HashMapStateBackend, EmbeddedRocksDBStateBackend; disaggregated state (ForSt) "not fully available for production"; state TTL "Only TTLs in reference to processing time are currently supported"; Flink SQL regular joins keep state; table.exec.state.ttl default 0 (never cleaned); STATE_TTL hint; interval, temporal and lookup joins.
- Spark 4.2: stream–stream joins — watermark + time constraint required for outer/semi joins; inner without them "will keep growing indefinitely"; default HDFS-backed state store, RocksDB opt-in (3.2+); changelog checkpointing 3.5.0 (off by default).
- ksqlDB: streams vs tables; stream–stream joins need WITHIN; co-partitioning required except foreign-key table–table joins; no GlobalKTable equivalent.
- Shopify Engineering: Flink apps with over 8 TB of state (13 TB for sales data).
- Customers, logins, payments and state growth rates are illustrative.
