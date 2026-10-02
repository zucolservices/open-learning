# Real-time analytics stores (Streaming Data Systems, module 21)

1. **Scoreboard or newspaper** (analogy): stadium scoreboard (seconds, many readers, simple) vs tomorrow's paper (deep, late).
2. **Race to the dashboard** ⭐ (animated infographic): publish an event; log-time lanes show when each path makes it queryable (Elasticsearch, ClickHouse, Pinot/Druid, Zomato, Snowpipe Streaming, dynamic tables, Redpanda Iceberg, Iceberg Kafka sink, Zomato's S3 + Trino); tap a lane for its source.
3. **Why they're fast** ⭐ (step-through): time pruning, columnar, indexes, rollup shrink values read.
4. **Meet the stores** (explore): ClickHouse, Druid, Pinot, others; real examples; Rockset and Timestream as cautions.
5. **Where should it live?** (sort checkpoint): lakehouse, real-time store, stream processor.
6. **Wrap**.
