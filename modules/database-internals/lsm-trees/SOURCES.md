# Sources: LSM trees (fact-checked 2026-10-04)

- P. O'Neil, E. Cheng, D. Gawlick, E. O'Neil, "The Log-Structured Merge-Tree (LSM-Tree)", Acta Informatica 33(4), 1996.
- Chang et al., "Bigtable: A Distributed Storage System for Structured Data", OSDI 2006 (memtable and SSTables).
- RocksDB wiki (memtable, sstfile, logfile; forked from LevelDB 1.5; levels; Bloom filters ~10 bits/key ≈ 1%) and Tuning Guide (write/read/space amplification; "compaction is key to change the trade-off among the three").
- B. Bloom, "Space/time trade-offs in hash coding with allowable errors", CACM 13(7), 1970.
- Apache Cassandra docs (tombstones; LSM storage engine); ScyllaDB; CockroachDB Pebble; TiKV.
- Facebook Engineering (2016) and Matsunobu, Dong, Lee, VLDB 2020 (MyRocks storage vs compressed InnoDB).

The memtable size, compaction trigger and keys are illustrative.
