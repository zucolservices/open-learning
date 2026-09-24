# Sources: Hands-on: query in your browser

Verified empirically on 2026-09-24 by running every query in the module in DuckDB-WASM 1.32.0 (DuckDB v1.4.3) in Chromium via Playwright.

| Claim in the module                                                                                                      | How verified                 | Reference                                                        |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------------- |
| `parquet_metadata()` returns row groups with per-column stats_min/stats_max, sizes                                       | Ran it; columns listed       | duckdb.org/docs/stable/data/parquet/metadata                     |
| Row groups written at ~100,000 rows land as 100,352 (multiple of 2,048-value vectors)                                    | Observed                     | duckdb.org/docs/current/internals/vector.html (vector size 2048) |
| Sorted file: each row group spans ~5 weeks, 1 candidate group for 2026-03-20; shuffled: all span the year, 10 candidates | Ran the queries              | —                                                                |
| `notes` ≈ 13 MB of ~27 MB compressed; sorted order_date compresses to ~0 MB                                              | Ran the size query           | —                                                                |
| EXPLAIN shows `PARQUET_SCAN` with `Projections: amount` and `Filters: order_date=…`                                      | Ran EXPLAIN                  | duckdb.org/docs/stable/guides/meta/explain                       |
| COPY … TO '…parquet' works in the browser; SUMMARIZE, parquet_schema, window functions                                   | Ran them                     | DuckDB docs                                                      |
| Loading bundles from jsDelivr with a blob worker                                                                         | Library's documented pattern | github.com/duckdb/duckdb-wasm README                             |
