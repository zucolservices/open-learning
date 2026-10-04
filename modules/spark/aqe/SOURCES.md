# Sources: Adaptive Query Execution (fact-checked 2026-10-04)

- Spark 4.2 SQL Performance Tuning, "Adaptive Query Execution" (definition; on by default since 3.2.0; coalescing; converting sort-merge to broadcast or shuffled hash join; skew join; configuration defaults including parallelismFirst, 64 MB advisory size, 5× factor and 256 MB threshold).
- Spark 3.2.0 release notes: "Enable adaptive query execution by default (SPARK-33679)".
- W. Fan, H. van Hovell, M. Xue, "Adaptive Query Execution: Speeding Up Spark SQL at Runtime", Databricks blog, 29 May 2020 (three features in Spark 3.0; query stages; conditions: not streaming, at least one exchange or subquery).

Partition sizes, timings and the cluster in the simulation are illustrative; plan output is simplified.
