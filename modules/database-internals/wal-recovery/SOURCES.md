# Sources: Write-ahead logging and recovery (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Write-Ahead Logging (central concept quote; "roll-forward recovery, also known as REDO"); WAL Configuration (checkpoints quote; checkpoint_timeout 5min; max_wal_size 1GB); full_page_writes; Asynchronous Commit ("data loss, not data corruption"); fsync ("can result in unrecoverable data corruption"); WAL internals (LSN).
- C. Mohan et al., "ARIES: A Transaction Recovery Method Supporting Fine-Granularity Locking and Partial Rollbacks Using Write-Ahead Logging", ACM TODS 17(1), 1992.
- MySQL 8.4 manual: redo log, undo logs, doublewrite buffer.
- SQLite: Write-Ahead Logging (https://www.sqlite.org/wal.html); journal_mode (DELETE default).

The transfer, balances and log records are illustrative.
