# Sources: Statistics and the optimiser (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Statistics Used by the Planner (pg_stats: null_frac, n_distinct, MCVs, histogram, correlation; default_statistics_target 100; extended statistics, "the planner normally assumes that multiple conditions are independent of each other"); CREATE STATISTICS; Populating a Database ("Run ANALYZE Afterwards"); autovacuum (50 + 10%).
- PostgreSQL source, src/backend/commands/analyze.c (sample = 300 × statistics target).
- Leis et al., "How Good Are Query Optimizers, Really?", PVLDB 9(3), 2015.
- Microsoft Learn, Statistics (auto-update thresholds; dynamic threshold from SQL Server 2016).
- MySQL 8.4 manual, InnoDB persistent statistics (recalculation after more than 10% of rows change).

Tables, plans, timings and percentages are illustrative.
