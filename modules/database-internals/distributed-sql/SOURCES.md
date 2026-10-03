# Sources: Distributed SQL and consensus (fact-checked 2026-10-04)

- D. Ongaro and J. Ousterhout, "In Search of an Understandable Consensus Algorithm (Extended Version)" (USENIX ATC 2014 Best Paper for the shorter version): terms, randomised election timeouts (150–300 ms), majority commit, five servers tolerate two failures.
- L. Lamport, "The Part-Time Parliament", ACM TOCS 16(2), 1998 (submitted 1990); "Paxos Made Simple", ACM SIGACT News 32(4), 2001.
- J. Corbett et al., "Spanner: Google's Globally-Distributed Database", OSDI 2012 (TrueTime, ε about 1–7 ms, commit wait, Paxos groups); Google Cloud Spanner docs, Replication ("splits").
- CockroachDB docs: replication zones (range_max_bytes 512 MiB, num_replicas 3), replication and distribution layers (Raft), transaction layer (hybrid-logical clocks).
- PingCAP docs: TiDB architecture, TiKV overview (Regions, Multi-Raft, PD); TiKV deep dive, Percolator.
- YugabyteDB docs: DocDB replication (tablets, Raft, fault tolerance by replication factor); YSQL.
- AWS What's New: Aurora DSQL preview (3 Dec 2024), general availability (27 May 2025).
- Microsoft Learn: Azure Cosmos DB for PostgreSQL introduction (retirement path; Elastic Clusters in Azure Database for PostgreSQL).

The Raft simulation is simplified; TrueTime figures in the step-through are illustrative.
