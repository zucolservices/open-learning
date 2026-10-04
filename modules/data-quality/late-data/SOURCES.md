# Sources: Late and missing data (fact-checked 2026-10-04)

- T. Akidau et al., "The Dataflow Model", VLDB 2015; T. Akidau, "Streaming 101" (Aug 2015) and "Streaming 102" (Jan 2016), O'Reilly.
- Apache Airflow docs: best practices (idempotent tasks, UPSERT, partitions), data intervals, catchup (off by default in 3.0), `airflow backfill create`.
- Apache Spark docs: `spark.sql.sources.partitionOverwriteMode` (default static).
- dbt docs: incremental models (lookback window and full refresh), microbatch (dbt 1.9: event_time, begin, batch_size, lookback in batches).
- SQL:2003 MERGE.

The week of orders and delays is made up.
