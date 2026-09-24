# Sources: Partitioning done right

Fact-checked 2026-09-24 against docs.databricks.com, docs.delta.io and PROTOCOL.md, iceberg.apache.org, hudi.apache.org, Apache Hive and Spark docs, and AWS S3/Athena docs. Page text saved in the session scratchpad (`partitioning/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| Databricks: under 1 TB don't partition; 1–100 TB use liquid clustering; 100 TB+ partitioning might help but try clustering first; ≥ 1 GB per partition | Verified (page updated Sep 11, 2026) | docs.databricks.com/aws/en/tables/partitions |
| Delta: don't partition by high-cardinality columns such as a 1M-value userId; partition only if ≥ 1 GB per partition | Verified | docs.delta.io/best-practices |
| Hive-style tables can't prune on a filter over a column the partition is derived from; Iceberg hidden partitioning and Delta generated columns derive the partition filter | Verified | iceberg.apache.org/docs/latest/partitioning; docs.delta.io/delta-batch |
| A file can't span a partition boundary, so fine partitions mean small files | Verified (Iceberg spark-writes wording) | iceberg.apache.org/docs/latest/spark-writes |
| Liquid clustering: CLUSTER BY, up to 4 keys, not with partitioning or ZORDER, key change doesn't rewrite existing data; OSS 3.1 preview, flag removed in 3.2; CLUSTER BY AUTO is Databricks-only | Verified | docs.delta.io/delta-clustering; Delta releases; Databricks clustering docs |
| Hudi recommends coarse top-level partitions (e.g. date) plus clustering | Verified (FAQ) | hudi.apache.org/faq/general; docs/clustering |
| Hive dynamic partitions: 1,000 per write, 100 per node by default; Spark enforces the cap only for Hive-format tables | Verified | Hive Configuration Properties; Spark source |
| S3: at least 3,500 writes / 5,500 reads per second per partitioned prefix; scales gradually | Verified | docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html |
| Skew as a reason to prefer clustering | Verified (Databricks lists "heavy data skew") | docs.databricks.com/aws/en/delta/clustering |

## Decisions

- The simulator is an illustrative model with its assumptions shown in the UI (1 GB/day for three years, 256 MB file target, 5 GB/s scan, per-file open and planning costs). Only partition pruning is modelled; file statistics are the next module's topic.
- The model's outputs were checked across all eight schemes before building the UI.
- The "five-million-file table" is a composite scenario, not a specific published incident; its numbers follow from its own setup (730 days × ~200 cities × 24 hours).
- Planning cost is described as "much of it happens on the driver", not "single-threaded".
