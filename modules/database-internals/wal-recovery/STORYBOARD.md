# Storyboard: Write-ahead logging and recovery

1. **The shop's day book** (story).
2. **Pull the plug** ⭐ (simulation): no log vs WAL × three crash moments; disk, log, recovered balances.
3. **Checkpoints and torn pages** (explore).
4. **Speed versus safety** (compare): synchronous_commit, fsync; InnoDB, SQLite.
5. **After the restart** (checkpoint `after-restart`).
6. **What to remember** (wrap).
