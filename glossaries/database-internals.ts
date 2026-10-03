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
} satisfies Record<string, GlossaryEntry>;
