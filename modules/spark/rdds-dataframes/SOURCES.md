# Sources: RDDs, DataFrames and Datasets (fact-checked 2026-10-04)

- Spark 4.2 docs: RDD programming guide (RDD definition; automatic recovery); SQL programming guide (Dataset and DataFrame definitions; Python has no Dataset API; "Spark SQL uses this extra information to perform extra optimizations"; same execution engine); Spark Connect overview (RDD unsupported).
- M. Zaharia et al., "Resilient Distributed Datasets", NSDI 2012 (lineage).
- Release notes: Spark 1.3.0 (March 2015, DataFrame, renamed from SchemaRDD), 1.6.0 (January 2016, Dataset), 2.0.0 (July 2016, unification, SparkSession).

The orders dataset, its size and the bytes read are illustrative.
