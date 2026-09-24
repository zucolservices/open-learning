# Storyboard: File layout, clustering & data skipping

Track: Modern Data Lakehouse · Chapter 4 · Module 14 · ~30 min · level: deep

`inside-parquet` showed min/max skipping of row groups within one file sorted by one column. This module moves to the table level: per-file statistics in table metadata, the multi-column problem, space-filling curves, bloom filters, and keeping layouts from decaying.

## What must the learner understand?

1. Per-file statistics let engines skip files, but only when each file covers a narrow range, so row arrangement matters as much as the stats.
2. A sort serves one column; Z-order and Hilbert (and liquid clustering) balance several; Hilbert avoids Z-order's jumps.
3. Random high-cardinality lookups need bloom filters, not min/max.
4. Layouts decay with every unsorted append and need periodic, ideally incremental, re-clustering.

## Steps

| #   | Step                 | Interaction                                                                                      | Gate   |
| --- | -------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| 1   | A label on every box | Same query, arrival vs clustered rows; where each format stores stats                            |        |
| 2   | The layout lab ⭐    | **Real computation**: 1,024 rows, 5 layouts × 3 queries × 4 file sizes; write-order path overlay |        |
| 3   | Checkpoint           | Pick a layout for two query populations                                                          | choice |
| 4   | Bloom filters        | UUID lookup: min/max vs bloom (with a false positive)                                            |        |
| 5   | Keeping the layout   | Decay visual; per-format re-clustering commands                                                  |        |
| 6   | Checkpoint           | Sort query patterns into sort / multi-column / bloom                                             | sort   |
| 7   | Takeaways            |                                                                                                  |        |
