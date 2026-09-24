# Storyboard: Partitioning done right

Track: Modern Data Lakehouse · Chapter 4 · Module 13 · ~30 min · level: core

The next module covers clustering, Z-order and data skipping in depth; this one stays on partitioning: pruning, choosing a key, the small-files trap, and the alternatives.

## 1. What must the learner truly understand?

1. **Partitioning speeds up only queries that filter on the partition column** (directly, or via hidden partitioning / generated columns).
2. **Every partition splits files.** Too many partitions means small files, which slows planning, reading and writing. Finer isn't better.
3. **Choose keys by query filters and partition size** (low-to-moderate cardinality, ≥ ~1 GB per partition), and know that many tables shouldn't be partitioned at all.
4. **Modern layouts avoid lock-in**: liquid clustering, Iceberg partition evolution, Hudi clustering.

## 2. Misconceptions

| Misconception                                     | Where                         |
| ------------------------------------------------- | ----------------------------- |
| "Partitioning speeds up every query"              | Filing cabinet (1), simulator |
| "Finer partitions are always faster"              | Simulator (2), checkpoint (3) |
| "More machines will fix a slow, fragmented table" | Fix the problem (4)           |
| "Every big table should be partitioned"           | Rules of thumb (5)            |
| "More folders = more S3 throughput"               | Rules of thumb (5)            |

## 3. What does the learner do?

| #   | Step                        | Interaction                                                                               | Gate   |
| --- | --------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| 1   | A filing cabinet            | Three filters against a date-partitioned table; which folders are opened                  |        |
| 2   | Choose a scheme ⭐          | **Simulator**: 8 schemes × 3 queries; partitions, files, file size, files per write, time |        |
| 3   | Checkpoint                  | What a customer_id partition key does to each hourly write                                | choice |
| 4   | The five-million-file table | Fix the problem: pick the lasting fix                                                     | choice |
| 5   | Rules of thumb              | Sourced guidance                                                                          |        |
| 6   | Beyond folders              | Liquid clustering, Iceberg hidden partitioning + sort, Hudi clustering                    |        |
| 7   | Checkpoint                  | Sort proposed keys into good / poor                                                       | sort   |
| 8   | Takeaways                   |                                                                                           |        |
