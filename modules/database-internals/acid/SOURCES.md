# Sources: Transactions and ACID (fact-checked 2026-10-04)

- J. Gray, "The Transaction Concept: Virtues and Limitations", VLDB 1981 (atomicity, consistency, durability; the contract analogy).
- T. Haerder and A. Reuter, "Principles of Transaction-Oriented Database Recovery", ACM Computing Surveys 15(4), 1983 (ACID).
- PostgreSQL 18 tutorial §3.4 Transactions (Alice/Bob/Wally example; savepoints); BEGIN ("autocommit"); SAVEPOINT; PREPARE TRANSACTION and max_prepared_transactions (default 0).
- PostgreSQL wiki, Transactional DDL; MySQL 8.0 manual, Statements That Cause an Implicit Commit.
- MongoDB 4.0 release notes (multi-document transactions on replica sets); 4.2 (sharded clusters).

The transfer simulation is illustrative.
