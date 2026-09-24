# Sources: CDC, MERGE & slowly changing dimensions

Fact-checked 2026-09-24 against primary docs. Page text saved in the session scratchpad (`cdc/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| Debezium envelope: before / after / source / op (c, u, d, r; also t, m); tombstone after delete by default | Nuanced: top-level ts_ms is processing time, source.ts_ms is change time | debezium.io/documentation/reference/stable/connectors/postgresql.html |
| Postgres `before` holds only the key unless REPLICA IDENTITY FULL; unchanged TOASTed columns arrive as a placeholder | Verified | Debezium Postgres connector docs |
| Order per key within a Kafka partition; at-least-once after crashes | Verified | debezium.io/documentation/faq/ |
| DMS to S3: first column of CDC records is I/U/D; no op in full load unless IncludeOpForFullLoad; order needs a timestamp column | Verified | docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html |
| Datastream: uuid, source_timestamp, sort_keys, source_metadata (change_type, is_deleted) | Verified (Postgres change_type is INSERT/UPDATE/DELETE) | cloud.google.com/datastream/docs/events-and-streams |
| MERGE clauses; multiple source rows matching one target row fails; NOT MATCHED BY SOURCE (Delta SQL 2.4+, Iceberg with Spark 3.5) | Verified | docs.delta.io/delta-update/ ; iceberg.apache.org/docs/latest/spark-writes/ |
| Late events: dedupe per key + seq guard; hard deletes let late events resurrect rows | Verified (nuance) | docs.delta.io/delta-update/ ; Databricks AUTO CDC docs (tombstones, `pipelines.cdc.tombstoneGCThresholdInSeconds`) |
| AUTO CDC (replaces APPLY CHANGES, same syntax), SEQUENCE BY, STORED AS SCD TYPE 1/2 | Verified | docs.databricks.com/aws/en/ldp/cdc |
| Hudi EVENT_TIME_ORDERING with `hoodie.table.ordering.fields` (precombine field deprecated in 1.1) | Verified | hudi.apache.org/docs/record_merger |
| SCD2 via MERGE with a union of rows (NULL merge key); one change per key per run | Verified | docs.delta.io/delta-update/ (SCD Type 2) |
| Delta CDF columns and change types; Iceberg create_changelog_view (identifier_columns, UPDATE_BEFORE/AFTER); Hudi CDC via hudi_table_changes(…, 'cdc', …) | Verified | Delta CDF docs; iceberg.apache.org/docs/latest/spark-procedures/ ; hudi.apache.org/docs/sql_queries |
| Iceberg changelog scan fails on snapshots with delete files (merge-on-read) | Verified at time of writing (apache/iceberg#14264 open) | Iceberg source `BaseIncrementalChangelogScan` |

## Decisions

- The replay lab is an illustrative model (model.ts) with MERGE semantics matching Delta/Iceberg; all 16 combinations were checked with tsx before building the UI.
- Brewline customers, LSNs and timestamps are fictional.
