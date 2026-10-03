# Sources: Row stores and column stores (fact-checked 2026-10-04)

- Stonebraker et al., "C-Store: A Column-oriented DBMS", VLDB 2005 ("read-optimized relational DBMS that contrasts sharply with most current systems, which are write-optimized").
- Lamb et al., "The Vertica Analytic Database: C-Store 7 Years Later", VLDB 2012 ("a commercialization of the design of the C-Store research prototype").
- Microsoft Learn, Columnstore indexes overview (rowstore for seeks; columnstore for analytic scans; nonclustered columnstore on OLTP tables).
- ClickHouse docs ("a column-oriented SQL database management system (DBMS) for online analytical processing (OLAP)"); DuckDB ("columnar-vectorized query execution engine"); Amazon Redshift columnar storage; Google BigQuery (Capacitor); Apache Parquet (dictionary and run-length encoding).
- Oracle Database In-Memory (dual format); MySQL HeatWave (in-memory query accelerator).

Sizes and read counts in the simulation are illustrative.
