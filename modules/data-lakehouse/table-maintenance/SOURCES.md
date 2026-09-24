# Sources: Keeping tables healthy

Fact-checked 2026-09-24 against docs.delta.io and Delta source, docs.databricks.com, iceberg.apache.org, hudi.apache.org, AWS (S3 Tables, Glue) and Google Cloud docs. Page text saved in the session scratchpad (`maintenance/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| VACUUM: 7-day default (`delta.deletedFileRetentionDuration`), safety check, never automatic in OSS; default (FULL) also removes unreferenced files from failed jobs; LITE (Delta 3.3+) reads only the log and skips them | Verified | docs.delta.io/delta-utility; Delta 3.3.0 release notes |
| Log retention 30 days, cleaned after checkpoints; checkpoint every 10 commits; time travel needs log and data files | Verified | docs.delta.io/delta-batch; DeltaConfig.scala |
| OPTIMIZE bin-packing idempotent, 1 GiB target; auto compaction (3.1+) 128 MB after writes | Verified | docs.delta.io/optimizations-oss; DeltaSQLConf.scala |
| expire_snapshots defaults 5 days / keep 1; removes only files no remaining snapshot needs | Verified | iceberg spark-procedures; configuration |
| remove_orphan_files: 3-day default, dry_run | Verified | iceberg maintenance; spark-procedures |
| Manifests merged on commit by default; old metadata.json kept unless delete-after-commit (keeps 100); rewrite_manifests | Verified | iceberg configuration; maintenance |
| rewrite_data_files: binpack default, 512 MB target, min 5 input files | Verified | iceberg spark-procedures |
| Hudi cleaner automatic, KEEP_LATEST_COMMITS 10; archival 20/30; failed writes rolled back | Verified | hudi cleaning; configurations; rollbacks |
| Databricks predictive optimization: OPTIMIZE, VACUUM, ANALYZE for UC managed Delta and Iceberg; default for accounts since Nov 11, 2024; 7-day VACUUM minimum; no ZORDER | Verified | docs.databricks.com/aws/en/optimizations/predictive-optimization |
| S3 Tables: compaction (512 MB), snapshot management (keep 1, 120 h), unreferenced-file removal; on by default; bucket-level | Verified | AWS S3 Tables maintenance docs |
| Glue Data Catalog optimizers: compaction, snapshot retention, orphan deletion; opt-in; orphans 3 days | Verified (opt-in, not default) | AWS Glue table-optimizers docs |
| BigQuery Iceberg tables: automatic file sizing, clustering, garbage collection; untracked files deleted | Verified | cloud.google.com/bigquery/docs/iceberg-tables |
| "Not uncommon" for removed files to exceed current table size; ANALYZE TABLE … COMPUTE STORAGE METRICS | Verified | docs.databricks.com/aws/en/tables/size |

## Decisions

- The six-month story and the policy simulator share one illustrative model (`life.ts`) with its assumptions shown in the UI. Per-file cost was set to 10 ms (an object-store request plus footer read); the model was checked across four policies, including the "compaction without clean-up makes storage worse" case.
- The storage-bill incident is a composite scenario, not a published case.
- The "Tidy metadata" job is shown per format but not simulated.
