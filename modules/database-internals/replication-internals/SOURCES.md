# Sources: Replication under the hood (fact-checked 2026-10-04)

- PostgreSQL 18 docs: §26.2 Log-Shipping Standby Servers (streaming replication, "typically under one second", same major version, replication slots, synchronous replication, synchronous_standby_names); §26.4 Hot Standby (query conflicts, hot_standby_feedback); §19.5 WAL settings (synchronous_commit levels); §19.6 Replication settings (max_slot_wal_keep_size default -1, max_standby_streaming_delay default 30 s); §27.2 pg_stat_replication (write_lag, flush_lag, replay_lag); Ch. 29 Logical Replication (publish/subscribe, restrictions); PostgreSQL 10 release notes.
- MySQL 8.4 manual: Replication Formats, binlog_format (ROW default; deprecated), GTID concepts, Semisynchronous Replication; MySQL 5.7 manual (ROW default since 5.7.7).
- A. Verbitski et al., "Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases", SIGMOD 2017 (6 copies, 3 AZs, 4/6 write and 3/6 read quorums, "the log is the database"); AWS Aurora User Guide, storage reliability.

Commit latencies in the simulation are illustrative.
