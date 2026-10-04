# Sources: Data skew (fact-checked 2026-10-04)

- Spark 4.2 SQL Performance Tuning, "Optimizing Skew Join" (splitting and replicating skewed tasks; 5× median and 256 MB; defaults).
- Spark 4.2 Web UI docs, stage detail summary metrics (Min, 25th, Median, 75th, Max).
- Databricks, "Comprehensive Guide to Optimize Data Workloads", data skewness section (definition; filtering nulls; salting as the last choice).
- Databricks docs, Spark UI guide "Skew and spill" (Max vs 75th percentile; 50% rule of thumb).

Partition sizes, timings, key counts and the cluster are illustrative.
