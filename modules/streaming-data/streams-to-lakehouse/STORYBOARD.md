# Streaming into the lakehouse (Streaming Data Systems, module 20)

1. **Filing receipts** (analogy): file instantly (fresh, thin folders), daily (tidy, stale), or often + merge at night (compaction).
2. **Tune the commit interval** ⭐ (simulation): 10 s–1 h commits, writers, table partitions, hash distribution, compaction to 512 MB; freshness, files per day, average file size.
3. **Updates leave a trail** (step-through): insert, update as equality delete + new row, reader merge cost, compaction and deletion vectors.
4. **Kafka to table, ready-made** (explore): Flink, Spark, Iceberg Kafka Connect, Tableflow, Redpanda, Firehose, Event Hubs Capture, Snowflake/BigQuery/Databricks, Paimon/Fluss; maintenance jobs.
5. **Tune or tidy?** (sort checkpoint).
6. **Wrap**.
