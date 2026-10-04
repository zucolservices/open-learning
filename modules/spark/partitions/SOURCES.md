# Sources: Partitions and parallelism (fact-checked 2026-10-04)

- Spark 4.2 docs: configuration (spark.sql.shuffle.partitions 200; spark.default.parallelism; spark.sql.files.maxPartitionBytes 128 MB); SQL performance tuning (AQE coalescing toward 64 MB); tuning guide ("2-3 tasks per CPU core"); RDD programming guide (one task per partition; coalesce and repartition).
- PySpark API docs: DataFrame.coalesce (narrow dependency, 1000 to 100 without a shuffle; cannot increase) and DataFrame.repartition.

Data sizes, rates and overheads in the simulation are illustrative.
