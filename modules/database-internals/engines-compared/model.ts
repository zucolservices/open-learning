/** How popular engines make their core choices. Versions as of October 2026. */

export type Engine = "postgres" | "mysql" | "sqlite" | "sqlserver" | "oracle" | "rocksdb";
export type Facet = "storage" | "versions" | "writers" | "shape";

export const FACETS: Record<Facet, string> = {
  storage: "Storage",
  versions: "Concurrency",
  writers: "Writers",
  shape: "Runs as",
};

export interface EngineInfo {
  name: string;
  version: string;
  facets: Record<Facet, string>;
  /** Earlier module that explains the key idea. */
  see: string;
}

export const ENGINES: Record<Engine, EngineInfo> = {
  postgres: {
    name: "PostgreSQL",
    version: "18 (Sept 2025); 19 in beta",
    facets: {
      storage:
        "Heap tables: rows in no particular order, with separate B-tree (and other) indexes pointing at them.",
      versions: "MVCC with old row versions kept in the table; VACUUM removes them.",
      writers: "Many concurrent writers; row locks only where writers meet.",
      shape: "A server you connect to; one process per connection.",
    },
    see: "MVCC (module 17)",
  },
  mysql: {
    name: "MySQL (InnoDB)",
    version: "8.4 and 9.7 LTS; innovation releases now numbered like 26.7",
    facets: {
      storage: "The table is its clustered index: rows live inside the primary-key B-tree.",
      versions: "MVCC with old values in undo logs (rollback segments); purge threads clean up.",
      writers: "Many concurrent writers; next-key locks at repeatable read.",
      shape: "A server you connect to. MariaDB, a fork, also uses InnoDB (12.3 LTS).",
    },
    see: "B-trees (module 6), locks (module 16)",
  },
  sqlite: {
    name: "SQLite",
    version: "3.53",
    facets: {
      storage: "The whole database is a single file of B-tree pages.",
      versions: "In WAL mode, readers carry on while a writer writes.",
      writers: "One writer at a time: “there can only be one writer at a time.”",
      shape: "A library inside your app. No server at all.",
    },
    see: "Pages (module 3), WAL (module 13)",
  },
  sqlserver: {
    name: "SQL Server",
    version: "2025 (Nov 2025)",
    facets: {
      storage: "Row-store B-tree pages, with optional columnstore indexes for analytics.",
      versions:
        "Locking by default on-premises; row versioning (READ_COMMITTED_SNAPSHOT, SNAPSHOT) is opt-in.",
      writers: "Many concurrent writers; locks can escalate to a whole table.",
      shape: "A server; Azure SQL Database is the managed version.",
    },
    see: "Isolation (module 15)",
  },
  oracle: {
    name: "Oracle",
    version: "AI Database 26ai (replaced 23ai, Oct 2025)",
    facets: {
      storage: "Rows in data blocks, with B-tree and other indexes.",
      versions: "Read consistency from undo segments: readers rebuild old blocks.",
      writers: "Many concurrent writers; readers never wait for them.",
      shape: "A server, on-premises or in Oracle's cloud.",
    },
    see: "MVCC (module 17)",
  },
  rocksdb: {
    name: "RocksDB",
    version: "Library, continuously released",
    facets: {
      storage: "An LSM tree: memtable, write-ahead log, sorted files merged by compaction.",
      versions: "Snapshots by sequence number; no SQL, just keys and values.",
      writers: "Fast writes: appends, not in-place updates.",
      shape: "A C++ library embedded in other systems (TiKV, for one).",
    },
    see: "LSM trees (module 8)",
  },
};
