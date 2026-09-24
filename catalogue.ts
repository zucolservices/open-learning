/**
 * The catalogue: every track, chapter and module on the platform.
 *
 * Track and module pages are generated from this file. To add a module:
 *   1. add its entry here (status "planned" until it is built),
 *   2. build it under modules/<track>/<module>/,
 *   3. register its loader in modules/registry.ts and set status to "live".
 */

import type { TermId } from "./glossaries";

export type ExperienceType =
  | "3d-model"
  | "animated-infographic"
  | "simulation"
  | "step-through"
  | "scroll-story"
  | "build-connect"
  | "fix-the-problem"
  | "branching-scenario"
  | "checkpoint"
  | "sandbox";

export const experienceLabels: Record<ExperienceType, string> = {
  "3d-model": "3D model",
  "animated-infographic": "Animated infographic",
  simulation: "Live simulation",
  "step-through": "Step-through",
  "scroll-story": "Scroll story",
  "build-connect": "Build & connect",
  "fix-the-problem": "Fix the problem",
  "branching-scenario": "Branching scenario",
  checkpoint: "Checkpoints",
  sandbox: "Sandbox",
};

export type ModuleStatus = "live" | "planned";

/** How much background a module assumes. */
export type ModuleLevel = "beginner" | "core" | "deep" | "applied";

export const levelLabels: Record<ModuleLevel, string> = {
  beginner: "Beginner",
  core: "Core",
  deep: "Deep dive",
  applied: "Applied",
};

export interface ModuleMeta {
  slug: string;
  title: string;
  /** One-sentence promise to the learner. */
  summary: string;
  /** Indicative duration in minutes. */
  minutes: number;
  /** The centrepiece interaction for this module. */
  signature: string;
  formats: ExperienceType[];
  /** What the learner should truly understand by the end. */
  concepts: string[];
  status: ModuleStatus;
  level: ModuleLevel;
  /** Modules worth taking first (slugs in the same track). */
  prerequisites?: string[];
  /** The module's idea in two or three plain sentences, for complete newcomers. */
  plain: string;
  /** Glossary terms this module uses; shown in its "Key terms" drawer. */
  terms?: TermId[];
}

export interface Chapter {
  slug: string;
  title: string;
  /** One line on what the chapter is about. */
  summary: string;
  modules: ModuleMeta[];
}

export interface Track {
  slug: string;
  title: string;
  area: string;
  tagline: string;
  description: string;
  /** Key into the track accent palette in globals.css ([data-track]). */
  accent: "lakehouse" | "neutral";
  chapters: Chapter[];
  /** Hidden tracks are routable but not listed (e.g. the toolkit demo). */
  hidden?: boolean;
}

