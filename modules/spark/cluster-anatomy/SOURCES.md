# Sources: Driver, executors and the cluster (fact-checked 2026-10-04)

- Spark 4.2 docs, Cluster Mode Overview (components; cluster managers; deploy modes; glossary; web UI on port 4040).
- SPARK-35050 (Mesos deprecated, 3.2.0) and SPARK-44442 (Mesos removed, 4.0.0); Spark 4.0.0 release notes.
- Spark Connect overview (introduced in 3.4; unresolved plans over gRPC; Arrow-encoded results).
- RDD programming guide (fault tolerance); DAGScheduler source documentation (resubmitting lost stages); configuration (spark.task.maxFailures 4, spark.executor.cores, spark.task.cpus).

Task counts and timings in the simulation are illustrative.
