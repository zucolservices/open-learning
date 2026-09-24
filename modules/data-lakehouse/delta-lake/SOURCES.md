# Fact check: Delta Lake module

Checked 2026-09-24 against primary sources.

- Delta protocol spec: https://github.com/delta-io/delta/blob/master/PROTOCOL.md
  (Delta Log Entries, Actions, Add/Remove File, Per-file Statistics, Action Reconciliation, Checkpoints,
  Last Checkpoint File, Deletion Vectors, Protocol Evolution, Metadata Cleanup, Transaction Identifiers)
- Docs: https://docs.delta.io/ (delta-batch, delta-utility, table-properties, concurrency-control,
  delta-storage, delta-deletion-vectors, delta-change-data-feed, delta-clustering, delta-uniform)
- delta-spark defaults: DeltaConfig.scala (checkpointInterval = 10, isolationLevel = Serializable)
- S3 multi-cluster writes: docs delta-storage § Amazon S3 (S3DynamoDBLogStore);
  delta-spark issue #3596 (S3 conditional writes, closed not planned);
  delta-rs discussion #4482 (1.0 uses S3 conditional put by default)
- DuckDB delta extension: https://duckdb.org/docs/lts/core_extensions/delta
- Fabric OneLake: https://learn.microsoft.com/en-us/fabric/fundamentals/delta-lake-overview

## Decisions based on the check

- The spec does not mandate a checkpoint cadence. We say "Delta's Spark writer checkpoints every 10 commits by default".
- OSS Delta isolation is Serializable only; WriteSerializable is Databricks-specific. We don't claim a default beyond that.
- Multi-part checkpoints are deprecated; we mention V2 checkpoints instead.
- DV purge is guaranteed only by `REORG TABLE … APPLY (PURGE)`.
- The file identity key is (path, deletionVector id); we simplify to "path" and note the DV nuance in the deletion vectors card.
- Catalog-managed tables (newest commits approved and held by a catalog) are mentioned as an emerging protocol feature.
- Re-verify before any major content update. These features move quickly.
