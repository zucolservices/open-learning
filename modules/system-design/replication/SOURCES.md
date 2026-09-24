# Sources: Replication

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-data/`).

| Claim in the module                                                                                                                                                                                     | Verdict   | Source                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| PostgreSQL synchronous_commit (off/local/remote_write/on/remote_apply), quorum standbys; MySQL semi-sync waits for receipt, falls back to async on timeout                                              | Verified  | postgresql.org runtime-config-wal / replication; dev.mysql.com semi-sync  |
| Read-your-writes and monotonic reads (Terry et al. 1994); pg_last_wal_replay_lsn, WAIT_FOR_EXECUTED_GTID_SET; PostgreSQL 19 WAIT FOR LSN                                                                | Verified  | Terry 1994; PostgreSQL and MySQL docs; PG 19 release notes                |
| Multi-leader examples; leaderless = Dynamo-style (Cassandra, Riak) — DynamoDB is not leaderless                                                                                                         | Corrected | MySQL group replication; RDS pgactive; USENIX ATC '22 DynamoDB paper      |
| Fencing tokens; RDS Multi-AZ instance failover typically 60–120 s; DB cluster under 35 s; Aurora 6 copies/3 AZs, write 4/6, read 3/6; Cloud SQL HA synchronous regional disk; Azure SQL Always On-style | Verified  | Kleppmann 2016; AWS RDS docs; AWS Aurora blog; Cloud SQL HA; Azure SQL HA |

## Decisions

- Replica lags, refresh times and which replica serves each refresh are fixed and illustrative (model.ts); commit latencies (1 ms local, ~1.5 ms nearby, ~140 ms remote) are orders of magnitude.
