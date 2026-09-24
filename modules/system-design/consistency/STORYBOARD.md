# Storyboard: Consistency, CAP & quorums

Track: System Design at Scale · Chapter 4 · Module 11 · ~35 min · level: deep

## Steps

| #   | Step                    | Interaction                                                                       | Gate    |
| --- | ----------------------- | --------------------------------------------------------------------------------- | ------- |
| 1   | The line goes dead ⭐   | **Branching scenario**: Mumbai/Delhi partition, a shared wallet; refuse or accept |         |
| 2   | What can a reader see?  | Linearizable / causal / eventual; CAP and PACELC stated precisely                 |         |
| 3   | Quorums: N, W and R ⭐  | **Simulation**: N, W, R, copies down; worst-case read                             |         |
| 4   | The smallest safe read  | N=5, W=3 → R=3                                                                    | predict |
| 5   | When copies disagree    | Last-write-wins loses the cold brew; CRDT set keeps both                          |         |
| 6   | Is it CP or AP?         | Depends on the operation                                                          | choice  |
| 7   | Consistency you'll meet | Cassandra, DynamoDB, Spanner, CockroachDB, MongoDB                                |         |
| 8   | What to remember        |                                                                                   |         |
