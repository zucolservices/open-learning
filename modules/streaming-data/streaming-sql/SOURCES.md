# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m16-facts.md` (raw pages in `m16/`).

- Flink 2.3 dynamic tables: "A continuous query never terminates and produces dynamic results - another dynamic table"; results "semantically equivalent to the result of the same query executed in batch mode on a snapshot of the input tables"; docs example SELECT user, COUNT(url) FROM clicks GROUP BY user; append-only, retract and upsert encodings; RowKind +I, -U, +U, -D. CREATE MATERIALIZED TABLE with FRESHNESS (CONTINUOUS / FULL). table.exec.state.ttl default 0. kafka connector append-only sink; upsert-kafka needs a PRIMARY KEY, writes deletes as tombstones. Window aggregations emit final results (insert-only).
- ksqlDB: persistent queries (CSAS/CTAS), push queries (EMIT CHANGES), pull queries; RocksDB + changelog; Confluent recommends Flink for new workloads, ksqlDB fully supported (2026-09-22).
- RisingWave: PostgreSQL wire protocol, incrementally maintained materialised views, Apache 2.0, state on object storage; RisingWave Cloud.
- Materialize: Differential Dataflow on Timely Dataflow (Frank McSherry); strict serializable default; "the live data layer for apps and AI agents"; BSL 1.1 (Apache 2.0 after four years); Community Edition (24 GiB memory / 48 GiB disk).
- Spark 4.1.0 (16 Dec 2025) Spark Declarative Pipelines — "A materialized view always has exactly one batch flow writing to it"; Databricks Lakeflow pipelines add incremental refresh (serverless).
- Snowflake Dynamic Tables GA 29 Apr 2024 (target lag). BigQuery continuous queries GA (2025-05-19); stateful operations (joins, aggregations, windows) Preview since 2026-04-09.
- The order stream and the simulated engine (changelog per new order; window closes when a later order arrives) are illustrative.
