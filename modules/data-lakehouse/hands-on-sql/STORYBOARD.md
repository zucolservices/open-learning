# Storyboard: Hands-on: query in your browser

Track: Modern Data Lakehouse · Chapter 7 · Module 22 · ~40 min · level: core

## What must the learner understand?

1. Parquet footers hold row-group statistics you can read yourself (`parquet_metadata()`).
2. Sorting decides how much min/max skipping can do: 1 of 10 row groups vs 10 of 10 on identical rows.
3. Columnar storage means unread columns cost nothing; EXPLAIN shows Projections and Filters inside the scan.

## Technical notes

- DuckDB-WASM (`@duckdb/duckdb-wasm`, pinned 1.32.0, DuckDB v1.4.3) is imported only in this module (`duck.ts`), and its wasm/worker load from jsDelivr via `getJsDelivrBundles()` (the eh wasm is ~34 MB, above some static hosts' per-file limits).
- On boot it generates 1,000,000 deterministic orders and writes `orders_sorted.parquet` and `orders_random.parquet` (ROW_GROUP_SIZE 100,000 → 10 groups of 100,352 rows) into DuckDB's in-memory file system. Nothing is downloaded besides the engine; nothing leaves the tab.
- If the CDN is unreachable, the page shows an error with Retry instead of throwing.

## Steps

| #   | Step                            | Interaction                                                     | Gate   |
| --- | ------------------------------- | --------------------------------------------------------------- | ------ |
| 1   | A real engine, inside this page | Boot, file sizes, first queries                                 |        |
| 2   | Look inside a Parquet file ⭐   | `parquet_metadata()` on both files + row-group range chart      |        |
| 3   | Prove the skipping ⭐           | Candidate row groups from metadata; timed queries on both files |        |
| 4   | What can the engine skip?       | Shuffled file: none                                             | choice |
| 5   | Only the columns you need       | Column sizes; EXPLAIN                                           |        |
| 6   | Read the scan                   | Meaning of Filters inside PARQUET_SCAN                          | choice |
| 7   | Your turn                       | Free sandbox with snippets (SUMMARIZE, windows, COPY TO)        |        |
| 8   | What to remember                |                                                                 |        |
