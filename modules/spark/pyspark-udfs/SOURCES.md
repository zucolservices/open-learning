# Sources: PySpark, Arrow and UDFs (fact-checked 2026-10-04)

- PySpark docs, Debugging (Py4J on the driver; Python workers launched lazily for Python functions and RDDs).
- PySpark docs, "Apache Arrow in PySpark" (4.2: Arrow enabled by default; 4.1: disabled by default; toPandas collects all records), Arrow Python UDFs (default since 4.2; `spark.sql.execution.pythonUDF.arrow.enabled`), pandas UDFs, Python Data Source API (4.0).
- Spark 2.3.0, 3.5.0 and 4.2.0 release notes (vectorised UDFs; Arrow Python UDFs SPARK-40307; SPARK-54555 Arrow by default).
- L. Jin, "Introducing Pandas UDF for PySpark", Databricks blog, 30 Oct 2017 (3× to over 100×, microbenchmark).
- X. Meng et al., "Arrow-optimized Python UDFs in Apache Spark 3.5", Databricks blog, 6 Nov 2023 (~1.6×).

Relative times in the ladder are illustrative.
