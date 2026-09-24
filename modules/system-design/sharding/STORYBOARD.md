# Storyboard: Partitioning & sharding

Track: System Design at Scale · Chapter 4 · Module 10 · ~35 min · level: core

## Steps

| #   | Step                           | Interaction                                                                                              | Gate    |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------- | ------- |
| 1   | Split the phone book           | Range vs hash: write hot spot vs shards touched by "last week"                                           |         |
| 2   | Add a server ⭐                | **3D hash ring**: mod N vs consistent hashing vs virtual nodes; keys that move lift up; share per server |         |
| 3   | How much moves?                | 10 → 11 servers with mod N ≈ 91%                                                                         | predict |
| 4   | Hot keys and scattered queries | Split a celebrity key; scatter-gather vs global index                                                    |         |
| 5   | Pick the shard key             | customer_id                                                                                              | choice  |
| 6   | Sharding you'll meet           | Cassandra, DynamoDB, MongoDB, CockroachDB, Vitess, Citus                                                 |         |
| 7   | What to remember               |                                                                                                          |         |
