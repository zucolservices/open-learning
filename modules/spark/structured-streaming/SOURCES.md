# Sources: Structured Streaming (fact-checked 2026-10-04)

- Spark 4.2 Structured Streaming guide (docs/latest/streaming/): overview (micro-batch default, ~100 ms, exactly-once); programming model ("a table that is being continuously appended"); triggers (default, processingTime, availableNow, deprecated once, continuous); watermarking (Spark 2.1; max event time − delay); checkpointing and write-ahead logs; state store providers (HDFS-backed default; RocksDB since 3.2); transformWithState (Spark 4.0); performance tips (continuous processing experimental since 2.3, ~1 ms, at-least-once).
- Spark 4.1.0 release notes (Real-Time Mode, SPARK-53736) and 4.2.0 release notes (RTM trigger in PySpark, SPARK-54660).

Event times, windows and counts in the simulation are illustrative.
