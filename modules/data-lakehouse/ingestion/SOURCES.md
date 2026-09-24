# Sources: Getting data in

Fact-checked 2026-09-24 against Spark, Flink, Kafka, Iceberg, Delta, Databricks, AWS, Google Cloud, Hudi, Airbyte and Fivetran docs. Page text saved in the session scratchpad (`ingestion/`).

| Claim in the module                                                                                                                 | Verdict                  | Source                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------- |
| Spark micro-batch triggers (default, processingTime, availableNow; Trigger.Once deprecated; continuous experimental, at-least-once) | Verified                 | spark.apache.org streaming docs (4.2)                   |
| Exactly-once = replayable source + checkpointed offsets + idempotent sink                                                           | Verified (Spark wording) | Spark streaming guide                                   |
| Delta txn(appId, version); txnAppId/txnVersion for foreachBatch; deleting the checkpoint and reusing txnAppId silently skips writes | Verified                 | docs.delta.io/latest/delta-streaming.html; PROTOCOL.md  |
| Flink Iceberg sink exactly-once, commits on checkpoint completion                                                                   | Verified                 | iceberg.apache.org/docs/latest/flink-writes             |
| Iceberg Kafka Connect sink: coordinator (1.6.0), exactly-once (KIP-447), commit interval default 5 min                              | Verified                 | iceberg.apache.org/docs/latest/kafka-connect            |
| Kafka: partitions, offsets, retention independent of consumption, per-partition order                                               | Verified                 | kafka.apache.org 4.3 docs                               |
| Auto Loader: incremental file discovery, schema evolution, exactly-once via checkpoint                                              | Verified                 | Databricks Auto Loader docs                             |
| Firehose → S3 / Iceberg incl. S3 Tables; buffering default 5 MiB / 300 s                                                            | Verified                 | AWS Firehose API and dev guide                          |
| Datastream → BigQuery; → Iceberg append-only; Pub/Sub BigQuery subscriptions at-least-once                                          | Verified                 | Google Cloud docs                                       |
| Hudi Streamer (renamed from DeltaStreamer), continuous mode, upsert default                                                         | Verified                 | hudi.apache.org streaming ingestion                     |
| Airbyte S3 Data Lake (Iceberg) destination; Fivetran Managed Data Lake (Iceberg, optional Delta)                                    | Verified                 | Airbyte and Fivetran docs                               |
| Small files from frequent commits; compaction needed                                                                                | Verified                 | Iceberg maintenance; Databricks triggers; Firehose docs |

## Decisions

- The streaming simulator is illustrative (500-byte events, 4 writer tasks, ~2 s per commit, 128 MB healthy file) with assumptions shown in the UI.
- The Brewline API / Kafka offsets in the scroll story are fictional.
