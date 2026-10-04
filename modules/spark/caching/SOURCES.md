# Sources: Caching and persistence (fact-checked 2026-10-04)

- Spark 4.2 RDD Programming Guide, "RDD Persistence" (storage levels; cache() = MEMORY_ONLY for RDDs; Python levels; fault tolerance; laziness; advice on spilling; unpersist non-blocking; LRU eviction).
- Spark Dataset.scala and PySpark DataFrame.cache docs (DataFrame default MEMORY_AND_DISK; PySpark name MEMORY_AND_DISK_DESER since 3.0).
- Spark 4.2 Configuration: `spark.sql.defaultCacheStorageLevel` (since 4.0.0).
- Spark 4.2 SQL reference, CACHE TABLE (eager by default, LAZY option, default MEMORY_AND_DISK); SQL Performance Tuning, "Caching Data" (columnar format).
- PySpark DataFrame.unpersist docs (cached data shared across sessions).

Data sizes, memory and timings in the simulation are illustrative.
