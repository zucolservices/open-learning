# State and joins (Streaming Data Systems, module 14)

1. **The cashier's register** (analogy): a customer register looked up for each cheque; a tray of recent ID slips.
2. **Streams and tables** ⭐ (simulation): step through a changelog of customer tiers and watch the table build (delete via null); RocksDB, compacted changelog, standby replicas.
3. **Join payments to customers and logins** ⭐ (simulation): stream–table enrichment (tier as of processing) vs stream–stream join with logins ±5 min; inner vs left; co-partitioning, GlobalKTable, versioned tables.
4. **Watch the state grow** ⭐ (simulation): windowed/TTL vs unbounded state over 120 minutes; Flink TTL default, Spark watermark rules, Shopify scale.
5. **Which join?** (sort checkpoint).
6. **Wrap**.
