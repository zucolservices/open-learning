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
  /** Slug of the category this track belongs to (see `categories`). */
  category: string;
  tagline: string;
  description: string;
  /** Key into the track accent palette in globals.css ([data-track]). */
  accent: "lakehouse" | "blueprint" | "synapse" | "neutral";
  chapters: Chapter[];
  /** Hidden tracks are routable but not listed (e.g. the toolkit demo). */
  hidden?: boolean;
}

const lakehouse: Track = {
  slug: "data-lakehouse",
  title: "Modern Data Lakehouse",
  area: "Data engineering",
  category: "data-engineering",
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
          status: "live",
          level: "core",
          plain:
            "Partitioning splits a table into groups, for example one per day, so a query for yesterday only reads yesterday. Done well, queries fly. Done badly, the table shatters into millions of tiny files. This module helps you find the balance.",
          prerequisites: ["what-makes-a-table"],
          terms: [
            "partition",
            "partition-pruning",
            "small-files",
            "hidden-partitioning",
            "liquid-clustering",
            "data-skipping",
          ],
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
          status: "live",
          level: "deep",
          plain:
            "The fastest data to read is data you never read. By arranging rows cleverly and keeping small summaries of every file, engines can skip most of a table for a typical query. You'll see sorting, Z-order and clustering at work.",
          prerequisites: ["inside-parquet", "partitioning"],
          terms: [
            "data-skipping",
            "statistics",
            "z-order",
            "hilbert-curve",
            "bloom-filter",
            "liquid-clustering",
          ],
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
          status: "live",
          level: "core",
          plain:
            "Tables collect clutter: tiny files, old versions, orphaned leftovers. Left alone, queries get slower and storage bills grow. A few routine jobs (compaction, vacuum, snapshot expiry) keep a table healthy, and this module shows exactly what each does.",
          prerequisites: ["delta-lake"],
          terms: ["compaction", "vacuum", "snapshot", "retention", "small-files", "orphan-files"],
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
          formats: ["build-connect", "step-through", "checkpoint"],
          concepts: [
            "Namespaces, table pointers and atomic commits",
            "Hive Metastore, AWS Glue, Unity Catalog, Apache Polaris, Nessie",
            "The Iceberg REST catalog spec",
            "Git-like branching of data (Nessie, Iceberg branches)",
          ],
          status: "live",
          level: "core",
          plain:
            "A catalog is the lakehouse's directory: it knows every table, where its metadata lives and who may use it. Because every engine asks the same catalog, Spark, Trino and others all see the same tables and the same latest version.",
          prerequisites: ["what-makes-a-table"],
          terms: ["catalog", "metadata", "engine", "commit", "iceberg-rest", "iceberg-branch"],
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
          status: "live",
          level: "core",
          plain:
            "Data about people needs rules: who can see what, how long it's kept, and how to erase it on request. That's tricky when files are immutable and old versions linger. This module walks through access control and privacy obligations like India's DPDP Act.",
          prerequisites: ["catalogs"],
          terms: [
            "catalog",
            "row-filter",
            "column-mask",
            "credential-vending",
            "dpdp",
            "retention",
            "vacuum",
          ],
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
          status: "live",
          level: "core",
          plain:
            "Before data can be analysed it has to arrive: in nightly batches, or continuously as a stream. This module follows data from apps and databases into lakehouse tables, and shows the trade-off between freshness and file sizes.",
          prerequisites: ["what-makes-a-table"],
          terms: [
            "kafka",
            "micro-batch",
            "exactly-once",
            "idempotent",
            "streaming",
            "batch",
            "small-files",
          ],
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
          status: "live",
          level: "deep",
          plain:
            "When an app database changes, those changes can be streamed as events: insert this, update that, delete this. Applying them to a lakehouse table correctly, even when they arrive late or twice, is the job of MERGE. You'll also learn how to keep history of changes.",
          prerequisites: ["ingestion", "delta-lake"],
          terms: [
            "cdc",
            "debezium",
            "merge",
            "upsert",
            "tombstone",
            "soft-delete",
            "scd",
            "change-feed",
          ],
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
            "Transformation tools: dbt, Spark, Lakeflow pipelines",
            "Orchestration: Airflow, Dagster",
          ],
          status: "live",
          level: "core",
          plain:
            "Most pipelines move data through three layers: bronze keeps it raw, silver cleans and standardises it, gold shapes it for the business. This module follows one messy record through all three, and shows how to build pipelines you can safely rerun.",
          prerequisites: ["what-makes-a-table"],
          terms: ["medallion", "etl", "expectation", "dag", "backfill", "idempotent", "schema"],
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
          status: "live",
          level: "core",
          plain:
            "When you run SQL on a lakehouse, an engine looks up the table, reads its metadata, skips every file it can, and processes the rest column by column. Following one query end to end shows why the whole stack is designed the way it is.",
          prerequisites: ["inside-parquet", "what-makes-a-table"],
          terms: [
            "engine",
            "catalog",
            "query-plan",
            "predicate-pushdown",
            "statistics",
            "data-skipping",
            "vectorised",
          ],
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
          status: "live",
          level: "core",
          plain:
            "Time to try it yourself. A real query engine (DuckDB) runs inside this page, on real Parquet files. Guided tasks walk you through inspecting files and proving that skipping and pruning really happen.",
          prerequisites: ["inside-parquet"],
          terms: [
            "sql",
            "duckdb",
            "parquet",
            "row-group",
            "statistics",
            "query-plan",
            "predicate-pushdown",
            "projection-pushdown",
          ],
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
          status: "live",
          level: "applied",
          plain:
            "The same lakehouse tables feed dashboards, machine-learning models and AI assistants. This module shows what each of those needs from the data, and how one copy can serve them all.",
          prerequisites: ["medallion"],
          terms: [
            "bi",
            "semantic-layer",
            "data-leakage",
            "point-in-time",
            "feature-store",
            "rag",
            "embedding",
            "vector-index",
          ],
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
            "Ingestion: DMS, Amazon Data Firehose, MSK",
          ],
          status: "live",
          level: "applied",
          plain:
            "Amazon Web Services offers a service for every lakehouse layer: S3 for storage, Glue for the catalog, Athena, EMR and Redshift for compute, and more. You'll assemble them into one working design and see what each piece is for.",
          prerequisites: ["catalogs", "query-engines"],
          terms: ["object-storage", "catalog", "engine"],
        },
        {
          slug: "on-gcp",
          title: "Lakehouse on Google Cloud",
          summary:
            "Cloud Storage, BigQuery, Iceberg tables, Managed Spark, Dataflow and Knowledge Catalog, assembled.",
          minutes: 30,
          signature:
            "Assemble a Google Cloud lakehouse and compare BigQuery-managed vs open Iceberg tables",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Storage: Cloud Storage; Apache Iceberg managed tables vs open Iceberg tables",
            "Catalog and governance: Lakehouse runtime catalog, Knowledge Catalog",
            "Compute: BigQuery, Managed Service for Apache Spark, Dataflow",
            "Ingestion: Datastream, Pub/Sub",
          ],
          status: "live",
          level: "applied",
          plain:
            "Google Cloud's version of the lakehouse centres on Cloud Storage, Iceberg tables and BigQuery. You'll assemble a design and compare tables that BigQuery manages with open Iceberg tables.",
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
          status: "live",
          level: "applied",
          plain:
            "On Azure, the lakehouse is built from Azure Data Lake Storage, Azure Databricks and Microsoft Fabric's OneLake. You'll assemble a design and see how Fabric avoids copying data.",
          prerequisites: ["catalogs", "query-engines"],
          terms: ["object-storage", "catalog", "engine", "shortcut"],
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
            "Open-source stack: Ceph/SeaweedFS/Garage, Iceberg, Polaris/Lakekeeper, Spark, Trino, Airflow, Superset",
            "Lock-in, portability and cost considerations",
            "Mapping equivalent services across clouds",
          ],
          status: "live",
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
          status: "live",
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
          status: "live",
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

