# Sources: Memory, SSDs and disks (fact-checked 2026-10-04)

- Peter Norvig, "Teach Yourself Programming in Ten Years" (timing table): https://norvig.com/21-days.html
- Jeff Dean's latency numbers, c. 2012 (L1 0.5 ns; main memory 100 ns; SSD 4K random 150 µs; disk seek 10 ms): https://gist.github.com/jboner/2841832 (classic rows only)
- Samsung 990 PRO datasheet (random read 22K IOPS at QD1; ≈45 µs each is our arithmetic).
- Linux kernel docs (x86 4K pages); PostgreSQL 8 kB pages; InnoDB 16 KB default.
- fsync(2): https://man7.org/linux/man-pages/man2/fsync.2.html
- PostgreSQL docs, Write-Ahead Logging ("the cost of syncing the WAL is much less than the cost of flushing the data pages"): https://www.postgresql.org/docs/current/wal-intro.html
- AWS EBS volume types (gp3 "single-digit millisecond"; io2 Block Express "sub-millisecond").

The page-reading exercise and per-read times are illustrative.
