# Sources: MVCC (fact-checked 2026-10-04)

- PostgreSQL 18 docs: §13.1 MVCC introduction (snapshots; "reading never blocks writing…"); §5.6 System Columns (xmin, xmax); §66.6 Database Page Layout (t_xmin, t_xmax, t_ctid); §24.1 Routine Vacuuming (dead row versions, space not returned to the OS, autovacuum, bloat, 32-bit XIDs, 2 billion visibility window, freezing, 3 million XID safety stop); §66.7 Heap-Only Tuples (HOT conditions, pruning, fillfactor); idle_in_transaction_session_timeout.
- MySQL 8.4 manual: InnoDB Multi-Versioning (undo logs, rollback segments, consistent reads); Purge Configuration.
- Oracle Database 23 Concepts, Data Concurrency and Consistency (undo segments, read consistency, "snapshot too old").
- D. P. Reed, "Naming and Synchronization in a Decentralized Computer System", MIT-LCS-TR-205, 1978 (PhD 1979).
- P. Bernstein and N. Goodman, "Multiversion Concurrency Control: Theory and Algorithms", ACM TODS 8(4), 1983.

Transaction IDs, prices and index counts in the visuals are illustrative.
