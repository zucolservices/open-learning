# Sources: The shuffle (fact-checked 2026-10-04)

- Spark 4.2 RDD Programming Guide, "Shuffle operations" (definition, all-to-all, costs: disk I/O, serialization, network I/O; operations that can cause a shuffle; shuffle files on disk kept for lineage re-computation).
- Spark 4.2 Configuration (`spark.local.dir` default /tmp; `spark.sql.shuffle.partitions` 200; `spark.shuffle.service.enabled` false; `spark.dynamicAllocation.shuffleTracking.enabled` true).
- Spark 4.2 Job Scheduling (executors serve their own map outputs; external shuffle service; not supported on Kubernetes).

Record counts, keys, task counts and plan snippets are illustrative and simplified.
