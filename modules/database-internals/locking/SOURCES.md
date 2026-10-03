# Sources: Locks and deadlocks (fact-checked 2026-10-04)

- PostgreSQL 18 docs §13.3 Explicit Locking (table lock modes, row-level locks, deadlocks, advisory locks); §13.1 MVCC introduction ("reading never blocks writing…"); §19.12 Lock Management (deadlock_timeout, default 1s); §19.11 Client Connection Defaults (lock_timeout, statement_timeout, default 0); pg_locks view.
- K. Eswaran, J. Gray, R. Lorie, I. Traiger, "The Notions of Consistency and Predicate Locks in a Database System", CACM 19(11), 1976 (two-phase locking; hold update locks to the end of the transaction).
- MySQL 8.4 manual: InnoDB Locking (gap and next-key locks), Deadlock Detection (innodb_deadlock_detect, "tries to pick small transactions"), SHOW ENGINE INNODB STATUS.
- Microsoft Learn, Transaction locking and row versioning guide (lock escalation at 5,000 locks per statement on one table or index).

The lock simulation is a simplification (exclusive row locks only); the bar charts are illustrative.