const systemDesign: Track = {
  slug: "system-design",
  title: "System Design at Scale",
  area: "Architecture",
  category: "architecture",
  tagline: "Build systems that bend, not break.",
  description:
    "How real systems handle millions of users: load balancers, caches, replication and sharding, queues, retries and failover, then classic designs from URL shorteners to flash sales. Vendor-neutral, with the building blocks mapped onto AWS, Google Cloud, Azure and open source. By the end you can sketch, size and defend a design.",
  accent: "blueprint",
  chapters: [
    {
      slug: "foundations",
      title: "Foundations",
      summary: "What changes as systems grow, and how to measure and estimate it.",
      modules: [
        {
          slug: "what-scale-means",
          title: 'What "at scale" means',
          summary:
            "Follow one app from 100 users to 100 million and watch each part break in turn.",
          minutes: 25,
          signature:
            "Scroll through one app's growth: each order of magnitude breaks something, and the architecture grows to fix it",
          formats: ["scroll-story", "animated-infographic", "checkpoint"],
          concepts: [
            "Vertical vs horizontal scaling",
            "Separating the database, adding load balancers, caches and replicas",
            "Sharding and multiple regions",
            "Scale is about load, data and people, not just servers",
          ],
          status: "live",
          level: "beginner",
          plain:
            "A small app runs happily on one server. As users grow, different parts run out of room at different times. This module follows one app from a hundred users to a hundred million and shows what breaks and what engineers add at each stage.",
          terms: [
            "scalability",
            "vertical-scaling",
            "horizontal-scaling",
            "load-balancer",
            "cache",
            "replica",
            "cdn",
            "queue",
            "shard",
          ],
        },
        {
          slug: "latency-throughput",
          title: "Latency, throughput & percentiles",
          summary: "Why averages lie, and why the slowest 1% of requests matters so much.",
          minutes: 25,
          signature:
            "A coffee-counter queue simulation: raise arrivals toward capacity and watch p50, p99 and the queue explode; then fan one request out to many servers",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Latency vs throughput",
            "Percentiles: p50, p95, p99",
            "Utilisation and queueing: why waits explode near 100%",
            "Tail latency amplification with fan-out",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["what-scale-means"],
          plain:
            "Latency is how long one request takes; throughput is how many you handle per second. Averages hide the unlucky users, so engineers look at percentiles. You'll see why a system at 90% busy feels far slower than one at 60%.",
          terms: [
            "latency",
            "throughput",
            "utilisation",
            "percentile",
            "tail-latency",
            "fan-out",
            "littles-law",
          ],
        },
        {
          slug: "estimation",
          title: "Back-of-the-envelope estimation",
          summary: "Turn a vague brief into requests per second, storage and bandwidth in minutes.",
          minutes: 25,
          signature:
            "An estimator: daily users → requests per second → peak → storage over five years → bandwidth, beside a ladder of latency numbers scaled to human time",
          formats: ["simulation", "animated-infographic", "checkpoint"],
          concepts: [
            "Daily active users to average and peak requests per second",
            "Read/write ratios, storage growth and bandwidth",
            "Latency numbers every engineer should know",
            "Rounding and orders of magnitude",
          ],
          status: "live",
          level: "core",
          prerequisites: ["latency-throughput"],
          plain:
            "Before designing anything, engineers estimate: how many requests a second, how much data, how much bandwidth. Rough numbers are enough to rule designs in or out. You'll practise the arithmetic and learn which operations are fast and which are slow.",
          terms: ["back-of-envelope", "qps", "latency", "throughput", "utilisation"],
        },
      ],
    },
    {
      slug: "stateless-tier",
      title: "Scaling the stateless tier",
      summary:
        "Spreading requests across many servers, adding and removing them, and serving from the edge.",
      modules: [
        {
          slug: "load-balancing",
          title: "Load balancing",
          summary:
            "How one address spreads traffic across many servers, and what happens when one is slow.",
          minutes: 30,
          signature:
            "Simulation: round robin vs least connections vs power of two choices, with one slow server and one dead one; health checks pull it out",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: [
            "Layer 4 vs layer 7 load balancing",
            "Algorithms: round robin, least connections, power of two choices, hashing",
            "Health checks and connection draining",
            "Load balancers as a single point of failure",
          ],
          status: "live",
          level: "core",
          prerequisites: ["latency-throughput"],
          plain:
            "A load balancer sits in front of many servers and decides which one handles each request. How it decides matters most when one server is slow or broken. You'll run the main strategies side by side.",
          terms: [
            "load-balancer",
            "health-check",
            "single-point-of-failure",
            "sticky-session",
            "tail-latency",
          ],
        },
        {
          slug: "autoscaling",
          title: "Horizontal scaling & autoscaling",
          summary: "Keeping servers interchangeable, and adding them before users notice.",
          minutes: 30,
          signature:
            "A traffic-spike simulation: tune thresholds, warm-up and cooldown; see scaling too late, too eagerly, and just right",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Stateless servers and where session state goes",
            "Autoscaling policies: target tracking, step, scheduled",
            "Warm-up time, cooldown and flapping",
            "Scaling limits elsewhere: the database becomes the bottleneck",
          ],
          status: "live",
          level: "core",
          prerequisites: ["load-balancing"],
          plain:
            "Adding more identical servers is the easiest way to handle more users, but only if any server can handle any request. Autoscaling adds and removes servers automatically. You'll tune it through a traffic spike.",
          terms: ["stateless", "autoscaling", "horizontal-scaling", "load-balancer", "utilisation"],
        },
        {
          slug: "cdn-edge",
          title: "CDNs & the edge",
          summary: "Serving content from near the user, and the hard part: keeping it fresh.",
          minutes: 25,
          signature:
            "A map of users and edge locations: watch requests hit or miss nearby caches, then publish a change and invalidate it",
          formats: ["animated-infographic", "simulation", "checkpoint"],
          concepts: [
            "Edge locations and origin servers",
            "Cache hit ratio, TTLs and cache keys",
            "Invalidation and versioned URLs",
            "Edge compute and what not to cache",
          ],
          status: "live",
          level: "core",
          prerequisites: ["latency-throughput"],
          plain:
            "A content delivery network keeps copies of files on servers around the world, so users download from somewhere close. The speed-up is huge; the challenge is updating those copies when things change.",
          terms: ["cdn", "edge-location", "hit-ratio", "ttl", "latency", "cache"],
        },
      ],
    },
    {
      slug: "caching",
      title: "Caching",
      summary: "Remembering answers so you don't recompute them, and the problems that brings.",
      modules: [
        {
          slug: "caching-patterns",
          title: "Caching patterns",
          summary: "Cache-aside, read-through, write-through and write-back, step by step.",
          minutes: 25,
          signature:
            "Step-through of reads and writes under each pattern, with a stale read waiting to happen",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Cache-aside, read-through, write-through, write-back",
            "Where caches live: client, CDN, application, database",
            "Staleness and consistency trade-offs",
          ],
          status: "live",
          level: "core",
          prerequisites: ["latency-throughput"],
          plain:
            "A cache is a fast copy of data that's slow to fetch. There are a few standard ways to fill it and keep it in step with the database, each with different risks of serving old data.",
          terms: ["cache", "cache-aside", "lease", "ttl", "hit-ratio"],
        },
        {
          slug: "cache-eviction",
          title: "Eviction, invalidation & stampedes",
          summary:
            "What to throw out when the cache is full, and how a popular key expiring can take a site down.",
          minutes: 30,
          signature:
            "Simulation: LRU vs LFU vs TTL on real-looking traffic, then a hot key expires and a thundering herd hits the database; tame it",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Eviction policies: LRU, LFU, TTL",
            "Hit ratio and working set size",
            "Cache stampedes: request coalescing, early refresh, jitter",
            "Invalidation strategies",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["caching-patterns"],
          plain:
            "Caches are small, so something must be thrown out to make room. And when a popular item expires, thousands of requests can rush to the database at once. You'll watch that happen, then prevent it.",
          terms: ["eviction", "stampede", "jitter", "hot-key", "hit-ratio", "ttl", "lease"],
        },
      ],
    },
    {
      slug: "data-at-scale",
      title: "Data at scale",
      summary: "Copying, splitting and keeping data consistent across many machines.",
      modules: [
        {
          slug: "replication",
          title: "Replication",
          summary: "Copies of the database on many machines, and the lag between them.",
          minutes: 30,
          signature:
            "Replication-lag simulation: write to the leader, read from a follower, and miss your own update; fix it with read-your-writes",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: [
            "Leader-follower, multi-leader and leaderless replication",
            "Synchronous vs asynchronous replication",
            "Replication lag and read-your-writes",
            "Failover and split brain",
          ],
          status: "live",
          level: "core",
          prerequisites: ["what-scale-means"],
          plain:
            "Replication keeps copies of the same data on several machines, for speed and safety. Copies take time to catch up, so a user can briefly see old data, even their own old data. You'll see why and how systems handle it.",
          terms: ["replica", "leader-follower", "replication-lag", "failover", "split-brain"],
        },
        {
          slug: "sharding",
          title: "Partitioning & sharding",
          summary: "Splitting data across machines, and moving it when you add more.",
          minutes: 35,
          signature:
            "A 3D hash ring: add a server and watch which keys move under naive hashing vs consistent hashing; then a hot key melts one shard",
          formats: ["3d-model", "simulation", "checkpoint"],
          concepts: [
            "Range vs hash partitioning",
            "Consistent hashing and virtual nodes",
            "Hot keys and skew",
            "Resharding and cross-shard queries",
          ],
          status: "live",
          level: "core",
          prerequisites: ["replication"],
          plain:
            "When data won't fit on one machine, it's split into pieces called shards. Choosing how to split decides whether load spreads evenly, and how painful it is to add machines later.",
          terms: ["shard", "consistent-hashing", "hot-key", "replica"],
        },
        {
          slug: "consistency",
          title: "Consistency, CAP & quorums",
          summary:
            "What happens when the network splits, and how quorums trade speed for correctness.",
          minutes: 35,
          signature:
            "A network-partition scenario where you choose to refuse or accept writes, then an N/R/W quorum simulator with stale reads",
          formats: ["branching-scenario", "simulation", "checkpoint"],
          concepts: [
            "Consistency models: strong, eventual, causal, read-your-writes",
            "CAP and PACELC, stated precisely",
            "Quorums: N, R, W",
            "Conflict resolution: last-write-wins, vector clocks, CRDTs",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["replication"],
          plain:
            "When copies of data can't talk to each other, a system must choose: stay available and risk disagreement, or stop accepting changes until they reconnect. You'll make that choice yourself and see the consequences.",
          terms: ["cap", "partition-network", "consistency-model", "quorum", "replica"],
        },
        {
          slug: "choosing-a-database",
          title: "Choosing a database",
          summary:
            "Relational, key-value, document, wide-column, graph, time-series and search, matched to real workloads.",
          minutes: 30,
          signature:
            "Build & connect: route eight real workloads to the database family that fits, with explained mismatches",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Data models and access patterns",
            "Relational vs NoSQL families and their trade-offs",
            "Polyglot persistence",
            "Managed options on each cloud",
          ],
          status: "live",
          level: "core",
          prerequisites: ["sharding"],
          plain:
            "There's no single best database. Each family is built for certain questions: joins, fast lookups by key, huge write volumes, relationships, time series or text search. You'll match workloads to the right kind.",
          terms: ["polyglot-persistence", "shard", "replica", "cache"],
        },
        {
          slug: "distributed-transactions",
          title: "Transactions across services",
          summary: "Keeping several databases in step without a single transaction.",
          minutes: 35,
          signature:
            "Step-through of an order across payment, inventory and shipping: two-phase commit vs saga vs outbox, with failures injected at each step",
          formats: ["step-through", "fix-the-problem", "checkpoint"],
          concepts: [
            "Why one transaction can't span services",
            "Two-phase commit and its blocking problem",
            "Sagas and compensating actions",
            "The transactional outbox and dual writes",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["replication"],
          plain:
            "When one business action touches several services, each with its own database, there's no single transaction to keep them in step. You'll see what goes wrong when a step fails halfway, and the patterns that make it safe.",
          terms: ["two-phase-commit", "saga", "dual-write", "outbox", "idempotent"],
        },
      ],
    },
    {
      slug: "async",
      title: "Asynchronous systems",
      summary: "Queues, streams and events: decoupling work, and making retries safe.",
      modules: [
        {
          slug: "queues-streams",
          title: "Queues & streams",
          summary: "Letting producers and consumers work at their own pace.",
          minutes: 30,
          signature:
            "Simulation: producers outpace consumers; watch the backlog grow, add consumers, and see ordering break across partitions",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Message queues vs event logs",
            "Consumer groups and partitions",
            "Ordering guarantees",
            "Backpressure and dead-letter queues",
          ],
          status: "live",
          level: "core",
          prerequisites: ["latency-throughput"],
          plain:
            "A queue lets one part of a system hand work to another without waiting. That smooths spikes and isolates failures, but brings new questions: what order do messages arrive in, and what if consumers fall behind?",
          terms: [
            "queue",
            "event-log",
            "offset",
            "consumer-group",
            "dead-letter-queue",
            "backpressure",
          ],
        },
        {
          slug: "retries-idempotency",
          title: "Retries, idempotency & delivery guarantees",
          summary: "Why retries can take a system down, and how to make repeating an action safe.",
          minutes: 30,
          signature:
            "A retry storm simulation with and without exponential backoff and jitter, then a double-charged payment fixed with an idempotency key",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "At-most-once, at-least-once, effectively-once",
            "Exponential backoff and jitter",
            "Idempotency keys and deduplication",
            "Retry budgets",
          ],
          status: "live",
          level: "core",
          prerequisites: ["queues-streams"],
          plain:
            "Networks fail, so clients retry. Retrying at the wrong moment can overwhelm a struggling service, and retrying the wrong action can charge a customer twice. You'll fix both.",
          terms: [
            "idempotent",
            "retry-storm",
            "exponential-backoff",
            "jitter",
            "retry-budget",
            "idempotency-key",
          ],
        },
        {
          slug: "event-driven",
          title: "Event-driven architecture",
          summary: "Systems that react to events instead of calling each other directly.",
          minutes: 30,
          signature:
            "Build & connect: rewire a tightly coupled checkout into events; add a new consumer without touching the others",
          formats: ["build-connect", "step-through", "checkpoint"],
          concepts: [
            "Commands vs events",
            "Publish/subscribe and choreography vs orchestration",
            "Event sourcing and CQRS, briefly",
            "Schemas and event evolution",
          ],
          status: "live",
          level: "core",
          prerequisites: ["queues-streams"],
          plain:
            "Instead of one service telling others what to do, it announces what happened, and interested services react. That makes systems easier to extend, and harder to follow. You'll see both sides.",
          terms: ["event", "pub-sub", "event-sourcing", "cqrs", "schema-registry"],
        },
      ],
    },
    {
      slug: "reliability",
      title: "Reliability",
      summary: "Designing for failure, containing it, and knowing when it happens.",
      modules: [
        {
          slug: "availability",
          title: "Availability math",
          summary: "What 99.9% really means, and how components add up.",
          minutes: 25,
          signature:
            "An availability calculator: chain components in series, add redundancy in parallel, and watch the nines and the yearly downtime change",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Nines and downtime budgets",
            "Series vs parallel availability",
            "Single points of failure",
            "Correlated failures",
          ],
          status: "live",
          level: "core",
          prerequisites: ["load-balancing"],
          plain:
            "Availability is the share of time a system works. Every component you depend on can fail, so chaining many lowers availability, and duplicating them raises it. You'll do the arithmetic and find the weak links.",
          terms: ["availability", "availability-zone", "single-point-of-failure", "replica", "sla"],
        },
        {
          slug: "resilience-patterns",
          title: "Timeouts, circuit breakers & rate limiting",
          summary: "Stopping one slow service from taking everything down with it.",
          minutes: 35,
          signature:
            "A cascading-failure simulation: one slow dependency exhausts threads upstream; add timeouts, a circuit breaker, bulkheads and a token-bucket rate limiter",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Timeouts and deadlines",
            "Circuit breakers and bulkheads",
            "Rate limiting: token bucket, leaky bucket, sliding window",
            "Load shedding and graceful degradation",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["retries-idempotency", "availability"],
          plain:
            "When one service slows down, everything waiting on it can pile up until the whole system stalls. A few simple patterns contain the damage. You'll watch a cascade happen, then stop it.",
          terms: ["cascading-failure", "circuit-breaker", "bulkhead", "rate-limit", "timeout"],
        },
        {
          slug: "multi-region-dr",
          title: "Multi-region & disaster recovery",
          summary:
            "Surviving the loss of a data centre, and deciding how much data you can afford to lose.",
          minutes: 30,
          signature:
            "A failover drill as a branching scenario: a region goes dark; your earlier choices of backup, replication and DNS decide what users see",
          formats: ["branching-scenario", "animated-infographic", "checkpoint"],
          concepts: [
            "RPO and RTO",
            "Backup/restore, pilot light, warm standby, active-active",
            "DNS and global load balancing",
            "Data residency",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["replication", "availability"],
          plain:
            "Whole data centres and cloud regions do fail. Disaster recovery plans decide how quickly you recover and how much recent data you might lose. You'll run a failover drill.",
          terms: ["disaster-recovery", "rpo", "rto", "failover", "replica", "data-residency"],
        },
        {
          slug: "observability",
          title: "Observability & SLOs",
          summary: "Metrics, logs and traces, and deciding how reliable is reliable enough.",
          minutes: 30,
          signature:
            "Step through a distributed trace to find the slow hop, then set an SLO and watch an error budget burn",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: [
            "Metrics, logs and traces",
            "SLIs, SLOs and SLAs",
            "Error budgets and burn-rate alerts",
            "OpenTelemetry",
          ],
          status: "live",
          level: "core",
          prerequisites: ["latency-throughput"],
          plain:
            "You can't fix what you can't see. Observability means collecting the signals that tell you what a system is doing. Service level objectives turn those signals into a clear target for reliability.",
          terms: ["observability", "metric", "log", "trace", "sli", "slo", "error-budget"],
        },
      ],
    },
    {
      slug: "classic-designs",
      title: "Classic designs",
      summary: "Well-known systems designed end to end, one decision at a time.",
      modules: [
        {
          slug: "url-shortener",
          title: "Design a URL shortener",
          summary: "The classic warm-up: estimate, generate keys, store, cache and redirect.",
          minutes: 35,
          signature:
            "A guided design: estimate the load, pick a key scheme (and see collisions), choose storage and caching, then load-test the result",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Requirements and estimation",
            "Key generation: hashing, counters, random IDs",
            "Read-heavy design and caching",
            "Analytics without slowing redirects",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["estimation", "caching-patterns"],
          plain:
            "A URL shortener turns long links into short ones and redirects people who click them. It's simple enough to design fully, yet touches estimation, key generation, storage and caching.",
          terms: ["back-of-envelope", "base62", "birthday-paradox", "cache", "hit-ratio"],
        },
        {
          slug: "news-feed",
          title: "Design a news feed",
          summary: "Building everyone's timeline fast, including when a celebrity posts.",
          minutes: 35,
          signature:
            "Simulation: fan-out on write vs fan-out on read; a celebrity with ten million followers posts, and you choose a hybrid",
          formats: ["simulation", "build-connect", "checkpoint"],
          concepts: [
            "Fan-out on write vs on read",
            "The celebrity problem and hybrids",
            "Feed ranking and caching",
            "Pagination",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["caching-patterns", "queues-streams"],
          plain:
            "A news feed shows each user recent posts from the people they follow. Doing that quickly for millions of users is a classic trade-off between work at posting time and work at reading time.",
          terms: ["fan-out", "cache", "hot-key", "cursor-pagination"],
        },
        {
          slug: "realtime-chat",
          title: "Design real-time chat",
          summary: "Delivering messages instantly, in order, to people on flaky phones.",
          minutes: 35,
          signature:
            "Step through a message from one phone to another: persistent connections, routing between servers, ordering, delivery receipts and an offline recipient",
          formats: ["step-through", "build-connect", "checkpoint"],
          concepts: [
            "Polling, long polling, WebSockets and server-sent events",
            "Routing messages between connection servers",
            "Ordering and delivery receipts",
            "Presence and offline delivery",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["queues-streams", "sharding"],
          plain:
            "Chat looks simple: send a message, the other person sees it. Doing it instantly for millions of people whose phones drop signal all the time takes persistent connections, careful routing and a clear idea of message order.",
          terms: ["websocket", "long-polling", "presence", "consistent-hashing", "idempotent"],
        },
        {
          slug: "flash-sale",
          title: "Design a flash-sale booking system",
          summary:
            "A million people, a thousand tickets, one minute, and nobody sold the same seat twice.",
          minutes: 35,
          signature:
            "Simulation: a million users hit ‘Book’ at 10:00; compare row locks, optimistic updates, a queue and a virtual waiting room",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Contention on a single hot resource",
            "Pessimistic vs optimistic concurrency",
            "Inventory holds and expiry",
            "Virtual waiting rooms and fairness",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["retries-idempotency", "consistency"],
          plain:
            "When far more people want something than there is, like concert tickets or train seats at opening time, the system must stay up, stay fair, and never sell the same item twice.",
          terms: ["hot-key", "lost-update", "inventory-hold", "waiting-room", "idempotent"],
        },
      ],
    },
    {
      slug: "platforms-capstone",
      title: "Platforms & capstone",
      summary: "The building blocks on real clouds, then two capstones.",
      modules: [
        {
          slug: "building-blocks",
          title: "Building blocks on AWS, Google Cloud, Azure & open source",
          summary: "Load balancers, caches, queues and databases, translated across platforms.",
          minutes: 30,
          signature:
            "A Rosetta stone: one reference architecture whose every block relabels across AWS, Google Cloud, Azure and open source",
          formats: ["animated-infographic", "build-connect", "checkpoint"],
          concepts: [
            "Managed equivalents of each building block",
            "Managed vs self-run trade-offs",
            "Portability and lock-in",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["choosing-a-database", "queues-streams"],
          plain:
            "Every cloud offers the same building blocks under different names. Learning the mapping lets you read any architecture diagram and design on whichever platform a project uses.",
          terms: ["managed-service", "vendor-lock-in", "load-balancer", "cdn", "queue", "cache"],
        },
        {
          slug: "results-day",
          title: "Capstone: the results-day portal",
          summary: "Design a state board's exam-results site for the day millions check at once.",
          minutes: 40,
          signature:
            "Design with branching decisions, then replay results day: traffic surges 100× at 10:00 and your design holds, bends or falls over",
          formats: ["branching-scenario", "simulation", "checkpoint"],
          concepts: ["Applying estimation, caching, CDNs, scaling and reliability to one design"],
          status: "live",
          level: "applied",
          prerequisites: ["cdn-edge", "autoscaling", "cache-eviction"],
          plain:
            "Once a year, millions of students check their exam results in the same few minutes. You'll design a site that survives that spike, then watch results day play out against your design.",
          terms: ["back-of-envelope", "cdn", "autoscaling", "cache", "single-point-of-failure"],
        },
        {
          slug: "the-outage",
          title: "Capstone: the outage",
          summary: "A cascading failure is unfolding. Read the evidence, find the cause, stop it.",
          minutes: 35,
          signature:
            "Investigate dashboards, traces and logs during an incident: a cache stampede and a retry storm feed each other; apply fixes and watch recovery",
          formats: ["fix-the-problem", "simulation", "checkpoint"],
          concepts: ["Diagnosing interacting failures from metrics, traces and logs"],
          status: "live",
          level: "applied",
          prerequisites: ["resilience-patterns", "cache-eviction", "observability"],
          plain:
            "It's 9 pm and the site is down. Several problems are feeding each other. Using dashboards, traces and logs, you'll work out what's happening and bring the system back.",
          terms: ["stampede", "retry-storm", "metastable-failure", "trace", "postmortem"],
        },
      ],
    },
  ],
};

const llmFoundations: Track = {
  slug: "llm-foundations",
  title: "LLM Foundations",
  area: "AI & machine learning",
  category: "ai-ml",
  tagline: "See inside the models, not just the chat box.",
  description:
    "What large language models really do, from tokens and embeddings through attention, training and alignment, to running them fast and cheaply and using them safely. Vendor-neutral: closed and open-weight models, on APIs, cloud platforms or your own GPUs. By the end you can explain how an LLM works, choose one for a job, and predict where it will fail.",
  accent: "synapse",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "What a language model does, and the raw material it works with.",
      modules: [
        {
          slug: "what-an-llm-does",
          title: "What an LLM actually does",
          summary: "A machine that predicts the next word, astonishingly well, over and over.",
          minutes: 25,
          signature:
            "Scroll from phone autocomplete to a chat assistant: one next-token prediction at a time, with the probabilities visible",
          formats: ["scroll-story", "simulation", "checkpoint"],
          concepts: [
            "Next-token prediction as the core task",
            "Generation as a loop: predict, pick, append, repeat",
            "Models learn patterns from text, not a database of facts",
            "Why the same prompt can give different answers",
          ],
          status: "live",
          level: "beginner",
          plain:
            "A large language model is trained to guess the next piece of text. Chat assistants are that guess, repeated one piece at a time, very fast. Almost everything else in this track follows from that one idea.",
          terms: ["llm", "next-token-prediction", "token", "chat-template"],
        },
        {
          slug: "tokens",
          title: "Tokens",
          summary:
            "The pieces models actually read, and why they explain cost, limits and odd mistakes.",
          minutes: 25,
          signature:
            "Type anything and watch a real tokenizer split it; step through how byte-pair merges are learned; compare English, Hindi and code",
          formats: ["sandbox", "step-through", "checkpoint"],
          concepts: [
            "Text becomes token IDs before the model sees it",
            "Byte-pair encoding learns frequent pieces",
            "Token counts drive price, speed and context limits",
            "Why some languages and tasks (counting letters) are harder",
          ],
          status: "planned",
          level: "beginner",
          prerequisites: ["what-an-llm-does"],
          plain:
            "Models don't read letters or words; they read tokens, chunks of text from a fixed vocabulary. How text is chopped up decides how much a request costs and explains some surprising mistakes.",
        },
        {
          slug: "embeddings",
          title: "Embeddings: meaning as coordinates",
          summary: "How text becomes points in space, where closeness means similar meaning.",
          minutes: 30,
          signature:
            "Explore a 3D map of real sentence embeddings; search it by meaning, and see where it gets confused",
          formats: ["3d-model", "simulation", "checkpoint"],
          concepts: [
            "Vectors as lists of numbers that capture meaning",
            "Cosine similarity",
            "Semantic search vs keyword search",
            "Dimensions, and what projection to 3D hides",
          ],
          status: "planned",
          level: "beginner",
          prerequisites: ["tokens"],
          plain:
            "An embedding turns a word or sentence into a long list of numbers, like coordinates on a map of meaning. Similar ideas land near each other, which is what lets computers search by meaning rather than exact words.",
        },
      ],
    },
    {
      slug: "transformer",
      title: "Inside the transformer",
      summary: "The architecture behind every modern language model.",
      modules: [
        {
          slug: "attention",
          title: "Attention",
          summary: "How each word decides which other words to pay attention to.",
          minutes: 30,
          signature:
            "An attention heatmap for a sentence: step through queries, keys and values, and compare heads that track grammar, references and position",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: [
            "Queries, keys and values",
            "Attention weights as a softmax over similarities",
            "Multiple heads learn different relationships",
            "Causal masking: no peeking at the future",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["embeddings"],
          plain:
            "To understand a word, you look at the words around it: in 'she put the cup on the table because it was hot', 'it' means the cup. Attention is the mechanism that lets the model decide which earlier words matter for each word.",
        },
        {
          slug: "transformer-block",
          title: "The transformer block",
          summary: "One token's journey through the layers of a model.",
          minutes: 30,
          signature:
            "A 3D stack of transformer layers: follow one token through attention, the feed-forward network and residual connections, then see what a hundred layers add",
          formats: ["3d-model", "step-through", "checkpoint"],
          concepts: [
            "Embedding, attention, feed-forward, residual, normalisation",
            "Layers stacked dozens of times",
            "Where the parameters live",
            "The final layer's scores over the vocabulary",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["attention"],
          plain:
            "A transformer is the same building block repeated many times. Each block lets tokens share information (attention) and then processes each one on its own. Stacking dozens of blocks turns simple pattern matching into surprisingly capable behaviour.",
        },
        {
          slug: "context-window",
          title: "Positions & the context window",
          summary: "Why word order must be added in, and why long inputs cost so much.",
          minutes: 25,
          signature:
            "Grow the context from a paragraph to a book and watch attention work, memory and price climb; see what the KV cache saves",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Positional information (such as RoPE)",
            "The context window as working memory",
            "Attention cost grows with context length",
            "The KV cache",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["transformer-block"],
          plain:
            "A model can only consider a limited amount of text at once: its context window. Bigger windows let it read whole documents, but every extra token costs memory and time. This module shows why.",
        },
        {
          slug: "sampling",
          title: "From scores to words: sampling",
          summary: "How the model's scores become the next word, and what temperature really does.",
          minutes: 25,
          signature:
            "A live next-token distribution: turn temperature, top-k and top-p and watch which words stay possible, then generate the same sentence many times",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Logits and softmax",
            "Greedy decoding vs sampling",
            "Temperature, top-k and top-p",
            "Determinism, seeds and why outputs vary",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["what-an-llm-does"],
          plain:
            "At each step the model gives every possible next token a score. Sampling settings decide how adventurous the choice is: always the favourite, or sometimes a less likely option. That's why the same question can get different answers.",
        },
      ],
    },
    {
      slug: "learning",
      title: "How models learn",
      summary: "Pretraining, fine-tuning, alignment and reasoning.",
      modules: [
        {
          slug: "pretraining",
          title: "Pretraining & scaling laws",
          summary:
            "How reading trillions of tokens teaches a model, and how to spend a compute budget.",
          minutes: 30,
          signature:
            "Watch training loss fall as a tiny model learns; then split a fixed compute budget between model size and data and see which wins",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Loss and gradient descent, intuitively",
            "Training data: sources, filtering and deduplication",
            "Scaling laws: parameters, data and compute",
            "Why training costs so much",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["transformer-block"],
          plain:
            "A model starts as random numbers. Pretraining shows it huge amounts of text and nudges the numbers every time it guesses the next token wrong. Researchers have found predictable rules for how much data and model size to use for a given budget.",
        },
        {
          slug: "base-to-assistant",
          title: "From base model to assistant",
          summary: "Why a raw model continues your text, and how fine-tuning makes it answer.",
          minutes: 25,
          signature:
            "The same prompt to a base model and an instruction-tuned one, step by step; then see what a small fine-tuning set changes",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Base models vs instruction-tuned models",
            "Supervised fine-tuning (SFT)",
            "Chat templates and roles",
            "Parameter-efficient fine-tuning (LoRA), briefly",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["pretraining"],
          plain:
            "A freshly pretrained model just continues text: ask it a question and it may write more questions. Fine-tuning on examples of good answers teaches it to behave like an assistant.",
        },
        {
          slug: "alignment",
          title: "Alignment: RLHF, DPO & friends",
          summary: "How human preferences shape what assistants say, and refuse to say.",
          minutes: 30,
          signature:
            "Rank answer pairs yourself, then watch a reward model and a preference-tuned model learn from those choices, including their side effects",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: [
            "Preference data",
            "Reward models and RLHF",
            "Direct preference optimisation (DPO)",
            "Side effects: over-refusal and sycophancy",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["base-to-assistant"],
          plain:
            "To make assistants helpful and safe, developers collect people's judgements about which of two answers is better and train the model toward the preferred kind. It works well, but it can also make models overly cautious or eager to please.",
        },
        {
          slug: "reasoning-models",
          title: "Reasoning models",
          summary: "Models that think before they answer, and what that costs.",
          minutes: 25,
          signature:
            "Give a puzzle to a model with and without thinking time; trade accuracy against tokens, latency and cost",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Chain of thought",
            "Test-time compute and thinking budgets",
            "Training reasoning with reinforcement learning",
            "When reasoning helps and when it only adds cost",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["alignment"],
          plain:
            "Some newer models write out their working before answering. Spending more tokens on thinking often gives better answers on hard problems, at the price of more time and money.",
        },
      ],
    },
    {
      slug: "using",
      title: "Using models well",
      summary: "Prompts, tools, context and the limits of what models know.",
      modules: [
        {
          slug: "prompting",
          title: "Prompting fundamentals",
          summary: "Clear instructions, good examples and the right format.",
          minutes: 25,
          signature:
            "Fix a failing prompt step by step: add a role, constraints, examples and an output format, and watch results improve",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "System, user and assistant messages",
            "Instructions, constraints and examples (few-shot)",
            "Asking for a specific format",
            "Iterating against test cases",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["base-to-assistant"],
          plain:
            "A prompt is the model's whole brief. Vague briefs get vague results. Being specific about the task, giving examples and saying what the answer should look like makes a large difference.",
        },
        {
          slug: "tool-calling",
          title: "Structured output & tool calling",
          summary: "Getting reliable data out of models, and letting them use other software.",
          minutes: 30,
          signature:
            "Step through the tool-calling loop: the model asks for a function, your code runs it, the result goes back; then break a schema and see what happens",
          formats: ["step-through", "sandbox", "checkpoint"],
          concepts: [
            "JSON output and schemas",
            "Function (tool) calling",
            "The model decides, your code acts",
            "Validation and error handling",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["prompting"],
          plain:
            "Applications need data, not prose. Models can be asked to answer in a fixed structure, and to request actions such as 'look up order 42', which your code then carries out. This is the foundation of agents.",
        },
        {
          slug: "context-engineering",
          title: "Context engineering",
          summary: "Deciding what goes into the context window, and what stays out.",
          minutes: 25,
          signature:
            "Fill a context window with documents, history and instructions; see accuracy drop when key facts sit in the middle, and compare long context with retrieval",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Everything the model knows about your task is in the context",
            "Long context vs retrieval",
            "Position effects (lost in the middle)",
            "Summaries, memory and prompt caching",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["context-window", "prompting"],
          plain:
            "A model only knows what's in its training and what you put in front of it. Choosing which documents, history and instructions to include, and in what order, often matters more than the wording of the prompt.",
        },
        {
          slug: "hallucinations",
          title: "Hallucinations",
          summary: "Why fluent models state false things confidently, and what actually helps.",
          minutes: 25,
          signature:
            "Diagnose a set of confident wrong answers: missing knowledge, pressure to answer, bad retrieval or sampling; apply fixes and measure",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Why next-token prediction produces plausible falsehoods",
            "Knowledge cut-offs",
            "Grounding in sources and citing them",
            "Letting the model say 'I don't know'",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["what-an-llm-does", "context-engineering"],
          plain:
            "Models are trained to produce likely-sounding text, not true text. When they don't know, they can still produce a confident answer. Knowing why helps you design systems that catch it.",
        },
      ],
    },
    {
      slug: "running",
      title: "Running models",
      summary: "Speed, memory, throughput and cost.",
      modules: [
        {
          slug: "inference",
          title: "Inference: prefill, decode & the KV cache",
          summary: "Where the time goes between pressing Enter and the last word.",
          minutes: 25,
          signature:
            "A request timeline: prefill the prompt, then decode token by token; change prompt and answer length and see time to first token and tokens per second move",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Prefill vs decode",
            "Time to first token and tokens per second",
            "Memory bandwidth as the bottleneck",
            "The KV cache and prompt caching",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["context-window"],
          plain:
            "Generating an answer happens in two phases: reading the whole prompt at once, then writing the answer one token at a time. Each phase has different costs, which is why long answers feel slow even when short ones are quick.",
        },
        {
          slug: "memory-quantization",
          title: "Model size, memory & quantization",
          summary: "Will this model fit on this GPU, and what do you lose by shrinking it?",
          minutes: 25,
          signature:
            "A GPU memory calculator: parameters × bytes, plus the KV cache; quantize from 16 to 8 to 4 bits and watch fit, speed and quality",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Parameters and bytes per parameter",
            "GPU memory: weights, KV cache and overhead",
            "Quantization and its trade-offs",
            "Mixture-of-experts: total vs active parameters",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["inference"],
          plain:
            "A model's size in parameters decides how much memory it needs. Storing each number with fewer bits (quantization) lets bigger models fit on smaller machines, usually at a small cost in quality.",
        },
        {
          slug: "serving",
          title: "Serving at scale",
          summary: "Many users, one GPU: batching, throughput and latency.",
          minutes: 25,
          signature:
            "A serving simulation: requests arrive, batch together and share the GPU; tune batch size and watch throughput rise and latency stretch",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Batching and continuous batching",
            "Throughput vs latency",
            "Serving engines (such as vLLM)",
            "Autoscaling GPUs",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["inference"],
          plain:
            "A GPU is wasted serving one request at a time. Serving systems group many requests together to use it fully, which raises total throughput but can make each individual answer a little slower.",
        },
        {
          slug: "cost-latency",
          title: "Cost & latency estimation",
          summary: "Estimate what an AI feature will cost each month, and how fast it will feel.",
          minutes: 25,
          signature:
            "A calculator for a real feature: requests, tokens in and out, model tier and caching; compare API pricing with renting GPUs",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Input vs output token pricing",
            "Caching and batch discounts",
            "API vs self-hosted break-even",
            "Latency budgets for user-facing features",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["tokens", "inference"],
          plain:
            "AI features are billed by the token. A quick estimate of requests and tokens tells you whether a feature costs pennies or a fortune, and whether it will feel instant or sluggish.",
        },
      ],
    },
    {
      slug: "landscape",
      title: "The model landscape",
      summary: "Choosing among models, modalities and sizes.",
      modules: [
        {
          slug: "open-vs-closed",
          title: "Open vs closed models",
          summary: "Weights, licences and where a model can run.",
          minutes: 25,
          signature:
            "Match requirements (data residency, cost, control, quality) to models and hosting: provider APIs, AWS Bedrock, Google Vertex AI, Azure AI Foundry or your own GPUs",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Closed APIs vs open-weight models",
            "Licences and what 'open' means",
            "Hosting options across clouds",
            "Benchmarks and their limits",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["cost-latency"],
          plain:
            "Some models are only available through their maker's service; others publish their weights so you can run them yourself. The choice affects cost, control, privacy and where your data goes.",
        },
        {
          slug: "multimodal",
          title: "Multimodal models",
          summary: "Models that see images, read documents, hear and speak.",
          minutes: 25,
          signature:
            "Step through how an image becomes tokens a language model can attend to; then see document, audio and image-generation pipelines",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Image patches as tokens",
            "Document understanding",
            "Speech in and out",
            "Generating images",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["attention"],
          plain:
            "Modern models can take pictures, scanned documents and audio as input, and some can produce images or speech. Under the hood, each kind of input is turned into tokens the same transformer can process.",
        },
        {
          slug: "small-models",
          title: "Small & on-device models",
          summary: "When a small, focused model beats a giant one.",
          minutes: 25,
          signature:
            "Compare small and large models on cost, speed and quality for different jobs; see distillation turn a big model's answers into a small model's skills",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Distillation",
            "Small models for narrow tasks",
            "On-device and edge inference",
            "Routing between small and large models",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["memory-quantization"],
          plain:
            "Bigger isn't always better. For narrow, well-defined jobs, a small model can be faster, cheaper and private enough to run on a laptop or phone, sometimes with similar quality.",
        },
      ],
    },
    {
      slug: "safety",
      title: "Safety & responsibility",
      summary: "Attacks, privacy and building systems people can trust.",
      modules: [
        {
          slug: "prompt-injection",
          title: "Prompt injection & data leakage",
          summary: "How untrusted text can hijack a model, and how to limit the damage.",
          minutes: 30,
          signature:
            "Attack a toy assistant with direct and indirect prompt injection, then add defences and see which attacks still get through",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Direct and indirect prompt injection",
            "Why instructions and data mix",
            "Least privilege for tools",
            "Leaking system prompts and data",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["tool-calling"],
          plain:
            "Models follow instructions, and they can't reliably tell your instructions from instructions hidden in an email or web page they read. That makes a new kind of attack, which you defend against by limiting what the model can do.",
        },
        {
          slug: "responsible-use",
          title: "Bias, privacy & responsible use",
          summary: "Where bias comes from, handling personal data, and keeping humans in charge.",
          minutes: 25,
          signature:
            "A branching scenario for a government eligibility assistant: data, bias checks, consent under the DPDP Act and human review",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "Bias from training data",
            "Personal data and India's DPDP Act",
            "Human oversight for important decisions",
            "Transparency with users",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["hallucinations"],
          plain:
            "Models learn from human text, including its biases, and they may handle people's personal data. Responsible systems check for unfair outcomes, respect privacy law and keep a human in charge of decisions that matter.",
        },
      ],
    },
    {
      slug: "capstones",
      title: "Capstones",
      summary: "Put it all together.",
      modules: [
        {
          slug: "choose-a-model",
          title: "Capstone: choose and size a model",
          summary: "Design the model side of a multilingual citizen helpdesk.",
          minutes: 40,
          signature:
            "Branching decisions for a helpdesk in English, Hindi and Kannada: model, context strategy, hosting, cost and latency; then replay a day of questions",
          formats: ["branching-scenario", "simulation", "checkpoint"],
          concepts: ["Applying tokens, context, cost, latency and hosting to one design"],
          status: "planned",
          level: "applied",
          prerequisites: ["cost-latency", "open-vs-closed", "context-engineering"],
          plain:
            "A state department wants an assistant that answers citizens' questions in several languages. You'll choose the model, how it gets its knowledge, where it runs and what it will cost, then see how your choices hold up.",
        },
        {
          slug: "misbehaving-assistant",
          title: "Capstone: the assistant that misbehaves",
          summary: "Find out why a deployed assistant goes wrong, and fix it.",
          minutes: 40,
          signature:
            "Investigate transcripts and traces: a tokenizer surprise, a sampling setting, a buried instruction and an injection attack; fix each and re-test",
          formats: ["fix-the-problem", "simulation", "checkpoint"],
          concepts: ["Diagnosing LLM failures from evidence"],
          status: "planned",
          level: "applied",
          prerequisites: ["prompt-injection", "hallucinations", "sampling"],
          plain:
            "An assistant that worked in testing is giving strange answers in production. Using everything from this track, you'll trace each problem to its cause and fix it.",
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
  category: "internal",
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

export const tracks: Track[] = [lakehouse, systemDesign, llmFoundations, playground];

export interface CategoryTrack {
  title: string;
  blurb: string;
  /** Set once the track is built: links to /tracks/<slug>. */
  slug?: string;
}

export interface Category {
  slug: string;
  title: string;
  summary: string;
  description: string;
  /** Key into the track accent palette in globals.css ([data-track]). */
  accent: Track["accent"];
  tracks: CategoryTrack[];
}

/** Areas from the solution document (§10). A track gets a `slug` here when it goes live. */
export const categories: Category[] = [
  {
    slug: "data-engineering",
    title: "Data engineering",
    summary: "Move, store and model data at any scale.",
    description:
      "How modern data platforms really work: storage formats, table formats, pipelines, streaming and the modelling that turns raw data into answers.",
    accent: "lakehouse",
    tracks: [
      {
        title: "Modern Data Lakehouse",
        slug: "data-lakehouse",
        blurb: "Open table formats, engines and governance on AWS, GCP, Azure and open source.",
      },
      {
        title: "Streaming Data Systems",
        blurb: "Events, windows, state and exactly-once pipelines.",
      },
      { title: "Spark", blurb: "How distributed dataframes plan, shuffle and scale." },
      { title: "Data Modelling", blurb: "Stars, snowflakes, vaults and when to use each." },
      { title: "Data Quality", blurb: "Tests, contracts and observability for data." },
    ],
  },
  {
    slug: "ai-ml",
    title: "AI & machine learning",
    summary: "From model foundations to agents in production.",
    description:
      "What large language models do inside, how to ground them in your data, build agents and voice interfaces, and measure whether any of it works.",
    accent: "synapse",
    tracks: [
      {
        title: "LLM Foundations",
        slug: "llm-foundations",
        blurb: "Tokens, embeddings, attention and sampling, seen from inside.",
      },
      {
        title: "RAG Systems",
        blurb: "Grounding models in your documents: retrieval, chunking and ranking.",
      },
      { title: "AI Agents", blurb: "Tools, planning, memory and guardrails." },
      { title: "Voice AI", blurb: "Speech in, speech out, in real time." },
      { title: "LLM Evaluation", blurb: "Measuring quality, safety and regressions." },
      { title: "Applied ML", blurb: "Classic machine learning, from features to deployment." },
    ],
  },
  {
    slug: "platform-cloud",
    title: "Platform & cloud",
    summary: "Run software reliably on modern infrastructure.",
    description:
      "The infrastructure under every product: cloud building blocks, containers, delivery pipelines and the signals that tell you what's happening.",
    accent: "neutral",
    tracks: [
      {
        title: "Cloud Architecture",
        blurb: "Networks, identity and landing zones across the big clouds.",
      },
      { title: "Kubernetes", blurb: "Pods, controllers and scheduling, taken apart." },
      { title: "CI/CD", blurb: "From commit to production, safely and often." },
      { title: "Observability", blurb: "Metrics, logs, traces and SLOs in depth." },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture",
    summary: "Design systems that scale, survive and evolve.",
    description:
      "The trade-offs behind large systems: load, data, failure and change, practised on real design problems.",
    accent: "blueprint",
    tracks: [
      {
        title: "System Design at Scale",
        slug: "system-design",
        blurb: "From one server to multi-region systems, with capstones.",
      },
      { title: "API Design", blurb: "Resources, versions, pagination and contracts." },
      {
        title: "Database Internals",
        blurb: "Pages, indexes, logs and transactions underneath SQL.",
      },
      {
        title: "Enterprise Patterns",
        blurb: "Integration, domains and boundaries in large organisations.",
      },
    ],
  },
  {
    slug: "security-government",
    title: "Security & government",
    summary: "Build secure, compliant systems for the public sector.",
    description:
      "Security from the attacker's point of view, India's data protection law, and what building for government really involves.",
    accent: "neutral",
    tracks: [
      {
        title: "Application Security",
        blurb: "The common attacks, and the habits that stop them.",
      },
      { title: "DPDP Act", blurb: "India's data protection law for engineers." },
      {
        title: "Building for Government",
        blurb: "Procurement, standards, accessibility and scale.",
      },
    ],
  },
  {
    slug: "cross-cutting",
    title: "Cross-cutting",
    summary: "Skills every engineer uses, whatever the stack.",
    description: "Practices that apply across every role and technology.",
    accent: "neutral",
    tracks: [
      {
        title: "AI-Assisted Development",
        blurb: "Working well with coding assistants and agents.",
      },
    ],
  },
  {
    slug: "software-development",
    title: "Software development",
    summary: "Craft, test and ship quality code.",
    description:
      "The everyday craft of building software well, from the browser to the server and the phone.",
    accent: "neutral",
    tracks: [
      { title: "Frontend", blurb: "The browser, rendering and modern UI frameworks." },
      { title: "Backend", blurb: "Services, data access and APIs that last." },
      { title: "Mobile", blurb: "Native and cross-platform apps." },
      { title: "Testing", blurb: "What to test, at which level, and why." },
      { title: "Clean Code", blurb: "Code other people can read and change." },
      { title: "Code Review", blurb: "Giving and receiving useful reviews." },
      { title: "Git", blurb: "Commits, branches and history, understood." },
    ],
  },
  {
    slug: "design",
    title: "Design",
    summary: "Interfaces people understand and enjoy.",
    description: "Design fundamentals for everyone who builds screens, dashboards and flows.",
    accent: "neutral",
    tracks: [
      { title: "UX Fundamentals", blurb: "Research, flows and usability." },
      { title: "UI for Developers", blurb: "Layout, type, colour and spacing that work." },
      { title: "Design Systems", blurb: "Tokens, components and consistency at scale." },
      { title: "Accessibility", blurb: "Building for everyone, and meeting the standards." },
      { title: "Dashboards", blurb: "Showing data so people can act on it." },
    ],
  },
  {
    slug: "delivery-management",
    title: "Delivery management",
    summary: "Plan, estimate and deliver projects predictably.",
    description:
      "Running projects that finish: planning, estimating, managing risk and measuring delivery.",
    accent: "neutral",
    tracks: [
      { title: "Agile & Scrum", blurb: "The ceremonies, and the thinking behind them." },
      { title: "Estimation", blurb: "Forecasting honestly under uncertainty." },
      { title: "Fixed-Scope Projects", blurb: "Delivering to a contract without heroics." },
      { title: "Risk", blurb: "Spotting, sizing and handling project risks." },
      { title: "Delivery Metrics", blurb: "Measures that help rather than harm." },
    ],
  },
  {
    slug: "business-analysis",
    title: "Business analysis",
    summary: "Turn needs into clear, buildable requirements.",
    description:
      "Understanding what people need and describing it so teams can build the right thing.",
    accent: "neutral",
    tracks: [
      { title: "Requirements", blurb: "Eliciting, writing and validating requirements." },
      { title: "Product Thinking", blurb: "Outcomes over output." },
      { title: "Process Mapping", blurb: "Seeing how work really flows." },
    ],
  },
  {
    slug: "presales-client",
    title: "Pre-sales & client skills",
    summary: "Win work and earn client trust.",
    description: "From reading an RFP to presenting a solution and keeping clients informed.",
    accent: "neutral",
    tracks: [
      { title: "RFP Response", blurb: "Reading tenders and answering them well." },
      { title: "Proposal Architecture", blurb: "Solutions that win and can be delivered." },
      { title: "Demos", blurb: "Showing software that tells a story." },
      { title: "Client Communication", blurb: "Clear updates, hard conversations and trust." },
    ],
  },
  {
    slug: "domain-knowledge",
    title: "Domain knowledge",
    summary: "Understand the sectors we build for.",
    description: "How the institutions we work with operate, so the systems we build fit them.",
    accent: "neutral",
    tracks: [
      { title: "Higher Education", blurb: "Admissions, exams, results and accreditation." },
      { title: "Government Systems", blurb: "How departments, schemes and services work." },
      {
        title: "Cooperative Banking",
        blurb: "Accounts, loans and regulation in cooperative banks.",
      },
      { title: "Health Insurance", blurb: "Policies, claims and the systems behind them." },
    ],
  },
  {
    slug: "leadership",
    title: "Leadership",
    summary: "Grow from engineer to leader.",
    description:
      "The people side of technical work: leading teams, giving feedback and writing clearly.",
    accent: "neutral",
    tracks: [
      { title: "Engineer to Tech Lead", blurb: "The shift from doing to enabling." },
      { title: "Feedback", blurb: "Giving and receiving it well." },
      { title: "Effective Meetings", blurb: "Fewer, shorter and more useful." },
      { title: "Technical Writing", blurb: "Documents people actually read." },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Built tracks in a category (live or in progress), in catalogue order. */
export function categoryTracks(category: Category): Track[] {
  return tracks.filter(
    (t) =>
      t.category === category.slug && !t.hidden && trackModules(t).some((m) => m.status === "live"),
  );
}

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
