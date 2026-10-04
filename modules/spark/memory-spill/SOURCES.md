# Sources: Memory, spill and out-of-memory (fact-checked 2026-10-04)

- Spark 4.2 Tuning Guide, "Memory Management Overview" (execution vs storage; unified region M; R; eviction rules; 300 MiB reserved; fraction 0.6; storageFraction 0.5) and "Memory Usage of Reduce Tasks" (increase parallelism).
- Spark 4.2 Configuration: spark.memory.fraction, spark.memory.storageFraction, spark.executor.memory, spark.executor.memoryOverhead / memoryOverheadFactor (0.10; 0.40 for Kubernetes non-JVM jobs) / minMemoryOverhead (384m), container size formula.
- Spark 4.2 Web UI docs: Spill (memory) and Spill (disk), peak execution memory.
- Databricks docs, Spark UI guide "Skew and spill".

The per-task share, spill amount and OOM rule in the simulation are simplified; Python memory and summary metrics are illustrative.
