# Sources: Tungsten and vectorised engines (fact-checked 2026-10-04)

- R. Xin, J. Rosen, "Project Tungsten: Bringing Apache Spark Closer to Bare Metal", Databricks blog, 28 April 2015 (three initiatives).
- S. Agarwal, D. Liu, R. Xin, "Apache Spark as a Compiler: Joining a Billion Rows per Second on a Laptop", Databricks blog, 23 May 2016 (Volcano model; whole-stage codegen in Spark 2.0; "order of magnitude"; vectorisation where codegen isn't possible; stars in explain; Exchange breaks codegen).
- Spark 4.2 Parquet docs: `spark.sql.parquet.enableVectorizedReader` true, `columnarReaderBatchSize` 4096.
- A. Behm et al., "Photon: A Fast Query Engine for Lakehouse Systems", SIGMOD 2022.
- Apache Gluten: incubator status page (graduated 2026-02-18) and gluten.apache.org (Velox and ClickHouse backends, Substrait, fallback).
- Apache DataFusion Comet: datafusion.apache.org/comet (Rust/DataFusion, fallback, no GPUs).

Call counts are computed for the toy query; relative speeds are illustrative.
