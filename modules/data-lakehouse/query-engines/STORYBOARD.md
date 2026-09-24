# Storyboard: How engines read a lakehouse

Track: Modern Data Lakehouse · Chapter 7 · Module 21 · ~30 min · level: core

## What must the learner understand?

1. Every engine: catalog lookup → plan and optimise → prune files with metadata → split → scan few columns and row groups → vectorised compute → shuffle and combine.
2. Reading less (partition filters, clustering, fewer columns) is the biggest lever for speed and pay-per-scan cost.
3. Plans (EXPLAIN / EXPLAIN ANALYZE) show pushed filters, files read and shuffles; functions on filter columns defeat pruning.
4. Many engines share the same tables; they differ in where they run, pricing, caching and format support.

## Steps

| #   | Step                         | Interaction                                                     | Gate    |
| --- | ---------------------------- | --------------------------------------------------------------- | ------- |
| 1   | The life of a query ⭐       | **Scroll story** (librarian analogy), 8 stages with visuals     |         |
| 2   | How much does it read?       | Predict the GB scanned for a one-month filter                   | predict |
| 3   | What makes a query cheap? ⭐ | **Simulator**: filters × columns × clustering → bytes, files, $ |         |
| 4   | Row or batch at a time?      | Animated row vs vectorised execution                            |         |
| 5   | Reading a query plan         | Click plan nodes (scan, partial agg, exchange, final, metrics)  |         |
| 6   | The slow dashboard           | Function-wrapped filter defeats pruning                         | choice  |
| 7   | Same tables, many engines    | Explorer: 10 engines by group                                   |         |
| 8   | What to remember             |                                                                 |         |
