# Sources: Using indexes well (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Indexes: Introduction ("when it thinks doing so would be more efficient than a sequential table scan"); chapter intro ("add overhead to the database system as a whole, so they should be used sensibly"); Multicolumn Indexes ("most efficient when there are constraints on the leading (leftmost) columns"); Index-Only Scans and Covering Indexes (INCLUDE, visibility map); Indexes on Expressions; Partial Indexes ("more than a few percent of all the table rows"); Examining Index Usage.
- PostgreSQL 11 release notes (covering indexes with INCLUDE).
- Markus Winand, Use The Index, Luke ("The UPPER function is just a black box"; leading-wildcard LIKE).
- PostgreSQL pg_stat_user_indexes (idx_scan); MySQL 8.4 sys.schema_unused_indexes.

The orders table, plans and page counts are illustrative.
