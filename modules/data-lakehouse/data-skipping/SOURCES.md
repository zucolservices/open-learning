# Sources: File layout, clustering & data skipping

Fact-checked 2026-09-24 against Delta PROTOCOL.md, docs and source, docs.databricks.com, iceberg.apache.org docs/spec and repo, hudi.apache.org docs/blog, parquet.apache.org and parquet-java. Page text saved in the session scratchpad (`skipping/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| Delta `add.stats`: numRecords, minValues, maxValues, nullCount; first 32 columns by default; `delta.dataSkippingStatsColumns` (Delta 3.0+) | Verified | PROTOCOL.md (per-file statistics); docs.delta.io optimizations-oss; Delta 3.0 notes |
| Iceberg manifest bounds and counts; `write.metadata.metrics.default` = truncate(16); max inferred columns 100 | Verified | iceberg configuration; spec (field-level metrics) |
| Hudi data skipping via metadata table column_stats (on by default for Spark) | Verified | hudi.apache.org/docs/configurations |
| OPTIMIZE ZORDER BY (Delta 2.0+): effectiveness drops per extra column; columns without stats rejected in OSS; not incremental (re-clusters a partition) | Verified | docs.delta.io optimizations-oss; Delta source |
| Liquid clustering is incremental; OPTIMIZE FULL re-clusters; open-source Delta uses a Hilbert curve for multiple keys | Verified; "Hilbert" comes from Delta OSS source (`ClusteringStrategy.curve = "hilbert"`), not from Databricks docs | Delta OptimizeTableStrategy.scala; delta-clustering docs |
| Iceberg WRITE ORDERED BY; rewrite_data_files strategy 'sort' with zorder(...); Hilbert merged to main but unreleased as of Sep 2026 | Verified | spark-ddl, spark-procedures (1.11.0); apache/iceberg PR #16827 |
| Hudi `hoodie.layout.optimize.strategy` LINEAR (default) / ZORDER / HILBERT; clustering sort columns | Verified | hudi configurations; clustering docs |
| Parquet split block bloom filters (parquet-java 1.12+); `parquet.bloom.filter.enabled#col`; Iceberg `write.parquet.bloom-filter-enabled.column.<col>` (fpp 0.01) | Verified | parquet bloomfilter spec; parquet-java README; Iceberg configuration |
| ~10 bits/value ≈ 1% false positives; 5 bits ≈ 18% | Verified (Parquet spec's own example: 1.26% and ~18%) | parquet.apache.org/docs/file-format/bloomfilter |
| Databricks bloom filter indexes deprecated; predictive I/O and liquid clustering recommended | Verified | docs.databricks.com/aws/en/optimizations/bloom-filters |
| Layouts decay with appends; frequent OPTIMIZE for heavy-write clustered tables | Verified | Databricks clustering docs; Delta clustering docs |

## Decisions

- The layout lab is an exact computation, not a model: 1,024 rows on a 32×32 grid, five orderings, files cut every N rows, and a file is read iff its min/max box intersects the query. Curve correctness was tested (Hilbert visits every cell once with only adjacent steps; Morton indices are unique).
- "Hilbert never jumps" is taught as geometry the learner can see, not quoted from a doc. Hudi's blog reports Hilbert slightly ahead of Z-order in its benchmark, consistent with the lab.
- The bloom-filter step uses a fixed illustrative example (six "definitely not", one true hit, one false positive).