const lakehouse: Track = {
  slug: "data-lakehouse",
  title: "Modern Data Lakehouse",
  area: "Data engineering",
  tagline: "Open files, open tables, any engine.",
  description:
    "From object storage and Parquet up through Delta Lake, Apache Iceberg and Apache Hudi, to catalogs, pipelines, query engines and real platforms on AWS, Google Cloud, Azure and open source. By the end you can reason about how a lakehouse behaves, and design one.",
  accent: "lakehouse",
  chapters: [
    {
      slug: "foundations",
      title: "Foundations",
      summary:
        "Where lakehouses come from, and the storage and file formats everything else stands on.",
      modules: [
        {
          slug: "swamp-to-lakehouse",
          title: "From swamp to lakehouse",
          summary:
            "Why warehouses and data lakes each fell short, and what the lakehouse architecture actually changes.",
          minutes: 20,
          signature:
            "Scroll through 30 years of data architecture as the same company's data platform evolves around you",
          formats: ["scroll-story", "animated-infographic", "checkpoint"],
          concepts: [
            "OLTP vs OLAP workloads",
            "Warehouses: coupled storage/compute, proprietary formats",
            "Hadoop-era data lakes and why they became swamps",
            "Separation of storage and compute",
            "The lakehouse stack: object storage → file format → table format → catalog → engines",
          ],
          status: "live",
          level: "beginner",
          plain:
            "Companies keep two kinds of data work apart: running the business (taking orders) and analysing it (monthly reports). Over 30 years they tried warehouses, then data lakes, then both at once, and each fixed one problem while creating another. A lakehouse is today's answer: one copy of data in cheap cloud storage, with the reliability of a warehouse on top.",
          terms: [
            "oltp",
            "olap",
            "data-warehouse",
            "etl",
            "data-lake",
            "schema-on-read",
            "data-swamp",
            "object-storage",
            "table-format",
            "catalog",
            "engine",
            "lakehouse",
          ],
        },
        {
          slug: "object-storage",
          title: "Object storage: the ground floor",
          summary:
            "S3, GCS and ADLS are not file systems. Their guarantees shape everything built on top.",
          minutes: 25,
          signature:
            "Try to 'rename a folder' on object storage and watch it become thousands of copy-and-delete calls that can fail halfway",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: [
            "Buckets, keys and prefixes (there are no directories)",
            "Consistency guarantees and conditional writes (put-if-absent)",
            "Why rename is not atomic and why that matters for tables",
            "LIST cost and latency; request pricing",
            "Storage classes, multipart uploads, lifecycle rules",
          ],
          status: "live",
          level: "beginner",
          plain:
            "Cloud storage like Amazon S3 keeps each piece of data under a name (a key), a bit like a cloakroom ticket. It looks like folders, but it isn't. There's no safe way to rename or change many things at once. That single limitation shapes how every lakehouse table is designed.",
          prerequisites: ["swamp-to-lakehouse"],
          terms: [
            "object-storage",
            "bucket",
            "key-prefix",
            "atomic",
            "put-if-absent",
            "commit",
            "storage-class",
            "lifecycle-rule",
            "small-files",
          ],
        },
        {
          slug: "file-formats",
          title: "Rows vs columns: file formats",
          summary: "CSV, JSON, Avro, ORC and Parquet, and why analytics wants columns.",
          minutes: 20,
          signature:
            "Follow one Brewline order as it's saved as CSV, JSON, Avro and Parquet, then flip between row and column layouts and watch the bytes a query reads light up",
          formats: ["scroll-story", "animated-infographic", "simulation", "checkpoint"],
          concepts: [
            "Row-oriented vs column-oriented storage",
            "Self-describing vs schema-less formats",
            "Splittability and compression",
            "When Avro, ORC or Parquet fits best",
          ],
          status: "live",
          level: "beginner",
          plain:
            "The same data can be saved in very different shapes: plain text like CSV, nested like JSON, or organised by column like Parquet. For analysis, storing each column together means a query reads only what it needs. This module shows why the lakehouse standardised on columnar files.",
          prerequisites: ["swamp-to-lakehouse"],
          terms: [
            "serialization",
            "csv",
            "json",
            "avro",
            "orc",
            "parquet",
            "columnar",
            "schema",
            "self-describing",
            "splittable",
            "compression",
            "arrow",
          ],
        },
        {
          slug: "inside-parquet",
          title: "Inside a Parquet file",
          summary:
            "Open up a Parquet file layer by layer: row groups, column chunks, pages, encodings and the footer.",
          minutes: 35,
          signature:
            "Scroll to zoom into a 3D Parquet file (file \u2192 row group \u2192 column chunk \u2192 page \u2192 encoded values), then run a filter and watch row groups get skipped",
          formats: ["3d-model", "scroll-story", "simulation", "checkpoint"],
          concepts: [
            "Row groups, column chunks and pages",
            "Dictionary, RLE, bit-packing and delta encodings",
            "Compression codecs (Snappy, ZSTD, GZIP) and their trade-offs",
            "Footer metadata, min/max statistics and bloom filters",
            "Nested data: repetition and definition levels",
            "Predicate pushdown and projection pruning",
          ],
          status: "live",
          level: "core",
          plain:
            "A Parquet file isn't just data. It is carefully arranged into chunks, compressed, and ends with a summary (the footer) of what's inside each chunk. Engines read that summary first and skip everything that can't match the query. That's where much of a lakehouse's speed comes from.",
          prerequisites: ["file-formats"],
          terms: [
            "parquet",
            "row-group",
            "column-chunk",
            "parquet-footer",
            "statistics",
            "predicate-pushdown",
            "projection-pruning",
            "encoding",
            "compression",
            "page-index",
            "bloom-filter",
            "rep-def-levels",
          ],
        },
      ],
    },
    {
      slug: "table-formats",
      title: "Open table formats",
      summary:
        "How Delta Lake, Apache Iceberg and Apache Hudi turn folders of files into real tables.",
      modules: [
        {
          slug: "what-makes-a-table",
          title: "What makes a table a table",
          summary:
            "A folder of Parquet files is not a table. See how Hive-style tables broke, and what a table format must provide.",
          minutes: 25,
          signature:
            "Two jobs write to a Hive-style table at once; find out why a reader sees half-written data, then fix it",
          formats: ["fix-the-problem", "step-through", "checkpoint"],
          concepts: [
            "Directory-as-table and the Hive Metastore",
            "Failure modes: partial writes, listing, no isolation",
            "What a table format adds: atomic commits, snapshots, schema, statistics",
            "Metadata about files vs the files themselves",
          ],
          status: "live",
          level: "beginner",
          plain:
            "A folder of data files looks like a table, but it isn't one. Nothing stops a reader from seeing half-written data, and nothing records which files belong. A table format adds a small layer of bookkeeping that fixes this. It's the key idea behind Delta Lake, Iceberg and Hudi.",
          prerequisites: ["object-storage", "file-formats"],
          terms: [
            "hive-table",
            "hive-metastore",
            "partition",
            "atomic",
            "isolation",
            "snapshot",
            "schema",
            "metadata",
            "table-format",
            "commit",
          ],
        },
        {
          slug: "delta-lake",
          title: "Delta Lake: the transaction log",
          summary:
            "Every Delta table is a log of commits. Replay it to get any version of the table.",
          minutes: 35,
          signature:
            "Transaction-log time travel: drag a version slider and watch files join and leave the table as _delta_log commits replay",
          formats: ["step-through", "simulation", "animated-infographic", "checkpoint"],
          concepts: [
            "_delta_log: JSON commits with add/remove/metaData/protocol actions",
            "Checkpoints and log compaction",
            "Snapshot reconstruction and time travel (VERSION AS OF / TIMESTAMP AS OF)",
            "Protocol versions and table features",
            "Deletion vectors, liquid clustering, change data feed",
            "VACUUM and retention",
          ],
          status: "live",
          level: "core",
          plain:
            "Delta Lake keeps a diary of every change to a table: which files were added and which were removed. Replay the diary and you get the table at any moment in its history. That simple idea gives you safe concurrent writes, undo, audit history and time travel.",
          prerequisites: ["what-makes-a-table"],
          terms: [
            "transaction-log",
            "commit",
            "snapshot",
            "time-travel",
            "checkpoint",
            "vacuum",
            "retention",
            "optimistic-concurrency",
            "put-if-absent",
            "deletion-vector",
            "acid",
            "json",
            "parquet",
          ],
        },
        {
          slug: "apache-iceberg",
          title: "Apache Iceberg: the metadata tree",
          summary:
            "Catalog pointer, metadata file, manifest list, manifests, data files: follow a query down the tree.",
          minutes: 35,
          signature:
            "Scroll down Iceberg's metadata tree in 3D, following one query from the catalog pointer to the few data files it actually reads",
          formats: ["3d-model", "scroll-story", "step-through", "checkpoint"],
          concepts: [
            "Catalog → metadata.json → manifest list → manifests → data files",
            "Snapshots, time travel, branches and tags",
            "Hidden partitioning and partition transforms",
            "Partition and schema evolution without rewrites",
            "Position and equality deletes; v3 deletion vectors",
            "Field IDs and why they make evolution safe",
          ],
          status: "live",
          level: "core",
          plain:
            "Iceberg solves the same problem as Delta with a different design: instead of a diary, it keeps a tree of metadata files, and a catalog points to the current top of the tree. Queries walk down the tree and skip whole branches of files they don't need.",
          prerequisites: ["what-makes-a-table"],
          terms: [
            "iceberg",
            "snapshot",
            "metadata",
            "catalog",
            "partition",
            "time-travel",
            "statistics",
            "manifest",
            "manifest-list",
            "hidden-partitioning",
            "field-id",
          ],
        },
        {
          slug: "apache-hudi",
          title: "Apache Hudi: the timeline",
          summary:
            "Hudi was built for upserts and incremental processing. See its timeline, table types and indexes.",
          minutes: 30,
          signature:
            "Stream upserts into a Hudi table and watch the timeline, base files and log files evolve",
          formats: ["scroll-story", "simulation", "step-through", "checkpoint"],
          concepts: [
            "The timeline: instants, actions and states",
            "Copy-on-Write vs Merge-on-Read table types",
            "Record keys, file groups and indexing",
            "Incremental queries and compaction/clustering services",
          ],
          status: "live",
          level: "core",
          plain:
            "Hudi was built at Uber for tables that change constantly, where rows are updated all the time rather than just appended. It keeps a timeline of actions and can either rewrite files on each change or log changes and merge them later.",
          prerequisites: ["what-makes-a-table"],
          terms: [
            "hudi",
            "hudi-timeline",
            "upsert",
            "record-key",
            "file-group",
            "copy-on-write",
            "merge-on-read",
            "compaction",
            "commit",
          ],
        },
        {
          slug: "format-showdown",
          title: "Delta vs Iceberg vs Hudi",
          summary:
            "The same operations in all three formats side by side, where they are converging, and how to interoperate.",
          minutes: 30,
          signature:
            "Run one INSERT, UPDATE and schema change and watch what each format writes to storage, side by side",
          formats: ["simulation", "scroll-story", "branching-scenario", "checkpoint"],
          concepts: [
            "Design philosophies and ecosystem support",
            "Feature comparison: evolution, deletes, concurrency, streaming",
            "Interoperability: Delta UniForm, Apache XTable",
            "Convergence (deletion vectors, variant type) and newer entrants",
            "Choosing a format for a given project",
          ],
          status: "live",
          level: "core",
          plain:
            "Delta Lake, Iceberg and Hudi all turn files into reliable tables, but they make different trade-offs and have different ecosystems. This module compares them side by side, shows how they're converging, and helps you choose one for a project.",
          prerequisites: ["delta-lake", "apache-iceberg", "apache-hudi"],
          terms: [
            "delta-lake",
            "iceberg",
            "hudi",
            "table-format",
            "deletion-vector",
            "uniform",
            "xtable",
            "catalog",
          ],
        },
      ],
    },
    {
      slug: "table-internals",
      title: "How tables behave",
      summary:
        "Transactions, row-level changes and schema changes: what really happens underneath.",
      modules: [
        {
          slug: "acid-and-concurrency",
          title: "ACID on object storage",
          summary:
            "How commits stay atomic without a database server, and what happens when two writers race.",
          minutes: 30,
          signature:
            "ACID explained with one bank transfer, then two writers race to commit and you step through conflict detection and retry",
          formats: ["scroll-story", "simulation", "step-through", "checkpoint"],
          concepts: [
            "Atomicity via put-if-absent or catalog pointer swap",
            "Optimistic concurrency control and conflict detection",
            "Serializable vs snapshot/write-serializable isolation",
            "Multi-writer setups and commit coordinators",
          ],
          status: "live",
          level: "deep",
          plain:
            "ACID is the set of promises a database makes about changes: all or nothing, rules respected, no interference, nothing lost. This module shows how a lakehouse keeps those promises on plain cloud storage, even when two jobs write at the same time.",
          prerequisites: ["delta-lake"],
          terms: [
            "acid",
            "transaction",
            "atomic",
            "isolation",
            "optimistic-concurrency",
            "put-if-absent",
            "commit",
            "serializable",
            "write-serializable",
            "blind-append",
          ],
        },
        {
          slug: "updates-and-deletes",
          title: "Updates & deletes: Copy-on-Write vs Merge-on-Read",
          summary:
            "Files are immutable, so how do you change a row? Compare the strategies and their costs.",
          minutes: 30,
          signature:
            "Slide the update rate up and watch write cost and read cost trade places for CoW vs MoR",
          formats: ["simulation", "animated-infographic", "checkpoint"],
          concepts: [
            "Rewriting files (Copy-on-Write)",
            "Delete files, deletion vectors and log files (Merge-on-Read)",
            "Read amplification vs write amplification",
            "When to compact",
          ],
          status: "live",
          level: "deep",
          plain:
            "Data files in a lakehouse are never edited. So how do you change one row? Either rewrite the whole file (simple to read, expensive to write) or note the change separately and apply it when reading (cheap to write, more work to read). You'll see when each makes sense.",
          prerequisites: ["delta-lake"],
          terms: [
            "copy-on-write",
            "merge-on-read",
            "deletion-vector",
            "compaction",
            "write-amplification",
            "read-amplification",
            "vacuum",
          ],
        },
        {
          slug: "schema-evolution",
          title: "Schema evolution & enforcement",
          summary: "Add, rename, drop and widen columns safely, and stop bad data at the door.",
          minutes: 25,
          signature:
            "Rename a column in a Hive table and an Iceberg table and see which one quietly returns wrong data",
          formats: ["fix-the-problem", "step-through", "checkpoint"],
          concepts: [
            "Schema enforcement vs schema evolution",
            "Name-based vs ID-based column mapping",
            "Safe and unsafe type changes",
            "Nested and semi-structured data (variant)",
          ],
          status: "live",
          level: "core",
          plain:
            "Tables change shape over time: new columns, renamed columns, wider types. Done carelessly, old data and new code silently disagree. This module shows how table formats let a schema evolve safely, and how they block bad data at the door.",
          prerequisites: ["what-makes-a-table"],
          terms: [
            "schema",
            "schema-enforcement",
            "schema-evolution",
            "field-id",
            "column-mapping",
            "variant",
          ],
        },
      ],
    },
    {
      slug: "performance",
      title: "Performance & layout",
      summary: "Layout decisions that make queries fast and keep storage costs down.",
      modules: [
        {
          slug: "partitioning",
          title: "Partitioning done right",
          summary: "Partitioning can make queries fly or drown the table in tiny files.",
          minutes: 30,
          signature:
            "Choose a partition scheme and watch file count, file size and query time respond live",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Hive-style partitions and partition pruning",
            "Over-partitioning and cardinality",
            "Iceberg hidden partitioning and partition evolution",
            "Liquid clustering as an alternative",
          ],
          status: "planned",
          level: "core",
          plain:
            "Partitioning splits a table into groups, for example one per day, so a query for yesterday only reads yesterday. Done well, queries fly. Done badly, the table shatters into millions of tiny files. This module helps you find the balance.",
          prerequisites: ["what-makes-a-table"],
          terms: ["partition", "small-files", "data-skipping", "predicate-pushdown"],
        },
        {
          slug: "data-skipping",
          title: "File layout, clustering & data skipping",
          summary:
            "Small files, sort orders, Z-order and statistics: how engines avoid reading data.",
          minutes: 30,
          signature:
            "Re-cluster a table with linear sort, Z-order or Hilbert curves and watch files skipped per query",
          formats: ["simulation", "animated-infographic", "checkpoint"],
          concepts: [
            "The small-files problem and target file sizes",
            "Sorting, Z-order and Hilbert clustering",
            "File-level statistics and data skipping",
            "Bloom filters and secondary indexing",
          ],
          status: "planned",
          level: "deep",
          plain:
            "The fastest data to read is data you never read. By arranging rows cleverly and keeping small summaries of every file, engines can skip most of a table for a typical query. You'll see sorting, Z-order and clustering at work.",
          prerequisites: ["inside-parquet", "partitioning"],
          terms: ["data-skipping", "statistics", "z-order", "small-files", "compaction"],
        },
        {
          slug: "table-maintenance",
          title: "Keeping tables healthy",
          summary:
            "Compaction, vacuum, snapshot expiry and orphan files: the routine work that keeps cost and latency down.",
          minutes: 25,
          signature:
            "Scroll through six months in a table's life as small files and snapshots pile up, then run maintenance and compare cost and query time",
          formats: ["scroll-story", "simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "OPTIMIZE / rewrite_data_files (compaction)",
            "VACUUM, expire_snapshots and remove_orphan_files",
            "Retention vs time travel trade-offs",
            "Manifest and checkpoint housekeeping",
          ],
          status: "planned",
          level: "core",
          plain:
            "Tables collect clutter: tiny files, old versions, orphaned leftovers. Left alone, queries get slower and storage bills grow. A few routine jobs (compaction, vacuum, snapshot expiry) keep a table healthy, and this module shows exactly what each does.",
          prerequisites: ["delta-lake"],
          terms: ["compaction", "vacuum", "snapshot", "retention", "small-files"],
        },
      ],
    },
    {
      slug: "catalogs-governance",
      title: "Catalogs & governance",
      summary: "Who knows where every table lives, and who is allowed to read it.",
      modules: [
        {
          slug: "catalogs",
          title: "Catalogs: the source of truth",
          summary:
            "What a catalog does, why it holds the commit pointer, and the landscape from Hive Metastore to REST catalogs.",
          minutes: 30,
          signature:
            "Point Spark, Trino and DuckDB at one catalog and watch a commit from one become visible to the others",
          formats: ["step-through", "build-connect", "checkpoint"],
          concepts: [
            "Namespaces, table pointers and atomic commits",
            "Hive Metastore, AWS Glue, Unity Catalog, Apache Polaris, Nessie",
            "The Iceberg REST catalog spec",
            "Git-like branching of data (Nessie, Iceberg branches)",
          ],
          status: "planned",
          level: "core",
          plain:
            "A catalog is the lakehouse's directory: it knows every table, where its metadata lives and who may use it. Because every engine asks the same catalog, Spark, Trino and others all see the same tables and the same latest version.",
          prerequisites: ["what-makes-a-table"],
          terms: ["catalog", "metadata", "engine", "commit"],
        },
        {
          slug: "governance-security",
          title: "Governance, security & privacy",
          summary:
            "Access control, credential vending, lineage, and deleting personal data from immutable files.",
          minutes: 30,
          signature:
            "Follow one customer's personal data through the lakehouse, then handle their erasure request and find every snapshot and file that still holds it",
          formats: ["scroll-story", "fix-the-problem", "checkpoint"],
          concepts: [
            "Table, row and column-level access control",
            "Credential vending and storage-level security",
            "Encryption, auditing and lineage",
            "Right-to-erasure (DPDP/GDPR) on immutable storage",
          ],
          status: "planned",
          level: "core",
          plain:
            "Data about people needs rules: who can see what, how long it's kept, and how to erase it on request. That's tricky when files are immutable and old versions linger. This module walks through access control and privacy obligations like India's DPDP Act.",
          prerequisites: ["catalogs"],
          terms: ["catalog", "retention", "vacuum", "time-travel"],
        },
      ],
    },
    {
      slug: "pipelines",
      title: "Building pipelines",
      summary: "Getting data in, and shaping it into tables people can trust.",
      modules: [
        {
          slug: "ingestion",
          title: "Getting data in",
          summary:
            "Batch loads, file-arrival triggers and streaming writes, and the tools that do them.",
          minutes: 30,
          signature:
            "Follow one app event from a phone to a lakehouse table, then tune a streaming writer and watch latency fall as small files pile up",
          formats: ["scroll-story", "simulation", "build-connect", "checkpoint"],
          concepts: [
            "Batch vs micro-batch vs continuous ingestion",
            "Spark Structured Streaming, Flink, Kafka Connect",
            "Exactly-once sinks and idempotent writes",
            "Managed ingestion: Auto Loader, Firehose, Datastream, Airbyte, Fivetran",
          ],
          status: "planned",
          level: "core",
          plain:
            "Before data can be analysed it has to arrive: in nightly batches, or continuously as a stream. This module follows data from apps and databases into lakehouse tables, and shows the trade-off between freshness and file sizes.",
          prerequisites: ["what-makes-a-table"],
          terms: ["batch", "streaming", "idempotent", "small-files"],
        },
        {
          slug: "cdc-and-merge",
          title: "CDC, MERGE & slowly changing dimensions",
          summary: "Turn a stream of database changes into a correct, up-to-date lakehouse table.",
          minutes: 35,
          signature:
            "Replay Debezium change events into a table with MERGE; inject out-of-order and duplicate events and fix the result",
          formats: ["step-through", "fix-the-problem", "checkpoint"],
          concepts: [
            "Change data capture with Debezium, DMS and Datastream",
            "MERGE INTO semantics, ordering and deduplication",
            "SCD Type 1 and Type 2",
            "Change feeds: Delta CDF, Iceberg changelog, Hudi incremental queries",
          ],
          status: "planned",
          level: "deep",
          plain:
            "When an app database changes, those changes can be streamed as events: insert this, update that, delete this. Applying them to a lakehouse table correctly, even when they arrive late or twice, is the job of MERGE. You'll also learn how to keep history of changes.",
          prerequisites: ["ingestion", "delta-lake"],
          terms: ["cdc", "merge", "upsert", "scd", "streaming"],
        },
        {
          slug: "medallion",
          title: "Medallion architecture",
          summary:
            "Bronze, silver and gold: what each layer promises, and how to build pipelines you can rerun safely.",
          minutes: 30,
          signature:
            "Follow one messy record from bronze to gold, then wire the layers into a pipeline and replay a bad day of data",
          formats: ["scroll-story", "build-connect", "fix-the-problem", "checkpoint"],
          concepts: [
            "Layer contracts and data quality expectations",
            "Idempotency, backfills and reprocessing",
            "Transformation tools: dbt, Spark, Lakeflow/DLT",
            "Orchestration: Airflow, Dagster",
          ],
          status: "planned",
          level: "core",
          plain:
            "Most pipelines move data through three layers: bronze keeps it raw, silver cleans and standardises it, gold shapes it for the business. This module follows one messy record through all three, and shows how to build pipelines you can safely rerun.",
          prerequisites: ["what-makes-a-table"],
          terms: ["medallion", "etl", "idempotent", "schema"],
        },
      ],
    },
    {
      slug: "querying",
      title: "Querying & serving",
      summary: "How engines read tables, and how BI, ML and AI use them.",
      modules: [
        {
          slug: "query-engines",
          title: "How engines read a lakehouse",
          summary:
            "Follow one SQL query from catalog lookup through pruning to vectorised execution, across Spark, Trino, DuckDB and more.",
          minutes: 30,
          signature:
            "The life of a SQL query: scroll from SQL text to a plan to pruned files to results, then compare how Spark, Trino and DuckDB do it",
          formats: ["scroll-story", "step-through", "checkpoint"],
          concepts: [
            "Planning: catalog → metadata → file pruning → scan",
            "Vectorised, columnar execution",
            "Engines: Spark, Trino/Presto, Flink, DuckDB, StarRocks, Dremio",
            "Serverless engines: Athena, BigQuery, Snowflake, Databricks SQL",
          ],
          status: "planned",
          level: "core",
          plain:
            "When you run SQL on a lakehouse, an engine looks up the table, reads its metadata, skips every file it can, and processes the rest column by column. Following one query end to end shows why the whole stack is designed the way it is.",
          prerequisites: ["inside-parquet", "what-makes-a-table"],
          terms: ["engine", "query-plan", "predicate-pushdown", "data-skipping", "statistics"],
        },
        {
          slug: "hands-on-sql",
          title: "Hands-on: query in your browser",
          summary: "Real SQL on real Parquet files with DuckDB running inside the page.",
          minutes: 40,
          signature:
            "Guided tasks in a DuckDB-WASM sandbox: inspect Parquet metadata, compare query plans, prove pruning works",
          formats: ["sandbox", "checkpoint"],
          concepts: [
            "Reading Parquet metadata and statistics",
            "EXPLAIN and reading query plans",
            "Measuring projection and predicate pushdown",
          ],
          status: "planned",
          level: "core",
          plain:
            "Time to try it yourself. A real query engine (DuckDB) runs inside this page, on real Parquet files. Guided tasks walk you through inspecting files and proving that skipping and pruning really happen.",
          prerequisites: ["inside-parquet"],
          terms: ["sql", "parquet", "query-plan", "predicate-pushdown"],
        },
        {
          slug: "bi-ml-ai",
          title: "Serving BI, ML & AI",
          summary: "One copy of data for dashboards, machine learning and AI applications.",
          minutes: 25,
          signature:
            "Route BI, ML training and a RAG app to the same gold tables and see which serving layer each needs",
          formats: ["build-connect", "animated-infographic", "checkpoint"],
          concepts: [
            "Semantic layers and BI acceleration",
            "Feature pipelines and training data",
            "Unstructured data and vector search alongside tables",
          ],
          status: "planned",
          level: "applied",
          plain:
            "The same lakehouse tables feed dashboards, machine-learning models and AI assistants. This module shows what each of those needs from the data, and how one copy can serve them all.",
          prerequisites: ["medallion"],
          terms: ["olap", "engine", "medallion"],
        },
      ],
    },
    {
      slug: "platforms",
      title: "Platforms & ecosystem",
      summary: "The same ideas on AWS, Google Cloud, Azure and pure open source.",
      modules: [
        {
          slug: "on-aws",
          title: "Lakehouse on AWS",
          summary:
            "S3, S3 Tables, Glue, Lake Formation, EMR, Athena, Redshift and friends, assembled.",
          minutes: 30,
          signature:
            "Assemble an AWS lakehouse from service blocks and watch data flow and the cost estimate update",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Storage: S3 and S3 Tables (managed Iceberg)",
            "Catalog and governance: Glue Data Catalog, Lake Formation",
            "Compute: EMR, Glue ETL, Athena, Redshift",
            "Ingestion: DMS, Kinesis Data Firehose, MSK",
          ],
          status: "planned",
          level: "applied",
          plain:
            "Amazon Web Services offers a service for every lakehouse layer: S3 for storage, Glue for the catalog, Athena, EMR and Redshift for compute, and more. You'll assemble them into one working design and see what each piece is for.",
          prerequisites: ["catalogs", "query-engines"],
          terms: ["object-storage", "catalog", "engine"],
        },
        {
          slug: "on-gcp",
          title: "Lakehouse on Google Cloud",
          summary: "GCS, BigLake, BigQuery, Dataproc, Dataflow and Dataplex, assembled.",
          minutes: 30,
          signature:
            "Assemble a Google Cloud lakehouse and compare BigQuery-managed vs open Iceberg tables",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Storage: GCS; BigLake and BigQuery tables for Apache Iceberg",
            "Catalog and governance: BigLake metastore, Dataplex",
            "Compute: BigQuery, Dataproc (Spark), Dataflow",
            "Ingestion: Datastream, Pub/Sub",
          ],
          status: "planned",
          level: "applied",
          plain:
            "Google Cloud's version of the lakehouse centres on Cloud Storage, BigLake and BigQuery. You'll assemble a design and compare tables that BigQuery manages with open Iceberg tables.",
          prerequisites: ["catalogs", "query-engines"],
          terms: ["object-storage", "catalog", "engine"],
        },
        {
          slug: "on-azure",
          title: "Lakehouse on Azure & Fabric",
          summary: "ADLS Gen2, Azure Databricks and Microsoft Fabric OneLake, assembled.",
          minutes: 30,
          signature: "Assemble an Azure lakehouse and see how OneLake shortcuts avoid copying data",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Storage: ADLS Gen2 and OneLake",
            "Compute: Azure Databricks, Fabric Spark and SQL endpoints",
            "Governance: Unity Catalog, Microsoft Purview",
            "Ingestion: Event Hubs, Data Factory",
          ],
          status: "planned",
          level: "applied",
          plain:
            "On Azure, the lakehouse is built from Azure Data Lake Storage, Azure Databricks and Microsoft Fabric's OneLake. You'll assemble a design and see how Fabric avoids copying data.",
          prerequisites: ["catalogs", "query-engines"],
          terms: ["object-storage", "catalog", "engine"],
        },
        {
          slug: "landscape",
          title: "The open-source & vendor landscape",
          summary:
            "Databricks, Snowflake, Dremio, Starburst and friends, plus a fully open-source stack you can run yourself.",
          minutes: 30,
          signature:
            "A lakehouse 'Rosetta stone': swap one architecture between AWS, GCP, Azure, vendors and pure open source and see each block change",
          formats: ["build-connect", "animated-infographic", "checkpoint"],
          concepts: [
            "Vendor platforms and what they add",
            "Open-source stack: MinIO, Iceberg, Polaris/Nessie, Spark, Trino, Airflow, Superset",
            "Lock-in, portability and cost considerations",
            "Mapping equivalent services across clouds",
          ],
          status: "planned",
          level: "applied",
          plain:
            "Beyond the three clouds are vendor platforms (Databricks, Snowflake, Dremio and more) and fully open-source stacks you run yourself. This module maps equivalent pieces across all of them, so you can read any architecture diagram.",
          prerequisites: ["on-aws"],
          terms: ["lakehouse", "table-format", "catalog", "engine"],
        },
      ],
    },
    {
      slug: "capstone",
      title: "Capstone",
      summary: "Put it all together: design one lakehouse, then fix a broken one.",
      modules: [
        {
          slug: "design-a-lakehouse",
          title: "Design a lakehouse",
          summary:
            "Take a realistic brief and design the whole thing: formats, layout, catalog, pipelines and platform.",
          minutes: 40,
          signature:
            "Build an architecture for a cooperative bank's transaction analytics; checkpoints probe every choice",
          formats: ["build-connect", "branching-scenario", "checkpoint"],
          concepts: ["Applying every chapter to one end-to-end design"],
          status: "planned",
          level: "applied",
          plain:
            "Now put everything together. You'll get a realistic brief, a cooperative bank's transaction analytics, and design the whole thing: formats, layout, catalog, pipelines and platform, defending each choice.",
          prerequisites: ["medallion", "catalogs"],
          terms: ["lakehouse", "medallion", "partition", "table-format"],
        },
        {
          slug: "fix-the-lakehouse",
          title: "The slow, expensive lakehouse",
          summary:
            "A production lakehouse is slow and costly. Diagnose it from the evidence and fix it.",
          minutes: 35,
          signature:
            "Investigate metrics, table metadata and query plans to find and fix five compounding problems",
          formats: ["fix-the-problem", "simulation", "checkpoint"],
          concepts: ["Diagnosing layout, maintenance, partitioning and pipeline issues together"],
          status: "planned",
          level: "applied",
          plain:
            "A production lakehouse is slow and expensive, and it's your job to find out why. Using metrics, table metadata and query plans, you'll diagnose several problems at once and fix them.",
          prerequisites: ["table-maintenance", "data-skipping"],
          terms: ["small-files", "compaction", "vacuum", "partition", "data-skipping"],
        },
      ],
    },
  ],
};

