# Sources: Updates & deletes, Copy-on-Write vs Merge-on-Read

Fact-checked 2026-09-24 against docs.delta.io, Delta PROTOCOL.md and source, docs.databricks.com, iceberg.apache.org spec and docs, and hudi.apache.org docs. New page text saved in the session scratchpad (`updates/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| Update = delete old version + insert new; rows must be found first | Verified for Delta and Iceberg (position deletes / DVs). **Exceptions taught:** Iceberg equality deletes skip finding the row; Hudi locates the file group via its index and writes a new record version to a log | Iceberg spec; hudi.apache.org/docs/table_types |
| `delta.enableDeletionVectors`; DELETE 2.4, UPDATE 3.0, MERGE 3.1; on by default for new tables on Databricks (SQL warehouse / DBR 14.3 LTS+); enabling upgrades the protocol | Verified | docs.delta.io/delta-deletion-vectors; PROTOCOL.md; Databricks DV docs |
| DV rows remain in files until rewrite; `REORG TABLE … APPLY (PURGE)` guarantees rewrite; OPTIMIZE has "no strict guarantees"; then VACUUM after retention counted from the REORG | Verified | docs.delta.io/delta-deletion-vectors; Databricks GDPR guidance |
| Iceberg `write.{delete,update,merge}.mode` default copy-on-write; MoR needs v2+; v3 uses DVs; `rewrite_data_files` (delete-ratio-threshold 0.3); `rewrite_position_delete_files` | Verified | iceberg.apache.org/docs/latest/configuration, spark-procedures; spec |
| Equality deletes mostly from Flink upserts | Verified; "most expensive to read" is taught as reasoning, not quoted | Iceberg flink-writes; spec (scan planning) |
| DVs more efficient than position deletes at read time | Verified (spec wording) | Iceberg spec |
| Hudi table type at creation (`type = 'mor'`), default COW; change via CLI, MOR→COW needs full compaction; compaction async by default; `hoodie.compact.inline.max.delta.commits` = 5 | Verified | hudi.apache.org/docs/cli, configurations, compaction |
| Erasure: Iceberg rewrite_data_files → expire_snapshots → remove_orphan_files; Hudi hard deletes + compaction + cleaner | Verified (Iceberg has no GDPR page; this is the documented maintenance path) | Iceberg maintenance docs; Hudi writing_data, cleaning |
| Databricks auto compaction and predictive optimization | Verified | Databricks tune-file-size; predictive-optimization |

## Decisions

- The simulator's cost model is illustrative and its assumptions are shown in the UI: 128 MB files, 12 update batches per hour, full-table reads, ~0.5 KB of reader work per pending change, ~1 MB-equivalent per extra small file. It models deletion-vector-style MoR, the cheapest variant for readers.
- Model behaviour was checked across eight workloads before building the UI (read-heavy → CoW, write-heavy/spread → MoR, clustered updates → CoW).
- Delta's DV storage details (inline vs `.bin`, wide stats bounds) are left out at this level.
