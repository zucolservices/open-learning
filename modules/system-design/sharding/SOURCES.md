# Sources: Partitioning & sharding

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-data/`).

| Claim in the module                                                                                            | Verdict  | Source                        |
| -------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| Consistent hashing moves the minimum needed (~1/(n+1)) when a node joins; mod N moves ≈ N/(N+1) (derived)      | Verified | Karger et al. 1997 (STOC)     |
| Virtual nodes introduced by Dynamo                                                                             | Verified | Dynamo, SOSP 2007             |
| Cassandra num_tokens default 16 (256 before 4.0)                                                               | Verified | cassandra.yaml docs           |
| DynamoDB partition max 3,000 RCU / 1,000 WCU; adaptive capacity isolates hot items; GSIs eventually consistent | Verified | DynamoDB developer guide      |
| MongoDB 128 MB ranges, balancer threshold; resharding since 5.0                                                | Verified | MongoDB sharding docs         |
| CockroachDB range_max_bytes 512 MiB                                                                            | Verified | CockroachDB replication zones |
| Vitess (MySQL), Citus (PostgreSQL)                                                                             | Verified | vitess.io; Citus docs         |

## Decisions

- Ring model (model.ts): FNV-1a hash; movement and balance measured over 4,000 keys, 72 drawn. Checked with tsx: mod 74–79% moved; consistent + 32 vnodes ≈ 24–25%; single-point ring badly unbalanced (the reason vnodes exist).