/** A small end-to-end module that exercises the toolkit and Module SDK. */
const playground: Track = {
  slug: "playground",
  title: "Toolkit playground",
  area: "Internal",
  tagline: "A working sample of the module toolkit.",
  description:
    "A short sample module used to check the step shell, checkpoints and progress saving from start to finish.",
  accent: "lakehouse",
  hidden: true,
  chapters: [
    {
      slug: "demo",
      title: "Demo",
      summary: "A tiny sample of the toolkit.",
      modules: [
        {
          slug: "rows-vs-columns",
          title: "Rows vs columns in five minutes",
          summary: "A tiny sample module that walks through the toolkit.",
          minutes: 5,
          signature: "Toggle row and columnar layouts and see bytes scanned",
          formats: ["simulation", "checkpoint"],
          concepts: ["Row vs column layout"],
          status: "live",
          level: "beginner",
          plain:
            "A tiny sample module: the same data stored row by row or column by column, and why that decides how much a query must read.",
          terms: ["columnar"],
        },
      ],
    },
  ],
};

export const tracks: Track[] = [lakehouse, playground];

/** Planned areas from the solution document (§10). Tracks move into `tracks` as they are built. */
export const roadmap: { area: string; tracks: string[] }[] = [
  {
    area: "Data engineering",
    tracks: [
      "Modern Data Lakehouse",
      "Streaming Data Systems",
      "Spark",
      "Data Modelling",
      "Data Quality",
    ],
  },
  {
    area: "AI & machine learning",
    tracks: [
      "LLM Foundations",
      "RAG Systems",
      "AI Agents",
      "Voice AI",
      "LLM Evaluation",
      "Applied ML",
    ],
  },
  {
    area: "Platform & cloud",
    tracks: ["Cloud Architecture", "Kubernetes", "CI/CD", "Observability"],
  },
  {
    area: "Architecture",
    tracks: ["System Design at Scale", "API Design", "Database Internals", "Enterprise Patterns"],
  },
  {
    area: "Security & government",
    tracks: ["Application Security", "DPDP Act", "Building for Government"],
  },
  { area: "Cross-cutting", tracks: ["AI-Assisted Development"] },
  {
    area: "Software development",
    tracks: ["Frontend", "Backend", "Mobile", "Testing", "Clean Code", "Code Review", "Git"],
  },
  {
    area: "Design",
    tracks: [
      "UX Fundamentals",
      "UI for Developers",
      "Design Systems",
      "Accessibility",
      "Dashboards",
    ],
  },
  {
    area: "Delivery management",
    tracks: ["Agile & Scrum", "Estimation", "Fixed-Scope Projects", "Risk", "Delivery Metrics"],
  },
  {
    area: "Business analysis",
    tracks: ["Requirements", "Product Thinking", "Process Mapping"],
  },
  {
    area: "Pre-sales & client skills",
    tracks: ["RFP Response", "Proposal Architecture", "Demos", "Client Communication"],
  },
  {
    area: "Domain knowledge",
    tracks: ["Higher Education", "Government Systems", "Cooperative Banking", "Health Insurance"],
  },
  {
    area: "Leadership",
    tracks: ["Engineer to Tech Lead", "Feedback", "Effective Meetings", "Technical Writing"],
  },
];

export const visibleTracks = tracks.filter((t) => !t.hidden);

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}

export function trackModules(track: Track): ModuleMeta[] {
  return track.chapters.flatMap((c) => c.modules);
}

export function getModule(
  trackSlug: string,
  moduleSlug: string,
): { track: Track; module: ModuleMeta; index: number } | undefined {
  const track = getTrack(trackSlug);
  if (!track) return undefined;
  const modules = trackModules(track);
  const index = modules.findIndex((m) => m.slug === moduleSlug);
  if (index === -1) return undefined;
  return { track, module: modules[index], index };
}

export function trackMinutes(track: Track): number {
  return trackModules(track).reduce((sum, m) => sum + m.minutes, 0);
}
