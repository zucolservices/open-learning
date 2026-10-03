import type { GlossaryEntry } from "./types";

/** Database Internals track glossary. `module` slugs refer to this track. */
export const databaseInternals = {
  parser: {
    term: "Parser",
    definition:
      "The part of a database that checks a SQL statement's syntax and turns the text into a tree structure the rest of the system can work with.",
    module: "query-journey",
  },
  "query-planner": {
    term: "Query planner",
    definition:
      "The part of a database that works out how to run a query: it considers different ways (which indexes, which join order), estimates the cost of each and picks the cheapest. Also called the optimiser.",
    analogy: "A satnav comparing routes before you set off.",
    module: "query-planning",
  },
  page: {
    term: "Page",
    definition:
      "The fixed-size block a database reads and writes as a unit, usually 8 kB in PostgreSQL, 16 KB in MySQL's InnoDB and 4 KB in SQLite. Tables and indexes are stored as files of pages.",
    module: "pages-rows",
  },
  "buffer-pool": {
    term: "Buffer pool",
    definition:
      "The area of memory where a database keeps copies of recently used pages, so most reads don't have to go to disk. PostgreSQL calls it shared buffers.",
    module: "buffer-pool",
  },
  index: {
    term: "Index",
    definition:
      "A separate structure that lets a database find rows by a column's value without reading the whole table, like the index at the back of a book. It speeds up reads but adds work to every write.",
    module: "btrees",
  },
  durability: {
    term: "Durability",
    definition:
      "The promise that once a database says a change is saved, it survives crashes and power cuts, which means it has reached storage that doesn't forget, not just memory.",
    module: "storage-hierarchy",
  },
  fsync: {
    term: "fsync",
    definition:
      "An operating system call that forces a file's buffered changes out to the storage device and waits until the device confirms, so they survive a crash.",
    module: "storage-hierarchy",
  },
  "slotted-page": {
    term: "Slotted page",
    definition:
      "The usual layout of a database page: a small array of pointers (slots) at the front and the rows packed from the back, so rows can move within the page while their slot numbers stay the same.",
    module: "pages-rows",
  },
  ctid: {
    term: "ctid",
    definition:
      "PostgreSQL's physical address for a row version: its page number and slot number, such as (12,4). It changes when the row is updated, so it can't be used as a permanent ID.",
    module: "pages-rows",
  },
  heap: {
    term: "Heap (table storage)",
    definition:
      "Storing a table's rows in whichever page has room, in no particular order, as PostgreSQL does. Indexes then point to each row's page and slot.",
    module: "pages-rows",
  },
  "row-store": {
    term: "Row store",
    definition:
      "A database that stores all the columns of a record together, so reading or writing one whole record touches one place. Suited to transactional work; PostgreSQL and MySQL are row stores.",
    module: "row-vs-column",
  },
  "column-store": {
    term: "Column store",
    definition:
      "A database that stores each column's values together, so a query reading a few columns over many rows reads only those columns, and similar values compress well. Suited to analytics.",
    module: "row-vs-column",
  },
  oltp: {
    term: "OLTP",
    definition:
      "Online transaction processing: workloads of many small, fast reads and writes of individual records, like placing orders or making payments. Analytics (OLAP) is the opposite: big scans and summaries.",
    module: "row-vs-column",
  },
  "cache-hit": {
    term: "Cache hit",
    definition:
      "Finding the data you need already in memory, so no trip to storage is needed. A miss means reading it from disk or SSD, thousands of times slower.",
    module: "buffer-pool",
  },
  eviction: {
    term: "Eviction",
    definition:
      "Removing a page from a full cache to make room for another. The eviction policy (such as LRU or clock sweep) decides which page goes.",
    module: "buffer-pool",
  },
  "dirty-page": {
    term: "Dirty page",
    definition:
      "A page in memory that has been changed but not yet written back to storage. It must be flushed before its memory can be reused.",
    module: "buffer-pool",
  },
  btree: {
    term: "B-tree",
    definition:
      "A balanced tree of pages used for most database indexes: upper pages hold guide keys pointing to lower pages, and the leaves hold every key in sorted order, so any key is found in a few page reads.",
    analogy: "A multi-volume dictionary with guide words at the top of every page.",
    module: "btrees",
  },
  "page-split": {
    term: "Page split",
    definition:
      "What happens when a B-tree page is full and a new key must go in: part of its keys move to a new page and the parent gets a pointer to it. A split of the root adds a level to the tree.",
    module: "btrees",
  },
  "composite-index": {
    term: "Composite index",
    definition:
      "An index on several columns, sorted by the first column, then the second, and so on. It helps queries that filter on its leading columns, like a phone book sorted by surname then first name.",
    module: "using-indexes",
  },
  "covering-index": {
    term: "Covering index",
    definition:
      "An index that contains every column a query needs, so the database can answer from the index alone (an index-only scan) without reading the table.",
    module: "using-indexes",
  },
  selectivity: {
    term: "Selectivity",
    definition:
      "The share of rows a condition matches. A selective condition matches few rows and suits an index; one matching most of the table is cheaper to answer with a full scan.",
    module: "using-indexes",
  },
  "lsm-tree": {
    term: "LSM tree",
    definition:
      "Log-structured merge-tree: a storage design that collects writes in memory, writes them out as sorted immutable files, and merges those files in the background. Very fast writes; reads may check several files.",
    module: "lsm-trees",
  },
  memtable: {
    term: "Memtable",
    definition:
      "The sorted in-memory table where an LSM tree collects new writes before flushing them to disk as a file.",
    module: "lsm-trees",
  },
  sstable: {
    term: "SSTable",
    definition:
      "Sorted string table: an immutable file of key-value pairs sorted by key, written when an LSM tree's memtable is flushed.",
    module: "lsm-trees",
  },
  compaction: {
    term: "Compaction",
    definition:
      "Merging data files in the background, keeping only the newest version of each key and removing deleted entries, so reads check fewer files and old data stops using disk space.",
    module: "lsm-trees",
  },
  "bloom-filter": {
    term: "Bloom filter",
    definition:
      "A compact bit array that can say 'definitely not here' or 'maybe here' for a key, with a small rate of false 'maybes'. LSM trees use one per file to skip files that can't contain a key.",
    module: "lsm-trees",
  },
  "inverted-index": {
    term: "Inverted index",
    definition:
      "An index that lists every word (or element) and, for each, the documents or rows that contain it, like the index at the back of a book. Used for full-text search, arrays and JSON.",
    module: "other-indexes",
  },
  "vector-index": {
    term: "Vector index",
    definition:
      "An index for finding the stored vectors (lists of numbers that capture meaning) closest to a query vector. Approximate ones such as HNSW trade a little accuracy for much faster search.",
    module: "other-indexes",
  },
  "query-plan": {
    term: "Query plan",
    definition:
      "The tree of steps a database chooses to run a query, such as which tables to scan, which indexes to use and how to join them. The same query can have many possible plans with very different costs.",
    module: "query-planning",
  },
  explain: {
    term: "EXPLAIN",
    definition:
      "A SQL command that shows the plan the database would use for a query, with estimated costs and row counts. EXPLAIN ANALYZE also runs the query and shows what actually happened.",
    module: "query-planning",
  },
  join: {
    term: "Join",
    definition:
      "Combining rows from two tables that match on a condition, such as each order with its customer. Databases do it with nested loops, hash joins or merge joins.",
    module: "joins",
  },
  "hash-join": {
    term: "Hash join",
    definition:
      "A join method that builds an in-memory lookup table from one input, then streams the other input through it to find matches. Fast for large equality joins; slows down if the table spills to disk.",
    module: "joins",
  },
  "table-statistics": {
    term: "Table statistics",
    definition:
      "Summaries a database keeps about its data, such as row counts, distinct values and common values with their frequencies, which the planner uses to estimate how many rows each step will produce.",
    module: "cost-optimiser",
  },
  "cardinality-estimate": {
    term: "Cardinality estimate",
    definition:
      "The planner's guess of how many rows a step of a query will produce. When it's far from reality, the planner can choose a plan that is thousands of times slower.",
    module: "cost-optimiser",
  },
  wal: {
    term: "Write-ahead log (WAL)",
    definition:
      "A sequential log on disk where a database records every change before changing the data files. After a crash, replaying it restores committed work.",
    analogy: "A shop's day book, written before the ledgers are updated.",
    module: "wal-recovery",
  },
  checkpoint: {
    term: "Checkpoint",
    definition:
      "A moment when a database has written all changed pages up to that point to disk, so crash recovery only needs to replay the log from there.",
    module: "wal-recovery",
  },
  lsn: {
    term: "Log sequence number (LSN)",
    definition:
      "A position in the write-ahead log that only ever increases, used to order changes and to track how far recovery or a replica has got.",
    module: "wal-recovery",
  },
  transaction: {
    term: "Transaction",
    definition:
      "A group of database changes treated as one unit: either all of them take effect (COMMIT) or none do (ROLLBACK), even if something fails halfway.",
    analogy: "A contract: either everyone is bound by it or no one is.",
    module: "acid",
  },
  acid: {
    term: "ACID",
    definition:
      "The four guarantees of a transaction: Atomic (all or nothing), Consistent (rules hold), Isolated (concurrent transactions don't see each other's unfinished work) and Durable (committed changes survive crashes). Named by Härder and Reuter in 1983.",
    module: "acid",
  },
  autocommit: {
    term: "Autocommit",
    definition:
      "The default mode in which each SQL statement runs as its own transaction and commits immediately, unless you start a transaction explicitly with BEGIN.",
    module: "acid",
  },
  "isolation-level": {
    term: "Isolation level",
    definition:
      "A setting that decides how much concurrent transactions may see of each other's work, and so which anomalies can happen: read uncommitted, read committed, repeatable read or serializable.",
    analogy: "How many bank counters share one ledger at once.",
    module: "isolation",
  },
  "dirty-read": {
    term: "Dirty read",
    definition:
      "Reading data written by another transaction that hasn't committed yet, and might still roll back.",
    module: "isolation",
  },
  "non-repeatable-read": {
    term: "Non-repeatable read",
    definition:
      "Reading the same row twice in one transaction and getting different values, because another transaction changed it and committed in between.",
    module: "isolation",
  },
  "phantom-read": {
    term: "Phantom read",
    definition:
      "Running the same search twice in one transaction and getting a different set of rows, because another transaction inserted or deleted matching rows and committed.",
    module: "isolation",
  },
  "write-skew": {
    term: "Write skew",
    definition:
      "Two concurrent transactions read overlapping data, then each updates a different row based on what it read, together breaking a rule neither would break alone (for example, both on-call doctors going off call).",
    module: "isolation",
  },
  "snapshot-isolation": {
    term: "Snapshot isolation",
    definition:
      "Each transaction reads from a consistent snapshot of the database taken when it starts, and a write fails if another transaction already changed the same row. Prevents dirty reads, non-repeatable reads and lost updates, but allows write skew.",
    module: "isolation",
  },
  ssi: {
    term: "Serializable snapshot isolation (SSI)",
    definition:
      "Snapshot isolation plus tracking of which transactions read what others wrote; when a pattern could produce a non-serializable result, one transaction is aborted to be retried. PostgreSQL's serializable level since 9.1.",
    module: "isolation",
  },
  lock: {
    term: "Lock",
    definition:
      "A claim a transaction holds on a row, table or other object so that conflicting transactions must wait until it's released, usually at COMMIT or ROLLBACK.",
    analogy: "Holding the only knife in a kitchen.",
    module: "locking",
  },
  deadlock: {
    term: "Deadlock",
    definition:
      "Two or more transactions each waiting for a lock another of them holds, so none can proceed. Databases detect the cycle and abort one of them.",
    analogy:
      "Two cooks: one holds the knife and wants the board, the other holds the board and wants the knife.",
    module: "locking",
  },
  "deadlock-timeout": {
    term: "deadlock_timeout",
    definition:
      "PostgreSQL setting: how long a transaction waits for a lock before the server checks whether it is part of a deadlock. Default 1 second. It doesn't abort anything by itself.",
    module: "locking",
  },
  "two-phase-locking": {
    term: "Two-phase locking (2PL)",
    definition:
      "A rule for locking: a transaction takes all its locks (growing phase) before releasing any (shrinking phase). It guarantees a serializable result. Strict 2PL holds write locks until commit.",
    module: "locking",
  },
  "gap-lock": {
    term: "Gap lock",
    definition:
      "In MySQL InnoDB, a lock on the space between index entries that stops other transactions inserting there. Combined with a lock on the entry itself it's a next-key lock, used to prevent phantom rows.",
    module: "locking",
  },
  "lock-escalation": {
    term: "Lock escalation",
    definition:
      "Replacing many fine-grained locks (rows or pages) with one coarse lock (a table) to save memory, at the cost of blocking more of other transactions' work. SQL Server does this automatically.",
    module: "locking",
  },
  mvcc: {
    term: "MVCC (multi-version concurrency control)",
    definition:
      "Keeping several versions of each row so that every transaction reads a consistent snapshot. Readers don't block writers and writers don't block readers; old versions are cleaned up later.",
    analogy:
      "Pinning the new timetable beside the old one instead of taking the old one down mid-read.",
    module: "mvcc",
  },
  xmin: {
    term: "xmin and xmax",
    definition:
      "Hidden columns on every PostgreSQL row version: xmin is the ID of the transaction that created it, xmax the ID of the transaction that deleted or replaced it (0 if none). Together with a snapshot they decide which version a transaction sees.",
    module: "mvcc",
  },
  "vacuum-pg": {
    term: "VACUUM (PostgreSQL)",
    definition:
      "The PostgreSQL command that removes dead row versions no transaction can still see, marks their space reusable and freezes old rows against transaction ID wraparound. It doesn't normally shrink the table file.",
    module: "mvcc",
  },
  autovacuum: {
    term: "Autovacuum",
    definition:
      "PostgreSQL's background process that runs VACUUM and ANALYZE automatically as tables change.",
    module: "mvcc",
  },
  "xid-wraparound": {
    term: "Transaction ID wraparound",
    definition:
      "PostgreSQL transaction IDs are 32-bit and compared on a circle, so a row left unfrozen for more than about 2 billion transactions would appear to be in the future and vanish. VACUUM's freezing prevents it.",
    module: "mvcc",
  },
  "hot-update": {
    term: "HOT update",
    definition:
      "A heap-only tuple update in PostgreSQL: when no indexed column changes and the page has free space, the new row version stays on the same page and no new index entries are written.",
    module: "mvcc",
  },
  "undo-log": {
    term: "Undo log",
    definition:
      "A record of the old values of changed rows, kept so a transaction can be rolled back and so readers can rebuild earlier versions for their snapshot. Used by InnoDB and Oracle for MVCC.",
    module: "mvcc",
  },
  snapshot: {
    term: "Snapshot",
    definition:
      "The view of the database a transaction or statement reads from: only changes committed before it was taken are visible, whatever happens afterwards.",
    module: "mvcc",
  },
  "streaming-replication": {
    term: "Streaming replication",
    definition:
      "PostgreSQL's built-in physical replication: the primary sends write-ahead log records to standbys as they're generated, and each standby replays them to stay a byte-for-byte copy.",
    analogy: "Chess by post: send each move, and the other board stays identical.",
    module: "replication-internals",
  },
  "hot-standby": {
    term: "Hot standby",
    definition:
      "A replica that accepts read-only queries while it keeps replaying the primary's log, ready to be promoted if the primary fails.",
    module: "replication-internals",
  },
  "logical-replication": {
    term: "Logical replication",
    definition:
      "Replicating row-level changes (inserts, updates, deletes) for chosen tables, decoded from the log, using publish and subscribe. Works across major versions; doesn't copy schema changes.",
    module: "replication-internals",
  },
  "synchronous-commit": {
    term: "synchronous_commit",
    definition:
      "PostgreSQL setting for when a commit is reported as done: off, local (flushed locally), remote_write, on or remote_apply (the standby has written, flushed or applied it). The remote levels need a synchronous standby to be configured.",
    module: "replication-internals",
  },
  binlog: {
    term: "Binary log (binlog)",
    definition:
      "MySQL's log of committed changes, separate from InnoDB's redo log. Replicas read it and replay its events; it's also used for point-in-time recovery and change data capture.",
    module: "replication-internals",
  },
  gtid: {
    term: "GTID",
    definition:
      "Global transaction identifier: a unique ID MySQL gives every committed transaction across a replication topology, so replicas can track what they've applied without log file positions.",
    module: "replication-internals",
  },
  semisync: {
    term: "Semi-synchronous replication",
    definition:
      "MySQL mode where a commit waits until at least one replica has received the change and flushed it to its relay log (not applied it). Falls back to asynchronous if no replica answers in time.",
    module: "replication-internals",
  },
  "distributed-sql": {
    term: "Distributed SQL",
    definition:
      "A relational database that spreads its data across many machines, replicates each piece with a consensus protocol, and still offers SQL and ACID transactions. Examples: Spanner, CockroachDB, TiDB, YugabyteDB.",
    module: "distributed-sql",
  },
  consensus: {
    term: "Consensus",
    definition:
      "Getting a group of machines to agree on a sequence of values (such as log entries) even when some crash or messages are lost. Raft and Paxos are consensus protocols.",
    analogy: "Five friends booking a restaurant: it's decided once three say yes.",
    module: "distributed-sql",
  },
  raft: {
    term: "Raft",
    definition:
      "A consensus protocol (Ongaro and Ousterhout, 2014) designed to be understandable: an elected leader copies log entries to followers, and an entry commits once a majority has it.",
    module: "distributed-sql",
  },
  paxos: {
    term: "Paxos",
    definition:
      "Leslie Lamport's consensus protocol (published 1998), the foundation of many replicated systems, including Google's Spanner.",
    module: "distributed-sql",
  },
  truetime: {
    term: "TrueTime",
    definition:
      "Google Spanner's clock API: it returns the current time as an interval guaranteed to contain the true time, using GPS and atomic clocks. Spanner waits out the uncertainty before making a commit visible.",
    module: "distributed-sql",
  },
  hlc: {
    term: "Hybrid logical clock (HLC)",
    definition:
      "A timestamp made of a physical part (close to wall-clock time) and a logical counter that orders events with the same physical time. Used by CockroachDB.",
    module: "distributed-sql",
  },
  "clustered-index": {
    term: "Clustered index",
    definition:
      "An index that holds the table's rows themselves, in key order, rather than pointers to them. In MySQL's InnoDB every table is stored as a clustered index on its primary key.",
    module: "engines-compared",
  },
  "pg-stat-statements": {
    term: "pg_stat_statements",
    definition:
      "A PostgreSQL extension that tracks planning and execution statistics for every normalised SQL statement, so you can see which queries use the most time. It must be loaded via shared_preload_libraries.",
    module: "capstone-db",
  },
} satisfies Record<string, GlossaryEntry>;
