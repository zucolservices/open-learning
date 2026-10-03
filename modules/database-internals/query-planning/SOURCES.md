# Sources: Parsing and planning (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Using EXPLAIN (plan tree; estimated start-up/total cost, rows, width; `Seq Scan on tenk1 (cost=0.00..445.00 rows=10000 width=244)` = 345 × 1.0 + 10000 × 0.01; "whether the estimated row counts are reasonably close to reality"; bitmap scans sort row locations into physical order; EXPLAIN ANALYZE executes the query; buffers included with ANALYZE in 18): https://www.postgresql.org/docs/current/using-explain.html
- PostgreSQL docs, Planner Method Configuration ("a crude method of influencing the query plans chosen by the query optimizer"); PREPARE ("first five executions are done with custom plans").
- Microsoft Learn, Query processing architecture guide ("A SELECT statement is non-procedural; it doesn't state the exact steps..."); Query Store (on by default for new databases from SQL Server 2022).
- MySQL manual: EXPLAIN FORMAT=TREE (8.0.16), EXPLAIN ANALYZE (8.0.18).

The join plan and its numbers are illustrative.
