# Sources: Isolation levels and anomalies (fact-checked 2026-10-04)

- PostgreSQL 18 docs §13.2 Transaction Isolation (phenomena definitions, Table 13.1, read committed default, repeatable read = snapshot isolation, serializable = SSI, retry advice); §13.3 Explicit Locking (FOR UPDATE).
- H. Berenson, P. Bernstein, J. Gray, J. Melton, E. O'Neil, P. O'Neil, "A Critique of ANSI SQL Isolation Levels", SIGMOD 1995 (defines snapshot isolation; P4 lost update; A5B write skew).
- M. Cahill, U. Röhm, A. Fekete, "Serializable Isolation for Snapshot Databases", SIGMOD 2008 (doctors on call).
- D. Ports, K. Grittner, "Serializable Snapshot Isolation in PostgreSQL", PVLDB 5(12), 2012 (PostgreSQL 9.1; Alice/Bob example, Fig. 1).
- A. Fekete et al., "Making Snapshot Isolation Serializable", ACM TODS 2005 (Oracle SERIALIZABLE is snapshot isolation).
- MySQL 8.4 manual, InnoDB transaction isolation levels (REPEATABLE READ default).
- Microsoft Learn, SET TRANSACTION ISOLATION LEVEL (READ COMMITTED default; READ_COMMITTED_SNAPSHOT off on SQL Server, on in Azure SQL Database).
- Oracle Database 19c Concepts, Data Concurrency and Consistency (read committed default).
- Jepsen, PostgreSQL 12.3 (2020): G2-item under serializable in 9.5–13; PostgreSQL 12.4 release notes.

The transaction timelines are illustrative.
