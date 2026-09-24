import type { GlossaryEntry } from "./types";

/** Modern Data Lakehouse track glossary. `module` slugs refer to this track. */
export const dataLakehouse = {
  "hive-metastore": {
    term: "Hive Metastore",
    definition:
      "A long-standing catalog service that stores each table's name, schema, partitions and folder location. It stores metadata only; the data files live in storage.",
    module: "what-makes-a-table",
  },
  "hive-table": {
    term: "Hive-style table",
    definition:
      "A table defined as “all the files in this folder”, usually with one sub-folder per partition value (date=2026-09-24/). Simple, but with no record of which files belong at any moment.",
    module: "what-makes-a-table",
  },
  "column-chunk": {
    term: "Column chunk",
    definition:
      "All the values of one column within one row group, stored together in one contiguous stretch of a Parquet file.",
    module: "inside-parquet",
  },
  "parquet-footer": {
    term: "Parquet footer",
    definition:
      "The metadata at the end of a Parquet file: the schema, where every row group and column chunk sits, and statistics such as min and max. Readers read it first.",
    analogy: "The index at the back of a book.",
    module: "inside-parquet",
  },
  "projection-pruning": {
    term: "Projection pruning",
    definition: "Reading only the columns a query actually uses and skipping the rest.",
    module: "inside-parquet",
  },
  "page-index": {
    term: "Page index",
    definition:
      "Optional per-page min/max values and locations, stored near the footer, so a reader can skip individual pages inside a column chunk.",
    module: "inside-parquet",
  },
  "bloom-filter": {
    term: "Bloom filter",
    definition:
      "A compact structure that answers “is this value definitely not here?”. Useful for skipping data on equality filters like id = 42 when min/max can't help.",
    module: "inside-parquet",
  },
  "rep-def-levels": {
    term: "Repetition & definition levels",
    definition:
      "Two small numbers stored with each value of a nested column, recording where lists start and where values are missing, so nested data can be stored column by column.",
    module: "inside-parquet",
  },
  serialization: {
    term: "Serialization",
    definition:
      "Turning data in memory (like a table) into a line of bytes that can be saved to a file or sent over a network, and back again.",
    analogy: "Packing a room into boxes for a move, in an order you can unpack from.",
    module: "file-formats",
  },
  splittable: {
    term: "Splittable",
    definition:
      "A file is splittable if many workers can each start reading from the middle of it, so one big file can be processed in parallel.",
    module: "file-formats",
  },
  "self-describing": {
    term: "Self-describing file",
    definition:
      "A file that carries its own schema (column names and types) inside it, so a reader needs nothing else to understand it. Avro, Parquet and ORC are; CSV is not.",
    module: "file-formats",
  },
  arrow: {
    term: "Apache Arrow",
    definition:
      "A columnar format for data in memory, so engines and languages can share data without converting it. It complements Parquet, which is for storage.",
    module: "file-formats",
  },
  oltp: {
    term: "OLTP",
    definition:
      "Online transaction processing: many small, fast reads and writes of individual records, like placing an order or updating stock.",
    analogy: "The billing counter: one customer at a time, and it must be quick.",
    module: "swamp-to-lakehouse",
  },
  olap: {
    term: "OLAP",
    definition:
      "Online analytical processing: big scans and summaries over lots of historical data, like revenue by city for three years.",
    analogy: "The accountant at month end, going through every bill in the shop.",
    module: "swamp-to-lakehouse",
  },
  "data-warehouse": {
    term: "Data warehouse",
    definition:
      "A database built for analytics: clean tables and fast SQL, traditionally with storage and compute bundled in one system.",
    module: "swamp-to-lakehouse",
  },
  etl: {
    term: "ETL",
    definition:
      "Extract, transform, load: a job that copies data out of one system, reshapes it, and loads it into another.",
    module: "swamp-to-lakehouse",
  },
  "data-lake": {
    term: "Data lake",
    definition:
      "A large, cheap store that keeps data of every kind in its raw form, usually as files in object storage.",
    module: "swamp-to-lakehouse",
  },
  "data-swamp": {
    term: "Data swamp",
    definition:
      "A data lake nobody trusts any more: no transactions, no enforced schema and no catalog, so nobody knows which data is right.",
    module: "swamp-to-lakehouse",
  },
  lakehouse: {
    term: "Lakehouse",
    definition:
      "An architecture that gives warehouse-style guarantees (transactions, schema, governance) on one copy of open files in object storage, readable by many engines.",
    module: "swamp-to-lakehouse",
  },
  "schema-on-read": {
    term: "Schema-on-read",
    definition:
      "Storing data as-is and deciding its structure only when reading it. Flexible, but nothing stops bad data from coming in.",
    module: "swamp-to-lakehouse",
  },
  engine: {
    term: "Query engine",
    definition:
      "The software that actually runs your SQL or code over the data, such as Spark, Trino, DuckDB or a cloud warehouse.",
    analogy: "The chef. The data is the pantry.",
    module: "query-engines",
  },
  "object-storage": {
    term: "Object storage",
    definition:
      "Cloud storage (Amazon S3, Google Cloud Storage, Azure) that stores each blob of bytes under a key. Cheap, durable and huge, but not a real file system.",
    analogy:
      "A giant cloakroom: hand over a coat, get a ticket (the key), and get the coat back with the ticket.",
    module: "object-storage",
  },
  bucket: {
    term: "Bucket",
    definition:
      "A top-level container in object storage. Every object lives in exactly one bucket.",
    module: "object-storage",
  },
  "key-prefix": {
    term: "Key and prefix",
    definition:
      "An object's key is its full name, like sales/2026/09/part-0.parquet. A prefix is the start of a key; the “folders” you see are just prefixes.",
    module: "object-storage",
  },
  "put-if-absent": {
    term: "Put-if-absent",
    definition:
      "A write that only succeeds if the key doesn't exist yet. When two writers race, exactly one wins. Also called a conditional write.",
    module: "object-storage",
  },
  "storage-class": {
    term: "Storage class",
    definition:
      "A price and speed tier in object storage. Colder classes cost less to keep but more (or longer) to read.",
    module: "object-storage",
  },
  "lifecycle-rule": {
    term: "Lifecycle rule",
    definition:
      "A rule that moves objects to cheaper storage classes, or deletes them, once they reach a certain age.",
    module: "object-storage",
  },
  "small-files": {
    term: "Small-files problem",
    definition:
      "When a table is split into too many tiny files, engines spend more time opening files and making requests than reading data.",
    module: "data-skipping",
  },
  avro: {
    term: "Avro",
    definition:
      "A compact, row-oriented binary format with an embedded schema. Popular for streaming and data exchange.",
    module: "file-formats",
  },
  orc: {
    term: "ORC",
    definition:
      "Optimized Row Columnar: an open columnar file format from the Hive world, similar in spirit to Parquet.",
    module: "file-formats",
  },
  parquet: {
    term: "Parquet",
    definition:
      "The most widely used open columnar file format for analytics. It stores data column by column, compressed, with statistics that let engines skip data.",
    module: "inside-parquet",
  },
  columnar: {
    term: "Columnar storage",
    definition:
      "Storing all values of one column together, instead of one row at a time. Analytics queries then read only the columns they need.",
    analogy: "A cupboard sorted by item type (all cups together) instead of by meal.",
    module: "file-formats",
  },
  compression: {
    term: "Compression",
    definition:
      "Encoding data in fewer bytes. Columnar data compresses very well because similar values sit together.",
    module: "inside-parquet",
  },
  encoding: {
    term: "Encoding",
    definition:
      "Clever ways of writing values compactly before compression, such as a dictionary (store 'paid' once, then refer to it) or run-length (write '5 × paid').",
    module: "inside-parquet",
  },
  "row-group": {
    term: "Row group",
    definition:
      "A horizontal slice of a Parquet file, typically many thousands of rows, stored column by column.",
    module: "inside-parquet",
  },
  statistics: {
    term: "Min/max statistics",
    definition:
      "The smallest and largest value of a column in a file or row group. If you look for amount > 500 and the max is 300, the whole chunk can be skipped.",
    module: "inside-parquet",
  },
  "predicate-pushdown": {
    term: "Predicate pushdown",
    definition:
      "Applying a query's filter (the WHERE clause) as early as possible, at the file or storage level, so less data is read.",
    module: "query-engines",
  },
  "data-skipping": {
    term: "Data skipping",
    definition:
      "Using metadata and statistics to avoid reading files or chunks that can't contain matching rows.",
    module: "data-skipping",
  },
  partition: {
    term: "Partition",
    definition:
      "Splitting a table into groups by a column (such as date) so queries that filter on it only read the matching groups.",
    analogy: "A file cabinet with one drawer per month.",
    module: "partitioning",
  },
  "z-order": {
    term: "Z-order / clustering",
    definition:
      "Arranging rows so that values of several columns sit close together in the same files, so more files can be skipped.",
    module: "data-skipping",
  },
  compaction: {
    term: "Compaction",
    definition:
      "Rewriting many small files into fewer large ones (OPTIMIZE in Delta, rewrite_data_files in Iceberg).",
    module: "table-maintenance",
  },
  "table-format": {
    term: "Open table format",
    definition:
      "A layer of metadata over data files (Delta Lake, Apache Iceberg, Apache Hudi) that turns a folder of files into a real table with transactions.",
    module: "what-makes-a-table",
  },
  "delta-lake": {
    term: "Delta Lake",
    definition:
      "An open table format that records every change in an ordered transaction log (_delta_log/).",
    module: "delta-lake",
  },
  iceberg: {
    term: "Apache Iceberg",
    definition:
      "An open table format that tracks files through a tree of metadata, with the current state held by a catalog pointer.",
    module: "apache-iceberg",
  },
  hudi: {
    term: "Apache Hudi",
    definition:
      "An open table format built for fast upserts and incremental processing, organised around a timeline of actions.",
    module: "apache-hudi",
  },
  "transaction-log": {
    term: "Transaction log",
    definition:
      "An append-only list of every change made to a table, in order. Replaying it gives the table at any point.",
    analogy:
      "A bank passbook: every deposit and withdrawal is a line; the balance is what the lines add up to.",
    module: "delta-lake",
  },
  commit: {
    term: "Commit",
    definition:
      "The moment a change becomes official and visible. In a table format, writing the next log or metadata entry.",
    module: "delta-lake",
  },
  snapshot: {
    term: "Snapshot / version",
    definition:
      "The complete state of a table at one point in its history: exactly which files made it up.",
    module: "delta-lake",
  },
  "time-travel": {
    term: "Time travel",
    definition: "Querying a table as it was at an earlier version or time, e.g. VERSION AS OF 3.",
    module: "delta-lake",
  },
  checkpoint: {
    term: "Checkpoint (Delta)",
    definition:
      "A Parquet file that summarises the whole table state at one version, so readers don't have to replay every log entry from the start.",
    module: "delta-lake",
  },
  vacuum: {
    term: "VACUUM",
    definition:
      "A maintenance command that permanently deletes data files no longer used by the table and older than the retention period.",
    module: "table-maintenance",
  },
  retention: {
    term: "Retention period",
    definition:
      "How long old files or history are kept before clean-up may delete them. It limits how far back time travel reaches.",
    module: "table-maintenance",
  },
  "optimistic-concurrency": {
    term: "Optimistic concurrency",
    definition:
      "Letting writers work in parallel without locks, and checking for conflicts only at commit time. On a clash, one retries or fails.",
    module: "acid-and-concurrency",
  },
  isolation: {
    term: "Isolation",
    definition:
      "How far concurrent transactions are shielded from each other's half-finished work.",
    module: "acid-and-concurrency",
  },
  "copy-on-write": {
    term: "Copy-on-write",
    definition:
      "Changing rows by rewriting the whole files that contain them. Reads stay simple; writes are expensive.",
    module: "updates-and-deletes",
  },
  "merge-on-read": {
    term: "Merge-on-read",
    definition:
      "Recording changes separately (delete files, logs) and merging them in when reading. Writes are cheap; reads do extra work.",
    module: "updates-and-deletes",
  },
  "deletion-vector": {
    term: "Deletion vector",
    definition:
      "A small bitmap marking which rows of a file are deleted, so the file doesn't have to be rewritten.",
    module: "updates-and-deletes",
  },
  upsert: {
    term: "Upsert",
    definition: "Update the row if it exists, insert it if it doesn't.",
    module: "cdc-and-merge",
  },
  merge: {
    term: "MERGE",
    definition:
      "A SQL statement that upserts and deletes rows in one go by matching a source against a target table.",
    module: "cdc-and-merge",
  },
  cdc: {
    term: "CDC",
    definition:
      "Change data capture: turning every insert, update and delete in a database into a stream of change events.",
    module: "cdc-and-merge",
  },
  scd: {
    term: "Slowly changing dimension",
    definition:
      "Ways to handle attributes that change over time, like a customer's city: overwrite it (Type 1) or keep history rows (Type 2).",
    module: "cdc-and-merge",
  },
  "partition-pruning": {
    term: "Partition pruning",
    definition:
      "Skipping whole partitions (folders) whose values can't match a query's filter on the partition column.",
    analogy: "Opening only the drawer labelled with the date you need.",
    module: "partitioning",
  },
  "liquid-clustering": {
    term: "Liquid clustering",
    definition:
      "A Delta Lake layout that groups rows into files by up to four clustering keys instead of partition folders. Keys can change without rewriting existing data.",
    module: "partitioning",
  },
  "schema-enforcement": {
    term: "Schema enforcement",
    definition:
      "Rejecting writes that don't match the table's schema (wrong types, unknown columns, missing required values). The whole write fails; nothing is committed.",
    analogy: "A receptionist who won't accept a form with letters in the phone-number box.",
    module: "schema-evolution",
  },
  "schema-evolution": {
    term: "Schema evolution",
    definition:
      "Changing a table's schema on purpose (adding, renaming, dropping or widening columns) without breaking old data or rewriting it.",
    module: "schema-evolution",
  },
  "column-mapping": {
    term: "Column mapping (Delta)",
    definition:
      "A Delta table feature that gives columns stable IDs/physical names, so renames and drops become metadata-only changes. Set with delta.columnMapping.mode = 'name'.",
    module: "schema-evolution",
  },
  variant: {
    term: "VARIANT type",
    definition:
      "A column type for semi-structured, JSON-like data stored in an efficient binary encoding, so fields can vary from row to row without schema changes.",
    module: "schema-evolution",
  },
  "write-amplification": {
    term: "Write amplification",
    definition:
      "Writing far more data than actually changed, e.g. rewriting a whole 128 MB file to change one row under Copy-on-Write.",
    module: "updates-and-deletes",
  },
  "read-amplification": {
    term: "Read amplification",
    definition:
      "Extra work every read must do beyond reading the data itself, e.g. applying pending delete files, deletion vectors or log files under Merge-on-Read.",
    module: "updates-and-deletes",
  },
  serializable: {
    term: "Serializable isolation",
    definition:
      "The strictest common isolation level: concurrent transactions must produce a result that matches running them one at a time, in the order the history shows.",
    module: "acid-and-concurrency",
  },
  "write-serializable": {
    term: "WriteSerializable",
    definition:
      "Databricks' default Delta isolation level. Writes are serializable, but a blind append doesn't conflict with a concurrent reader, so more jobs succeed while history can describe an order that didn't really happen.",
    module: "acid-and-concurrency",
  },
  "blind-append": {
    term: "Blind append",
    definition:
      "A write that adds new rows without reading the table first, such as a plain INSERT. It can't be invalidated by other writers' data changes.",
    module: "acid-and-concurrency",
  },
  uniform: {
    term: "UniForm (Delta)",
    definition:
      "A Delta Lake feature that also writes Iceberg (and, in preview, Hudi) metadata for the same Parquet files, so Iceberg readers can query a Delta table without copying it.",
    module: "format-showdown",
  },
  xtable: {
    term: "Apache XTable",
    definition:
      "An incubating Apache project (formerly OneTable) that translates table metadata between Delta, Iceberg and Hudi, without copying data files.",
    module: "format-showdown",
  },
  "hudi-timeline": {
    term: "Timeline (Hudi)",
    definition:
      "Hudi's record of every action on a table (commits, cleans, compactions…), stored as small files under .hoodie/timeline/. Readers only trust actions marked completed.",
    analogy: "The order rail in a restaurant kitchen: tickets requested, in progress, served.",
    module: "apache-hudi",
  },
  "hudi-instant": {
    term: "Instant (Hudi)",
    definition:
      "One action on the Hudi timeline: an action type, a requested time, a state (requested, inflight or completed) and, once done, a completion time.",
    module: "apache-hudi",
  },
  "record-key": {
    term: "Record key",
    definition:
      "The field (or fields) that uniquely identify a record, such as trip_id. Hudi uses it to route updates and deletes to the right file group.",
    module: "apache-hudi",
  },
  "file-group": {
    term: "File group",
    definition:
      "Hudi's unit of storage within a partition: a set of records identified by a file ID, stored as a series of file slices (a base file plus log files).",
    module: "apache-hudi",
  },
  "hudi-index": {
    term: "Index (Hudi)",
    definition:
      "The mechanism Hudi uses to find which file group holds a record key, such as Simple, Bloom, Bucket or a record-level index in the metadata table.",
    module: "apache-hudi",
  },
  "hudi-metadata-table": {
    term: "Metadata table (Hudi)",
    definition:
      "An internal table under .hoodie/metadata that stores file listings, column statistics and indexes, so engines don't have to list storage or open every file.",
    module: "apache-hudi",
  },
  "iceberg-metadata-file": {
    term: "Metadata file (Iceberg)",
    definition:
      "A JSON file describing an Iceberg table: its schemas, partition specs, snapshots and which snapshot is current. Each commit writes a new one; the catalog points to the latest.",
    analogy: "The library's guide, reprinted as a new edition for every change.",
    module: "apache-iceberg",
  },
  "manifest-list": {
    term: "Manifest list",
    definition:
      "An Avro file, one per Iceberg snapshot, naming the manifests in that snapshot with a summary of each manifest's partition values, so whole manifests can be skipped.",
    module: "apache-iceberg",
  },
  manifest: {
    term: "Manifest",
    definition:
      "An Avro file listing a set of Iceberg data (or delete) files, with each file's partition, row count, size and per-column statistics such as min and max.",
    module: "apache-iceberg",
  },
  "hidden-partitioning": {
    term: "Hidden partitioning",
    definition:
      "Iceberg derives partition values from ordinary columns with a transform (e.g. days(order_ts)), so users never fill in or filter on a separate partition column.",
    module: "apache-iceberg",
  },
  "partition-transform": {
    term: "Partition transform",
    definition:
      "A function that turns a column value into a partition value: identity, years, months, days, hours, bucket(N) or truncate(W).",
    module: "apache-iceberg",
  },
  "partition-evolution": {
    term: "Partition evolution",
    definition:
      "Changing how a table is partitioned as a metadata-only change. New data uses the new layout; old files keep theirs and are never rewritten.",
    module: "apache-iceberg",
  },
  "field-id": {
    term: "Field ID",
    definition:
      "A permanent number Iceberg gives every column. Data files are read by ID, not name, so renames, drops and re-adds can never mix up columns.",
    module: "apache-iceberg",
  },
  "iceberg-branch": {
    term: "Branch / tag (Iceberg)",
    definition:
      "Named pointers to snapshots. A branch can take new commits (e.g. for write-audit-publish); a tag is fixed and can keep a snapshot from being expired.",
    module: "apache-iceberg",
  },
  "equality-delete": {
    term: "Equality delete",
    definition:
      "An Iceberg delete file that removes rows by column values (e.g. order_id = 1042). Cheap to write; readers must check older rows against it.",
    module: "apache-iceberg",
  },
  "position-delete": {
    term: "Position delete",
    definition:
      "An Iceberg delete file that lists a data file's path and the row positions to skip. Replaced by deletion vectors in format v3.",
    module: "apache-iceberg",
  },
  catalog: {
    term: "Catalog",
    definition:
      "The directory of all tables: their names, where their metadata lives and who may access them. Engines ask the catalog first.",
    analogy:
      "A library catalogue: it doesn't hold the books, but tells you exactly where each one is.",
    module: "catalogs",
  },
  medallion: {
    term: "Medallion architecture",
    definition:
      "Organising pipelines in layers: bronze (raw), silver (cleaned and conformed) and gold (business-ready).",
    module: "medallion",
  },
  "query-plan": {
    term: "Query plan",
    definition:
      "The step-by-step recipe an engine builds to run a query: which files to read, how to filter, join and aggregate.",
    module: "query-engines",
  },
} satisfies Record<string, GlossaryEntry>;
