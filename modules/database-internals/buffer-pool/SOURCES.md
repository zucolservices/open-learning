# Sources: The buffer pool (fact-checked 2026-10-04)

- PostgreSQL docs, shared_buffers (default 128MB; 25% of RAM starting point on a dedicated server with 1GB+; more than 40% rarely helps) and effective_cache_size.
- PostgreSQL source: src/backend/storage/buffer/README (clock sweep; buffer rings, "For sequential scans, a 256KB ring is used"); src/include/storage/buf_internals.h (BM_MAX_USAGE_COUNT 5); freelist.c (ring sizing).
- PostgreSQL docs: background writer, checkpoints, EXPLAIN BUFFERS (PostgreSQL 18 includes buffers with ANALYZE), pg_buffercache.
- MySQL 8.4 Reference Manual, Buffer Pool ("a variation of the LRU algorithm", "midpoint insertion strategy", "3/8 of the buffer pool is devoted to the old sublist", "up to 80% of physical memory"); page cleaner threads.
- O'Neil, O'Neil, Weikum, "The LRU-K page replacement algorithm for database disk buffering", SIGMOD 1993; Johnson & Shasha, "2Q", VLDB 1994.

The workload, pool size and hit rates are illustrative.
