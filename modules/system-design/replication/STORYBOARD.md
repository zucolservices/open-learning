# Storyboard: Replication

Track: System Design at Scale · Chapter 4 · Module 9 · ~30 min · level: core

## Steps

| #   | Step                        | Interaction                                                                                             | Gate   |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Where did my change go? ⭐  | **Simulation**: lag × read strategy (any / sticky / leader after writes / wait for LSN); five refreshes |        |
| 2   | Wait for the copy, or not?  | Async / semi-sync / sync × remote replica: write latency vs what a crash loses                          |        |
| 3   | The disappearing photo      | Read-your-writes fix                                                                                    | choice |
| 4   | When the leader dies ⭐     | **Step-through**: failover, lost writes, split brain vs fencing                                         |        |
| 5   | Three shapes of replication | Single-leader / multi-leader / leaderless                                                               |        |
| 6   | The missing orders          | Async failover lost confirmed writes                                                                    | choice |
| 7   | Replication you'll meet     | RDS, Aurora, Cloud SQL, Azure SQL, PostgreSQL/MySQL settings                                            |        |
| 8   | What to remember            |                                                                                                         |        |
