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
} satisfies Record<string, GlossaryEntry>;
