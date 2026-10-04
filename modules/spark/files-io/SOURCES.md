# Sources: Reading and writing files (fact-checked 2026-10-04)

- Spark 4.2 SQL Performance Tuning: `spark.sql.files.maxPartitionBytes` (128 MB, file-based sources), `openCostInBytes` (4 MB), coalesce/repartition/REBALANCE hints.
- Spark 4.2 Generic Load/Save (partitionBy with save and saveAsTable; bucketing only for persistent tables) and Parquet docs (partition discovery; `filterPushdown`; dynamic partition pruning config).
- Spark 4.2 Configuration: `spark.sql.files.maxRecordsPerFile` (0 = no limit); per-write option in FileFormatWriter.scala.
- Databricks, "Comprehensive Guide to Optimize Data Workloads" (predicate pushdown not for text/JSON/XML; partition and column pruning; DPP; tiny files; 16 MB–1 GB).
- Delta Lake docs: OPTIMIZE, auto compaction, optimized writes. Databricks docs on partitioning guidance.

File counts and sizes in the simulation are illustrative; plan output is simplified.
