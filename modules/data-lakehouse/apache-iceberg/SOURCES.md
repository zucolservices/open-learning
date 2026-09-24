# Sources: Apache Iceberg, the metadata tree

Fact-checked 2026-09-24 against primary sources. No claim was wrong; nuances below were folded in.

| Claim in the module                                                                                                                                              | Verdict                                                          | Source                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| catalog → metadata file (JSON) → manifest list (Avro, one per snapshot) → manifests (Avro) → data files; delete files tracked in (delete) manifests              | Verified                                                         | spec#overview, "Manifests"                       |
| Metadata file holds schemas, partition specs, snapshots, current-snapshot-id, refs, properties (+ more fields)                                                   | Verified                                                         | spec "Table Metadata Fields"                     |
| Manifest list stores per-manifest partition field summaries (bounds, contains_null/nan) and file counts, "used to avoid reading manifests that are not required" | Verified                                                         | spec "Manifest Lists"                            |
| Manifest entries hold path, partition, record count, size, per-column stats keyed by field ID                                                                    | Verified for v1–v3 (v4 draft moves stats into `content_stats`)   | spec "Manifests"                                 |
| Commit = atomic swap of the catalog's metadata pointer; optimistic concurrency with retry after re-validation                                                    | Verified. REST catalogs send requirements + updates; 409 = retry | spec#optimistic-concurrency; REST OpenAPI        |
| Unchanged manifests reused across snapshots                                                                                                                      | Verified ("Manifest files are reused across snapshots…")         | spec#overview                                    |
| Transforms identity, bucket, truncate, year, month, day, hour, void; hidden partitioning                                                                         | Verified (v3 adds multi-arg transforms)                          | spec "Partition Transforms"; docs/partitioning   |
| Partition evolution is metadata-only; old files keep old spec; planning split per spec                                                                           | Verified                                                         | docs/evolution                                   |
| Field IDs make rename/drop/add safe; int→long, float→double, decimal widening                                                                                    | Verified (v3 adds date→timestamp, unknown→any)                   | spec "Schema Evolution"                          |
| Spark `VERSION AS OF` / `TIMESTAMP AS OF`; Trino `FOR VERSION AS OF` / `FOR TIMESTAMP AS OF`                                                                     | Verified                                                         | docs/spark-queries; trino.io Iceberg connector   |
| Branches/tags, `CREATE TAG … RETAIN n DAYS`, WAP via `write.wap.enabled` + `spark.wap.branch`, `system.fast_forward`                                             | Verified                                                         | docs/branching; docs/spark-procedures            |
| `REPLACE PARTITION FIELD ts_day WITH day(ts)` syntax                                                                                                             | Verified                                                         | docs/spark-ddl                                   |
| v2 position + equality deletes; v3 deletion vectors in Puffin, max one per data file; "Position delete files must not be added to v3 tables"                     | Verified                                                         | spec "Deletion Vectors", "Format Versioning"     |
| expire_snapshots, remove_orphan_files (default older_than 3 days), rewrite_data_files, rewrite_manifests                                                         | Verified                                                         | docs/spark-procedures                            |
| Created at Netflix; Incubator 2018-11-16; TLP 2020-05-20; v1–v3 adopted, v4 in development                                                                       | Verified                                                         | incubator.apache.org/projects/iceberg.html; spec |
| Bucket transform = murmur3_x86_32 of 8-byte LE long, `& Integer.MAX_VALUE % N`; test vector hash(34L)=2017239379                                                 | Verified; `data.ts` implementation reproduces the vector         | spec Appendix B                                  |

## Decisions

- Metadata file names shown as `00003-….metadata.json`: that zero-padded form is the Java implementation's convention. The spec defines `v<V>.metadata.json` (file-system tables) and `<V>-<uuid>.metadata.json` (metastore tables).
- Per-column stats taught as maps keyed by field ID ("v1–v3"); the live spec page already shows v4 draft content.
- Retry is taught as "check, then retry" (not blind), per the spec's validation wording.
- Sequence numbers (how deletes are ordered against data) are left out at this level; they belong in _Updates & deletes_.
- Ecosystem list is deliberately brief; each platform gets its own module later in the track.
