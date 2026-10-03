# Storyboard: Replication under the hood

1. **Chess by post** (story): send the moves, not the board; streaming replication.
2. **How long should a commit wait?** ⭐ (simulation): five synchronous_commit levels, latency and three failure outcomes.
3. **Physical and logical** (compare): block copy vs publish/subscribe.
4. **What goes wrong** (explore): lag, slots filling disks, standby query cancellation.
5. **MySQL and Aurora** (compare): binlog, GTIDs, semisync; Aurora quorum storage.
6. **Pick the level** (checkpoint `pick-commit-level`).
7. **What to remember** (wrap).
