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
  accent:
    | "lakehouse"
    | "blueprint"
    | "synapse"
    | "cadence"
    | "lumen"
    | "stratus"
    | "current"
    | "helm"
    | "relay"
    | "signal"
    | "contract"
    | "ledger"
    | "keystone"
    | "ember"
    | "timber"
    | "assay"
    | "orbit"
    | "neutral";
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
          status: "live",
          level: "beginner",
          prerequisites: ["what-an-llm-does"],
          plain:
            "Models don't read letters or words; they read tokens, chunks of text from a fixed vocabulary. How text is chopped up decides how much a request costs and explains some surprising mistakes.",
          terms: ["token", "tokenizer", "vocabulary", "bpe"],
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
          status: "live",
          level: "beginner",
          prerequisites: ["tokens"],
          plain:
            "An embedding turns a word or sentence into a long list of numbers, like coordinates on a map of meaning. Similar ideas land near each other, which is what lets computers search by meaning rather than exact words.",
          terms: ["embedding", "cosine-similarity", "semantic-search", "token"],
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
          status: "live",
          level: "core",
          prerequisites: ["embeddings"],
          plain:
            "To understand a word, you look at the words around it: in 'she put the cup on the table because it was hot', 'it' means the cup. Attention is the mechanism that lets the model decide which earlier words matter for each word.",
          terms: ["attention", "attention-head", "qkv", "multi-head", "causal-mask"],
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
          status: "live",
          level: "core",
          prerequisites: ["attention"],
          plain:
            "A transformer is the same building block repeated many times. Each block lets tokens share information (attention) and then processes each one on its own. Stacking dozens of blocks turns simple pattern matching into surprisingly capable behaviour.",
          terms: ["transformer", "transformer-block", "attention", "parameter", "logit-lens"],
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
          status: "live",
          level: "core",
          prerequisites: ["transformer-block"],
          plain:
            "A model can only consider a limited amount of text at once: its context window. Bigger windows let it read whole documents, but every extra token costs memory and time. This module shows why.",
          terms: ["positional-encoding", "context-window", "kv-cache", "attention", "token"],
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
          status: "live",
          level: "core",
          prerequisites: ["what-an-llm-does"],
          plain:
            "At each step the model gives every possible next token a score. Sampling settings decide how adventurous the choice is: always the favourite, or sometimes a less likely option. That's why the same question can get different answers.",
          terms: ["sampling", "temperature", "top-k", "top-p", "softmax"],
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
          status: "live",
          level: "core",
          prerequisites: ["transformer-block"],
          plain:
            "A model starts as random numbers. Pretraining shows it huge amounts of text and nudges the numbers every time it guesses the next token wrong. Researchers have found predictable rules for how much data and model size to use for a given budget.",
          terms: ["pretraining", "loss", "scaling-law", "parameter", "token"],
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
          status: "live",
          level: "core",
          prerequisites: ["pretraining"],
          plain:
            "A freshly pretrained model just continues text: ask it a question and it may write more questions. Fine-tuning on examples of good answers teaches it to behave like an assistant.",
          terms: ["base-model", "instruction-tuning", "sft", "chat-template", "lora"],
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
          status: "live",
          level: "core",
          prerequisites: ["base-to-assistant"],
          plain:
            "To make assistants helpful and safe, developers collect people's judgements about which of two answers is better and train the model toward the preferred kind. It works well, but it can also make models overly cautious or eager to please.",
          terms: ["alignment", "rlhf", "reward-model", "sycophancy"],
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
          status: "live",
          level: "core",
          prerequisites: ["alignment"],
          plain:
            "Some newer models write out their working before answering. Spending more tokens on thinking often gives better answers on hard problems, at the price of more time and money.",
          terms: ["reasoning-model", "chain-of-thought", "test-time-compute", "token"],
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
          status: "live",
          level: "applied",
          prerequisites: ["base-to-assistant"],
          plain:
            "A prompt is the model's whole brief. Vague briefs get vague results. Being specific about the task, giving examples and saying what the answer should look like makes a large difference.",
          terms: ["prompt", "system-prompt", "few-shot", "eval", "chat-template"],
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
          status: "live",
          level: "applied",
          prerequisites: ["prompting"],
          plain:
            "Applications need data, not prose. Models can be asked to answer in a fixed structure, and to request actions such as 'look up order 42', which your code then carries out. This is the foundation of agents.",
          terms: ["json-schema", "constrained-decoding", "tool-calling", "mcp", "prompt"],
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
          status: "live",
          level: "applied",
          prerequisites: ["context-window", "prompting"],
          plain:
            "A model only knows what's in its training and what you put in front of it. Choosing which documents, history and instructions to include, and in what order, often matters more than the wording of the prompt.",
          terms: ["context-engineering", "context-window", "rag", "prompt-caching", "token"],
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
          status: "live",
          level: "applied",
          prerequisites: ["what-an-llm-does", "context-engineering"],
          plain:
            "Models are trained to produce likely-sounding text, not true text. When they don't know, they can still produce a confident answer. Knowing why helps you design systems that catch it.",
          terms: ["hallucination", "grounding", "sampling", "rag", "next-token-prediction"],
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
          status: "live",
          level: "core",
          prerequisites: ["context-window"],
          plain:
            "Generating an answer happens in two phases: reading the whole prompt at once, then writing the answer one token at a time. Each phase has different costs, which is why long answers feel slow even when short ones are quick.",
          terms: ["inference", "ttft", "memory-bandwidth", "kv-cache", "token"],
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
          status: "live",
          level: "core",
          prerequisites: ["inference"],
          plain:
            "A model's size in parameters decides how much memory it needs. Storing each number with fewer bits (quantization) lets bigger models fit on smaller machines, usually at a small cost in quality.",
          terms: ["quantization", "parameter", "kv-cache", "perplexity", "moe"],
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
          status: "live",
          level: "core",
          prerequisites: ["inference"],
          plain:
            "A GPU is wasted serving one request at a time. Serving systems group many requests together to use it fully, which raises total throughput but can make each individual answer a little slower.",
          terms: ["batching", "throughput", "continuous-batching", "paged-attention", "kv-cache"],
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
          status: "live",
          level: "applied",
          prerequisites: ["tokens", "inference"],
          plain:
            "AI features are billed by the token. A quick estimate of requests and tokens tells you whether a feature costs pennies or a fortune, and whether it will feel instant or sluggish.",
          terms: ["token", "prompt-caching", "streaming", "ttft", "model-routing"],
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
            "Match requirements (data residency, cost, control, quality) to models and hosting: provider APIs, Amazon Bedrock, Google's Gemini Enterprise Agent Platform, Microsoft Foundry or your own GPUs",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Closed APIs vs open-weight models",
            "Licences and what 'open' means",
            "Hosting options across clouds",
            "Benchmarks and their limits",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["cost-latency"],
          plain:
            "Some models are only available through their maker's service; others publish their weights so you can run them yourself. The choice affects cost, control, privacy and where your data goes.",
          terms: ["open-weights", "model-licence", "eval", "parameter"],
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
          status: "live",
          level: "core",
          prerequisites: ["attention"],
          plain:
            "Modern models can take pictures, scanned documents and audio as input, and some can produce images or speech. Under the hood, each kind of input is turned into tokens the same transformer can process.",
          terms: ["multimodal", "vision-transformer", "embedding", "token", "attention"],
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
          status: "live",
          level: "applied",
          prerequisites: ["memory-quantization"],
          plain:
            "Bigger isn't always better. For narrow, well-defined jobs, a small model can be faster, cheaper and private enough to run on a laptop or phone, sometimes with similar quality.",
          terms: [
            "calibration",
            "small-language-model",
            "distillation",
            "model-routing",
            "quantization",
            "embedding",
          ],
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
          status: "live",
          level: "applied",
          prerequisites: ["tool-calling"],
          plain:
            "Models follow instructions, and they can't reliably tell your instructions from instructions hidden in an email or web page they read. That makes a new kind of attack, which you defend against by limiting what the model can do.",
          terms: [
            "prompt-injection",
            "lethal-trifecta",
            "least-privilege",
            "tool-calling",
            "system-prompt",
          ],
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
          status: "live",
          level: "applied",
          prerequisites: ["hallucinations"],
          plain:
            "Models learn from human text, including its biases, and they may handle people's personal data. Responsible systems check for unfair outcomes, respect privacy law and keep a human in charge of decisions that matter.",
          terms: [
            "algorithmic-bias",
            "counterfactual-test",
            "dpdp",
            "data-minimisation",
            "human-in-the-loop",
          ],
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
          status: "live",
          level: "applied",
          prerequisites: ["cost-latency", "open-vs-closed", "context-engineering"],
          plain:
            "A state department wants an assistant that answers citizens' questions in several languages. You'll choose the model, how it gets its knowledge, where it runs and what it will cost, then see how your choices hold up.",
          terms: ["tokenizer", "rag", "context-window", "pivot-translation", "streaming"],
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
          status: "live",
          level: "applied",
          prerequisites: ["prompt-injection", "hallucinations", "sampling"],
          plain:
            "An assistant that worked in testing is giving strange answers in production. Using everything from this track, you'll trace each problem to its cause and fix it.",
          terms: ["llm-trace", "finish-reason", "temperature", "system-prompt", "prompt-injection"],
        },
      ],
    },
  ],
};

const agileScrum: Track = {
  slug: "agile-scrum",
  title: "Agile & Scrum",
  area: "Delivery management",
  category: "delivery-management",
  tagline: "The ceremonies, and the thinking behind them.",
  description:
    "Why short feedback loops beat big up-front plans, how Scrum and Kanban actually work (from the official guides, not folklore), how to write, split and order a backlog, and the engineering habits that make it all hold together. Tool-neutral: the same ideas in Jira, Azure Boards, GitHub, GitLab, Linear and open source. By the end you can run a sprint, read a team's charts, and tell real agility from ritual.",
  accent: "cadence",
  chapters: [
    {
      slug: "why-agile",
      title: "Why agile",
      summary: "Why big plans break, and what the agile movement proposed instead.",
      modules: [
        {
          slug: "why-plans-break",
          title: "Why plans break",
          summary: "Why software surprises big up-front plans, and how short loops help.",
          minutes: 25,
          signature:
            "Scroll from building a wedding hall to building a citizen portal: where the plan meets reality, and what it costs to learn late",
          formats: ["scroll-story", "simulation", "checkpoint"],
          concepts: [
            "Plan-driven (waterfall) and iterative delivery",
            "Why software requirements change as people see the product",
            "The cost of learning late",
            "Short feedback loops",
          ],
          status: "live",
          level: "beginner",
          plain:
            "A detailed plan works when you know exactly what to build, as with a hall built to a drawing. Software is different: people only discover what they need when they see it working. Agile ways of working show something real early and often, so mistakes are found while they are still cheap.",
          terms: ["plan-driven", "iterative-development", "feedback-loop", "big-bang-release"],
        },
        {
          slug: "agile-manifesto",
          title: "The Agile Manifesto",
          summary: "Four values and twelve principles: what they say, and what they don't.",
          minutes: 25,
          signature:
            "Step through the four values and twelve principles, then sort common claims into what the Manifesto says and what is myth",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "The four values, read in full",
            "The twelve principles",
            "Agile is a mindset, not one method",
            "Common myths: no plans, no documentation",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-plans-break"],
          plain:
            "In 2001, seventeen software practitioners wrote a short statement of what they had learned about building software well. It values people, working software, collaboration and responding to change, while still seeing value in plans, documents and contracts.",
          terms: ["agile-manifesto", "sustainable-pace", "iterative-development"],
        },
        {
          slug: "inspect-adapt",
          title: "Inspect & adapt",
          summary: "Empiricism: make work visible, look at it often, change course.",
          minutes: 25,
          signature:
            "Steer towards a moving target: long cycles vs short ones, and how much each drifts off course",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Transparency, inspection and adaptation",
            "Cycle length and the cost of drift",
            "Deciding from what is observed, not assumed",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-plans-break"],
          plain:
            "When you can't predict everything, you look often and adjust. Agile teams make their work visible, check it at regular short intervals, and change course based on what they see.",
          terms: ["empiricism", "three-pillars", "empirical-process-control", "feedback-loop"],
        },
      ],
    },
    {
      slug: "scrum",
      title: "Scrum, the framework",
      summary: "The accountabilities, events and artifacts, as the Scrum Guide defines them.",
      modules: [
        {
          slug: "scrum-on-one-page",
          title: "Scrum on one page",
          summary: "The whole framework in one picture, and how the parts fit.",
          minutes: 25,
          signature:
            "One animated picture of Scrum: click any accountability, event or artifact to see what it is for and when it happens",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Three accountabilities, five events, three artifacts",
            "The Sprint as the container for the other events",
            "Each artifact's commitment",
            "What is in the Scrum Guide and what is common practice",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["inspect-adapt"],
          plain:
            "Scrum is a lightweight framework: a small team works in fixed-length cycles called Sprints, with a few regular meetings and a few shared lists. Everything in it exists to make work visible and give the team regular chances to inspect and adapt.",
          terms: ["scrum", "accountability", "sprint", "scrum-artifact", "timebox"],
        },
        {
          slug: "who-decides",
          title: "Who decides what?",
          summary: "Product Owner, Scrum Master and Developers, in real situations.",
          minutes: 30,
          signature:
            "A branching scenario on a client project: who owns each decision, and what happens when the wrong person makes it",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "The Product Owner orders the backlog and maximises value",
            "Developers own how the work gets done",
            "The Scrum Master serves the team and the organisation",
            "Self-managing teams",
          ],
          status: "live",
          level: "core",
          prerequisites: ["scrum-on-one-page"],
          plain:
            "Scrum gives three kinds of people clear accountabilities: one person decides what matters most, the people building it decide how, and one person helps everyone use Scrum well. Most team friction comes from blurring these.",
          terms: ["product-owner", "scrum-master", "developers", "self-managing", "accountability"],
        },
        {
          slug: "sprint-planning",
          title: "The Sprint & Sprint Planning",
          summary: "Why a Sprint has a goal, and how a team plans one.",
          minutes: 30,
          signature:
            "Plan a Sprint: pick backlog items that serve one Sprint Goal and fit the team's real capacity",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "The Sprint: a fixed length of one month or less",
            "Sprint Planning: why, what and how",
            "The Sprint Goal as a commitment",
            "Capacity, and story points as an optional practice",
          ],
          status: "live",
          level: "core",
          prerequisites: ["who-decides"],
          plain:
            "A Sprint is a fixed period, one month or less, in which the team builds something usable. It starts with planning: why this Sprint matters, what can be done, and how. The Sprint Goal keeps everyone pulling in one direction when surprises come.",
          terms: ["sprint", "sprint-planning", "timebox", "story-points", "velocity"],
        },
        {
          slug: "daily-scrum",
          title: "The Daily Scrum",
          summary: "Fifteen minutes to replan towards the goal, not a status report.",
          minutes: 20,
          signature:
            "Three stand-up transcripts that go wrong: spot the problem in each and fix it",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Purpose: inspect progress towards the Sprint Goal",
            "The Developers choose the format",
            "Status reporting and problem-solving anti-patterns",
          ],
          status: "live",
          level: "core",
          prerequisites: ["sprint-planning"],
          plain:
            "Once a day the people doing the work spend up to fifteen minutes checking whether they are still on track for the Sprint Goal and adjusting the plan. It is for them, not a report to a manager.",
          terms: ["daily-scrum", "walk-the-board", "developers", "sprint"],
        },
        {
          slug: "review-retro",
          title: "Review & Retrospective",
          summary: "Inspect the product with stakeholders, then inspect how you work.",
          minutes: 30,
          signature:
            "Run a Sprint Review with a client, then facilitate a Retrospective: each choice changes what the team learns",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "The Sprint Review is a working session, not a demo gate",
            "The Retrospective improves quality and effectiveness",
            "Turning findings into concrete improvements",
          ],
          status: "live",
          level: "core",
          prerequisites: ["daily-scrum"],
          plain:
            "At the end of each Sprint the team shows what it built to the people who care and decides together what to do next. Then the team looks at how it worked and picks something to improve.",
          terms: ["sprint-review", "retrospective", "psychological-safety", "product-owner"],
        },
        {
          slug: "artifacts",
          title: "Artifacts & commitments",
          summary: "Product Backlog, Sprint Backlog and Increment, and what each commits to.",
          minutes: 25,
          signature:
            "Connect each artifact to its commitment (Product Goal, Sprint Goal, Definition of Done), then test real items against them",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "An ordered Product Backlog and the Product Goal",
            "The Sprint Backlog and the Sprint Goal",
            "The Increment and the Definition of Done",
            "Refinement as an ongoing activity",
          ],
          status: "live",
          level: "core",
          prerequisites: ["review-retro"],
          plain:
            "Scrum has three shared lists or results: everything the product might need, the plan for this Sprint, and the working product so far. Each has a commitment that says what 'good' means for it.",
          terms: ["scrum-artifact", "product-goal", "definition-of-done", "refinement"],
        },
      ],
    },
    {
      slug: "backlog",
      title: "The backlog",
      summary: "Writing, splitting and ordering the work.",
      modules: [
        {
          slug: "user-stories",
          title: "User stories & acceptance criteria",
          summary: "Small, testable descriptions of value, from the user's side.",
          minutes: 30,
          signature:
            "Rewrite weak stories until they pass INVEST, and add acceptance criteria in Given/When/Then",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "The story template and the conversation behind it",
            "INVEST",
            "Acceptance criteria and Given/When/Then",
          ],
          status: "live",
          level: "core",
          prerequisites: ["artifacts"],
          plain:
            "A user story is a short note about something a person needs, written as a placeholder for a conversation. Acceptance criteria say how everyone will know it's done.",
          terms: ["user-story", "invest", "acceptance-criteria", "definition-of-done"],
        },
        {
          slug: "splitting-stories",
          title: "Splitting stories",
          summary: "Slice big features into thin pieces that still deliver value.",
          minutes: 30,
          signature:
            "Take a big feature for a citizen portal and slice it vertically with splitting patterns until each piece fits a Sprint",
          formats: ["sandbox", "checkpoint"],
          concepts: [
            "Vertical slices vs horizontal layers",
            "Splitting patterns (paths, rules, data, interfaces, spikes)",
            "Why small items flow better",
          ],
          status: "live",
          level: "core",
          prerequisites: ["user-stories"],
          plain:
            "Big pieces of work hide risk and take too long to finish. Splitting them into thin slices, each working end to end, lets a team deliver and learn every few days.",
          terms: ["vertical-slice", "walking-skeleton", "spike", "user-story", "invest"],
        },
        {
          slug: "ordering-backlog",
          title: "Ordering the backlog",
          summary: "Deciding what comes first: value, urgency, risk and cost of delay.",
          minutes: 30,
          signature:
            "Order the same backlog by MoSCoW, by value and by cost of delay, and watch the value delivered over time",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Ordered, not just prioritised",
            "MoSCoW",
            "Cost of delay and WSJF",
            "Risk and learning as reasons to go first",
          ],
          status: "live",
          level: "core",
          prerequisites: ["splitting-stories"],
          plain:
            "Everything can't come first. Ordering the backlog means asking what each item is worth, how fast that value decays if you wait, and how big it is.",
          terms: ["cost-of-delay", "wsjf", "moscow", "product-owner"],
        },
      ],
    },
    {
      slug: "flow",
      title: "Flow & Kanban",
      summary: "Visualise the work, limit what's in progress, and read the signals.",
      modules: [
        {
          slug: "kanban-wip",
          title: "Kanban & WIP limits",
          summary: "Why starting less gets more finished.",
          minutes: 30,
          signature:
            "Run a live board: change the work-in-progress limits and watch cycle time, throughput and Little's Law",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Visualising the workflow",
            "Explicit WIP limits",
            "Flow metrics: WIP, throughput, work item age, cycle time",
            "Little's Law, and what it can't do",
          ],
          status: "live",
          level: "core",
          prerequisites: ["inspect-adapt"],
          plain:
            "Kanban makes work visible on a board and caps how much can be in progress at once. Fewer things in progress means each one finishes sooner.",
          terms: ["kanban", "wip", "littles-law"],
        },
        {
          slug: "reading-charts",
          title: "Reading the charts",
          summary: "Burndown, burnup, cumulative flow and cycle time: what each tells you.",
          minutes: 30,
          signature:
            "Step through four charts from real-looking teams, then diagnose what each one is saying",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Burndown and burnup",
            "Cumulative flow diagrams",
            "Cycle-time scatterplots and percentiles",
          ],
          status: "live",
          level: "core",
          prerequisites: ["kanban-wip"],
          plain:
            "A few simple charts show how work is flowing: whether it's getting done, piling up or stuck. Learning to read them lets you spot problems before anyone complains.",
          terms: ["burndown", "burnup", "cfd", "wip", "littles-law"],
        },
        {
          slug: "choose-a-way",
          title: "Scrum, Kanban or both?",
          summary: "Matching the way of working to the kind of work.",
          minutes: 25,
          signature:
            "Pick a way of working for four teams: a product team, a support team, a fixed-bid project and a platform team",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "When fixed Sprints help, and when continuous flow fits better",
            "Using Kanban practices inside Scrum",
            "Choosing by the work, not by fashion",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["reading-charts", "sprint-planning"],
          plain:
            "Scrum suits teams building a product in steps; Kanban suits a steady stream of varied requests. Many teams combine them. The right choice depends on the work.",
          terms: ["kanban", "scrumban", "wip", "sprint"],
        },
      ],
    },
    {
      slug: "engineering",
      title: "Engineering that makes agile work",
      summary: "The technical habits without which the ceremonies are empty.",
      modules: [
        {
          slug: "done-means-done",
          title: "Done means done",
          summary: "A strong Definition of Done, and what technical debt costs.",
          minutes: 25,
          signature:
            "Run sprints with a weak and a strong Definition of Done and watch technical debt slow the team",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "The Definition of Done as a quality commitment",
            "Undone work and technical debt",
            "Why debt compounds",
          ],
          status: "live",
          level: "core",
          prerequisites: ["artifacts"],
          plain:
            "If 'done' quietly means 'mostly done', the leftovers pile up and every Sprint gets slower. A clear, shared Definition of Done keeps the product releasable.",
          terms: ["definition-of-done", "technical-debt", "story-points", "wcag"],
        },
        {
          slug: "small-batches",
          title: "Small batches & continuous integration",
          summary: "Integrate often, release in small steps, and practices from XP.",
          minutes: 30,
          signature:
            "Change the batch size and integration frequency and watch lead time and merge pain",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Batch size and lead time",
            "Continuous integration",
            "Extreme Programming practices: TDD, pairing, refactoring",
          ],
          status: "live",
          level: "core",
          prerequisites: ["done-means-done"],
          plain:
            "Merging and releasing small changes often is safer and faster than big occasional drops. Extreme Programming added engineering practices that make this possible.",
          terms: [
            "batch-size",
            "continuous-integration",
            "xp",
            "tdd",
            "refactoring",
            "pair-programming",
            "trunk-based",
            "feature-flag",
            "dora-metrics",
          ],
        },
      ],
    },
    {
      slug: "real-world",
      title: "Agile in the real world",
      summary: "Clients, distance, many teams, tools and the ways it goes wrong.",
      modules: [
        {
          slug: "client-distributed",
          title: "Client-facing & distributed teams",
          summary: "Scrum when the client is elsewhere and the team spans time zones.",
          minutes: 30,
          signature:
            "A branching scenario: a Bengaluru team, a client in another time zone, and a proxy Product Owner",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "Proxy Product Owners and their limits",
            "Working across time zones",
            "Keeping the client close to the product",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["review-retro"],
          plain:
            "In services work the person who decides what matters is often at the client, far away and busy. The team has to find ways to keep that person close to the product.",
          terms: ["proxy-product-owner", "product-owner", "daily-scrum", "sprint-review"],
        },
        {
          slug: "scaling",
          title: "Many teams: scaling frameworks",
          summary: "SAFe, LeSS, Nexus and Scrum@Scale, compared plainly.",
          minutes: 30,
          signature:
            "Connect teams, backlogs and events for several frameworks and see where each puts coordination",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Why many teams need coordination",
            "SAFe, LeSS, Nexus and Scrum@Scale in one line each",
            "Dependencies and how to reduce them",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["artifacts"],
          plain:
            "When one product needs several teams, they have to coordinate. Different frameworks do this in different ways, from light to heavy.",
          terms: ["scaling-framework", "nexus", "less", "safe", "scrum-at-scale", "feature-team"],
        },
        {
          slug: "tools",
          title: "The same board, every tool",
          summary: "Jira, Azure Boards, GitHub, GitLab, Linear and open source.",
          minutes: 20,
          signature:
            "One board, shown the way each tool names and arranges it: a Rosetta stone of backlogs, sprints and boards",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "The same ideas under different names",
            "What to configure, and what to leave alone",
            "The tool supports the process, not the other way round",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["scrum-on-one-page"],
          plain:
            "Every agile tool has a backlog, a board and a way to plan a Sprint, but each names them differently. Once you know the ideas, any tool is easy to learn.",
          terms: ["product-backlog", "work-item", "sprint", "story-points", "burndown"],
        },
        {
          slug: "anti-patterns",
          title: "Agile anti-patterns",
          summary: "Velocity as a target, Water-Scrum-Fall, Zombie Scrum and others.",
          minutes: 25,
          signature: "Sort real team symptoms into named anti-patterns, then pick the fix for each",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Measures that become targets stop being useful",
            "Scrum rituals without empiricism",
            "Big plans in Sprint-shaped pieces",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["reading-charts"],
          plain:
            "Many teams go through the motions of agile without getting its benefits. Knowing the common failure patterns helps you spot and fix them.",
          terms: [
            "anti-pattern",
            "goodharts-law",
            "velocity",
            "zombie-scrum",
            "definition-of-done",
          ],
        },
      ],
    },
    {
      slug: "capstones",
      title: "Capstones",
      summary: "Put it all together.",
      modules: [
        {
          slug: "run-a-sprint",
          title: "Capstone: run a sprint",
          summary: "Two weeks on a client project, and you make the calls.",
          minutes: 40,
          signature:
            "Run a two-week Sprint day by day: scope changes, a sick day and a production bug, with the charts responding to every call",
          formats: ["simulation", "branching-scenario", "checkpoint"],
          concepts: ["Applying Scrum and flow under real pressure"],
          status: "live",
          level: "applied",
          prerequisites: ["choose-a-way", "done-means-done"],
          plain:
            "Everything in this track, in one Sprint. You'll plan it, protect the goal when surprises arrive, and review what happened.",
          terms: ["sprint", "burndown", "velocity", "definition-of-done", "sustainable-pace"],
        },
        {
          slug: "struggling-team",
          title: "Capstone: the struggling team",
          summary: "Diagnose a team from its board, charts and retro notes, then help it.",
          minutes: 40,
          signature:
            "Investigate a team's board, cumulative flow, cycle times and retrospective notes; find the causes and choose the fixes",
          formats: ["fix-the-problem", "simulation", "checkpoint"],
          concepts: ["Diagnosing ways of working from evidence"],
          status: "live",
          level: "applied",
          prerequisites: ["anti-patterns", "reading-charts"],
          plain:
            "A team says it does Scrum, but delivery is slow and people are unhappy. Using the evidence, you'll find out why and decide what to change first.",
          terms: ["wip", "cfd", "work-item-age", "theory-of-constraints", "psychological-safety"],
        },
      ],
    },
  ],
};

/** RAG Systems: grounding language models in your own documents. */
const ragSystems: Track = {
  slug: "rag-systems",
  title: "RAG Systems",
  area: "AI & machine learning",
  category: "ai-ml",
  tagline: "Answers grounded in your documents, not the model's memory.",
  description:
    "How retrieval-augmented generation really works, from parsing messy PDFs and chunking them, through keyword, vector and hybrid search, reranking and prompt assembly, to evaluating answers, keeping data secure and choosing a platform. Vendor-neutral: open-source vector databases and the managed services on AWS, Google Cloud and Azure. Builds on LLM Foundations. By the end you can design a RAG system, measure it, and find out why it gave a wrong answer.",
  accent: "lumen",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "What RAG is for, and every part of a working system.",
      modules: [
        {
          slug: "why-rag",
          title: "Why models need your documents",
          summary: "An open-book exam for a language model, and when that beats the alternatives.",
          minutes: 25,
          signature:
            "Scroll from a closed-book exam to an open-book one: the same question answered from memory, then from the right page",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "What a model knows, and what it can't",
            "Retrieval-augmented generation in one picture",
            "RAG vs fine-tuning vs long context",
          ],
          status: "live",
          level: "beginner",
          plain:
            "A language model only knows what it saw in training, and it can't see your company's documents. RAG finds the relevant passages first and hands them to the model with the question, like letting a student bring the textbook to an exam.",
          terms: [
            "rag",
            "parametric-memory",
            "non-parametric-memory",
            "knowledge-cutoff",
            "hallucination",
            "fine-tuning",
          ],
        },
        {
          slug: "rag-end-to-end",
          title: "A RAG system, end to end",
          summary: "Parse, chunk, embed, index, retrieve and answer, all in one working pipeline.",
          minutes: 30,
          signature:
            "Click through a tiny working RAG pipeline on a small document set: watch each stage transform the data and see the final answer cite its sources",
          formats: ["animated-infographic", "step-through", "checkpoint"],
          concepts: [
            "The ingestion pipeline: parse, chunk, embed, index",
            "The query pipeline: retrieve, rerank, generate",
            "Citations and grounding",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-rag"],
          plain:
            "A RAG system has two halves. One prepares your documents ahead of time so they can be searched. The other runs for every question: it searches, picks the best passages and asks the model to answer from them.",
          terms: [
            "ingestion",
            "chunk",
            "embedding",
            "vector-index",
            "top-k-retrieval",
            "grounding",
          ],
        },
      ],
    },
    {
      slug: "preparing",
      title: "Preparing documents",
      summary: "Turning real documents into clean, searchable pieces.",
      modules: [
        {
          slug: "parsing",
          title: "Parsing real documents",
          summary: "Scans, tables, columns and Hindi text: where naive extraction breaks.",
          minutes: 30,
          signature:
            "Feed a scanned form, a two-column PDF and a table through a naive extractor and a layout-aware parser, and compare what comes out",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Text PDFs, scanned PDFs and OCR",
            "Layout, reading order and tables",
            "Parsing tools, open source and managed",
          ],
          status: "live",
          level: "core",
          prerequisites: ["rag-end-to-end"],
          plain:
            "Before anything can be searched, the text has to come out of the document correctly. Scans, tables and multi-column pages often come out scrambled, and a RAG system can never be better than what it read.",
          terms: ["parsing", "text-layer", "ocr", "legacy-font", "chunk"],
        },
        {
          slug: "chunking",
          title: "Chunking",
          summary: "How big each searchable piece should be, and where to cut.",
          minutes: 30,
          signature:
            "Change chunk size, overlap and splitting rules on a real policy document and watch retrieval find, or miss, the answer",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Why documents are split into chunks",
            "Size, overlap and structure-aware splitting",
            "Parent–child chunks and late chunking",
          ],
          status: "live",
          level: "core",
          prerequisites: ["parsing"],
          plain:
            "Search works on pieces of documents, not whole files. Pieces that are too small lose their meaning; pieces that are too big bury the answer. Where you cut matters as much as how big the pieces are.",
          terms: ["chunk", "chunk-size", "chunk-overlap", "parent-child-chunks", "embedding"],
        },
        {
          slug: "metadata-freshness",
          title: "Metadata, freshness & deletions",
          summary: "Filters, versions and keeping the index in step with the documents.",
          minutes: 25,
          signature:
            "A circular is revised and an old one withdrawn: see the assistant quote the wrong version until metadata and re-indexing fix it",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Metadata for filtering: source, date, department, language",
            "Versions, updates and deletions",
            "Incremental re-indexing",
          ],
          status: "live",
          level: "core",
          prerequisites: ["chunking"],
          plain:
            "Documents change. If the search index still holds last year's rules, the assistant will quote them confidently. Tags such as date and version, and a way to update the index, keep answers current.",
          terms: ["index-freshness", "chunk-metadata", "metadata-filter", "chunk", "vector-index"],
        },
      ],
    },
    {
      slug: "search",
      title: "From words to meaning",
      summary: "Keyword search, vector search, and combining them.",
      modules: [
        {
          slug: "bm25",
          title: "Keyword search & BM25",
          summary: "The inverted index and the scoring formula behind most search boxes.",
          minutes: 30,
          signature:
            "Type a query and watch an inverted index and BM25 score every document live, term by term",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "The inverted index",
            "Term frequency and rarity (TF-IDF)",
            "BM25 and its two knobs",
            "Where keywords fail: synonyms and other languages",
          ],
          status: "live",
          level: "core",
          prerequisites: ["rag-end-to-end"],
          plain:
            "Keyword search finds documents that share words with your question, and ranks rare shared words higher than common ones. It's fast and exact, but it misses answers that use different words.",
          terms: ["inverted-index", "bm25", "idf", "stop-words", "stemming"],
        },
        {
          slug: "embeddings-retrieval",
          title: "Embeddings for retrieval",
          summary: "Searching by meaning, and choosing an embedding model.",
          minutes: 30,
          signature:
            "Ask the same question in English, Hindi and romanised Hindi and see which documents each embedding model brings back",
          formats: ["sandbox", "checkpoint"],
          concepts: [
            "Dense retrieval: queries and passages as vectors",
            "Similarity scores and their limits",
            "Choosing a model: benchmarks, languages, size and cost",
          ],
          status: "live",
          level: "core",
          prerequisites: ["bm25"],
          plain:
            "An embedding model turns text into a list of numbers so that similar meanings land close together. Searching with embeddings finds passages that mean the same thing even when they share no words.",
          terms: ["dense-retrieval", "embedding", "cosine-similarity", "mteb", "romanised-hindi"],
        },
        {
          slug: "vector-indexes",
          title: "Vector indexes",
          summary: "Why exact search doesn't scale, and how HNSW and IVF trade accuracy for speed.",
          minutes: 30,
          signature:
            "Search a million vectors: climb an HNSW graph layer by layer, then tune it and watch speed trade against recall",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: [
            "Exact vs approximate nearest-neighbour search",
            "HNSW graphs and IVF clusters",
            "Quantization and memory",
            "Recall vs latency",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["embeddings-retrieval"],
          plain:
            "Comparing a question with every stored vector is too slow once there are millions. Vector indexes take shortcuts that are much faster and almost always find the right neighbours. You choose how much 'almost' you can accept.",
          terms: ["ann", "hnsw", "ivf", "recall-at-k", "quantization-vectors", "vector-index"],
        },
        {
          slug: "hybrid-search",
          title: "Hybrid search & fusion",
          summary: "Keywords plus meaning, merged with reciprocal rank fusion.",
          minutes: 25,
          signature:
            "Run the same queries through keyword, vector and hybrid search and watch reciprocal rank fusion merge the two lists",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "What each kind of search misses",
            "Reciprocal rank fusion",
            "Weighting and tuning hybrid search",
          ],
          status: "live",
          level: "core",
          prerequisites: ["bm25", "embeddings-retrieval"],
          plain:
            "Keyword search is good at exact terms such as scheme names and form numbers; vector search is good at meaning. Hybrid search runs both and merges the results, so each covers the other's blind spots.",
          terms: ["hybrid-search", "rrf", "bm25", "dense-retrieval", "learned-sparse"],
        },
        {
          slug: "reranking",
          title: "Reranking & relevance filtering",
          summary: "A second, sharper look at the top results before the model sees them.",
          minutes: 25,
          signature:
            "Take the top 20 results, rerank them with a cross-encoder, then filter out passages that match the question but don't answer it",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Bi-encoders vs cross-encoders",
            "Rerankers and LLM-based reranking",
            "Relevance filtering and thresholds",
          ],
          status: "live",
          level: "core",
          prerequisites: ["hybrid-search"],
          plain:
            "The first search is fast but rough. A reranker reads the question and each candidate together and reorders them far more accurately, and a filter can drop passages that won't help, so the model gets less, better context.",
          terms: [
            "reranker",
            "cross-encoder",
            "relevance-threshold",
            "dense-retrieval",
            "calibration",
          ],
        },
      ],
    },
    {
      slug: "context",
      title: "Better context",
      summary: "Improving the query, the chunks and the prompt.",
      modules: [
        {
          slug: "query-understanding",
          title: "Understanding the question",
          summary: "Rewriting, expanding and splitting questions before searching.",
          minutes: 25,
          signature:
            "Fix a set of failing questions: vague follow-ups, two questions in one, and jargon that doesn't match the documents",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Follow-up questions in a conversation",
            "Query rewriting and multi-query",
            "HyDE: searching with a hypothetical answer",
            "Decomposing complex questions",
          ],
          status: "live",
          level: "core",
          prerequisites: ["hybrid-search"],
          plain:
            "People ask short, vague or multi-part questions, and 'what about for pensioners?' means nothing on its own. Rewriting the question into good searches before retrieving often helps more than a better index.",
          terms: [
            "query-rewriting",
            "query-decomposition",
            "multi-query",
            "hyde",
            "romanised-hindi",
          ],
        },
        {
          slug: "contextual-retrieval",
          title: "Contextual retrieval & small-to-big",
          summary: "Chunks that know where they came from, and returning more than you matched.",
          minutes: 25,
          signature:
            "Add a line of context to each chunk and see which searches it rescues; match small pieces but return their parent section",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: [
            "Why chunks lose context",
            "Contextual embeddings and contextual BM25",
            "Parent-document (small-to-big) retrieval",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["chunking", "reranking"],
          plain:
            "A chunk that says 'the limit is 20 kilolitres a month' doesn't say who gets it or which year's rules it comes from. Adding a short note about where each chunk came from, or returning the whole surrounding section, fixes many silent failures.",
          terms: ["contextual-retrieval", "parent-child-chunks", "late-chunking", "prompt-caching"],
        },
        {
          slug: "prompt-assembly",
          title: "Assembling the prompt",
          summary: "Order, citations, and teaching the model to say 'I don't know'.",
          minutes: 25,
          signature:
            "Build the final prompt from retrieved passages: reorder them, add citation markers and an 'answer only from these' rule, and compare the answers",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Instructions, passages and the question",
            "Lost in the middle",
            "Citations and refusing when the answer isn't there",
            "Prompt caching",
          ],
          status: "live",
          level: "core",
          terms: [
            "prompt",
            "abstention",
            "grounded-citation",
            "lost-in-the-middle",
            "prompt-caching",
          ],
          prerequisites: ["reranking"],
          plain:
            "The retrieved passages still have to be put in front of the model well. Clear instructions, sensible order, source labels and permission to say 'I don't know' turn good retrieval into trustworthy answers.",
        },
      ],
    },
    {
      slug: "beyond",
      title: "Beyond basic RAG",
      summary: "Tables, graphs, agents and images.",
      modules: [
        {
          slug: "tables-sql",
          title: "Tables & SQL",
          summary: "When to query a database instead of searching text.",
          minutes: 25,
          signature:
            "Route questions to text search or to SQL over a table, and see which kinds of question each gets right",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Why counting and filtering don't work over text chunks",
            "Text-to-SQL and its risks",
            "Routing between retrieval and structured queries",
          ],
          status: "live",
          level: "applied",
          terms: ["sql", "text-to-sql", "query-router", "semantic-layer"],
          prerequisites: ["prompt-assembly"],
          plain:
            "'How many water connections were approved last month?' is a database question, not a search question. Good systems recognise this and query the data directly, carefully, instead of guessing from text.",
        },
        {
          slug: "graphrag",
          title: "GraphRAG",
          summary:
            "Entities, relationships and communities for questions about a whole collection.",
          minutes: 25,
          signature:
            "Build a small knowledge graph from documents, group it into communities, and answer a 'what are the main themes?' question that plain RAG can't",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: [
            "Local vs global questions",
            "Knowledge graphs extracted by a model",
            "Community summaries",
            "Cost and when it's worth it",
          ],
          status: "live",
          level: "deep",
          terms: ["graphrag", "entity", "knowledge-graph", "graph-community"],
          prerequisites: ["prompt-assembly"],
          plain:
            "Plain RAG is good at finding a specific fact but poor at 'summarise the main issues across all these reports'. GraphRAG first maps who and what is connected to what, then answers from that map.",
        },
        {
          slug: "agentic-rag",
          title: "Agentic RAG & MCP",
          summary: "Retrieval as a tool the model decides when and how to use.",
          minutes: 30,
          signature:
            "Step through an agent answering a multi-part question: it plans, searches, reads, searches again and stops",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: [
            "Retrieval as a tool call",
            "Iterative search and stopping",
            "Model Context Protocol (MCP) servers",
            "Cost, latency and loops",
          ],
          status: "live",
          level: "applied",
          terms: ["agentic-rag", "tool-calling", "mcp"],
          prerequisites: ["query-understanding"],
          plain:
            "Instead of searching once, an agent lets the model decide what to search for, read the results, and search again until it has enough. It handles harder questions, at the cost of more time and money.",
        },
        {
          slug: "multimodal-rag",
          title: "Multimodal RAG",
          summary: "Charts, forms and page images as searchable knowledge.",
          minutes: 25,
          signature:
            "Answer a question whose answer is only in a chart: extract-to-text vs searching page images directly",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: [
            "Images, charts and scans in documents",
            "Captioning vs multimodal embeddings",
            "Page-image retrieval (ColPali)",
          ],
          status: "live",
          level: "deep",
          terms: ["multimodal-rag", "vision-language-model", "ocr", "colpali"],
          prerequisites: ["parsing", "embeddings-retrieval"],
          plain:
            "Many answers live in charts, photos and scanned forms rather than text. Multimodal RAG either describes images in words or searches the page images themselves.",
        },
      ],
    },
    {
      slug: "running",
      title: "Measuring & running it",
      summary: "Evaluation, security, platforms and cost.",
      modules: [
        {
          slug: "eval-retrieval",
          title: "Evaluating retrieval",
          summary: "Recall, MRR and nDCG against a test set you build.",
          minutes: 30,
          signature:
            "Label a small test set of questions and correct passages, then score four retrieval setups with recall@k, MRR and nDCG",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Golden test sets",
            "Recall@k, precision, MRR and nDCG",
            "Evaluating on your own questions, not only benchmarks",
          ],
          status: "live",
          level: "core",
          terms: ["golden-set", "recall-at-k", "mrr", "ndcg"],
          prerequisites: ["reranking"],
          plain:
            "You can't improve what you don't measure. A few dozen real questions with known correct passages are enough to tell whether a change to chunking or search actually helped.",
        },
        {
          slug: "eval-answers",
          title: "Evaluating answers",
          summary: "Faithfulness, relevance, and using a model as the judge.",
          minutes: 25,
          signature:
            "Judge answers for faithfulness and relevance by hand, then compare with an LLM judge and spot where it disagrees",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Faithfulness (groundedness) and answer relevance",
            "Context precision and recall",
            "LLM-as-judge and its biases",
          ],
          status: "live",
          level: "core",
          terms: ["faithfulness", "answer-relevance", "llm-as-judge"],
          prerequisites: ["eval-retrieval"],
          plain:
            "Good retrieval doesn't guarantee a good answer. Answers are checked for whether they stick to the sources and actually answer the question, often with another model as the judge, which has its own blind spots.",
        },
        {
          slug: "rag-security",
          title: "Security & access control",
          summary: "Permissions, poisoned documents and personal data.",
          minutes: 30,
          signature:
            "An assistant leaks a salary sheet and obeys an instruction hidden in a document: try each defence and see which hold (a safe simulation)",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Document-level permissions at retrieval time",
            "Indirect prompt injection through retrieved text",
            "Personal data and India's DPDP Act",
            "Vector and embedding weaknesses (OWASP)",
          ],
          status: "live",
          level: "applied",
          terms: ["permission-aware-retrieval", "indirect-prompt-injection", "prompt-injection"],
          prerequisites: ["prompt-assembly"],
          plain:
            "A RAG system can show people documents they aren't allowed to see, and a document can contain hidden instructions the model obeys. Permissions must be checked when searching, and retrieved text must be treated as data, not commands.",
        },
        {
          slug: "platforms-cost",
          title: "Platforms, cost & long context",
          summary:
            "Vector databases and managed services, and when a long context window is enough.",
          minutes: 30,
          signature:
            "Place pgvector, OpenSearch, Qdrant and the managed services on AWS, Google Cloud and Azure on one map, then estimate monthly cost for a real workload",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Open-source vector databases and search engines",
            "Managed RAG services on the big clouds",
            "Cost: embedding, storage, queries and generation",
            "Long context and prompt caching vs RAG",
          ],
          status: "live",
          level: "applied",
          terms: ["vector-database", "context-window", "prompt-caching", "data-residency"],
          prerequisites: ["vector-indexes", "prompt-assembly"],
          plain:
            "You can run RAG on a database you already have, a dedicated vector database, or a fully managed cloud service. Each trades control for convenience, and sometimes a long context window makes retrieval unnecessary.",
        },
      ],
    },
    {
      slug: "capstones",
      title: "Capstones",
      summary: "Put it all together.",
      modules: [
        {
          slug: "scheme-assistant",
          title: "Capstone: a scheme assistant",
          summary: "Design a bilingual assistant for government-scheme FAQs, and evaluate it.",
          minutes: 40,
          signature:
            "Choose parsing, chunking, search, reranking and prompt for an English and Hindi scheme assistant, then run it against a test set and see where it fails",
          formats: ["branching-scenario", "simulation", "checkpoint"],
          concepts: ["Designing a RAG system end to end"],
          status: "live",
          level: "applied",
          terms: ["rag", "romanised-hindi", "golden-set", "hybrid-search", "reranker"],
          prerequisites: ["eval-answers", "platforms-cost"],
          plain:
            "Everything in this track in one design. You'll make each choice for a real kind of assistant, then measure it and improve it.",
        },
        {
          slug: "wrong-answers",
          title: "Capstone: the RAG that answers wrong",
          summary: "Trace failures to their cause, from parsing to the prompt, and fix them.",
          minutes: 40,
          signature:
            "Investigate wrong answers with traces of each stage: a scrambled table, a split chunk, a missed keyword, a stale index and a buried passage",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Debugging RAG systems stage by stage"],
          status: "live",
          level: "applied",
          terms: ["trace", "chunk", "index-freshness", "faithfulness"],
          prerequisites: ["eval-answers", "contextual-retrieval"],
          plain:
            "A RAG assistant gives confident wrong answers. Using traces of what each stage did, you'll find where each one went wrong and fix the right stage.",
        },
      ],
    },
  ],
};

const cloudArchitecture: Track = {
  slug: "cloud-architecture",
  title: "Cloud Architecture",
  area: "Platform & cloud",
  category: "platform-cloud",
  tagline: "How cloud platforms are built, and how to design on them.",
  description:
    "What the cloud really is, and how to build on it well: compute choices, private networks, identity and encryption, guardrails, landing zones and infrastructure as code, resilience, cost, and running in India. Vendor-neutral: AWS, Google Cloud and Azure side by side, with open-source tools. By the end you can read a cloud architecture diagram, spot what's missing, and design a sound foundation for a real organisation.",
  accent: "stratus",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "What the cloud is, where it lives, and who is responsible for what.",
      modules: [
        {
          slug: "what-is-cloud",
          title: "What the cloud really is",
          summary: "Someone else's data centres, rented by the minute.",
          minutes: 20,
          signature:
            "Scroll from a server cupboard to a hyperscale data centre, peeling back IaaS, PaaS and SaaS layer by layer",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "On-premises vs cloud",
            "IaaS, PaaS and SaaS",
            "Paying for what you use, and what that changes",
          ],
          status: "live",
          level: "beginner",
          plain:
            "The cloud is computers in someone else's data centre that you rent by the minute over the internet. Instead of buying servers years ahead, you ask for them when you need them and give them back when you don't.",
          terms: [
            "cloud-computing",
            "on-premises",
            "iaas",
            "paas",
            "saas",
            "elasticity",
            "pay-as-you-go",
          ],
        },
        {
          slug: "regions-responsibility",
          title: "Regions, zones and shared responsibility",
          summary: "Where your cloud actually is, how it fails, and what's yours to secure.",
          minutes: 25,
          signature:
            "Fail a data centre, then a zone, then a region on a map, and see which designs keep running; then sort security jobs between you and the provider",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Regions and availability zones",
            "Designing for a zone failure",
            "The shared responsibility model",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["what-is-cloud"],
          plain:
            "A cloud region is a city's worth of data centres split into separate zones, each with its own power and cooling. The provider keeps the buildings and hardware secure; you are responsible for how you configure what you build on them.",
          terms: ["region", "availability-zone", "sla", "shared-responsibility"],
        },
      ],
    },
    {
      slug: "compute",
      title: "Compute",
      summary: "Virtual machines, containers and functions, and scaling them.",
      modules: [
        {
          slug: "vms-containers-functions",
          title: "Virtual machines, containers and functions",
          summary: "The same small app run three ways.",
          minutes: 25,
          signature:
            "Run one app as a VM, a container and a function under the same traffic, and compare start-up time, cost and how much you manage",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "What a virtual machine is",
            "Containers and managed container services",
            "Functions (serverless): cold starts and per-request billing",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["what-is-cloud"],
          plain:
            "You can rent a whole virtual computer, a lightweight container, or just pay each time a small function runs. Each step hands more work to the provider and gives you less control.",
          terms: [
            "virtual-machine",
            "container",
            "serverless-function",
            "cold-start",
            "pay-as-you-go",
          ],
        },
        {
          slug: "autoscaling-load-balancing",
          title: "Autoscaling and load balancers",
          summary:
            "Adding and removing servers as traffic changes, and spreading requests across them.",
          minutes: 25,
          signature:
            "Drive a day of traffic into a scaling group and tune its rules; watch health checks pull a sick server out of the load balancer",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Scaling groups and scaling policies",
            "Health checks",
            "Layer 4 vs layer 7 load balancers",
          ],
          status: "live",
          level: "core",
          prerequisites: ["vms-containers-functions"],
          plain:
            "When traffic rises, the cloud can start more servers automatically and stop them when it falls. A load balancer spreads requests across whichever servers are healthy right now.",
          terms: ["autoscaling", "scaling-group", "load-balancer", "health-check"],
        },
      ],
    },
    {
      slug: "networking",
      title: "Networking",
      summary: "Private networks, the way in and out, connecting networks, and DNS.",
      modules: [
        {
          slug: "private-networks",
          title: "Your own private network",
          summary: "Address ranges, subnets and routes: a VPC or VNet, built by hand.",
          minutes: 30,
          signature:
            "Carve an address range into public and private subnets across two zones, then write the route tables that make them work",
          formats: ["build-connect", "checkpoint"],
          concepts: ["CIDR ranges and subnets", "Route tables", "Public vs private subnets"],
          status: "live",
          level: "core",
          prerequisites: ["regions-responsibility"],
          plain:
            "Each cloud lets you draw your own private network, called a VPC on AWS and Google Cloud or a VNet on Azure. You split its address range into subnets and decide, with route tables, where traffic is allowed to go.",
          terms: ["vpc", "cidr", "subnet", "route-table", "internet-gateway", "stateful-firewall"],
        },
        {
          slug: "in-and-out",
          title: "Getting in and out",
          summary: "Internet and NAT gateways, private endpoints, and what leaving costs.",
          minutes: 25,
          signature:
            "Trace a packet from a private server to the internet and back, then reach a cloud service privately without the internet at all",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Internet gateways and NAT",
            "Private endpoints for cloud services",
            "Egress charges",
          ],
          status: "live",
          level: "core",
          prerequisites: ["private-networks"],
          plain:
            "Servers in a private subnet can reach the internet through a NAT gateway without being reachable from it. Private endpoints let them use cloud services without touching the internet, and data leaving the cloud usually costs money.",
          terms: ["nat", "private-endpoint", "egress", "internet-gateway"],
        },
        {
          slug: "connecting-networks",
          title: "Connecting networks",
          summary: "Peering, hub-and-spoke, and links to offices and data centres.",
          minutes: 25,
          signature:
            "Connect six networks first by peering every pair, then through a hub, and count the links; then add an office over VPN and a dedicated line",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Network peering and its limits",
            "Hub-and-spoke and transit gateways",
            "VPN and dedicated connections",
          ],
          status: "live",
          level: "core",
          prerequisites: ["private-networks"],
          plain:
            "Organisations end up with many networks that need to talk to each other and to their offices. Connecting each pair directly gets messy fast, so most use a central hub, with VPNs or private lines back to their own buildings.",
          terms: ["peering", "transit-hub", "site-to-site-vpn", "dedicated-connection"],
        },
        {
          slug: "dns-routing",
          title: "DNS and traffic routing",
          summary: "Names, private DNS, failover and latency routing, and CDNs.",
          minutes: 25,
          signature:
            "Send users in Delhi, Chennai and Singapore to the nearest healthy region, then take a region down and watch DNS fail over",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "DNS records and private zones",
            "Latency, weighted and failover routing",
            "Content delivery networks",
          ],
          status: "live",
          terms: ["dns", "routing-policy", "ttl", "private-dns-zone", "cdn"],
          level: "core",
          prerequisites: ["private-networks"],
          plain:
            "DNS turns names like portal.gov.example into addresses. Cloud DNS services can answer differently depending on where the user is or which region is healthy, and a CDN keeps copies of content close to users.",
        },
      ],
    },
    {
      slug: "identity-security",
      title: "Identity & security",
      summary:
        "Who can do what, without keys lying around, with data encrypted and rules enforced.",
      modules: [
        {
          slug: "iam",
          title: "Identity and access",
          summary: "Users, roles and policies, and why least privilege matters.",
          minutes: 30,
          signature:
            "Evaluate real policy documents against requests, then cut an over-broad policy down until it allows only what the job needs",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Identities, roles and policies",
            "How a request is allowed or denied",
            "Least privilege",
          ],
          status: "live",
          terms: [
            "iam",
            "principal",
            "iam-role",
            "iam-policy",
            "explicit-deny",
            "permissions-boundary",
            "least-privilege",
          ],
          level: "core",
          prerequisites: ["regions-responsibility"],
          plain:
            "Every action in the cloud is checked against policies that say who may do what to which resource. Giving each person and program only the access it needs limits the damage when something goes wrong.",
        },
        {
          slug: "workload-identity",
          title: "Workload identity and federation",
          summary: "No long-lived keys: roles for services, single sign-on and OIDC.",
          minutes: 25,
          signature:
            "Follow a leaked access key to the damage it does, then replace it with short-lived credentials handed to the workload and to CI",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Why long-lived keys leak",
            "Roles for services and workloads",
            "Federation and single sign-on (SAML, OIDC)",
          ],
          status: "live",
          terms: [
            "access-key",
            "short-lived-credentials",
            "workload-identity",
            "oidc",
            "federation",
          ],
          level: "core",
          prerequisites: ["iam"],
          plain:
            "Passwords and access keys stored in code or laptops get leaked. Modern setups give people and programs short-lived credentials automatically, based on who they already are, so there is nothing permanent to steal.",
        },
        {
          slug: "encryption-secrets",
          title: "Encryption, keys and secrets",
          summary: "Key management services, envelope encryption and secret stores.",
          minutes: 25,
          signature:
            "Encrypt a file the way cloud storage does, with a data key wrapped by a master key, then rotate and revoke keys and see what still opens",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Encryption at rest and in transit",
            "Key management services and envelope encryption",
            "Secret managers",
          ],
          status: "live",
          terms: ["envelope-encryption", "kms", "key-rotation", "tls", "secret-manager"],
          level: "core",
          prerequisites: ["iam"],
          plain:
            "Cloud data is encrypted with keys kept in a key management service, which never lets the master key leave. Passwords and API keys belong in a secret manager, not in code or configuration files.",
        },
        {
          slug: "guardrails",
          title: "Guardrails and policy as code",
          summary: "Organisation-wide rules that stop mistakes before they happen.",
          minutes: 25,
          signature:
            "Try to create a public bucket, a server in the wrong region and an untagged database under different guardrails, and see which are blocked and which only flagged",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Preventive vs detective controls",
            "Organisation policies on each cloud",
            "Policy as code",
          ],
          status: "live",
          terms: ["guardrail", "preventive-control", "detective-control", "policy-as-code"],
          level: "core",
          prerequisites: ["iam"],
          plain:
            "Guardrails are rules set once for the whole organisation, such as 'nothing outside India' or 'no public storage'. Some block a mistake outright; others raise an alert so someone can fix it.",
        },
      ],
    },
    {
      slug: "organising",
      title: "Organising the estate",
      summary: "Accounts and projects, landing zones, and infrastructure as code.",
      modules: [
        {
          slug: "resource-hierarchy",
          title: "Accounts, subscriptions and projects",
          summary: "The resource hierarchy, and why one big account goes wrong.",
          minutes: 25,
          signature:
            "Sort a department's workloads into an organisation tree of folders and accounts, then see how policies and bills flow down it",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Organisations, folders, accounts, subscriptions and projects",
            "Blast radius and separation",
            "How policies and billing inherit",
          ],
          status: "live",
          terms: ["cloud-account", "resource-hierarchy", "blast-radius"],
          level: "core",
          prerequisites: ["iam"],
          plain:
            "Clouds let you split your work into separate accounts or projects grouped in a tree. Keeping production apart from testing, and teams apart from each other, limits how far one mistake can spread.",
        },
        {
          slug: "landing-zones",
          title: "Landing zones",
          summary: "A ready foundation of shared networking, logging and security.",
          minutes: 30,
          signature:
            "Assemble a landing zone piece by piece (log archive, security tooling, shared network, workload accounts) and check it against what each cloud's blueprint provides",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "What a landing zone contains",
            "AWS, Azure and Google Cloud blueprints",
            "Vending new accounts safely",
          ],
          status: "live",
          terms: ["landing-zone", "account-vending"],
          level: "applied",
          prerequisites: ["resource-hierarchy", "guardrails", "connecting-networks"],
          plain:
            "A landing zone is the prepared ground every new project lands on: accounts, networks, logging and security rules already in place. Each cloud publishes a blueprint for one, so teams don't start from scratch.",
        },
        {
          slug: "infrastructure-as-code",
          title: "Infrastructure as code",
          summary: "Describe infrastructure in files; plan, apply, and catch drift.",
          minutes: 30,
          signature:
            "Read a real Terraform plan, predict what it will create, change and destroy, then find the drift someone caused by clicking in the console",
          formats: ["sandbox", "checkpoint"],
          concepts: ["Declarative infrastructure", "Plan, apply and state", "Drift and reviews"],
          status: "live",
          terms: ["infrastructure-as-code", "declarative", "iac-plan", "iac-state", "drift"],
          level: "applied",
          prerequisites: ["private-networks"],
          plain:
            "Instead of clicking in a web console, you describe the infrastructure you want in files and let a tool create it. The files can be reviewed, versioned and re-run, and the tool shows exactly what it will change first.",
        },
      ],
    },
    {
      slug: "data-resilience-cost",
      title: "Data, resilience & cost",
      summary: "Where data lives, surviving failures, paying the bill, and reviewing a design.",
      modules: [
        {
          slug: "storage-databases",
          title: "Storage and managed databases",
          summary: "Object, block and file storage, and managed databases.",
          minutes: 25,
          signature:
            "Place a department's data (scanned files, a database, shared documents, backups) on the right kind of storage and tier, and watch the monthly cost change",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Object, block and file storage",
            "Storage tiers and lifecycle rules",
            "Managed databases vs running your own",
          ],
          status: "live",
          terms: [
            "object-storage",
            "block-storage",
            "file-storage",
            "storage-class",
            "lifecycle-rule",
            "managed-database",
          ],
          level: "core",
          prerequisites: ["what-is-cloud"],
          plain:
            "Clouds offer different storage for different jobs: object storage for files at any scale, disks attached to servers, and shared file systems. Managed databases take backups, patching and failover off your hands.",
        },
        {
          slug: "ha-dr",
          title: "High availability and disaster recovery",
          summary: "How much downtime and data loss you can afford, and what it costs to avoid.",
          minutes: 30,
          signature:
            "Pick a recovery strategy, from backups to active-active in two regions, then fail a region and see the downtime, data lost and monthly cost",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "RTO and RPO",
            "Backup and restore, pilot light, warm standby, active-active",
            "Testing recovery",
          ],
          status: "live",
          terms: ["disaster-recovery", "rpo", "rto", "high-availability", "chaos-engineering"],
          level: "applied",
          prerequisites: ["regions-responsibility", "storage-databases"],
          plain:
            "Two numbers drive the design: how long you can be down and how much recent data you can lose. Tighter answers mean copies in more places running all the time, which costs more.",
        },
        {
          slug: "cost-finops",
          title: "Cost and FinOps",
          summary: "Pricing models, commitments and spot capacity, tags, and bill shock.",
          minutes: 30,
          signature:
            "Price a workload with on-demand, committed and spot capacity using dated list prices, then find the idle and egress costs hiding in a real-shaped bill",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "On-demand, committed-use and spot pricing",
            "Tagging and showback",
            "Common sources of waste",
          ],
          status: "live",
          terms: ["on-demand", "commitment-discount", "spot-capacity", "finops"],
          level: "applied",
          prerequisites: ["vms-containers-functions"],
          plain:
            "Cloud bills grow quietly: forgotten servers, oversized machines and data moving between places. FinOps is the habit of making costs visible to the teams who cause them, and buying capacity the cheapest sensible way.",
        },
        {
          slug: "well-architected",
          title: "Well-architected reviews",
          summary: "The pillars the three clouds share, used to review a design.",
          minutes: 25,
          signature:
            "Review an architecture diagram against the pillars and find what's missing: no backups tested, one zone, admin keys in code, no budget alerts",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "The well-architected pillars",
            "Reviewing a design",
            "Trade-offs between pillars",
          ],
          status: "live",
          terms: ["well-architected-review", "wa-pillar", "high-risk-issue"],
          level: "applied",
          prerequisites: ["ha-dr", "cost-finops"],
          plain:
            "AWS, Azure and Google Cloud each publish a framework of good practice grouped into pillars such as security, reliability and cost. Walking a design through them is a quick way to find its weak spots.",
        },
      ],
    },
    {
      slug: "in-practice",
      title: "In practice",
      summary: "Running in India, moving workloads to the cloud, and a capstone design.",
      modules: [
        {
          slug: "cloud-india",
          title: "Cloud in India and government",
          summary: "Data residency, empanelment and the rules public projects work under.",
          minutes: 25,
          signature:
            "Check a government project's design service by service: is the region in India, is the service empanelled, does the data stay here?",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Cloud regions in India",
            "MeitY empanelment and government cloud",
            "Data residency and the DPDP Act",
          ],
          status: "live",
          terms: ["meity-empanelment", "data-residency", "dpdp"],
          level: "applied",
          prerequisites: ["regions-responsibility", "guardrails"],
          plain:
            "Public-sector projects in India often have to keep data in the country and use approved cloud services. Having a region in India isn't enough on its own: every service in the design has to be checked.",
        },
        {
          slug: "migration",
          title: "Migration: the 7 Rs",
          summary: "Rehost, replatform, refactor and the rest, for a real-shaped portfolio.",
          minutes: 25,
          signature:
            "Decide the fate of ten applications, from a COTS payroll system to a mainframe batch job, and see the cost, risk and time of each choice",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "The 7 Rs of migration",
            "Assessing an application portfolio",
            "Waves and cut-over",
          ],
          status: "live",
          terms: ["migration-strategy", "cutover"],
          level: "applied",
          prerequisites: ["vms-containers-functions", "storage-databases"],
          plain:
            "Not every application should move to the cloud the same way, and some shouldn't move at all. Teams sort each one: move it as is, tweak it, rebuild it, replace it with a service, keep it, or retire it.",
        },
        {
          slug: "capstone-landing-zone",
          title: "Capstone: a foundation for a state department",
          summary: "Design a landing zone and app platform, then review it.",
          minutes: 40,
          signature:
            "Make the choices for a state department's cloud foundation (hierarchy, network, identity, guardrails, recovery, cost) and review the result against the pillars and India's rules",
          formats: ["branching-scenario", "build-connect", "checkpoint"],
          concepts: ["Designing a cloud foundation end to end"],
          status: "live",
          terms: ["landing-zone", "well-architected-review"],
          level: "applied",
          prerequisites: ["landing-zones", "ha-dr", "cloud-india"],
          plain:
            "Everything in this track in one design. You'll make each choice for a realistic public-sector organisation, then check your design the way a reviewer would.",
        },
      ],
    },
  ],
};

const streamingData: Track = {
  slug: "streaming-data",
  title: "Streaming Data Systems",
  area: "Data engineering",
  category: "data-engineering",
  tagline: "Data that never stops: events, logs, windows and state.",
  description:
    "How data flows in real time: the append-only log, partitions and replication, change data capture and schemas, delivery guarantees, event time, windows, state and checkpoints, streaming SQL, and running pipelines at scale. Vendor-neutral: Apache Kafka, Redpanda and Pulsar, the clouds' own streaming services, and Flink, Spark, Kafka Streams and Beam side by side. By the end you can design a streaming pipeline and predict how it behaves when things go wrong.",
  accent: "current",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why process data as it happens, and the log at the heart of it.",
      modules: [
        {
          slug: "batch-vs-streams",
          title: "Batch vs streams",
          summary: "Bounded data on a schedule, or unbounded data as it arrives.",
          minutes: 20,
          signature:
            "Follow a suspicious payment through tonight's batch and through a live stream, and see which one stops the fraud",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "Bounded and unbounded data",
            "Latency: hours, seconds, milliseconds",
            "When batch is still the right answer",
          ],
          status: "live",
          terms: [
            "batch",
            "streaming",
            "bounded-data",
            "unbounded-data",
            "latency",
            "micro-batch",
            "lambda-architecture",
            "kappa-architecture",
          ],
          level: "beginner",
          plain:
            "Most data used to be processed in big nightly batches. Some decisions can't wait that long: a fraud check, a delivery estimate, a stock alert. Stream processing handles each event as it arrives, but costs more care to run.",
        },
        {
          slug: "events-logs-topics",
          title: "Events, logs and topics",
          summary: "The append-only log every streaming system is built on.",
          minutes: 25,
          signature:
            "Append events to a log, read it from any offset with several readers, and replay yesterday",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Events and their parts",
            "The append-only log and offsets",
            "Producers, topics and consumers",
          ],
          status: "live",
          terms: ["event", "append-only-log", "topic", "producer", "consumer", "offset"],
          level: "beginner",
          prerequisites: ["batch-vs-streams"],
          plain:
            "An event is a record that something happened. Streaming systems keep events in order in an append-only log, like a ledger nobody can rewrite. Any number of readers can follow it, each at its own position, and can go back to replay.",
        },
      ],
    },
    {
      slug: "the-log",
      title: "The log",
      summary: "How Kafka-style platforms split, share, protect and keep the log.",
      modules: [
        {
          slug: "partitions-ordering",
          title: "Partitions and ordering",
          summary: "Spreading a topic across machines without losing the order that matters.",
          minutes: 25,
          signature:
            "Pick a partition key for an order stream, then watch ordering per customer and one partition run hot",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Partitions and keys",
            "Ordering within a partition",
            "Hot partitions and key skew",
          ],
          status: "live",
          terms: ["stream-partition", "partition-key", "hot-partition"],
          level: "core",
          prerequisites: ["events-logs-topics"],
          plain:
            "A single log can't hold the whole world, so a topic is split into partitions. Events with the same key always land in the same partition, so their order is kept. Choose the key badly and one partition does all the work.",
        },
        {
          slug: "consumer-groups",
          title: "Consumer groups and offsets",
          summary: "Sharing the reading among many workers, and remembering where each got to.",
          minutes: 25,
          signature:
            "Add and remove consumers in a group, watch partitions rebalance and lag rise and fall",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Consumer groups and partition assignment",
            "Committed offsets",
            "Rebalances and consumer lag",
          ],
          status: "live",
          terms: ["consumer-group", "committed-offset", "rebalance", "consumer-lag"],
          level: "core",
          prerequisites: ["partitions-ordering"],
          plain:
            "To read faster, several consumers share a topic as a group, each taking some partitions. Each remembers how far it has read by committing an offset. When a consumer joins or leaves, the partitions are reshuffled.",
        },
        {
          slug: "replication-durability",
          title: "Durability and replication",
          summary: "Copies of every partition, and what a write acknowledgement really promises.",
          minutes: 25,
          signature:
            "Lose a broker under different acknowledgement settings and see which writes survive",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Leaders, followers and in-sync replicas",
            "acks and min.insync.replicas",
            "Failover and unclean leader election",
          ],
          status: "live",
          terms: [
            "replica",
            "partition-leader",
            "in-sync-replicas",
            "acks",
            "min-insync-replicas",
            "unclean-leader-election",
          ],
          level: "core",
          prerequisites: ["partitions-ordering"],
          plain:
            "Every partition is copied to several machines so a crash doesn't lose data. A producer chooses how many copies must confirm a write before it counts. Fewer confirmations are faster; more are safer.",
        },
        {
          slug: "retention-compaction",
          title: "Retention, compaction and tiered storage",
          summary: "How long the log keeps events, and how to keep only what matters.",
          minutes: 20,
          signature:
            "Run the same topic under time retention, size retention and compaction, then move old segments to object storage",
          formats: ["step-through", "checkpoint"],
          concepts: ["Time and size retention", "Log compaction by key", "Tiered storage"],
          status: "live",
          terms: [
            "retention-period",
            "log-segment",
            "log-compaction",
            "tombstone",
            "tiered-storage",
          ],
          level: "core",
          prerequisites: ["events-logs-topics"],
          plain:
            "Logs can't grow forever on fast disks. Topics delete old events after a time or size limit, or compact them to keep only the latest value for each key. Tiered storage moves old data to cheap object storage.",
        },
        {
          slug: "platforms-compared",
          title: "The platforms compared",
          summary: "Kafka, Redpanda, Pulsar and the clouds' own streaming services.",
          minutes: 25,
          signature:
            "Match workloads to Kafka, Redpanda, Pulsar, Kinesis, Pub/Sub and Event Hubs by their real limits and dated prices",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Kafka and Kafka-compatible platforms",
            "Cloud streaming services",
            "Managed vs self-run",
          ],
          status: "live",
          terms: ["kafka-protocol", "managed-kafka"],
          level: "core",
          prerequisites: ["replication-durability"],
          plain:
            "Kafka started the modern streaming platform, and many others now speak its protocol or offer something similar. The clouds each sell a managed version. They differ in limits, operations and price more than in the core idea.",
        },
      ],
    },
    {
      slug: "in-and-out",
      title: "Getting data in and out",
      summary: "Turning databases into streams, keeping events readable, and delivering them once.",
      modules: [
        {
          slug: "cdc-outbox",
          title: "Change data capture and the outbox",
          summary: "Turning every database change into an event, without dual writes.",
          minutes: 25,
          signature:
            "Watch a dual write lose an event, then fix it with an outbox table and change data capture",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Log-based change data capture",
            "The dual-write problem",
            "The transactional outbox",
          ],
          status: "live",
          terms: ["cdc", "transaction-log", "dual-write", "outbox", "debezium", "replication-slot"],
          level: "core",
          prerequisites: ["events-logs-topics"],
          plain:
            "Many events start life as a change in a database. Change data capture reads the database's own log and publishes each change. The outbox pattern makes sure a database update and its event can never disagree.",
        },
        {
          slug: "schemas-evolution",
          title: "Schemas and evolution",
          summary: "Agreeing what an event looks like, and changing it without breaking readers.",
          minutes: 25,
          signature:
            "Ship a schema change that breaks a consumer, then fix it with a registry and compatibility rules",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Avro, Protobuf and JSON Schema",
            "Schema registries",
            "Backward and forward compatibility",
          ],
          status: "live",
          terms: ["schema", "schema-registry", "backward-compatible", "forward-compatible", "avro"],
          level: "core",
          prerequisites: ["events-logs-topics"],
          plain:
            "Producers and consumers must agree on the shape of an event, even as it changes over the years. A schema registry stores each version and refuses changes that would break existing readers.",
        },
        {
          slug: "delivery-guarantees",
          title: "Delivery guarantees",
          summary: "At most once, at least once, exactly once, and what each really costs.",
          minutes: 25,
          signature:
            "Crash a producer and a consumer at the worst moment and count the duplicates and losses under each guarantee",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "At-most, at-least and exactly-once",
            "Idempotent producers and transactions",
            "Idempotent consumers",
          ],
          status: "live",
          terms: [
            "exactly-once",
            "idempotent-producer",
            "kafka-transaction",
            "idempotent-consumer",
          ],
          level: "core",
          prerequisites: ["consumer-groups"],
          plain:
            "Networks fail mid-message, so a system either risks losing events or risks repeating them. Exactly-once is possible inside a platform with idempotent writes and transactions; at the edges, consumers must cope with repeats.",
        },
      ],
    },
    {
      slug: "processing",
      title: "Processing streams",
      summary: "Transforming, timing, windowing and joining events as they flow.",
      modules: [
        {
          slug: "stateless-processing",
          title: "Filter, map, route",
          summary: "The simple building blocks of a stream pipeline.",
          minutes: 20,
          signature:
            "Wire filters, maps and routers into a small topology and watch events flow through it",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Stream processing topologies",
            "Stateless operations",
            "Kafka Streams, Flink and friends",
          ],
          status: "live",
          terms: ["stateless-operation", "processor-topology", "repartition"],
          level: "core",
          prerequisites: ["events-logs-topics"],
          plain:
            "The simplest stream processing looks at one event at a time: drop it, change it, or send it somewhere. Chain these steps into a pipeline and you have most real-time integrations.",
        },
        {
          slug: "event-time",
          title: "Event time vs processing time",
          summary: "When something happened, versus when you heard about it.",
          minutes: 25,
          signature:
            "Replay a day of events with network delays and see counts by processing time go wrong; add a watermark",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Event time and processing time",
            "Out-of-order and late events",
            "Watermarks",
          ],
          status: "live",
          terms: ["event-time", "processing-time", "watermark"],
          level: "core",
          prerequisites: ["stateless-processing"],
          plain:
            "An event can arrive minutes after it happened, out of order with others. Counting by arrival time gives wrong answers. Stream processors track event time and use watermarks to decide when they've probably seen everything up to a moment.",
        },
        {
          slug: "windows",
          title: "Windows",
          summary: "Grouping an endless stream into finite pieces you can count.",
          minutes: 25,
          signature:
            "Put the same clickstream through tumbling, hopping, sliding and session windows and compare the results",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Tumbling and hopping windows",
            "Sliding and session windows",
            "Late data and allowed lateness",
          ],
          status: "live",
          terms: [
            "stream-window",
            "tumbling-window",
            "hopping-window",
            "session-window",
            "watermark",
          ],
          level: "core",
          prerequisites: ["event-time"],
          plain:
            "You can't sum an infinite stream, so you cut it into windows: every five minutes, the last hour, or each user's session. The window type changes the answer.",
        },
        {
          slug: "state-joins",
          title: "State and joins",
          summary:
            "Remembering things between events, and joining streams to tables and to each other.",
          minutes: 30,
          signature:
            "Join a payment stream to a customer table and to a stream of logins, and watch the state grow",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Stateful operators and state stores",
            "Stream–table duality",
            "Stream–stream and stream–table joins",
          ],
          status: "live",
          terms: ["state-store", "stream-table-duality", "stream-table-join", "stream-stream-join"],
          level: "deep",
          prerequisites: ["windows"],
          plain:
            "Counting, deduplicating and joining all need memory between events. Stream processors keep this state locally and back it up. A table can be seen as a stream of changes, and a stream as building up a table.",
        },
        {
          slug: "checkpoints",
          title: "Checkpoints and exactly-once processing",
          summary: "Crashing mid-stream and carrying on as if nothing happened.",
          minutes: 25,
          signature:
            "Crash a job mid-stream, restore from a checkpoint and replay, and check that no count is doubled",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Distributed snapshots and barriers",
            "Restoring state and replaying input",
            "End-to-end exactly-once with transactional sinks",
          ],
          status: "live",
          terms: ["checkpoint", "checkpoint-barrier", "transactional-sink", "exactly-once"],
          level: "deep",
          prerequisites: ["state-joins", "delivery-guarantees"],
          plain:
            "Long-running jobs will crash. They periodically snapshot their state together with their position in the input. After a crash they restore the snapshot and replay from there, so results come out as if the crash never happened.",
        },
        {
          slug: "streaming-sql",
          title: "Streaming SQL",
          summary: "Queries that never finish, and views that keep themselves up to date.",
          minutes: 25,
          signature:
            "Write a continuous query over a live order stream and watch its materialised view update",
          formats: ["sandbox", "checkpoint"],
          concepts: [
            "Continuous queries",
            "Materialised views",
            "Flink SQL, ksqlDB, RisingWave and Materialize",
          ],
          status: "live",
          terms: ["continuous-query", "materialized-view", "stream-table-duality"],
          level: "core",
          prerequisites: ["windows"],
          plain:
            "Instead of writing code, you can describe stream processing in SQL. The query never finishes: its result updates as events arrive, like a spreadsheet that recalculates itself.",
        },
      ],
    },
    {
      slug: "operating",
      title: "Operating streams",
      summary: "Keeping pipelines healthy under load, errors and bills.",
      modules: [
        {
          slug: "backpressure-lag",
          title: "Backpressure and lag",
          summary: "What happens when events arrive faster than you can handle them.",
          minutes: 25,
          signature:
            "Send a sale-day spike through a pipeline and keep lag in check by scaling consumers and partitions",
          formats: ["simulation", "checkpoint"],
          concepts: ["Consumer lag", "Backpressure", "Scaling consumers and partitions"],
          status: "live",
          terms: ["consumer-lag", "backpressure", "consumer-group", "stream-partition"],
          level: "applied",
          prerequisites: ["consumer-groups"],
          plain:
            "When producers outpace consumers, events queue up and the stream falls behind. Lag measures how far behind; backpressure slows the fast part down. The fix is usually more consumers, which needs enough partitions.",
        },
        {
          slug: "errors-dlq",
          title: "Errors, retries and dead-letter queues",
          summary: "Handling the one bad message without stopping everything.",
          minutes: 20,
          signature:
            "Watch one malformed event block a partition, then add retries with backoff and a dead-letter topic",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Poison messages", "Retry with backoff", "Dead-letter queues and replay"],
          status: "live",
          level: "applied",
          prerequisites: ["delivery-guarantees"],
          plain:
            "One broken event can stop a consumer that keeps retrying it, and everything behind it waits. Good pipelines retry a few times, then park the bad event in a dead-letter queue for a human, and keep going.",
          terms: ["poison-pill", "dead-letter-queue", "jitter", "replay-dlq"],
        },
        {
          slug: "sizing-cost",
          title: "Sizing and cost",
          summary: "Partitions, throughput and what streaming really costs to run.",
          minutes: 25,
          signature:
            "Size a topic for a target throughput, then price it on managed Kafka, Kinesis, Pub/Sub and Event Hubs with dated list prices",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Throughput and partition counts",
            "Capacity units and pricing models",
            "Self-run vs managed cost",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["platforms-compared"],
          plain:
            "Streaming bills come from throughput, storage, partitions and data transfer. Each service counts them differently. Sizing a topic well avoids both bottlenecks and paying for capacity you never use.",
          terms: ["capacity-unit", "replication-factor", "cross-az-traffic", "fetch-from-follower"],
        },
      ],
    },
    {
      slug: "storage",
      title: "Streams meet storage",
      summary: "Landing streams in the lakehouse and serving them live.",
      modules: [
        {
          slug: "streams-to-lakehouse",
          title: "Streaming into the lakehouse",
          summary: "Fresh tables from a stream, without drowning in small files.",
          minutes: 25,
          signature:
            "Tune a stream's commit interval into an Iceberg table and trade freshness against small files and compaction",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Streaming writes to table formats",
            "Small files and compaction",
            "Kafka-to-table tools",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["checkpoints"],
          plain:
            "Streams often end up in lakehouse tables for analysis. Writing often keeps tables fresh but creates many small files that slow queries; writing rarely does the opposite. Compaction tidies up behind the stream.",
          terms: [
            "commit-interval",
            "small-files",
            "compaction",
            "equality-delete",
            "deletion-vector",
          ],
        },
        {
          slug: "realtime-analytics",
          title: "Real-time analytics stores",
          summary: "Databases built to answer questions about events seconds old.",
          minutes: 20,
          signature:
            "Point a live dashboard at a stream through ClickHouse, Apache Druid and Apache Pinot and compare freshness and query speed",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Real-time OLAP",
            "Ingesting directly from streams",
            "When a lakehouse is fresh enough",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["streams-to-lakehouse"],
          plain:
            "Some dashboards must show what happened seconds ago, for thousands of users at once. Real-time analytics databases ingest straight from streams and answer aggregations in milliseconds.",
          terms: ["real-time-olap", "columnar", "rollup", "olap"],
        },
      ],
    },
    {
      slug: "in-practice",
      title: "In practice",
      summary: "Event-driven designs and a capstone pipeline.",
      modules: [
        {
          slug: "event-patterns",
          title: "Event-driven patterns",
          summary: "Event sourcing, CQRS and sagas, and when they help.",
          minutes: 25,
          signature:
            "Rebuild an account balance from its events, split reads from writes, and run a three-step saga that has to undo itself",
          formats: ["step-through", "checkpoint"],
          concepts: ["Event sourcing", "CQRS", "Sagas and compensating actions"],
          status: "live",
          level: "applied",
          prerequisites: ["cdc-outbox"],
          plain:
            "Some systems store events as the source of truth and derive everything else from them. Others separate the model for writing from the models for reading, or coordinate a multi-step process with events instead of one big transaction.",
          terms: [
            "event-sourcing",
            "cqrs",
            "read-model",
            "saga",
            "compensating-action",
            "pivot-transaction",
          ],
        },
        {
          slug: "capstone-payments",
          title: "Capstone: a real-time payments monitor",
          summary: "Design a streaming pipeline for UPI-like payments, then break it.",
          minutes: 40,
          signature:
            "Choose the platform, keys, processing, guarantees and storage for a payments monitor, then fail a broker, a job and a schema and see what holds",
          formats: ["branching-scenario", "build-connect", "checkpoint"],
          concepts: ["Designing a streaming pipeline end to end"],
          status: "live",
          level: "applied",
          prerequisites: ["checkpoints", "errors-dlq", "sizing-cost"],
          plain:
            "Everything in this track in one design. You'll make each choice for a payments monitoring pipeline, then see how it behaves when things go wrong.",
          terms: [
            "stream-partition",
            "partition-key",
            "acks",
            "watermark",
            "dead-letter-queue",
            "checkpoint",
          ],
        },
      ],
    },
  ],
};

const kubernetes: Track = {
  slug: "kubernetes",
  title: "Kubernetes",
  area: "Platform & cloud",
  category: "platform-cloud",
  tagline: "Pods, controllers and scheduling, taken apart.",
  description:
    "How Kubernetes really works: desired state and control loops, the control plane and nodes, pods and Deployments, health checks, Services and Gateway API, network policies, configuration and storage, requests and limits, the scheduler, autoscaling, upgrades, access control, pod security, Helm and GitOps, debugging and operators. Vendor-neutral: upstream Kubernetes alongside EKS, GKE, AKS and OpenShift. By the end you can read a cluster, design a deployment and predict how it behaves when things go wrong.",
  accent: "helm",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why Kubernetes exists, and the one idea it is built on.",
      modules: [
        {
          slug: "why-kubernetes",
          title: "Why Kubernetes",
          summary: "From copying files to twenty servers by hand to declaring what you want.",
          minutes: 20,
          signature:
            "Deploy one app by hand to twenty servers until it breaks at 2 a.m., then let a cluster keep it running",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "What containers solved and what they didn't",
            "Orchestration: placing, restarting, scaling",
            "When Kubernetes isn't worth it",
          ],
          status: "live",
          level: "beginner",
          plain:
            "Containers package an app so it runs the same everywhere, but someone still has to decide which machine runs each one, restart them when they crash and add more when traffic grows. Kubernetes does that job: you describe what you want running, and it keeps it that way.",
          terms: [
            "container",
            "container-image",
            "orchestration",
            "cluster",
            "node",
            "desired-state",
          ],
        },
        {
          slug: "desired-state",
          title: "Desired state and the control loop",
          summary: "Say what you want; controllers keep making it true.",
          minutes: 20,
          signature: "Delete a pod or kill a node and watch the cluster put things back",
          formats: ["simulation", "checkpoint"],
          concepts: ["Declarative vs imperative", "Reconciliation loops", "Self-healing"],
          status: "live",
          level: "beginner",
          prerequisites: ["why-kubernetes"],
          plain:
            "You don't tell Kubernetes what to do step by step. You tell it what the end result should be, like setting a thermostat, and small programs called controllers keep comparing reality with that and fixing any difference.",
          terms: [
            "desired-state",
            "controller",
            "reconciliation",
            "spec-status",
            "kubectl",
            "declarative",
          ],
        },
        {
          slug: "cluster-anatomy",
          title: "The cluster, taken apart",
          summary: "The control plane, the nodes, and what happens on kubectl apply.",
          minutes: 25,
          signature:
            "Follow one kubectl apply through the API server, etcd, the scheduler, controllers and the kubelet",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Control plane components",
            "Nodes, kubelet and container runtime",
            "Everything goes through the API server",
          ],
          status: "live",
          level: "core",
          prerequisites: ["desired-state"],
          plain:
            "A cluster has a control plane that stores what you asked for and decides where things run, and worker machines (nodes) that actually run your containers. Every change goes through one front door, the API server.",
          terms: [
            "control-plane",
            "api-server",
            "etcd",
            "kube-scheduler",
            "kubelet",
            "container-runtime",
            "admission-control",
            "controller",
          ],
        },
      ],
    },
    {
      slug: "workloads",
      title: "Running workloads",
      summary: "Pods, Deployments, health checks and the other controllers.",
      modules: [
        {
          slug: "pods",
          title: "Pods",
          summary: "The smallest thing Kubernetes runs: one or more containers sharing a home.",
          minutes: 20,
          signature:
            "Put two containers in one pod, share a disk and a network, and follow the pod through its life",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Containers sharing network and storage",
            "Init containers and sidecars",
            "Pod phases and restarts",
          ],
          status: "live",
          level: "core",
          prerequisites: ["cluster-anatomy"],
          plain:
            "Kubernetes doesn't run containers directly; it runs pods. A pod is one or more tightly coupled containers that share an IP address and can share files. Pods are disposable: when one dies, a new one replaces it.",
          terms: [
            "pod",
            "container",
            "init-container",
            "sidecar-container",
            "pod-phase",
            "restart-policy",
            "kubelet",
          ],
        },
        {
          slug: "deployments",
          title: "Deployments and rolling updates",
          summary: "Releasing a new version without downtime, and rolling back a bad one.",
          minutes: 25,
          signature:
            "Roll out v2 across ten pods, tune how fast it goes, then roll back a broken release",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "ReplicaSets and Deployments",
            "Rolling update settings",
            "Rollback and revision history",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pods"],
          plain:
            "A Deployment keeps a set number of identical pods running and replaces them gradually when you ship a new version, so users never see an outage. If the new version is broken, you can roll back.",
          terms: ["deployment", "replicaset", "rolling-update", "rollback", "pod"],
        },
        {
          slug: "health-checks",
          title: "Health checks",
          summary: "Telling Kubernetes when an app is alive, ready, or still starting.",
          minutes: 20,
          signature:
            "A slow-starting app is killed in a restart loop; fix it with the right probes",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Liveness, readiness and startup probes",
            "Restart loops",
            "Graceful shutdown",
          ],
          status: "live",
          level: "core",
          prerequisites: ["deployments"],
          plain:
            "Kubernetes can only keep an app healthy if it can tell when it isn't. Probes are small checks it runs: one to see if the app is alive, one to see if it's ready for traffic, and one for slow starters.",
          terms: ["probe", "liveness-probe", "readiness-probe", "startup-probe", "restart-policy"],
        },
        {
          slug: "workload-controllers",
          title: "StatefulSets, DaemonSets, Jobs and CronJobs",
          summary: "Picking the right controller for each kind of workload.",
          minutes: 20,
          signature:
            "Match databases, log agents, nightly reports and web apps to the controller built for them",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Stable identity for stateful apps",
            "One pod per node",
            "Run-to-completion and scheduled work",
          ],
          status: "live",
          level: "core",
          prerequisites: ["deployments"],
          plain:
            "Deployments suit interchangeable web servers. Other workloads need something different: databases need stable names and disks, log collectors need one copy on every machine, and batch jobs need to run once and finish.",
          terms: ["deployment", "statefulset", "daemonset", "job", "cronjob"],
        },
      ],
    },
    {
      slug: "networking",
      title: "Networking",
      summary: "Finding pods that keep moving, letting traffic in, and keeping it out.",
      modules: [
        {
          slug: "services-dns",
          title: "Services and DNS",
          summary: "A stable address in front of pods that keep changing.",
          minutes: 25,
          signature:
            "Label pods, point a Service at them, and watch traffic follow pods as they come and go",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Labels and selectors",
            "ClusterIP, NodePort, LoadBalancer, headless",
            "Cluster DNS",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pods"],
          plain:
            "Pods come and go and their IP addresses change. A Service gives a group of pods one stable name and address, and spreads traffic across whichever pods are healthy right now.",
          terms: ["service", "label", "label-selector", "endpointslice", "readiness-probe"],
        },
        {
          slug: "ingress-gateway",
          title: "Ingress and Gateway API",
          summary: "Routing outside traffic to the right service.",
          minutes: 20,
          signature: "Route two websites and an API through one entry point, by host and path",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Ingress and ingress controllers",
            "Gateway API roles and routes",
            "TLS at the edge",
          ],
          status: "live",
          level: "core",
          prerequisites: ["services-dns"],
          plain:
            "Services work inside the cluster. To let the internet in, you put a router at the edge that sends each request to the right Service based on its hostname and path. Gateway API is the newer, richer way to describe that.",
          terms: ["ingress", "ingress-controller", "gateway-api", "service"],
        },
        {
          slug: "network-policies",
          title: "Network policies",
          summary: "Every pod can reach every other pod, until you say otherwise.",
          minutes: 20,
          signature:
            "Lock down a three-tier app so only the right pods can talk, without breaking it",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Default allow",
            "Ingress and egress rules",
            "Default deny and the CNI's role",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["services-dns"],
          plain:
            "By default any pod in a cluster can connect to any other, which means one compromised pod can reach your database. Network policies are firewall rules for pods.",
          terms: ["network-policy", "default-deny", "cni", "label-selector"],
        },
      ],
    },
    {
      slug: "config-storage",
      title: "Configuration and storage",
      summary: "Settings, secrets and data that outlive a pod.",
      modules: [
        {
          slug: "config-secrets",
          title: "ConfigMaps and Secrets",
          summary: "Keeping settings and passwords out of the image.",
          minutes: 20,
          signature: "Move settings out of an image, then find out what a Secret really protects",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "ConfigMaps as files and variables",
            "Secrets are encoded, not encrypted",
            "Encryption at rest and external secret stores",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pods"],
          plain:
            "Apps need settings and passwords that differ between environments. Kubernetes stores them as ConfigMaps and Secrets and hands them to pods, but a Secret is only base64-encoded unless you protect it properly.",
          terms: ["configmap", "secret", "encryption-at-rest", "etcd"],
        },
        {
          slug: "persistent-storage",
          title: "Persistent storage",
          summary: "Data that survives when a pod moves or dies.",
          minutes: 25,
          signature:
            "Run a database pod, move it to another node, and see what happens to its data",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Volumes, PersistentVolumes and claims",
            "StorageClasses and dynamic provisioning",
            "CSI drivers and access modes",
          ],
          status: "live",
          level: "core",
          prerequisites: ["config-secrets"],
          plain:
            "A container's files vanish when it restarts. For data that must survive, a pod claims a persistent volume, usually a cloud disk, which Kubernetes attaches wherever the pod runs.",
          terms: ["persistent-volume", "pvc", "storageclass", "csi", "emptydir"],
        },
      ],
    },
    {
      slug: "scheduling",
      title: "Scheduling and scaling",
      summary: "Where pods run, how big they are, and how many.",
      modules: [
        {
          slug: "requests-limits",
          title: "Requests, limits and QoS",
          summary: "How big each pod is, and what happens when it wants more.",
          minutes: 25,
          signature:
            "Pack pods onto nodes, then watch one get throttled and another killed for using too much memory",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Requests for scheduling, limits for enforcement",
            "CPU throttling vs out-of-memory kills",
            "Quality-of-service classes",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pods"],
          plain:
            "Each container says how much CPU and memory it needs (its request) and the most it may use (its limit). Requests decide where pods fit; limits decide what happens when they get greedy.",
          terms: [
            "resource-request",
            "resource-limit",
            "allocatable",
            "qos-class",
            "kube-scheduler",
          ],
        },
        {
          slug: "scheduler",
          title: "The scheduler",
          summary: "How Kubernetes picks a node for every pod.",
          minutes: 25,
          signature:
            "Place pods by hand against filters and scores, then add taints, affinity and spread rules",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Filtering and scoring",
            "Taints and tolerations, affinity",
            "Topology spread across zones",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["requests-limits"],
          plain:
            "When a pod needs a home, the scheduler rules out nodes that can't take it, scores the rest and picks the best. You can steer it: keep pods apart, together, on special hardware or spread across zones.",
          terms: ["kube-scheduler", "node-affinity", "taint", "toleration", "topology-spread"],
        },
        {
          slug: "autoscaling",
          title: "Autoscaling",
          summary: "More pods when busy, more nodes when full, fewer of both when quiet.",
          minutes: 25,
          signature: "Survive a traffic spike with pod and node autoscaling, then shrink back",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Horizontal and vertical pod autoscaling",
            "Cluster Autoscaler and Karpenter",
            "Event-driven scaling with KEDA",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["requests-limits"],
          plain:
            "Traffic rises and falls. Kubernetes can add pods when CPU or queue length grows, and add machines when the pods no longer fit, then remove both when things calm down.",
          terms: ["hpa", "vpa", "node-autoscaler", "keda", "resource-request"],
        },
        {
          slug: "disruptions-upgrades",
          title: "Disruptions and upgrades",
          summary: "Taking nodes away safely, and keeping the cluster current.",
          minutes: 20,
          signature:
            "Drain a node during maintenance without taking the app down, then plan a version upgrade",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Voluntary vs involuntary disruptions",
            "PodDisruptionBudgets and draining",
            "Version skew and upgrade order",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["autoscaling"],
          plain:
            "Machines need patching and Kubernetes itself releases three versions a year. Draining nodes one at a time, with budgets that keep enough pods running, lets you do both without an outage.",
          terms: ["pdb", "drain", "version-skew", "node"],
        },
      ],
    },
    {
      slug: "security-ops",
      title: "Security and operations",
      summary: "Access, policy, delivery and debugging.",
      modules: [
        {
          slug: "rbac",
          title: "Access control and service accounts",
          summary: "Who can do what in the cluster, people and pods alike.",
          minutes: 25,
          signature:
            "Find the over-privileged service account in a breach story, then grant only what's needed",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Authentication vs authorisation",
            "Roles, ClusterRoles and bindings",
            "Service accounts and cloud workload identity",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["cluster-anatomy"],
          plain:
            "Every request to the cluster is checked: who is asking, and are they allowed? Role-based access control grants permissions to people and to pods. Giving too much is one of the most common ways clusters get breached.",
          terms: ["rbac", "service-account", "role", "rolebinding", "api-server"],
        },
        {
          slug: "pod-security",
          title: "Pod security and admission",
          summary: "Stopping risky pods before they start.",
          minutes: 20,
          signature:
            "Sort pod settings from safe to dangerous, then write the policy that blocks the dangerous ones",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Pod Security Standards",
            "Non-root, read-only, no privilege",
            "Admission control and policy engines",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["rbac"],
          plain:
            "A container running as root with host access can take over its machine. Kubernetes can check every pod before it starts and refuse risky ones, using built-in security levels or a policy engine.",
          terms: [
            "pod-security-standards",
            "security-context",
            "admission-control",
            "policy-engine",
          ],
        },
        {
          slug: "helm-gitops",
          title: "Packaging and GitOps",
          summary: "From a Git commit to a running cluster, without kubectl by hand.",
          minutes: 25,
          signature:
            "Package an app with Helm, then let a GitOps agent sync it and undo a manual change",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Helm charts and Kustomize overlays",
            "GitOps: Git as the source of truth",
            "Argo CD and Flux",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["deployments"],
          plain:
            "Real apps are dozens of YAML files that differ per environment. Helm and Kustomize package them; GitOps tools then keep the cluster matching what's in Git, so every change is reviewed and reversible.",
          terms: ["helm", "kustomize", "gitops", "config-drift", "declarative"],
        },
        {
          slug: "debugging",
          title: "Debugging a cluster",
          summary: "Reading the clues when pods won't start or keep dying.",
          minutes: 25,
          signature:
            "Diagnose pods stuck in CrashLoopBackOff, Pending and ImagePullBackOff from events, logs and describe",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "Pod status and events",
            "kubectl describe, logs and get events",
            "Metrics and the usual suspects",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["health-checks"],
          plain:
            "When something breaks, Kubernetes leaves clues: the pod's status, its events and its logs. Most problems fall into a handful of patterns you can learn to recognise.",
          terms: [
            "k8s-event",
            "crashloopbackoff",
            "imagepullbackoff",
            "oomkilled",
            "ephemeral-container",
            "endpointslice",
          ],
        },
      ],
    },
    {
      slug: "in-practice",
      title: "In practice",
      summary: "Extending Kubernetes, choosing a managed service, and a capstone.",
      modules: [
        {
          slug: "operators",
          title: "Extending Kubernetes",
          summary: "Custom resources and operators: teaching the cluster new tricks.",
          minutes: 20,
          signature:
            "Add a 'Database' resource and watch an operator turn it into pods, storage and backups",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Custom resource definitions",
            "The operator pattern",
            "Using operators wisely",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["desired-state"],
          plain:
            "Kubernetes can learn new kinds of objects. An operator is a controller that knows how to run one specific piece of software, such as a database, and does the work a human operator would.",
          terms: ["custom-resource", "operator", "controller", "finalizer", "owner-reference"],
        },
        {
          slug: "managed-kubernetes",
          title: "Managed Kubernetes and cost",
          summary: "EKS, GKE, AKS and OpenShift, and what a cluster really costs.",
          minutes: 25,
          signature:
            "Price the same cluster on four managed services, then decide whether you need Kubernetes at all",
          formats: ["animated-infographic", "simulation", "checkpoint"],
          concepts: [
            "What managed services take off your hands",
            "Control plane fees, nodes and serverless modes",
            "When a simpler platform is better",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["autoscaling"],
          plain:
            "Running the control plane yourself is hard, so most teams use a managed service. They differ in what they manage, how they charge and how much they hide. Sometimes a simpler container service is the better choice.",
          terms: [
            "managed-kubernetes",
            "autopilot",
            "serverless-containers",
            "control-plane",
            "node",
          ],
        },
        {
          slug: "capstone-k8s",
          title: "Capstone: a payments API on Kubernetes",
          summary: "Design the cluster, then survive a bad day.",
          minutes: 40,
          signature:
            "Make the choices for a payments API, then face a bad release, a dead node and a traffic surge",
          formats: ["branching-scenario", "build-connect", "checkpoint"],
          concepts: ["Designing a production deployment end to end"],
          status: "live",
          level: "applied",
          prerequisites: ["health-checks", "autoscaling", "rbac"],
          plain:
            "Everything in this track in one design. You'll choose how to run a payments API on Kubernetes, then see how your choices hold up when things go wrong.",
          terms: [
            "deployment",
            "readiness-probe",
            "topology-spread",
            "hpa",
            "pdb",
            "rbac",
            "pod-security-standards",
          ],
        },
      ],
    },
  ],
};

const ciCd: Track = {
  slug: "ci-cd",
  title: "CI/CD",
  area: "Platform & cloud",
  category: "platform-cloud",
  tagline: "From commit to production, safely and often.",
  description:
    "How teams ship many times a day without breaking things: version control and branching, pipelines and runners, builds and caching, automated tests, quality gates, artifacts and container images, environments, infrastructure pipelines, release strategies, feature flags, database migrations, rollbacks, pipeline secrets and supply-chain security, and the DORA measures of delivery. Vendor-neutral: GitHub Actions, GitLab CI/CD, Jenkins, Azure Pipelines, CircleCI, Buildkite, AWS, Google Cloud and Tekton side by side. By the end you can design a pipeline, read one critically and predict what it will let through.",
  accent: "relay",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why teams integrate and release continuously, and what a pipeline is.",
      modules: [
        {
          slug: "why-ci-cd",
          title: "Why CI/CD",
          summary: "From a scary release weekend to small changes shipped every day.",
          minutes: 20,
          signature:
            "Live through a quarterly release weekend with a month of merged changes, then ship the same work in small daily steps",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "Integration pain grows with batch size",
            "Continuous integration, delivery and deployment",
            "Small, frequent changes are safer",
          ],
          status: "live",
          level: "beginner",
          plain:
            "When a team saves up months of changes and releases them all at once, something always breaks and nobody knows which change did it. CI/CD means joining everyone's work together many times a day, checking it automatically, and releasing in small steps, so problems are small and easy to find.",
          terms: [
            "continuous-integration",
            "continuous-delivery",
            "continuous-deployment",
            "batch-size",
            "pipeline",
            "branch",
          ],
        },
        {
          slug: "branching-strategies",
          title: "Version control and branching",
          summary: "Long-lived branches, GitFlow and trunk-based development, compared.",
          minutes: 25,
          signature:
            "Run a team on long-lived feature branches, then on short-lived ones, and watch merge conflicts pile up or vanish",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Commits, branches and merges",
            "Long-lived branches vs trunk-based development",
            "Pull requests and code review",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-ci-cd"],
          plain:
            "Version control keeps every change ever made to the code. Branches let people work apart, but the longer they stay apart, the harder it is to join the work back together. Most fast teams keep branches small and merge into the main line at least daily.",
          terms: [
            "version-control",
            "git",
            "commit",
            "branch",
            "merge-conflict",
            "pull-request",
            "trunk-based-development",
            "feature-flag",
          ],
        },
        {
          slug: "pipeline-anatomy",
          title: "A pipeline, taken apart",
          summary: "Triggers, stages, jobs, steps, runners and artifacts.",
          minutes: 25,
          signature: "Follow one git push through a pipeline, from webhook to a green tick",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Triggers and events",
            "Stages, jobs and steps; pipelines as code",
            "Runners and where jobs execute",
          ],
          status: "live",
          level: "core",
          prerequisites: ["branching-strategies"],
          plain:
            "A pipeline is a recipe, kept in the repository, that a server runs every time code changes: get the code, build it, test it, package it, ship it. Each part runs on a machine called a runner and reports back pass or fail.",
          terms: [
            "pipeline",
            "workflow",
            "trigger",
            "ci-job",
            "runner",
            "artifact",
            "status-check",
          ],
        },
      ],
    },
    {
      slug: "continuous-integration",
      title: "Continuous integration",
      summary: "Build, test and check every change within minutes.",
      modules: [
        {
          slug: "builds-caching",
          title: "Reproducible builds and caching",
          summary: "Lockfiles, pinned versions and caches that make builds fast and repeatable.",
          minutes: 25,
          signature:
            "Run the same build twice a month apart and get different results, then pin and cache until it's fast and identical",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Dependencies, lockfiles and pinning",
            "Build caches and cache keys",
            "Hermetic and reproducible builds",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pipeline-anatomy"],
          plain:
            "A build turns source code into something that runs. If it pulls whatever library versions happen to be newest, two builds of the same code can differ. Locking versions makes builds repeatable, and caching what hasn't changed makes them fast.",
          terms: ["build", "dependency", "lockfile", "build-cache", "reproducible-build"],
        },
        {
          slug: "test-pyramid",
          title: "Automated tests",
          summary: "Unit, integration and end-to-end tests, and the flaky ones.",
          minutes: 25,
          signature:
            "Shape a test suite for a checkout service and see how many bugs it catches, how long it takes and how often it lies",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "The test pyramid and its trade-offs",
            "What each kind of test catches",
            "Flaky tests and why they matter",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pipeline-anatomy"],
          plain:
            "Automated tests let a machine check the code on every change. Small, fast tests catch most mistakes; a few slow end-to-end tests check that the whole thing works together. Tests that fail at random teach people to ignore red builds.",
          terms: [
            "unit-test",
            "integration-test",
            "e2e-test",
            "test-pyramid",
            "flaky-test",
            "test-quarantine",
            "code-coverage",
          ],
        },
        {
          slug: "pipeline-speed",
          title: "Fast feedback",
          summary: "Parallel jobs, test splitting and only running what changed.",
          minutes: 20,
          signature:
            "Take a 45-minute pipeline and get it under ten with parallelism, sharding and change detection",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Why pipeline time changes behaviour",
            "Parallel jobs and test sharding",
            "Running only what a change affects",
          ],
          status: "live",
          level: "core",
          prerequisites: ["builds-caching", "test-pyramid"],
          plain:
            "If the pipeline takes an hour, people stop waiting for it and batch up changes, which brings back the problems CI was meant to fix. Running jobs side by side, splitting tests across machines and skipping work a change can't affect keep feedback to minutes.",
          terms: ["test-sharding", "change-detection", "critical-path", "build-cache", "runner"],
        },
        {
          slug: "quality-gates",
          title: "Quality gates and merge rules",
          summary:
            "Linters, static analysis, required reviews, branch protection and merge queues.",
          minutes: 25,
          signature:
            "Set the rules for merging into main, then watch which bad changes they stop and how much they slow good ones",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Linters, formatters and static analysis",
            "Required checks, reviews and branch protection",
            "Merge queues keep main green",
          ],
          status: "live",
          level: "core",
          prerequisites: ["test-pyramid"],
          plain:
            "A quality gate is a check a change must pass before it can join the main line: tests green, code reviewed, no known security problems. Good gates stop real problems without making every change wait in line for hours.",
          terms: [
            "quality-gate",
            "branch-protection",
            "status-check",
            "merge-queue",
            "sast",
            "secret-scanning",
            "codeowners",
          ],
        },
      ],
    },
    {
      slug: "artifacts-environments",
      title: "Artifacts and environments",
      summary: "Build once, then promote the same thing towards production.",
      modules: [
        {
          slug: "artifacts-versioning",
          title: "Artifacts and versioning",
          summary: "Build once, deploy many; semantic versions, registries and immutability.",
          minutes: 20,
          signature:
            "Rebuild for every environment and ship something you never tested, then build once and promote",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Artifacts and registries",
            "Build once, promote the same artifact",
            "Semantic versioning and immutable versions",
          ],
          status: "live",
          level: "core",
          prerequisites: ["builds-caching"],
          plain:
            "An artifact is the packaged result of a build, such as a container image or a library file. Build it once, give it a version that never changes, and move that exact artifact from testing to production, so what you tested is what you ship.",
          terms: ["artifact", "artifact-registry", "promotion", "semver"],
        },
        {
          slug: "container-builds",
          title: "Building container images",
          summary: "Layers, multi-stage builds, tags and digests.",
          minutes: 25,
          signature:
            "Shrink a bloated image and its rebuild time by reordering layers, adding a build stage and choosing a smaller base",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Image layers and the build cache",
            "Multi-stage builds and small base images",
            "Tags move, digests don't",
          ],
          status: "live",
          level: "core",
          prerequisites: ["artifacts-versioning"],
          plain:
            "A container image is built in layers, one per instruction, and unchanged layers are reused. Putting things that change least at the top, and leaving build tools out of the final image, makes images smaller, faster to build and safer.",
          terms: [
            "container-image",
            "dockerfile",
            "image-layer",
            "multi-stage-build",
            "image-digest",
          ],
        },
        {
          slug: "environments-promotion",
          title: "Environments and promotion",
          summary:
            "Dev, staging, production and preview environments, and what differs between them.",
          minutes: 25,
          signature:
            "Promote one release through test, staging and production, and catch the bug that only staging's real config reveals",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Why environments exist",
            "Config per environment, the same artifact everywhere",
            "Preview environments per pull request",
          ],
          status: "live",
          level: "core",
          prerequisites: ["artifacts-versioning"],
          plain:
            "Environments are separate copies of the system where a change is tried before real users see it. The code stays the same as it moves along; only the settings differ. The closer test environments are to production, the fewer surprises.",
          terms: ["environment", "staging", "promotion", "preview-environment"],
        },
        {
          slug: "iac-pipelines",
          title: "Infrastructure in the pipeline",
          summary: "Plan in the pull request, apply on merge, catch drift.",
          minutes: 25,
          signature:
            "Review a Terraform plan in a pull request and spot the line that would delete the production database",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Infrastructure changes go through review too",
            "Plan, apply and state",
            "Drift and policy checks",
          ],
          status: "live",
          level: "core",
          prerequisites: ["environments-promotion"],
          plain:
            "Servers, networks and databases can be described in code and changed through the same pipeline as the app. The pipeline shows exactly what will change before anything does, so a reviewer can catch a dangerous change in time.",
          terms: ["iac-plan", "iac-state", "policy-as-code", "drift"],
        },
      ],
    },
    {
      slug: "releasing",
      title: "Releasing safely",
      summary: "Get changes to users without taking the system down.",
      modules: [
        {
          slug: "delivery-vs-deployment",
          title: "Continuous delivery and deployment",
          summary: "Always releasable, and when to let the pipeline go all the way.",
          minutes: 20,
          signature:
            "Choose where the human approval sits in a pipeline and see what it costs in speed and catches in safety",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Continuous delivery vs continuous deployment",
            "The deployment pipeline as the only road to production",
            "Approvals, change windows and change records",
          ],
          status: "live",
          level: "core",
          prerequisites: ["environments-promotion"],
          plain:
            "Continuous delivery means every change that passes the pipeline could be released at the press of a button. Continuous deployment goes one step further: it releases automatically. Which one fits depends on how much you trust your tests and what a mistake costs.",
          terms: [
            "continuous-delivery",
            "continuous-deployment",
            "deployment-pipeline",
            "lead-time",
            "change-board",
          ],
        },
        {
          slug: "release-strategies",
          title: "Release strategies",
          summary: "Recreate, rolling, blue-green, canary and shadow releases.",
          minutes: 25,
          signature: "Release a buggy version five ways and compare how many users each one hurts",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Blue-green and instant switch-back",
            "Canary releases measured against the old version",
            "Cost and complexity of each strategy",
          ],
          status: "live",
          level: "core",
          prerequisites: ["delivery-vs-deployment"],
          plain:
            "There are several ways to swap an old version for a new one. Some replace everything at once; others send a few users to the new version first and watch what happens. The careful ways limit how many people a bad release can hurt.",
          terms: [
            "blue-green",
            "canary-release",
            "shadow-traffic",
            "progressive-delivery",
            "feature-flag",
          ],
        },
        {
          slug: "feature-flags",
          title: "Feature flags",
          summary:
            "Deploy code switched off, then release it gradually, separately from deploying.",
          minutes: 25,
          signature:
            "Roll a new checkout out to 1%, 10% and 50% of users, hit a bug, and switch it off without a deploy",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Deploying vs releasing",
            "Percentage rollouts, targeting and kill switches",
            "Flag debt and cleaning up",
          ],
          status: "live",
          level: "core",
          prerequisites: ["release-strategies"],
          plain:
            "A feature flag is a switch in the code that turns a feature on or off without shipping new code. Teams deploy unfinished work switched off, then turn it on for a few users at a time, and can turn it off instantly if it misbehaves.",
          terms: ["feature-flag", "kill-switch", "flag-debt", "progressive-delivery"],
        },
        {
          slug: "schema-migrations",
          title: "Database changes without downtime",
          summary: "Expand and contract: changing a schema while old and new code both run.",
          minutes: 25,
          signature:
            "Rename a column in a live database and break the old version mid-rollout, then do it in expand-and-contract steps",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Old and new code run at the same time",
            "Expand, migrate, contract",
            "Migrations as versioned, automated steps",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["release-strategies"],
          plain:
            "During a release, the old and new versions of an app run side by side against the same database. A schema change that suits only the new version breaks the old one. The fix is to change the database in small steps that both versions can live with.",
          terms: ["schema-migration", "expand-contract", "backfill", "rollback"],
        },
        {
          slug: "rollbacks",
          title: "Rollback and roll forward",
          summary: "Undo a bad release fast, automatically where you can.",
          minutes: 20,
          signature:
            "A release starts failing at 6 p.m.: roll back, roll forward or flip a flag, and see how long users suffer each way",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "Rollback vs roll forward vs flag off",
            "Automated rollback on health signals",
            "What can't be rolled back",
          ],
          status: "live",
          level: "core",
          prerequisites: ["feature-flags", "schema-migrations"],
          plain:
            "Every release can go wrong, so the real question is how fast you can undo it. Going back to the last good version is usually quickest; fixing forward is sometimes the only option, for example after a database change. The best pipelines watch the release and undo it on their own.",
          terms: [
            "rollback",
            "compensating-action",
            "recovery-time",
            "kill-switch",
            "feature-flag",
          ],
        },
      ],
    },
    {
      slug: "supply-chain",
      title: "Securing the pipeline",
      summary: "The pipeline holds the keys to production; protect it like production.",
      modules: [
        {
          slug: "pipeline-secrets",
          title: "Secrets and identity in pipelines",
          summary: "Short-lived credentials through OIDC instead of long-lived keys.",
          minutes: 25,
          signature:
            "A pull request from a stranger tries to read your cloud keys; close every way in",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Why pipelines are a prime target",
            "OIDC federation and short-lived credentials",
            "Least privilege and untrusted code in CI",
          ],
          status: "live",
          level: "core",
          prerequisites: ["pipeline-anatomy"],
          plain:
            "A pipeline that deploys to production needs permission to do so, which makes it a favourite target for attackers. Instead of storing long-lived passwords in the pipeline, modern setups let the pipeline prove who it is and get a key that expires in minutes.",
          terms: ["pipeline-secret", "oidc-federation", "least-privilege", "secret-scanning"],
        },
        {
          slug: "software-supply-chain",
          title: "Software supply chain security",
          summary:
            "Dependencies, SBOMs, signing and provenance, and the attacks that made them matter.",
          minutes: 30,
          signature:
            "Trace four real attacks through a build pipeline and place the defence that would have stopped each",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Dependency and build-system attacks",
            "SBOMs and vulnerability scanning",
            "Signing, provenance and SLSA",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["pipeline-secrets", "artifacts-versioning"],
          plain:
            "Most of the code you ship was written by someone else, and your build tools could be tampered with too. Supply chain security means knowing exactly what went into each artifact, checking it for known problems, and being able to prove it was built by your pipeline and not altered since.",
          terms: ["supply-chain", "sbom", "provenance", "slsa", "lockfile"],
        },
      ],
    },
    {
      slug: "in-practice",
      title: "In practice",
      summary: "Measure delivery, choose a platform, put it all together.",
      modules: [
        {
          slug: "dora-metrics",
          title: "Measuring delivery",
          summary: "The DORA measures: throughput and stability together.",
          minutes: 20,
          signature:
            "Compare two teams on deployment frequency, lead time, failure rate and recovery time, and see why speed and stability go together",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "The DORA software delivery measures",
            "Throughput and stability are not a trade-off",
            "Measuring without gaming the numbers",
          ],
          status: "live",
          level: "core",
          prerequisites: ["rollbacks"],
          plain:
            "Years of research by the DORA programme found a few measures that describe how well a team delivers software: how often it releases, how long a change takes to reach users, how often releases fail and how quickly it recovers. Teams that are fast also tend to be stable.",
          terms: ["dora", "lead-time", "deployment-frequency", "change-fail-rate", "recovery-time"],
        },
        {
          slug: "ci-platforms",
          title: "CI/CD platforms compared",
          summary:
            "GitHub Actions, GitLab, Jenkins, Azure Pipelines, CircleCI, Buildkite and the clouds' own.",
          minutes: 25,
          signature:
            "Price a month of builds on hosted and self-hosted runners, and pick a platform for three different teams",
          formats: ["animated-infographic", "simulation", "checkpoint"],
          concepts: [
            "Hosted vs self-hosted runners",
            "How the platforms differ",
            "What builds really cost",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["pipeline-speed"],
          plain:
            "Many products can run your pipelines. They differ in where the code lives, who runs the machines, how pipelines are written and how you pay. The right choice usually follows where your code already is.",
          terms: ["hosted-runner", "self-hosted-runner", "runner", "pipeline"],
        },
        {
          slug: "capstone-cicd",
          title: "Capstone: a pipeline for a payments app",
          summary: "Design the pipeline, then see what it lets through.",
          minutes: 40,
          signature:
            "Make the choices for a payments app's delivery pipeline, then face a bad commit, a poisoned dependency and a failed migration",
          formats: ["branching-scenario", "build-connect", "checkpoint"],
          concepts: ["Designing a delivery pipeline end to end"],
          status: "live",
          level: "applied",
          prerequisites: ["quality-gates", "rollbacks", "software-supply-chain"],
          plain:
            "Everything in this track in one design. You'll choose how a payments app goes from commit to production, then see how your pipeline copes when things go wrong.",
          terms: [
            "trunk-based-development",
            "quality-gate",
            "artifact",
            "canary-release",
            "feature-flag",
            "expand-contract",
            "oidc-federation",
            "supply-chain",
          ],
        },
      ],
    },
  ],
};

const observability: Track = {
  slug: "observability",
  title: "Observability",
  area: "Platform & cloud",
  category: "platform-cloud",
  tagline: "Metrics, logs, traces and SLOs in depth.",
  description:
    "How to see what a running system is doing and why: metrics and their types, percentiles and histograms, cardinality, the golden signals, structured logs and log pipelines, distributed tracing and sampling, profiling, OpenTelemetry, service level objectives and error budgets, alerting, dashboards, incident response, postmortems and the cost of it all. Vendor-neutral: OpenTelemetry, Prometheus, Grafana, Loki, Tempo, Jaeger and Elastic alongside Datadog, New Relic, Honeycomb, Splunk and the clouds' own tools. By the end you can instrument a service, set sensible targets and find out why it's slow at 3 a.m.",
  accent: "signal",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why seeing inside a system matters, and where the data comes from.",
      modules: [
        {
          slug: "why-observability",
          title: "Why observability",
          summary: "From 'is it up?' to 'why is it slow for these users?'.",
          minutes: 20,
          signature:
            "Live through a 3 a.m. incident with only a CPU graph, then again with metrics, logs and traces that answer new questions",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "Monitoring vs observability",
            "Known unknowns and unknown unknowns",
            "Telemetry is a product decision",
          ],
          status: "live",
          level: "beginner",
          plain:
            "Monitoring tells you when something you predicted goes wrong. Observability means collecting enough detail about a running system that you can ask questions you didn't think of in advance, like why checkout is slow only for one bank's customers.",
          terms: ["observability", "monitoring", "telemetry", "metric", "log", "trace"],
        },
        {
          slug: "signals-overview",
          title: "Metrics, logs and traces",
          summary: "Three kinds of telemetry, what each is good for and what each costs.",
          minutes: 20,
          signature:
            "Investigate the same slow request three ways and see what each signal can and can't tell you",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Metrics: cheap numbers over time",
            "Logs: detailed events",
            "Traces: one request's journey",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-observability"],
          plain:
            "Metrics are numbers counted over time, like requests per second. Logs are written records of individual events. Traces follow one request as it passes through many services. Each answers different questions at a different cost.",
          terms: ["metric", "log", "trace", "span", "exemplar", "semantic-conventions"],
        },
        {
          slug: "opentelemetry",
          title: "Instrumentation and OpenTelemetry",
          summary:
            "Getting telemetry out of code: auto and manual instrumentation, the SDK, the Collector.",
          minutes: 25,
          signature:
            "Instrument a small service, send its telemetry through an OpenTelemetry Collector, and switch backends without touching the code",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Automatic vs manual instrumentation",
            "API, SDK, OTLP and the Collector",
            "Vendor-neutral telemetry",
          ],
          status: "live",
          level: "core",
          prerequisites: ["signals-overview"],
          plain:
            "Code has to be instrumented to produce telemetry. OpenTelemetry is the open standard for doing it once, in any language, and sending the data to whichever tool you choose, so changing vendors doesn't mean rewriting code.",
          terms: [
            "instrumentation",
            "opentelemetry",
            "otlp",
            "otel-collector",
            "auto-instrumentation",
            "span",
          ],
        },
      ],
    },
    {
      slug: "metrics",
      title: "Metrics",
      summary: "Counting, measuring and summarising, cheaply and correctly.",
      modules: [
        {
          slug: "metric-types",
          title: "Counters, gauges and histograms",
          summary: "The metric types, rates, and how Prometheus collects them.",
          minutes: 25,
          signature:
            "Watch a counter, a gauge and a histogram react to the same traffic, then turn a counter into a rate",
          formats: ["simulation", "checkpoint"],
          concepts: ["Metric types", "Rates from counters", "Pull (scrape) vs push"],
          status: "live",
          level: "core",
          prerequisites: ["signals-overview"],
          plain:
            "A counter only goes up, like total requests; a gauge goes up and down, like memory in use; a histogram sorts measurements into buckets, like how many requests took under 100 ms. Most useful numbers, such as requests per second, are calculated from these.",
          terms: ["metric", "counter", "gauge", "histogram", "prometheus"],
        },
        {
          slug: "percentiles",
          title: "Averages lie: percentiles",
          summary: "p50, p95, p99, why the tail matters and why you can't average percentiles.",
          minutes: 25,
          signature:
            "Find the slow requests an average hides, then see how bucket choices change the p99 you report",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Why averages mislead",
            "Percentiles and the long tail",
            "Histogram buckets and aggregation",
          ],
          status: "live",
          level: "core",
          prerequisites: ["metric-types"],
          plain:
            "An average response time of 200 ms can hide one request in a hundred taking five seconds. Percentiles say what the slowest 5% or 1% of users actually experience, which is usually what matters.",
          terms: ["percentile", "tail-latency", "histogram"],
        },
        {
          slug: "cardinality",
          title: "Labels and cardinality",
          summary: "Why one innocent label can multiply your metrics bill a thousand times.",
          minutes: 20,
          signature:
            "Add labels to a metric one at a time and watch the number of time series, and the bill, explode",
          formats: ["simulation", "checkpoint"],
          concepts: ["Labels and time series", "Cardinality explosions", "Metrics vs events"],
          status: "live",
          level: "core",
          prerequisites: ["metric-types"],
          plain:
            "Each combination of label values creates a separate time series to store. Labelling requests by endpoint is fine; labelling them by user ID creates millions of series and can bring a metrics system down.",
          terms: ["cardinality", "label", "time-series", "metric"],
        },
        {
          slug: "golden-signals",
          title: "The golden signals",
          summary: "Latency, traffic, errors, saturation; RED for services, USE for resources.",
          minutes: 20,
          signature: "Diagnose three sick services from four numbers each",
          formats: ["branching-scenario", "checkpoint"],
          concepts: ["The four golden signals", "RED and USE methods", "Symptoms vs causes"],
          status: "live",
          level: "core",
          prerequisites: ["percentiles"],
          plain:
            "A few measurements tell you most of what you need about any service: how slow it is, how busy it is, how often it fails and how full it is. Start every dashboard and investigation with these.",
          terms: ["golden-signals", "saturation", "red-method", "use-method", "latency"],
        },
      ],
    },
    {
      slug: "logs-traces",
      title: "Logs and traces",
      summary: "Detailed records of events, and of requests crossing services.",
      modules: [
        {
          slug: "structured-logging",
          title: "Structured logs",
          summary:
            "Logs a machine can query: fields, levels, correlation IDs, and what never to log.",
          minutes: 20,
          signature:
            "Search a pile of free-text logs for one customer's failed payment, then do it with structured logs",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Structured vs free-text logs",
            "Levels and correlation IDs",
            "Personal data and secrets in logs",
          ],
          status: "live",
          level: "core",
          prerequisites: ["signals-overview"],
          plain:
            "A log line written as a sentence is easy for people and hard for machines. Writing each event as named fields (time, level, order ID, error) lets you search and count them, and following one ID ties a request's lines together.",
          terms: ["structured-log", "correlation-id", "log-level", "log", "trace"],
        },
        {
          slug: "log-pipelines",
          title: "Log pipelines and storage",
          summary: "Collecting, parsing, indexing and keeping logs without going broke.",
          minutes: 25,
          signature:
            "Route a day of logs through agents and a pipeline, choose what to index and keep, and see the cost change",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Agents and collectors",
            "Full-text indexing vs label indexing",
            "Retention tiers and sampling",
          ],
          status: "live",
          level: "core",
          prerequisites: ["structured-logging"],
          plain:
            "Logs have to be collected from every machine, cleaned up and stored somewhere searchable. Indexing every word is powerful and expensive; keeping recent logs hot and older ones in cheap storage keeps the bill sane.",
          terms: ["log-pipeline", "retention", "otel-collector", "log"],
        },
        {
          slug: "distributed-tracing",
          title: "Distributed tracing",
          summary: "Spans, trace IDs, context propagation and reading a waterfall.",
          minutes: 25,
          signature:
            "Follow one slow checkout across six services in a trace waterfall and find the span to blame",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Traces and spans",
            "Context propagation (traceparent)",
            "Reading a waterfall",
          ],
          status: "live",
          level: "core",
          prerequisites: ["signals-overview"],
          plain:
            "When one request passes through many services, a trace records each step as a span with its start and end time. Lined up in a waterfall, they show exactly where the time went.",
          terms: ["trace", "span", "context-propagation", "traceparent", "critical-path"],
        },
        {
          slug: "trace-sampling",
          title: "Sampling traces",
          summary:
            "Head and tail sampling, keeping the interesting traces and linking them to metrics.",
          minutes: 20,
          signature:
            "Keep 1% of traces and lose the one that mattered, then switch to tail sampling and keep every error",
          formats: ["simulation", "checkpoint"],
          concepts: ["Head vs tail sampling", "Keeping errors and slow requests", "Exemplars"],
          status: "live",
          level: "deep",
          prerequisites: ["distributed-tracing"],
          plain:
            "Recording every trace of a busy system is expensive, so most teams keep a sample. Deciding at the start is cheap but random; deciding at the end lets you keep every slow or failed request.",
          terms: ["head-sampling", "tail-sampling", "exemplar", "trace"],
        },
        {
          slug: "profiling",
          title: "Continuous profiling",
          summary: "Flame graphs: which lines of code burn the CPU and memory.",
          minutes: 20,
          signature: "Read a flame graph of a slow service and find the function eating the CPU",
          formats: ["step-through", "checkpoint"],
          concepts: ["Profiles and flame graphs", "Always-on profiling", "eBPF"],
          status: "live",
          level: "deep",
          prerequisites: ["distributed-tracing"],
          plain:
            "A profile shows where a program spends its time and memory, function by function. Continuous profiling samples production all the time at low cost, so you can see what the code was doing when it got slow.",
          terms: ["profile", "flame-graph", "continuous-profiling"],
        },
      ],
    },
    {
      slug: "reliability-targets",
      title: "Reliability targets",
      summary: "Decide how reliable is reliable enough, and act on it.",
      modules: [
        {
          slug: "slis-slos",
          title: "SLIs and SLOs",
          summary: "Measure what users feel, and set a target that isn't 100%.",
          minutes: 25,
          signature:
            "Pick the right indicator for a checkout journey and see what 99%, 99.9% and 99.99% really allow",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Service level indicators from user journeys",
            "Objectives and the nines",
            "SLAs are a different thing",
          ],
          status: "live",
          level: "core",
          prerequisites: ["golden-signals"],
          plain:
            "A service level indicator measures something users care about, like the share of payments that succeed within two seconds. An objective is the target for it, such as 99.9% over 28 days. No system is 100% reliable, and trying costs too much.",
          terms: ["sli", "slo", "sla", "percentile"],
        },
        {
          slug: "error-budgets",
          title: "Error budgets",
          summary: "The unreliability you can afford, and what to do when it runs out.",
          minutes: 20,
          signature:
            "Spend a month's error budget on releases and incidents, then decide what the policy says to do",
          formats: ["simulation", "checkpoint"],
          concepts: ["Error budgets", "Burn rate", "Error budget policies"],
          status: "live",
          level: "core",
          prerequisites: ["slis-slos"],
          plain:
            "If the target is 99.9%, the other 0.1% is a budget for things going wrong: risky releases, incidents, maintenance. While budget remains, ship freely; when it's spent, slow down and fix reliability.",
          terms: ["error-budget", "burn-rate", "error-budget-policy", "slo"],
        },
        {
          slug: "alerting",
          title: "Alerting that works",
          summary: "Page on symptoms, use burn rates, and stop alert fatigue.",
          minutes: 25,
          signature:
            "Tune alerts for a week of traffic: too many pages, too few, then multi-window burn-rate alerts",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Symptom vs cause alerts",
            "Multi-window, multi-burn-rate alerts",
            "Alert fatigue and on-call health",
          ],
          status: "live",
          level: "core",
          prerequisites: ["error-budgets"],
          plain:
            "An alert should wake someone only when users are being hurt and a person needs to act. Alerting on how fast the error budget is burning catches real problems quickly without paging for every blip.",
          terms: ["burn-rate", "burn-rate-alert", "alert-fatigue", "slo", "golden-signals"],
        },
        {
          slug: "dashboards",
          title: "Dashboards that answer questions",
          summary: "From walls of graphs to dashboards built for a purpose.",
          minutes: 20,
          signature:
            "Redesign a 40-panel dashboard so an on-call engineer can answer 'are users OK?' in five seconds",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Dashboards for a question",
            "Layout and drill-down",
            "Avoiding misleading charts",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["golden-signals"],
          plain:
            "A good dashboard answers a specific question for a specific person, top to bottom: are users OK, and if not, where? Forty unlabelled graphs answer nothing at 3 a.m.",
          terms: ["dashboard", "golden-signals", "percentile"],
        },
      ],
    },
    {
      slug: "operating",
      title: "Operating",
      summary: "Incidents, learning from them, and paying for it all.",
      modules: [
        {
          slug: "investigation",
          title: "Debugging with telemetry",
          summary: "From an alert to a cause: metrics, then traces, then logs.",
          minutes: 25,
          signature:
            "Work an incident from page to root cause, choosing which signal to look at next",
          formats: ["branching-scenario", "checkpoint"],
          concepts: [
            "Start broad, then narrow",
            "Slicing by attributes",
            "Hypotheses and evidence",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["golden-signals", "distributed-tracing", "structured-logging"],
          plain:
            "Finding the cause of a problem is a loop: look at a broad signal, form a guess, narrow down with more detailed data, check the guess. Moving smoothly from a graph to the traces and logs behind it is what good telemetry makes possible.",
          terms: ["core-analysis-loop", "mitigation", "golden-signals", "trace", "structured-log"],
        },
        {
          slug: "incident-response",
          title: "Incident response",
          summary: "Roles, communication and calm when production is on fire.",
          minutes: 20,
          signature:
            "Run a payments outage as incident commander: assign roles, update customers, decide when it's over",
          formats: ["branching-scenario", "checkpoint"],
          concepts: ["Incident roles", "Severity and communication", "Mitigate first"],
          status: "live",
          level: "core",
          prerequisites: ["alerting"],
          plain:
            "When something big breaks, a clear structure helps: one person coordinates, others investigate, someone keeps customers and colleagues informed. The first goal is to stop the harm, not to find the root cause.",
          terms: ["incident", "incident-commander", "severity", "mitigation"],
        },
        {
          slug: "postmortems",
          title: "Blameless postmortems",
          summary: "Learning from incidents without blaming people.",
          minutes: 20,
          signature:
            "Rewrite a blaming incident report into a blameless one and pick the action items that actually help",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Blameless culture",
            "Timelines and contributing factors",
            "Action items that stick",
          ],
          status: "live",
          level: "core",
          prerequisites: ["incident-response"],
          plain:
            "After an incident, the team writes down what happened and why, focusing on how the system and processes allowed it rather than who made a mistake. People only share the truth when they won't be punished for it.",
          terms: ["postmortem", "contributing-factor", "hindsight-bias", "incident"],
        },
        {
          slug: "observability-cost",
          title: "Observability platforms and cost",
          summary: "Open-source stacks and vendors compared, and how to keep the bill in check.",
          minutes: 25,
          signature:
            "Price the same telemetry on a self-hosted stack and several vendors, then cut the bill without going blind",
          formats: ["animated-infographic", "simulation", "checkpoint"],
          concepts: [
            "Open-source stacks and vendors",
            "What drives the bill",
            "Sampling, retention and dropping",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["cardinality", "log-pipelines", "trace-sampling"],
          plain:
            "Telemetry can cost as much as the systems it watches. Prices depend on how much data you send, how long you keep it and how many series or hosts you have, so choosing what to collect matters as much as which tool you pick.",
          terms: [
            "ingestion",
            "cardinality",
            "tail-sampling",
            "retention",
            "vendor-lock-in",
            "object-storage",
          ],
        },
        {
          slug: "capstone-observability",
          title: "Capstone: observing a payments platform",
          summary: "Instrument it and set its targets, then see what you'd catch.",
          minutes: 40,
          signature:
            "Make the observability choices for a payments platform, then face a slow bank, a silent failure and a 3 a.m. page storm",
          formats: ["branching-scenario", "build-connect", "checkpoint"],
          concepts: ["Designing observability end to end"],
          status: "live",
          level: "applied",
          prerequisites: ["slis-slos", "alerting", "investigation"],
          plain:
            "Everything in this track in one design. You'll choose how to observe a payments platform, then see whether you'd notice, understand and fix what goes wrong.",
          terms: [
            "technical-decline",
            "business-decline",
            "opentelemetry",
            "sli",
            "slo",
            "cardinality",
          ],
        },
      ],
    },
  ],
};

const apiDesign: Track = {
  slug: "api-design",
  title: "API Design",
  area: "Architecture",
  category: "architecture",
  tagline: "Resources, versions, pagination and contracts.",
  description:
    "How to design APIs other people can rely on: HTTP from the ground up, REST resources, status codes and errors, payload design, pagination, idempotency, OpenAPI contracts, versioning and deprecation, gRPC, GraphQL, webhooks, real-time APIs, authentication with OAuth and tokens, API security, rate limits, caching, gateways and developer experience. Vendor-neutral: open standards (HTTP RFCs, OpenAPI, AsyncAPI, OAuth) alongside gateways from AWS, Google Cloud, Azure, Kong and others. By the end you can design, document and evolve an API without breaking the people who depend on it.",
  accent: "contract",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "What an API is, the HTTP underneath, and the main styles.",
      modules: [
        {
          slug: "what-is-an-api",
          title: "What an API is",
          summary: "A promise between programs, and why breaking it hurts.",
          minutes: 20,
          signature:
            "Follow one tap in a food-delivery app through the APIs it calls, then see what happens when one of them quietly changes",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "An API is a contract",
            "Clients you don't control",
            "Design for the consumer",
          ],
          status: "live",
          level: "beginner",
          plain:
            "An API (application programming interface) is how one program asks another for something: a menu of requests it accepts and the answers it promises to give. Once other people's code depends on it, changing it carelessly breaks their software.",
          terms: ["api", "api-contract", "api-consumer", "api-first"],
        },
        {
          slug: "http-basics",
          title: "HTTP from the ground up",
          summary: "Requests, responses, methods, status codes and headers.",
          minutes: 25,
          signature: "Build an HTTP request piece by piece and watch the server's response change",
          formats: ["step-through", "checkpoint"],
          concepts: ["Request and response", "Methods, status codes, headers", "Statelessness"],
          status: "live",
          level: "beginner",
          prerequisites: ["what-is-an-api"],
          plain:
            "Most APIs on the web travel over HTTP, the same protocol your browser uses. A request names a method (like GET or POST), a path and some headers; the response comes back with a status code, headers and usually a body.",
          terms: ["http", "http-method", "http-header", "status-code", "safe-method", "idempotent"],
        },
        {
          slug: "api-styles",
          title: "REST, RPC, GraphQL and events",
          summary: "Four ways to shape an API, and when each fits.",
          minutes: 25,
          signature:
            "Match six real integrations to REST, gRPC, GraphQL or webhooks and see the trade-offs",
          formats: ["animated-infographic", "build-connect", "checkpoint"],
          concepts: ["Resources vs procedures", "Query languages", "Push vs pull"],
          status: "live",
          level: "beginner",
          prerequisites: ["http-basics"],
          plain:
            "There's more than one style of API. REST organises everything as resources with URLs, RPC calls named functions, GraphQL lets the client ask for exactly the fields it wants, and event-driven APIs push messages when something happens.",
          terms: ["rest", "rpc", "graphql", "webhook", "api"],
        },
      ],
    },
    {
      slug: "resources",
      title: "Designing REST APIs",
      summary: "Resources, methods, errors and the shape of the data.",
      modules: [
        {
          slug: "resources-urls",
          title: "Resources and URLs",
          summary: "Nouns, collections and sensible paths.",
          minutes: 25,
          signature: "Redesign a messy set of endpoints for a library into clean resources",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Resources and collections", "Nesting and identifiers", "Naming conventions"],
          status: "live",
          level: "core",
          prerequisites: ["api-styles"],
          plain:
            "A REST API is organised around things (books, members, loans) rather than actions. Each thing gets a URL, collections hold many of them, and the HTTP method says what you want to do.",
          terms: ["resource", "url", "collection", "hateoas", "rest"],
        },
        {
          slug: "methods-errors",
          title: "Methods, status codes and errors",
          summary: "Saying what happened, in a way programs understand.",
          minutes: 25,
          signature:
            "Answer twelve requests with the right status code, then turn vague errors into useful ones",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Safe and idempotent methods",
            "Choosing status codes",
            "Problem Details errors",
          ],
          status: "live",
          level: "core",
          prerequisites: ["resources-urls"],
          plain:
            "Each HTTP method has a meaning (GET reads, DELETE removes) and each response carries a status code (200 OK, 404 Not Found, 503 unavailable). Good errors also say clearly what went wrong and what to do about it, in a standard machine-readable form.",
          terms: ["status-code", "problem-details", "idempotent", "http-method"],
        },
        {
          slug: "payload-design",
          title: "Request and response design",
          summary: "JSON shapes that are easy to use and hard to misuse.",
          minutes: 20,
          signature:
            "Fix a payment response full of traps: floating-point money, ambiguous dates and mystery nulls",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Consistent naming", "Dates, money and IDs", "Nulls, enums and envelopes"],
          status: "live",
          level: "core",
          prerequisites: ["resources-urls"],
          plain:
            "The data an API sends back is part of its contract. Small choices, like how money, dates and missing values are written, decide whether every client gets it right or each one has to guess.",
          terms: ["json", "enum", "api-contract"],
        },
        {
          slug: "pagination",
          title: "Pagination, filtering and sorting",
          summary: "Handing over a million rows, a page at a time.",
          minutes: 25,
          signature:
            "Page through a changing list with offsets and with cursors, and watch rows go missing or repeat",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Offset vs cursor pagination",
            "Filtering and sorting",
            "Consistency while paging",
          ],
          status: "live",
          level: "core",
          prerequisites: ["resources-urls"],
          plain:
            "No API returns a million records at once. Pagination splits results into pages; how you mark your place (a page number or a cursor) decides whether items get skipped or duplicated when the data changes underneath you.",
          terms: ["pagination", "cursor", "collection"],
        },
        {
          slug: "idempotency",
          title: "Idempotency and safe retries",
          summary: "Making it safe to press 'pay' twice.",
          minutes: 25,
          signature: "Retry a payment through a flaky network with and without an idempotency key",
          formats: ["simulation", "checkpoint"],
          concepts: ["Why retries happen", "Idempotent methods", "Idempotency keys"],
          status: "live",
          level: "core",
          prerequisites: ["methods-errors"],
          plain:
            "Networks fail mid-request, so clients retry, and a retried payment must not charge twice. An idempotent operation gives the same result however many times it runs; idempotency keys make that possible even for actions like payments.",
          terms: ["idempotent", "idempotency-key", "http-method"],
        },
      ],
    },
    {
      slug: "contracts",
      title: "Contracts and change",
      summary: "Describing an API precisely, and changing it without breaking anyone.",
      modules: [
        {
          slug: "openapi",
          title: "OpenAPI and contract-first design",
          summary: "One description for docs, mocks, tests and code.",
          minutes: 25,
          signature:
            "Write a small OpenAPI description and watch docs, a mock server and a client appear from it",
          formats: ["step-through", "build-connect", "checkpoint"],
          concepts: [
            "Machine-readable contracts",
            "Design first vs code first",
            "Generating docs, mocks and clients",
          ],
          status: "live",
          level: "core",
          prerequisites: ["payload-design"],
          plain:
            "OpenAPI is a standard way to write down exactly what an API accepts and returns. From one description you can generate documentation, mock servers, tests and client code, and agree the design before anyone builds it.",
          terms: ["openapi", "api-contract", "api-first"],
        },
        {
          slug: "versioning",
          title: "Versioning and breaking changes",
          summary: "Which changes break clients, and what to do about it.",
          minutes: 25,
          signature:
            "Sort twelve proposed changes into safe and breaking, then ship them without a single client failing",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Breaking vs additive changes",
            "Versioning in the URL, header or date",
            "Tolerant readers",
          ],
          status: "live",
          level: "core",
          prerequisites: ["openapi"],
          plain:
            "Some changes to an API are harmless (adding a field) and some break every client (renaming one). Versioning lets old and new contracts live side by side while clients move over at their own pace.",
          terms: ["breaking-change", "api-versioning", "api-contract"],
        },
        {
          slug: "deprecation",
          title: "Deprecation and lifecycle",
          summary: "Retiring an API version without surprising anyone.",
          minutes: 20,
          signature:
            "Run a twelve-month sunset for an old API version and see which clients you'd strand",
          formats: ["simulation", "checkpoint"],
          concepts: ["Deprecation and Sunset headers", "Usage tracking", "Communicating change"],
          status: "live",
          level: "applied",
          prerequisites: ["versioning"],
          plain:
            "Old versions can't live forever, but switching them off suddenly breaks people's software. A good retirement announces the date early, signals it in the API itself, tracks who still calls it, and helps them move.",
          terms: ["deprecation", "sunset", "api-versioning", "breaking-change"],
        },
      ],
    },
    {
      slug: "beyond-rest",
      title: "Beyond REST",
      summary: "Binary RPC, flexible queries, push and real time.",
      modules: [
        {
          slug: "grpc",
          title: "gRPC and Protocol Buffers",
          summary: "Fast, typed calls between services.",
          minutes: 25,
          signature:
            "Change a Protocol Buffers message and see which old clients still read it correctly",
          formats: ["step-through", "simulation", "checkpoint"],
          concepts: ["Schemas and field numbers", "Streaming calls", "Compatibility rules"],
          status: "live",
          level: "core",
          prerequisites: ["api-styles"],
          plain:
            "gRPC lets one service call a function on another as if it were local. Messages are defined in Protocol Buffers, a compact binary format with numbered fields, which is quick to send and stays compatible if you follow a few rules.",
          terms: ["grpc", "protobuf", "rpc", "breaking-change"],
        },
        {
          slug: "graphql",
          title: "GraphQL",
          summary: "Ask for exactly what you need, and the costs that come with it.",
          minutes: 25,
          signature:
            "Build a GraphQL query for a screen, then watch an innocent query explode into thousands of database calls",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Schemas and queries",
            "Over- and under-fetching",
            "N+1 and query cost limits",
          ],
          status: "live",
          level: "core",
          prerequisites: ["api-styles"],
          plain:
            "With GraphQL the client sends a query describing the exact fields it wants and gets back just those, in one round trip. The flexibility moves work to the server, which then has to guard against slow or very expensive queries.",
          terms: ["graphql", "resolver", "rest"],
        },
        {
          slug: "webhooks",
          title: "Webhooks and async APIs",
          summary: "Telling clients when something happens.",
          minutes: 25,
          signature:
            "Deliver payment webhooks through failures: retries, duplicates, out-of-order events and a forged request",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: [
            "Polling vs webhooks",
            "Signing and verifying",
            "Retries, duplicates and ordering",
          ],
          status: "live",
          level: "core",
          prerequisites: ["idempotency"],
          plain:
            "Instead of clients asking 'anything new?' every few seconds, a webhook calls the client's own URL when something happens, like a payment succeeding. That means handling retries, duplicates and checking the message really came from you.",
          terms: ["webhook", "polling", "hmac", "idempotency-key"],
        },
        {
          slug: "realtime",
          title: "Real-time APIs",
          summary: "Polling, server-sent events and WebSockets.",
          minutes: 20,
          signature:
            "Stream live match scores with polling, long polling, server-sent events and WebSockets and compare the cost",
          formats: ["simulation", "checkpoint"],
          concepts: ["Polling and long polling", "Server-sent events", "WebSockets"],
          status: "live",
          level: "core",
          prerequisites: ["http-basics"],
          plain:
            "Some apps need updates the moment they happen: chat, live scores, ride tracking. Polling asks repeatedly, server-sent events keep one response open for the server to stream into, and WebSockets open a two-way channel.",
          terms: ["sse", "websocket", "polling", "http"],
        },
      ],
    },
    {
      slug: "security-ops",
      title: "Security and operations",
      summary: "Who may call, how often, how fast, and how people find out.",
      modules: [
        {
          slug: "authentication",
          title: "Authentication: keys, OAuth and tokens",
          summary: "Proving who is calling.",
          minutes: 30,
          signature:
            "Step through an OAuth 2.0 sign-in with PKCE, then decode a token and spot what's wrong with it",
          formats: ["step-through", "checkpoint"],
          concepts: ["API keys", "OAuth 2.0 and OpenID Connect", "Access tokens and JWTs"],
          status: "live",
          level: "core",
          prerequisites: ["http-basics"],
          plain:
            "APIs need to know who is calling. Simple ones use an API key; when a user lets an app act on their behalf, OAuth 2.0 issues the app a short-lived access token instead of handing over the user's password.",
          terms: ["authentication", "oauth", "access-token", "pkce", "jwt"],
        },
        {
          slug: "api-security",
          title: "Authorisation and API security",
          summary: "The ways APIs really get breached.",
          minutes: 25,
          signature:
            "Attack a sample API the way the OWASP API Top 10 describes, then fix each hole",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Object-level authorisation",
            "Mass assignment and data exposure",
            "Input validation",
          ],
          status: "live",
          level: "core",
          prerequisites: ["authentication"],
          plain:
            "Knowing who's calling isn't enough; every request must also check they're allowed to touch that particular record. Most API breaches come from missing checks like that, not from clever cryptography.",
          terms: ["bola", "mass-assignment", "authentication"],
        },
        {
          slug: "rate-limits",
          title: "Rate limits and quotas",
          summary: "Protecting the API, fairly.",
          minutes: 20,
          signature:
            "Send traffic through a token bucket and a fixed window, and tell clients when to come back",
          formats: ["simulation", "checkpoint"],
          concepts: ["Limiting algorithms", "429 and Retry-After", "Quotas and fairness"],
          status: "live",
          level: "core",
          prerequisites: ["methods-errors"],
          plain:
            "Rate limits stop one client from overwhelming an API or using more than its share. A good limit tells the client clearly that it was limited and when it may try again.",
          terms: ["rate-limit", "token-bucket", "quota", "status-code"],
        },
        {
          slug: "api-performance",
          title: "Caching and performance",
          summary: "Faster responses, fewer bytes, less work.",
          minutes: 25,
          signature:
            "Fetch the same resource with and without ETags and Cache-Control, and count bytes and round trips",
          formats: ["simulation", "checkpoint"],
          concepts: ["Cache-Control", "ETags and conditional requests", "Compression and batching"],
          status: "live",
          level: "core",
          prerequisites: ["http-basics"],
          plain:
            "The fastest request is one you don't have to make. HTTP has built-in ways to cache responses and check whether they've changed, which cuts latency and load without changing what the API means.",
          terms: ["etag", "cache-control", "http-header"],
        },
        {
          slug: "gateways-dx",
          title: "Gateways and developer experience",
          summary: "Running APIs at scale, and making them pleasant to use.",
          minutes: 25,
          signature:
            "Put an API behind a gateway, then judge three developer portals by how fast a newcomer makes a first call",
          formats: ["animated-infographic", "build-connect", "checkpoint"],
          concepts: ["API gateways", "Documentation, SDKs and sandboxes", "Time to first call"],
          status: "live",
          level: "applied",
          prerequisites: ["rate-limits"],
          plain:
            "An API gateway sits in front of your services to handle sign-in, limits and routing in one place. But an API succeeds only if developers can understand it quickly: clear documentation, examples and a sandbox matter as much as the code.",
          terms: ["api-gateway", "developer-experience", "rate-limit", "openapi"],
        },
        {
          slug: "capstone-api",
          title: "Capstone: an API for a parcel service",
          summary: "Design it, publish it, then live with it for a year.",
          minutes: 40,
          signature:
            "Design a parcel-tracking API, then face a mobile app release, a partner's retry storm, a breaking change and a security report",
          formats: ["branching-scenario", "build-connect", "checkpoint"],
          concepts: ["Designing an API end to end"],
          status: "live",
          level: "applied",
          prerequisites: ["versioning", "idempotency", "api-security"],
          plain:
            "Everything in this track in one design. You'll make the key choices for a parcel-tracking API, then see how they hold up over a year of real use.",
          terms: ["api", "api-contract", "idempotency-key", "bola", "breaking-change"],
        },
      ],
    },
  ],
};

const databaseInternals: Track = {
  slug: "database-internals",
  title: "Database Internals",
  area: "Architecture",
  category: "architecture",
  tagline: "Pages, indexes, logs and transactions underneath SQL.",
  description:
    "What happens inside a database: storage hardware, pages and rows, row and column stores, the buffer pool, B-trees, LSM trees and other indexes, query planning, join algorithms and the optimiser, write-ahead logging and crash recovery, transactions, isolation levels, locking, MVCC, replication and distributed SQL. Vendor-neutral: PostgreSQL, MySQL/InnoDB, SQLite, SQL Server, Oracle, RocksDB and the managed cloud databases. By the end you can read a query plan, choose indexes, reason about concurrency bugs and diagnose a slow database.",
  accent: "ledger",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "What a database does with your query, and the hardware it works with.",
      modules: [
        {
          slug: "query-journey",
          title: "What happens when you run a query",
          summary: "From a line of SQL to rows on your screen.",
          minutes: 20,
          signature:
            "Follow one SELECT through the parser, planner, executor, buffer pool and disk",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "Parser, planner, executor",
            "Pages and the buffer pool",
            "Why internals matter",
          ],
          status: "live",
          level: "beginner",
          plain:
            "When you send SQL to a database, it doesn't just look things up. It checks the query, works out the cheapest way to answer it, then reads data in fixed-size blocks called pages, keeping recently used ones in memory.",
          terms: ["parser", "query-planner", "page", "buffer-pool", "index"],
        },
        {
          slug: "storage-hierarchy",
          title: "Memory, SSDs and disks",
          summary: "Why databases are designed around slow storage.",
          minutes: 20,
          signature:
            "Scale the latency ladder to human time, then see why reading a whole page costs the same as reading one row",
          formats: ["animated-infographic", "simulation", "checkpoint"],
          concepts: ["The latency ladder", "Pages and blocks", "Durability needs storage"],
          status: "live",
          level: "beginner",
          prerequisites: ["query-journey"],
          plain:
            "Memory is fast but forgets everything when the power goes; SSDs and disks remember but are thousands of times slower. Databases are built around this gap: they read and write whole pages and keep the busy ones in memory.",
          terms: ["page", "durability", "fsync", "buffer-pool"],
        },
      ],
    },
    {
      slug: "storage",
      title: "Storing data",
      summary: "How rows sit inside pages and files, and how memory caches them.",
      modules: [
        {
          slug: "pages-rows",
          title: "Pages and rows",
          summary: "Inside an 8 kB page.",
          minutes: 25,
          signature:
            "Insert, update and delete rows in a slotted page and watch free space, pointers and dead rows change",
          formats: ["simulation", "checkpoint"],
          concepts: ["Slotted pages", "Row identifiers", "Large values and free space"],
          status: "live",
          level: "core",
          prerequisites: ["storage-hierarchy"],
          plain:
            "A table is stored as a file of fixed-size pages. Each page holds a small directory of pointers at the front and the rows themselves packed from the back, so rows can move within a page without anything else changing.",
          terms: ["page", "slotted-page", "ctid", "heap"],
        },
        {
          slug: "row-vs-column",
          title: "Row stores and column stores",
          summary: "Storing data the way it's read.",
          minutes: 20,
          signature:
            "Run a checkout and a monthly report against row and column layouts and count the bytes each reads",
          formats: ["simulation", "checkpoint"],
          concepts: ["Row vs column layout", "OLTP vs analytics", "Compression"],
          status: "live",
          level: "core",
          prerequisites: ["pages-rows"],
          plain:
            "A row store keeps each record together, which is ideal for fetching or updating one order. A column store keeps each column together, which is ideal for adding up one column across millions of rows.",
          terms: ["row-store", "column-store", "oltp", "page"],
        },
        {
          slug: "buffer-pool",
          title: "The buffer pool",
          summary: "Keeping the right pages in memory.",
          minutes: 25,
          signature:
            "Run a busy workload through a small buffer pool with LRU and clock sweep, then watch one big scan flush it",
          formats: ["simulation", "checkpoint"],
          concepts: ["Cache hits and misses", "Eviction policies", "Dirty pages"],
          status: "live",
          level: "core",
          prerequisites: ["pages-rows"],
          plain:
            "Databases keep recently used pages in a region of memory called the buffer pool, so most reads never touch the disk. When it's full, something must be evicted, and the choice decides how fast the database feels.",
          terms: ["buffer-pool", "cache-hit", "eviction", "dirty-page", "page"],
        },
      ],
    },
    {
      slug: "indexes",
      title: "Indexes",
      summary: "Finding rows without reading everything.",
      modules: [
        {
          slug: "btrees",
          title: "B-trees",
          summary: "The structure behind almost every index.",
          minutes: 30,
          signature:
            "Insert keys into a B+tree, watch pages split and the tree grow upwards, then find one row in three page reads",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: ["Balanced trees of pages", "Splits and fan-out", "Range scans"],
          status: "live",
          level: "core",
          prerequisites: ["pages-rows"],
          plain:
            "A B-tree index is like a book's index arranged in levels: a few top pages point to many lower pages, which point to rows. Even a billion rows can be found in a handful of page reads.",
          terms: ["btree", "page-split", "index", "page"],
        },
        {
          slug: "using-indexes",
          title: "Using indexes well",
          summary: "When an index helps, and when it doesn't.",
          minutes: 25,
          signature:
            "Try queries against single, composite and covering indexes and watch the plan switch between index and table scans",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Selectivity",
            "Composite index column order",
            "Covering indexes and write cost",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["btrees"],
          plain:
            "An index only helps if the database decides it's cheaper than reading the table. Which columns it covers, in which order, and how many rows match all decide whether it's used, and every index slows down writes.",
          terms: ["composite-index", "covering-index", "selectivity", "index"],
        },
        {
          slug: "lsm-trees",
          title: "LSM trees",
          summary: "Built for fast writes.",
          minutes: 25,
          signature:
            "Write keys into a memtable, flush sorted files, then compact them, and see where a read has to look",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: ["Memtables and SSTables", "Compaction", "Bloom filters"],
          status: "live",
          level: "core",
          prerequisites: ["btrees"],
          plain:
            "Some databases never update data in place. They collect writes in memory, write them out as sorted files, and merge those files in the background. Writes become very fast; reads may have to check several files.",
          terms: ["lsm-tree", "memtable", "sstable", "compaction", "bloom-filter"],
        },
        {
          slug: "other-indexes",
          title: "Hash, inverted and vector indexes",
          summary: "Different questions need different indexes.",
          minutes: 20,
          signature: "Match six searches to hash, B-tree, inverted, spatial and vector indexes",
          formats: ["animated-infographic", "build-connect", "checkpoint"],
          concepts: ["Hash indexes", "Inverted indexes for text", "Vector and spatial indexes"],
          status: "live",
          level: "core",
          prerequisites: ["btrees"],
          plain:
            "B-trees are great for exact values and ranges, but other questions need other structures: hash indexes for exact matches, inverted indexes for words in text, and vector indexes for finding similar items.",
          terms: ["inverted-index", "vector-index", "btree", "index"],
        },
      ],
    },
    {
      slug: "queries",
      title: "Running queries",
      summary: "Turning SQL into a plan, and a plan into rows.",
      modules: [
        {
          slug: "query-planning",
          title: "Parsing and planning",
          summary: "How a database chooses a plan.",
          minutes: 25,
          signature: "Read an EXPLAIN plan node by node, then compare two plans for the same query",
          formats: ["step-through", "checkpoint"],
          concepts: ["Parse trees and plans", "EXPLAIN", "Scans and operators"],
          status: "live",
          level: "core",
          prerequisites: ["using-indexes"],
          plain:
            "SQL says what you want, not how to get it. The planner considers different ways to answer a query, such as which index to use and in what order to join tables, and picks the one it estimates is cheapest.",
          terms: ["query-plan", "explain", "query-planner", "index"],
        },
        {
          slug: "joins",
          title: "Join algorithms",
          summary: "Nested loops, hash joins and merge joins.",
          minutes: 25,
          signature: "Join orders to customers three ways and count the work as the tables grow",
          formats: ["simulation", "checkpoint"],
          concepts: ["Nested loop", "Hash join", "Merge join"],
          status: "live",
          level: "core",
          prerequisites: ["query-planning"],
          plain:
            "Combining two tables can be done in very different ways: for each row look up its match, build a hash table of one side, or walk two sorted lists together. The right choice depends on table sizes and indexes.",
          terms: ["join", "hash-join", "query-plan", "index"],
        },
        {
          slug: "cost-optimiser",
          title: "Statistics and the optimiser",
          summary: "Why a query suddenly gets slow.",
          minutes: 25,
          signature:
            "Load a million rows without refreshing statistics and watch the optimiser pick a terrible plan",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: ["Statistics and histograms", "Cardinality estimates", "Stale statistics"],
          status: "live",
          level: "applied",
          prerequisites: ["joins"],
          plain:
            "The planner relies on statistics about the data, such as how many rows a table has and how values are spread. When those numbers are out of date, its estimates go wrong and it can choose a plan thousands of times slower.",
          terms: ["table-statistics", "cardinality-estimate", "query-planner", "explain"],
        },
      ],
    },
    {
      slug: "transactions",
      title: "Transactions and durability",
      summary: "Keeping data correct when things fail and users collide.",
      modules: [
        {
          slug: "wal-recovery",
          title: "Write-ahead logging and recovery",
          summary: "Surviving a crash mid-write.",
          minutes: 25,
          signature:
            "Pull the power during a transfer with and without a write-ahead log, then replay the log",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: ["Write-ahead logging", "Checkpoints", "Crash recovery"],
          status: "live",
          level: "core",
          prerequisites: ["buffer-pool"],
          plain:
            "Databases first write every change to a sequential log on disk, and only later update the data pages. After a crash, they replay the log to restore committed changes and undo unfinished ones.",
          terms: ["wal", "checkpoint", "lsn", "durability", "dirty-page"],
        },
        {
          slug: "acid",
          title: "Transactions and ACID",
          summary: "All or nothing.",
          minutes: 20,
          signature: "Run a money transfer that fails halfway, with and without a transaction",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "Atomicity and consistency",
            "Isolation and durability",
            "Commit and rollback",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["wal-recovery"],
          plain:
            "A transaction groups several changes so they all happen or none do. ACID names the guarantees: atomic, consistent, isolated and durable.",
          terms: ["transaction", "acid", "autocommit", "wal", "durability"],
        },
        {
          slug: "isolation",
          title: "Isolation levels and anomalies",
          summary: "What happens when users collide.",
          minutes: 30,
          signature:
            "Interleave two transactions at each isolation level and catch dirty reads, lost updates and write skew",
          formats: ["simulation", "checkpoint"],
          concepts: ["Read committed to serializable", "Anomalies", "Choosing a level"],
          status: "live",
          level: "core",
          prerequisites: ["acid"],
          plain:
            "When many transactions run at once, they can see each other's half-finished work or overwrite each other's changes. Isolation levels choose how much of that is allowed, trading safety for speed.",
          terms: [
            "isolation",
            "isolation-level",
            "dirty-read",
            "non-repeatable-read",
            "phantom-read",
            "lost-update",
            "write-skew",
            "snapshot-isolation",
            "ssi",
            "serializable",
          ],
        },
        {
          slug: "locking",
          title: "Locks and deadlocks",
          summary: "Waiting your turn, and what happens when nobody can.",
          minutes: 25,
          signature: "Grab row locks in two transactions and create, detect and resolve a deadlock",
          formats: ["simulation", "checkpoint"],
          concepts: ["Shared and exclusive locks", "Two-phase locking", "Deadlock detection"],
          status: "live",
          level: "core",
          prerequisites: ["isolation"],
          plain:
            "One way to keep transactions apart is locking: a transaction must hold a lock on a row before changing it. Locks make others wait, and sometimes two transactions each wait for the other forever: a deadlock.",
          terms: [
            "lock",
            "deadlock",
            "deadlock-timeout",
            "two-phase-locking",
            "gap-lock",
            "lock-escalation",
            "isolation",
            "transaction",
          ],
        },
        {
          slug: "mvcc",
          title: "MVCC",
          summary: "Readers that never wait for writers.",
          minutes: 25,
          signature:
            "Update a row while another transaction reads it, see both versions, then watch vacuum clean up",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: ["Row versions and snapshots", "Visibility rules", "Vacuum and bloat"],
          status: "live",
          level: "core",
          prerequisites: ["isolation"],
          plain:
            "Instead of making readers wait, many databases keep old versions of rows. Each transaction sees a consistent snapshot, and old versions are cleaned up later.",
          terms: [
            "mvcc",
            "snapshot",
            "xmin",
            "vacuum-pg",
            "autovacuum",
            "xid-wraparound",
            "hot-update",
            "undo-log",
          ],
        },
      ],
    },
    {
      slug: "beyond",
      title: "Beyond one machine",
      summary: "Copies, consensus and choosing an engine.",
      modules: [
        {
          slug: "replication-internals",
          title: "Replication under the hood",
          summary: "Shipping the log to another server.",
          minutes: 25,
          signature:
            "Stream a primary's write-ahead log to a replica, then compare physical and logical replication",
          formats: ["simulation", "checkpoint"],
          concepts: ["Log shipping", "Physical vs logical replication", "Synchronous commit"],
          status: "live",
          level: "core",
          prerequisites: ["wal-recovery"],
          plain:
            "Replicas stay up to date by receiving the primary's log of changes and replaying it. Whether the primary waits for a replica before confirming a commit decides how much data a failure can lose.",
          terms: [
            "wal",
            "replica",
            "streaming-replication",
            "hot-standby",
            "synchronous-commit",
            "logical-replication",
            "replication-lag",
            "replication-slot",
            "binlog",
            "gtid",
            "semisync",
            "quorum",
          ],
        },
        {
          slug: "distributed-sql",
          title: "Distributed SQL and consensus",
          summary: "One database across many machines.",
          minutes: 30,
          signature:
            "Elect a leader with Raft, lose a node, and see a write commit only when a majority agrees",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: ["Sharding with transactions", "Raft consensus", "Clocks and ordering"],
          status: "live",
          level: "deep",
          prerequisites: ["replication-internals"],
          plain:
            "Distributed SQL databases split data across many machines but still offer transactions. Each piece of data is copied to several machines that agree on every change through a consensus protocol such as Raft.",
          terms: [
            "distributed-sql",
            "shard",
            "consensus",
            "raft",
            "paxos",
            "truetime",
            "hlc",
            "two-phase-commit",
            "replica",
          ],
        },
        {
          slug: "engines-compared",
          title: "Database engines compared",
          summary: "PostgreSQL, MySQL, SQLite and the rest.",
          minutes: 25,
          signature:
            "Compare how popular engines store rows, index data and handle concurrency, side by side",
          formats: ["animated-infographic", "checkpoint"],
          concepts: ["Storage engines", "Concurrency control", "Managed cloud databases"],
          status: "live",
          level: "applied",
          prerequisites: ["mvcc", "btrees"],
          plain:
            "Every database makes different choices about storage, indexing and concurrency. Knowing them explains why PostgreSQL needs vacuum, why SQLite is a single file, and what a managed cloud database changes.",
          terms: [
            "heap",
            "clustered-index",
            "undo-log",
            "mvcc",
            "managed-service",
            "distributed-sql",
          ],
        },
        {
          slug: "capstone-db",
          title: "Capstone: the slow database",
          summary: "Diagnose a struggling database from the evidence.",
          minutes: 40,
          signature:
            "A payments database slows down: read plans, statistics, locks and vacuum data to find and fix five problems",
          formats: ["branching-scenario", "fix-the-problem", "checkpoint"],
          concepts: ["Diagnosing database performance"],
          status: "live",
          level: "applied",
          prerequisites: ["cost-optimiser", "mvcc", "locking"],
          plain:
            "Everything in this track in one investigation. A busy database is slow, and you'll use plans, statistics and lock information to find out why and fix it.",
          terms: ["pg-stat-statements", "xid-wraparound", "deadlock", "vacuum-pg"],
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

const enterprisePatterns: Track = {
  slug: "enterprise-patterns",
  title: "Enterprise Patterns",
  area: "Architecture",
  category: "architecture",
  tagline: "Integration, domains and boundaries in large organisations.",
  description:
    "How large organisations structure and connect their systems: Conway's law and team design, domain-driven design (ubiquitous language, bounded contexts, context maps, aggregates, event storming), the enterprise integration patterns (integration styles, messaging, routing, orchestration and choreography, from ESBs to API-led integration), architecture styles (hexagonal, modular monoliths and microservices, CQRS and event sourcing, data ownership and data mesh), and changing legacy estates (strangler fig, anticorruption layers, decision records, enterprise architecture). Vendor-neutral, with examples on open-source tools and AWS, Azure and Google Cloud integration services. By the end you can draw sensible boundaries, choose how systems should talk, and plan a migration you can actually finish.",
  accent: "keystone",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why systems in large organisations are hard, and why it's mostly about people.",
      modules: [
        {
          slug: "why-enterprise",
          title: "What makes enterprise systems hard",
          summary: "Many teams, old systems, one business.",
          minutes: 20,
          signature:
            "Follow one customer address change through a dozen systems that each keep their own copy",
          formats: ["scroll-story", "checkpoint"],
          concepts: ["Systems of record", "Integration sprawl", "Change across teams"],
          status: "live",
          level: "beginner",
          plain:
            "A large organisation runs hundreds of systems built at different times by different teams. The hard part isn't any one system; it's keeping them in step as the business changes.",
          terms: [
            "system-of-record",
            "big-ball-of-mud",
            "point-to-point",
            "pace-layers",
            "legacy-system",
          ],
        },
        {
          slug: "conways-law",
          title: "Conway's law and team topologies",
          summary: "Systems mirror the teams that build them.",
          minutes: 25,
          signature: "Reorganise teams around a product and watch the architecture redraw itself",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Conway's law",
            "The inverse Conway manoeuvre",
            "Team types and interaction modes",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-enterprise"],
          plain:
            "Software tends to take the shape of the organisation that builds it: three teams make three components. So designing teams is part of designing systems.",
          terms: [
            "conways-law",
            "inverse-conway",
            "team-topologies",
            "stream-aligned-team",
            "cognitive-load",
          ],
        },
      ],
    },
    {
      slug: "domains",
      title: "Domains and boundaries",
      summary: "Modelling the business so the code makes sense to the people who use it.",
      modules: [
        {
          slug: "domain-language",
          title: "A shared language",
          summary: "Same word, different meanings.",
          minutes: 20,
          signature:
            "Find the five meanings of 'customer' across sales, billing, support and delivery",
          formats: ["simulation", "checkpoint"],
          concepts: ["Domain-driven design", "Ubiquitous language", "Domain experts"],
          status: "live",
          level: "beginner",
          prerequisites: ["why-enterprise"],
          plain:
            "Bugs often start with words: 'account' or 'policy' means one thing to sales and another to finance. Domain-driven design asks teams to agree a precise language with the business, and use it in the code.",
          terms: ["domain-driven-design", "domain", "ubiquitous-language", "domain-expert"],
        },
        {
          slug: "bounded-contexts",
          title: "Bounded contexts",
          summary: "Where one model ends and another begins.",
          minutes: 25,
          signature:
            "Split one bloated Customer model into contexts and draw the lines between them",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Bounded contexts",
            "One model per context",
            "Subdomains: core, supporting, generic",
          ],
          status: "live",
          level: "core",
          prerequisites: ["domain-language"],
          plain:
            "Instead of one giant model of the whole business, draw boundaries. Inside each, words have one meaning and one team owns the model; between them, you translate.",
          terms: [
            "bounded-context",
            "core-domain",
            "generic-subdomain",
            "supporting-subdomain",
            "ubiquitous-language",
          ],
        },
        {
          slug: "context-mapping",
          title: "Context maps",
          summary: "How bounded contexts relate to each other.",
          minutes: 25,
          signature:
            "Map six relationships between contexts, from partnership to anticorruption layer",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Upstream and downstream",
            "Conformist, shared kernel, open host",
            "Anticorruption layer",
          ],
          status: "live",
          level: "core",
          prerequisites: ["bounded-contexts"],
          plain:
            "Once you have boundaries, you need to know how each pair of contexts depends on the other and who adapts to whom. A context map records it, and warns where trouble will come from.",
          terms: [
            "context-map",
            "upstream-downstream",
            "anticorruption-layer",
            "open-host-service",
            "published-language",
            "bounded-context",
          ],
        },
        {
          slug: "aggregates",
          title: "Entities, value objects and aggregates",
          summary: "Drawing consistency boundaries.",
          minutes: 25,
          signature:
            "Design an order aggregate, then break its rules and watch concurrent updates collide",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Entities and value objects",
            "Aggregates and invariants",
            "Small aggregates, references by ID",
          ],
          status: "live",
          level: "core",
          prerequisites: ["bounded-contexts"],
          plain:
            "Inside a context, some objects must change together to stay valid, like an order and its lines. An aggregate groups them so one transaction keeps the rules; everything else is linked by ID and updated separately.",
          terms: [
            "entity",
            "value-object",
            "aggregate",
            "aggregate-root",
            "invariant",
            "optimistic-concurrency",
            "repository",
            "domain-event",
          ],
        },
        {
          slug: "event-storming",
          title: "Event storming",
          summary: "Discovering a domain with sticky notes.",
          minutes: 20,
          signature:
            "Arrange domain events for a loan application on a timeline, then add commands, actors and hot spots",
          formats: ["simulation", "checkpoint"],
          concepts: ["Domain events", "Commands, actors and policies", "Finding boundaries"],
          status: "live",
          level: "beginner",
          prerequisites: ["domain-language"],
          plain:
            "Get the people who know the business in a room with a long wall and orange sticky notes. Writing down everything that happens, in the past tense and in order, quickly shows how the business works and where the boundaries are.",
          terms: ["event-storming", "domain-event", "hot-spot", "es-policy", "domain-expert"],
        },
      ],
    },
    {
      slug: "integration",
      title: "Integrating systems",
      summary: "Getting separate systems to work together.",
      modules: [
        {
          slug: "integration-styles",
          title: "Four ways to integrate",
          summary: "Files, shared databases, calls and messages.",
          minutes: 25,
          signature: "Connect a billing system four ways and break each with the same change",
          formats: ["simulation", "checkpoint"],
          concepts: ["File transfer", "Shared database", "Remote calls", "Messaging"],
          status: "live",
          level: "core",
          prerequisites: ["why-enterprise"],
          plain:
            "Systems can share data by exchanging files, reading the same database, calling each other, or sending messages. Each trades simplicity against how tightly the systems are tied together.",
          terms: ["eip", "integration-style", "messaging", "coupling", "point-to-point"],
        },
        {
          slug: "messaging-patterns",
          title: "Messaging building blocks",
          summary: "Channels, messages and endpoints.",
          minutes: 25,
          signature:
            "Send commands, events and documents through point-to-point and publish-subscribe channels",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Point-to-point vs publish-subscribe",
            "Command, event and document messages",
            "Correlation and dead letters",
          ],
          status: "live",
          level: "core",
          prerequisites: ["integration-styles"],
          plain:
            "Messaging has a small vocabulary that hasn't changed in twenty years: channels carry messages between endpoints, and a message is a command, an event or a document. Learn it once and every broker makes sense.",
          terms: [
            "message-channel",
            "point-to-point-channel",
            "competing-consumers",
            "pub-sub",
            "dead-letter-queue",
            "idempotent-receiver",
            "correlation-id",
            "consumer-group",
          ],
        },
        {
          slug: "routing-transformation",
          title: "Routing and transformation",
          summary: "Getting the right message to the right place in the right shape.",
          minutes: 25,
          signature: "Build an order pipeline with a router, splitter, translator and aggregator",
          formats: ["build-connect", "simulation", "checkpoint"],
          concepts: [
            "Content-based router",
            "Splitter and aggregator",
            "Translator and canonical data model",
          ],
          status: "live",
          level: "core",
          prerequisites: ["messaging-patterns"],
          plain:
            "Between sender and receiver, messages often need directing, splitting, combining or reshaping. A handful of named patterns covers almost every integration flow.",
          terms: [
            "content-based-router",
            "splitter",
            "aggregator",
            "content-enricher",
            "normalizer",
            "message-translator",
            "canonical-data-model",
          ],
        },
        {
          slug: "orchestration-choreography",
          title: "Orchestration and choreography",
          summary: "Who's in charge of a business process?",
          minutes: 25,
          signature:
            "Run a loan approval as a central workflow and as reacting services, then fail a step",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Orchestration and process managers",
            "Choreography with events",
            "Workflow engines",
          ],
          status: "live",
          level: "core",
          prerequisites: ["messaging-patterns"],
          plain:
            "A process that spans systems can be run by a conductor that tells each one what to do, or by systems reacting to each other's events. One is easier to follow; the other is less coupled.",
          terms: ["orchestration-ep", "choreography", "process-manager", "workflow-engine", "saga"],
        },
        {
          slug: "esb-to-api-led",
          title: "From ESB to API-led integration",
          summary: "How enterprise integration platforms evolved.",
          minutes: 20,
          signature:
            "Trace one integration through an ESB, point-to-point code, an API layer and an event mesh",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Enterprise service bus",
            "Smart endpoints, dumb pipes",
            "iPaaS and API-led connectivity",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["routing-transformation"],
          plain:
            "Enterprises once put all integration logic in a central bus. Microservices pushed logic back into services; today integration platforms, API gateways and event brokers share the work.",
          terms: ["esb", "api-led", "ipaas", "event-mesh", "system-of-record"],
        },
      ],
    },
    {
      slug: "styles",
      title: "Architecture styles",
      summary: "Structuring code and services for change.",
      modules: [
        {
          slug: "hexagonal",
          title: "Layers, hexagons and clean architecture",
          summary: "Keeping business logic independent of technology.",
          minutes: 25,
          signature: "Swap a database and a UI under the same business core without touching it",
          formats: ["simulation", "checkpoint"],
          concepts: ["Layered architecture", "Ports and adapters", "Dependency rule"],
          status: "live",
          level: "core",
          prerequisites: ["aggregates"],
          plain:
            "Put the business rules in the middle and everything technical (databases, web frameworks, message brokers) at the edges, plugged in through interfaces. Then the core can be tested and kept while the edges change.",
          terms: [
            "hexagonal-architecture",
            "port",
            "adapter",
            "dependency-rule",
            "anticorruption-layer",
          ],
        },
        {
          slug: "monolith-microservices",
          title: "Modular monoliths and microservices",
          summary: "How big should a service be?",
          minutes: 30,
          signature: "Split a system into one, five and fifty deployables and compare the costs",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Monolith, modular monolith, microservices",
            "Granularity trade-offs",
            "Real case studies",
          ],
          status: "live",
          level: "core",
          prerequisites: ["bounded-contexts", "conways-law"],
          plain:
            "Microservices let teams deploy independently but add networks, failures and operations. A well-structured monolith keeps the boundaries without the distribution. The right size follows the teams and the domain.",
          terms: [
            "monolith",
            "modular-monolith",
            "microservices",
            "independent-deployability",
            "microservice-premium",
            "bounded-context",
          ],
        },
        {
          slug: "cqrs-event-sourcing",
          title: "CQRS and event sourcing",
          summary: "Separate reads from writes; store what happened.",
          minutes: 30,
          signature:
            "Rebuild an account balance from its events, then add a new read model without touching the write side",
          formats: ["simulation", "step-through", "checkpoint"],
          concepts: [
            "Command-query separation",
            "Event stores and projections",
            "When not to use them",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["aggregates"],
          plain:
            "Instead of storing only the current state, store every change as an event and derive state from them. Separate models for writing and reading let each be shaped for its job. Powerful, and often overused.",
          terms: [
            "event-sourcing",
            "event-store",
            "compensating-event",
            "cqs",
            "cqrs",
            "projection",
            "read-model",
          ],
        },
        {
          slug: "data-ownership",
          title: "Who owns the data?",
          summary: "Database per service, master data and data mesh.",
          minutes: 25,
          signature:
            "Untangle five services sharing one database, then decide where the golden customer record lives",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Shared database anti-pattern",
            "Master data management",
            "Data mesh and data products",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["bounded-contexts"],
          plain:
            "When many systems need the same data, someone must own it. Each service owning its data keeps teams independent; master data management and data mesh are ways to share it across the organisation without chaos.",
          terms: [
            "integration-database",
            "database-per-service",
            "master-data-management",
            "golden-record",
            "data-mesh",
            "data-product",
          ],
        },
      ],
    },
    {
      slug: "change",
      title: "Change and legacy",
      summary: "Evolving systems you can't switch off.",
      modules: [
        {
          slug: "strangler-fig",
          title: "The strangler fig",
          summary: "Replacing a legacy system piece by piece.",
          minutes: 25,
          signature:
            "Migrate a legacy system route by route behind a façade, with a parallel run before each cut-over",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Incremental replacement",
            "Routing façades",
            "Branch by abstraction and parallel runs",
          ],
          status: "live",
          level: "core",
          prerequisites: ["integration-styles"],
          plain:
            "Big-bang rewrites of large systems often fail. Instead, put a façade in front of the old system and move one piece at a time to the new one, until the old system can be switched off.",
          terms: [
            "strangler-fig",
            "facade",
            "parallel-run",
            "branch-by-abstraction",
            "legacy-system",
          ],
        },
        {
          slug: "legacy-integration",
          title: "Living with legacy",
          summary: "Wrapping, mirroring and protecting yourself from old systems.",
          minutes: 25,
          signature:
            "Connect a new service to a mainframe through an API wrapper, change data capture and an anticorruption layer",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Anticorruption layers in practice",
            "Wrappers and change data capture",
            "Mainframes and batch",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["context-mapping", "strangler-fig"],
          plain:
            "Many core systems are decades old and still run the business. New systems have to talk to them without inheriting their model, by wrapping them, copying their changes, and translating at the boundary.",
          terms: [
            "mainframe",
            "anticorruption-layer",
            "cdc",
            "bubble-context",
            "autonomous-bubble",
            "legacy-system",
          ],
        },
        {
          slug: "decisions",
          title: "Architecture decisions and fitness functions",
          summary: "Recording why, and checking it stays true.",
          minutes: 20,
          signature:
            "Write an architecture decision record, then turn its rule into an automated fitness function",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Architecture decision records",
            "Fitness functions",
            "Evolutionary architecture",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["hexagonal"],
          plain:
            "Architecture is a series of decisions. Writing each one down, with its context and consequences, stops teams relitigating them; automated checks catch the code drifting away from them.",
          terms: ["adr", "fitness-function", "dependency-rule"],
        },
        {
          slug: "enterprise-architecture",
          title: "Enterprise architecture and governance",
          summary: "Seeing the whole estate.",
          minutes: 25,
          signature: "Draw a system at four C4 levels, then place technologies on a radar",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "C4 diagrams",
            "Capability maps and frameworks",
            "Governance without a bottleneck",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["decisions"],
          plain:
            "Someone has to see across hundreds of systems: what exists, what's duplicated, where to invest. Diagrams, capability maps, technology radars and paved roads help, as long as governance guides rather than blocks.",
          terms: [
            "enterprise-architecture",
            "c4-model",
            "technology-radar",
            "capability-map",
            "paved-road",
          ],
        },
      ],
    },
    {
      slug: "capstone",
      title: "Capstone",
      summary: "Everything together, on a real-shaped problem.",
      modules: [
        {
          slug: "capstone-enterprise",
          title: "Capstone: modernising a benefits system",
          summary: "Plan the modernisation of a state welfare platform.",
          minutes: 40,
          signature:
            "Split a legacy benefits platform into contexts, choose integration styles and plan a strangler migration, then live with the results",
          formats: ["branching-scenario", "checkpoint"],
          concepts: ["Applying enterprise patterns"],
          status: "live",
          level: "applied",
          prerequisites: ["strangler-fig", "context-mapping", "orchestration-choreography"],
          plain:
            "Everything in this track in one decision-filled project: a state department's twenty-year-old benefits system must be modernised without stopping payments.",
          terms: [
            "legacy-system",
            "strangler-fig",
            "anticorruption-layer",
            "bounded-context",
            "conways-law",
          ],
        },
      ],
    },
  ],
};

const spark: Track = {
  slug: "spark",
  title: "Apache Spark",
  area: "Data engineering",
  category: "data-engineering",
  tagline: "How distributed dataframes plan, shuffle and scale.",
  description:
    "How Apache Spark runs data processing across many machines: drivers and executors, RDDs and DataFrames, lazy evaluation, partitions, Spark SQL, the Catalyst optimiser, jobs, stages and tasks, the shuffle, join strategies, Adaptive Query Execution and vectorised engines; then performance (skew, memory, caching, file layout), Structured Streaming, PySpark and UDFs, and running and right-sizing Spark. Vendor-neutral: open-source Spark alongside Databricks, Amazon EMR, Google Dataproc, Azure and Fabric, and Kubernetes. By the end you can read a Spark plan and UI and make a slow job fast.",
  accent: "ember",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why Spark exists and what a Spark cluster looks like.",
      modules: [
        {
          slug: "why-spark",
          title: "Why Spark exists",
          summary: "From MapReduce to in-memory dataflow.",
          minutes: 20,
          signature:
            "Run the same three-step job as MapReduce and as Spark and watch where the data goes to disk",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "Splitting work across machines",
            "MapReduce and its disk trips",
            "Keeping data in memory",
          ],
          status: "live",
          level: "beginner",
          plain:
            "When data is too big for one computer, you split the work across many. Spark is the most widely used engine for doing that: it plans the work, sends pieces to many machines, and keeps data in memory between steps instead of writing it to disk each time.",
          terms: ["cluster", "mapreduce", "in-memory-processing", "iterative-job"],
        },
        {
          slug: "cluster-anatomy",
          title: "Driver, executors and the cluster",
          summary: "Who does what when a Spark job runs.",
          minutes: 20,
          signature:
            "Submit a job and follow it from the driver to executors on a cluster, then lose an executor",
          formats: ["animated-infographic", "simulation", "checkpoint"],
          concepts: ["Driver and executors", "Cluster managers", "Cores, tasks and slots"],
          status: "live",
          level: "beginner",
          prerequisites: ["why-spark"],
          plain:
            "A Spark application has one coordinator, the driver, and many workers, the executors. The driver turns your code into small tasks; the executors run them in parallel and report back. A cluster manager such as Kubernetes or YARN finds the machines.",
          terms: [
            "driver",
            "executor",
            "task",
            "cluster-manager",
            "deploy-mode",
            "spark-connect",
            "cluster",
          ],
        },
      ],
    },
    {
      slug: "apis",
      title: "Data and APIs",
      summary: "How you describe work in Spark.",
      modules: [
        {
          slug: "rdds-dataframes",
          title: "RDDs, DataFrames and Datasets",
          summary: "Three ways to hold distributed data.",
          minutes: 25,
          signature:
            "Write the same word count with an RDD and a DataFrame and compare what Spark can optimise",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "RDDs and lineage",
            "DataFrames and schemas",
            "Why structure helps the engine",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["cluster-anatomy"],
          plain:
            "Spark started with RDDs, collections of records spread across machines. DataFrames added columns and types, like a table. Because Spark then knows what your data looks like, it can optimise your job far better.",
          terms: ["rdd", "dataframe", "dataset-spark", "schema-spark", "lineage"],
        },
        {
          slug: "lazy-evaluation",
          title: "Transformations, actions and laziness",
          summary: "Nothing happens until you ask for a result.",
          minutes: 20,
          signature:
            "Chain transformations, watch Spark build a plan without running anything, then trigger it with an action",
          formats: ["step-through", "checkpoint"],
          concepts: ["Transformations vs actions", "The DAG", "Why laziness enables optimisation"],
          status: "live",
          level: "beginner",
          prerequisites: ["rdds-dataframes"],
          plain:
            "Most Spark operations, like filter and select, don't run immediately; they add a step to a plan. Only an action, such as count or write, makes Spark execute. Waiting lets it see the whole job and find the fastest way to do it.",
          terms: [
            "transformation",
            "action",
            "lazy-evaluation",
            "dag",
            "narrow-transformation",
            "wide-transformation",
          ],
        },
        {
          slug: "partitions",
          title: "Partitions and parallelism",
          summary: "How data is split into pieces of work.",
          minutes: 25,
          signature:
            "Change the number of partitions and cores and watch tasks run in waves, idle or overloaded",
          formats: ["simulation", "checkpoint"],
          concepts: ["Partitions and tasks", "Parallelism and cores", "Repartition vs coalesce"],
          status: "live",
          level: "core",
          prerequisites: ["lazy-evaluation"],
          plain:
            "Spark splits data into partitions, and each partition becomes one task. Too few partitions leave cores idle; too many create overhead. Getting the count roughly right is one of the most useful tuning skills.",
          terms: ["partition", "parallelism", "task", "coalesce", "repartition"],
        },
        {
          slug: "spark-sql",
          title: "Spark SQL and the DataFrame API",
          summary: "Two front doors to one engine.",
          minutes: 20,
          signature:
            "Write a query in SQL and as DataFrame code and see that both produce the same plan",
          formats: ["simulation", "checkpoint"],
          concepts: ["SQL and DataFrames", "Tables, views and catalogs", "Same engine underneath"],
          status: "live",
          level: "beginner",
          prerequisites: ["rdds-dataframes"],
          plain:
            "You can talk to Spark in SQL or in Python, Scala or R DataFrame code. Both end up as the same plan, run by the same engine, so choose whichever is clearer for the task.",
          terms: ["spark-sql", "dataframe", "temp-view", "catalog", "ansi-mode"],
        },
      ],
    },
    {
      slug: "execution",
      title: "How a query runs",
      summary: "From your code to tasks on executors.",
      modules: [
        {
          slug: "catalyst",
          title: "The Catalyst optimiser",
          summary: "How Spark rewrites your query to run faster.",
          minutes: 25,
          signature:
            "Step a query through parsing, analysis, optimisation and physical planning, and see filters pushed down",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Logical and physical plans",
            "Rule-based rewrites",
            "Predicate and column pruning",
          ],
          status: "live",
          level: "core",
          prerequisites: ["spark-sql"],
          plain:
            "Before running anything, Spark's optimiser, Catalyst, rewrites your query: it removes columns you don't need, moves filters as early as possible, and picks how to perform each step. Reading its plan explains most surprises.",
          terms: [
            "catalyst",
            "logical-plan",
            "physical-plan",
            "predicate-pushdown",
            "column-pruning",
            "lazy-evaluation",
          ],
        },
        {
          slug: "jobs-stages-tasks",
          title: "Jobs, stages and tasks",
          summary: "Reading the Spark UI.",
          minutes: 25,
          signature:
            "Run a job and read it in a simulated Spark UI: jobs split into stages at shuffles, stages into tasks",
          formats: ["simulation", "checkpoint"],
          concepts: ["Jobs, stages and tasks", "Stage boundaries", "The Spark UI"],
          status: "live",
          level: "core",
          prerequisites: ["partitions", "catalyst"],
          plain:
            "Each action becomes a job. Spark cuts the job into stages wherever data must be reshuffled between machines, and each stage into one task per partition. The Spark UI shows all of this, and it's where tuning starts.",
          terms: ["job", "stage", "task", "spark-ui", "history-server"],
        },
        {
          slug: "shuffle",
          title: "The shuffle",
          summary: "The expensive step that moves data between machines.",
          minutes: 25,
          signature:
            "Group sales by city and watch every executor send data to every other across the network",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Narrow vs wide transformations",
            "Shuffle write and read",
            "Why shuffles are expensive",
          ],
          status: "live",
          level: "core",
          prerequisites: ["jobs-stages-tasks"],
          plain:
            "Some operations, like grouping or joining, need all the rows with the same key on the same machine. Getting them there means writing data out, sending it over the network and reading it back: a shuffle. It's usually the slowest part of a job.",
          terms: ["shuffle", "shuffle-file", "exchange", "external-shuffle-service"],
        },
        {
          slug: "spark-joins",
          title: "Join strategies",
          summary: "Broadcast, sort-merge and shuffle hash joins.",
          minutes: 25,
          signature:
            "Join a big table to small and large ones and see Spark choose broadcast or sort-merge, and why",
          formats: ["simulation", "checkpoint"],
          concepts: ["Broadcast hash join", "Sort-merge join", "Join hints and thresholds"],
          status: "live",
          level: "core",
          prerequisites: ["shuffle"],
          plain:
            "Joining two big tables means shuffling both. If one table is small, Spark can instead copy it to every machine and skip the shuffle entirely. Knowing which strategy Spark picks, and why, is key to fast joins.",
          terms: ["broadcast-join", "sort-merge-join", "shuffled-hash-join", "join-hint"],
        },
        {
          slug: "aqe",
          title: "Adaptive Query Execution",
          summary: "Re-planning a query while it runs.",
          minutes: 20,
          signature:
            "Run a query with and without AQE and watch it merge tiny partitions, split a skewed one and switch a join",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Runtime statistics",
            "Coalescing partitions",
            "Skew joins and join switching",
          ],
          status: "live",
          level: "core",
          prerequisites: ["spark-joins"],
          plain:
            "Spark's first plan is based on guesses. Adaptive Query Execution looks at real sizes after each shuffle and adjusts the rest of the plan: merging tiny partitions, splitting huge ones, and picking a better join.",
          terms: ["aqe", "query-stage"],
        },
        {
          slug: "tungsten-vectorised",
          title: "Tungsten and vectorised engines",
          summary: "How Spark uses the CPU efficiently.",
          minutes: 20,
          signature:
            "Compare row-at-a-time, whole-stage code generation and vectorised execution on the same query",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Off-heap memory and binary rows",
            "Whole-stage code generation",
            "Vectorised native engines",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["catalyst"],
          plain:
            "Once the plan is chosen, how fast each machine runs it depends on using the CPU well. Spark generates compact code for whole stages, and newer native engines process columns of values at once.",
          terms: [
            "tungsten",
            "volcano-model",
            "whole-stage-codegen",
            "vectorised-execution",
            "native-engine",
          ],
        },
      ],
    },
    {
      slug: "performance",
      title: "Performance",
      summary: "Making slow jobs fast.",
      modules: [
        {
          slug: "skew",
          title: "Data skew",
          summary: "When one task does all the work.",
          minutes: 25,
          signature:
            "Group orders where one customer has half the rows, watch one task straggle, then fix it with salting and AQE",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: ["Spotting skew in the UI", "Salting keys", "AQE skew handling"],
          status: "live",
          level: "applied",
          prerequisites: ["aqe"],
          plain:
            "If one key has far more rows than the others, the task that handles it runs far longer than the rest, and the whole stage waits. Spreading that key across several tasks fixes it.",
          terms: ["data-skew", "straggler", "salting"],
        },
        {
          slug: "memory-spill",
          title: "Memory, spill and out-of-memory",
          summary: "Where executor memory goes.",
          minutes: 25,
          signature:
            "Size an executor's memory regions and watch a big sort spill to disk, then fail",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Execution and storage memory",
            "Spill to disk",
            "Common out-of-memory causes",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["shuffle"],
          plain:
            "Each executor has a fixed amount of memory shared between running work and cached data. When work doesn't fit, Spark writes it to disk, which is slow but survivable; when even that fails, the job dies with an out-of-memory error.",
          terms: ["execution-memory", "storage-memory", "spill", "memory-overhead"],
        },
        {
          slug: "caching",
          title: "Caching and persistence",
          summary: "Keeping results for reuse.",
          minutes: 20,
          signature:
            "Reuse an expensive DataFrame three times with and without caching and compare the work done",
          formats: ["simulation", "checkpoint"],
          concepts: ["cache and persist", "Storage levels", "When caching hurts"],
          status: "live",
          level: "applied",
          prerequisites: ["memory-spill"],
          plain:
            "If you use the same intermediate result several times, Spark recomputes it each time unless you cache it. Caching saves time when reused and wastes memory when not.",
          terms: ["cache-spark", "storage-level"],
        },
        {
          slug: "files-io",
          title: "Reading and writing files",
          summary: "Partitions on disk, small files and pushdown.",
          minutes: 25,
          signature:
            "Write a table with too many partitions, find thousands of tiny files, then fix the layout",
          formats: ["simulation", "fix-the-problem", "checkpoint"],
          concepts: ["Splits and file sizes", "Partitioned writes", "Small-file problems"],
          status: "live",
          level: "applied",
          prerequisites: ["partitions"],
          plain:
            "How data sits in files decides how fast Spark can read it. Too many tiny files, or a partition layout that doesn't match your queries, can make a job slow before it does any real work.",
          terms: ["partition-pruning", "small-files"],
        },
      ],
    },
    {
      slug: "beyond",
      title: "Beyond batch",
      summary: "Streaming, Python and running Spark for real.",
      modules: [
        {
          slug: "structured-streaming",
          title: "Structured Streaming",
          summary: "The same DataFrames, on data that never ends.",
          minutes: 25,
          signature:
            "Run a streaming count in micro-batches, add a watermark, and restart from a checkpoint",
          formats: ["simulation", "checkpoint"],
          concepts: ["Micro-batches", "Triggers, watermarks and state", "Checkpoints"],
          status: "live",
          level: "core",
          prerequisites: ["lazy-evaluation"],
          plain:
            "Structured Streaming treats a stream as a table that keeps growing. You write the same DataFrame code, and Spark runs it repeatedly on the new data, remembering where it got to.",
          terms: [
            "structured-streaming",
            "micro-batch",
            "watermark",
            "trigger",
            "streaming-checkpoint",
          ],
        },
        {
          slug: "pyspark-udfs",
          title: "PySpark, Arrow and UDFs",
          summary: "Python on a JVM engine.",
          minutes: 25,
          signature:
            "Apply a Python function row by row, then as a vectorised pandas UDF, then as a built-in, and compare speed",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "How PySpark talks to the JVM",
            "Python UDFs and their cost",
            "Arrow and pandas UDFs",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["spark-sql"],
          plain:
            "Most Spark users write Python, but the engine runs on the Java virtual machine. Built-in functions stay inside the engine; custom Python functions have to ship data back and forth, which can be slow unless it's done in batches.",
          terms: ["udf", "pandas-udf", "apache-arrow", "py4j"],
        },
        {
          slug: "spark-platforms",
          title: "Running Spark",
          summary: "Managed platforms, Kubernetes and Spark Connect.",
          minutes: 20,
          signature:
            "Compare running the same job on a managed platform, on Kubernetes and through Spark Connect",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Managed services on AWS, Google Cloud and Azure",
            "Spark on Kubernetes",
            "Spark Connect",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["cluster-anatomy"],
          plain:
            "You can run Spark yourself or use a managed service from Databricks or a cloud provider. Each handles clusters, upgrades and scaling differently, and newer client-server options let small apps talk to a remote Spark.",
          terms: ["managed-spark", "serverless-spark", "spark-connect", "cluster-manager"],
        },
        {
          slug: "cost-scaling",
          title: "Cost and right-sizing",
          summary: "Paying for what the job needs.",
          minutes: 20,
          signature:
            "Size a cluster for a nightly job, add dynamic allocation and spot capacity, and watch cost and runtime change",
          formats: ["simulation", "checkpoint"],
          concepts: ["Executor sizing", "Dynamic allocation and autoscaling", "Spot capacity"],
          status: "live",
          level: "applied",
          prerequisites: ["memory-spill"],
          plain:
            "A cluster costs money for every minute it runs. Choosing executor sizes, letting the cluster grow and shrink with the work, and using cheaper interruptible machines can cut costs sharply.",
          terms: ["dynamic-allocation", "spot-instance", "decommissioning"],
        },
      ],
    },
    {
      slug: "capstone",
      title: "Capstone",
      summary: "Everything together.",
      modules: [
        {
          slug: "capstone-spark",
          title: "Capstone: the slow nightly job",
          summary: "Diagnose a job that misses its deadline.",
          minutes: 40,
          signature:
            "A nightly sales job runs four hours over: read the plan and the Spark UI to find and fix five problems",
          formats: ["branching-scenario", "fix-the-problem", "checkpoint"],
          concepts: ["Diagnosing Spark performance"],
          status: "live",
          level: "applied",
          prerequisites: ["skew", "files-io", "memory-spill"],
          plain:
            "Everything in this track in one investigation: a nightly job is too slow, and you'll use plans, stages and metrics to find out why and fix it.",
          terms: ["shuffle", "data-skew", "spill", "aqe", "spark-ui"],
        },
      ],
    },
  ],
};

const dataModelling: Track = {
  slug: "data-modelling",
  title: "Data Modelling",
  area: "Data engineering",
  category: "data-engineering",
  tagline: "Stars, snowflakes, vaults and when to use each.",
  description:
    "How to shape data so it answers questions correctly and stays usable: conceptual, logical and physical models, keys and relationships, normalisation, transactions versus analytics, dimensional modelling (star schemas, grain, fact types, conformed dimensions, dimension patterns, slowly changing dimensions), Inmon and Kimball, Data Vault, wide tables, semantic layers, layered modelling with dbt, NoSQL and graph models, modelling time, and changing models safely. Vendor-neutral, with examples on PostgreSQL, the major cloud warehouses and lakehouses, dbt and NoSQL databases. By the end you can design a model from a set of business questions and defend each choice.",
  accent: "timber",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why the shape of data matters.",
      modules: [
        {
          slug: "why-model",
          title: "Why model data?",
          summary: "Same data, different questions.",
          minutes: 20,
          signature:
            "Answer the same business question against a messy spreadsheet and a modelled table",
          formats: ["scroll-story", "checkpoint"],
          concepts: ["What a data model is", "Questions drive design", "Operational vs analytical"],
          status: "live",
          level: "beginner",
          plain:
            "A data model decides how facts are arranged: what goes in which table and how tables connect. A good model makes the common questions easy and the wrong answers hard; a poor one makes every report a puzzle.",
          terms: ["data-model", "entity", "attribute", "operational-data", "analytical-data"],
        },
        {
          slug: "model-levels",
          title: "Conceptual, logical and physical",
          summary: "Three levels of detail.",
          minutes: 20,
          signature:
            "Turn a conversation about a library into a conceptual sketch, a logical model and real tables",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Entities and relationships",
            "Entity-relationship diagrams",
            "From logical to physical",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-model"],
          plain:
            "Modelling usually goes from rough to exact: first the things the business talks about and how they relate, then precise attributes and keys, and finally the actual tables and types in a specific database.",
          terms: [
            "conceptual-model",
            "logical-model",
            "physical-model",
            "er-diagram",
            "cardinality",
            "crows-foot",
          ],
        },
      ],
    },
    {
      slug: "relational",
      title: "Relational foundations",
      summary: "Keys, relationships and normal forms.",
      modules: [
        {
          slug: "keys-relationships",
          title: "Keys and relationships",
          summary: "How rows find each other.",
          minutes: 25,
          signature:
            "Link customers, orders and products with keys, then try one-to-many and many-to-many",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Primary and foreign keys",
            "Natural and surrogate keys",
            "Cardinality and bridge tables",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["model-levels"],
          plain:
            "Every table needs a way to identify each row, and a way to point at rows in other tables. Keys do both, and the kind of relationship (one-to-many, many-to-many) decides how tables connect.",
          terms: [
            "primary-key",
            "foreign-key",
            "referential-integrity",
            "candidate-key",
            "natural-key",
            "surrogate-key",
            "junction-table",
            "composite-key",
          ],
        },
        {
          slug: "normalisation",
          title: "Normalisation",
          summary: "Each fact in one place.",
          minutes: 25,
          signature:
            "Take a messy orders sheet through first, second and third normal form and watch update anomalies disappear",
          formats: ["step-through", "checkpoint"],
          concepts: [
            "Update, insert and delete anomalies",
            "First to third normal form",
            "When to stop",
          ],
          status: "live",
          level: "core",
          prerequisites: ["keys-relationships"],
          plain:
            "If the same fact is stored in several places, those copies drift apart. Normalisation splits tables so each fact lives in exactly one place, which keeps data consistent when it changes.",
          terms: ["normalisation", "normal-form", "data-anomaly", "functional-dependency", "bcnf"],
        },
        {
          slug: "oltp-olap",
          title: "Transactions vs analytics",
          summary: "Why reporting models look different.",
          minutes: 20,
          signature:
            "Run a checkout and a yearly sales report against a normalised model and a denormalised one",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "OLTP and OLAP workloads",
            "Denormalisation",
            "Separate models for separate jobs",
          ],
          status: "live",
          level: "core",
          prerequisites: ["normalisation"],
          plain:
            "Systems that take orders need small, fast, consistent updates, so they're normalised. Systems that answer questions over millions of rows prefer fewer joins, so they're often denormalised. Most organisations need both.",
          terms: ["oltp", "olap", "denormalisation", "etl"],
        },
      ],
    },
    {
      slug: "dimensional",
      title: "Dimensional modelling",
      summary: "Stars, facts and dimensions.",
      modules: [
        {
          slug: "star-schema",
          title: "Facts, dimensions and the star schema",
          summary: "The shape most analytics uses.",
          minutes: 25,
          signature:
            "Build a star schema for shop sales and answer questions by slicing measures by dimensions",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Facts and measures",
            "Dimensions and attributes",
            "Why stars are fast and easy",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["oltp-olap"],
          plain:
            "In a star schema, a central fact table records business events with numbers you can add up, and surrounding dimension tables describe them: who, what, where, when. Questions become 'total this, by that'.",
          terms: ["fact", "fact-table", "dimension-table", "star-schema"],
        },
        {
          slug: "grain",
          title: "The four-step design process",
          summary: "Start by declaring the grain.",
          minutes: 25,
          signature:
            "Design a fact table for supermarket sales: pick the process, declare the grain, choose dimensions and facts",
          formats: ["step-through", "checkpoint"],
          concepts: ["Business processes", "Declaring the grain", "Choosing dimensions and facts"],
          status: "live",
          level: "core",
          prerequisites: ["star-schema"],
          plain:
            "Kimball's method has four steps, and the second is the one teams get wrong: say exactly what one row of the fact table means. Every other decision follows from that.",
          terms: ["grain", "atomic-grain", "degenerate-dimension", "business-process"],
        },
        {
          slug: "fact-tables",
          title: "Types of fact table",
          summary: "Transactions, snapshots and accumulating snapshots.",
          minutes: 25,
          signature:
            "Model the same order process as a transaction fact, a periodic snapshot and an accumulating snapshot",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Transaction facts",
            "Periodic and accumulating snapshots",
            "Additive and semi-additive measures",
          ],
          status: "live",
          level: "core",
          prerequisites: ["grain"],
          plain:
            "Not every fact table records single events. Some take a regular snapshot, like daily stock levels; others follow a process from start to finish, like an order moving through stages. Each answers different questions.",
          terms: [
            "transaction-fact",
            "periodic-snapshot",
            "accumulating-snapshot",
            "additive-fact",
            "semi-additive-fact",
            "factless-fact",
          ],
        },
        {
          slug: "conformed-dimensions",
          title: "Conformed dimensions and the bus matrix",
          summary: "Making separate stars add up.",
          minutes: 20,
          signature: "Fill in a bus matrix for a retailer and see which reports can be combined",
          formats: ["build-connect", "checkpoint"],
          concepts: ["Conformed dimensions", "The bus matrix", "Drilling across"],
          status: "live",
          level: "core",
          prerequisites: ["star-schema"],
          plain:
            "When sales and returns use the same customer and product dimensions, their numbers can be compared side by side. Conformed dimensions are the glue that makes many stars one warehouse.",
          terms: ["conformed-dimension", "bus-matrix", "drill-across"],
        },
        {
          slug: "dimension-patterns",
          title: "Dimension patterns",
          summary: "Role-playing, junk, degenerate and snowflaked dimensions.",
          minutes: 25,
          signature: "Fix five awkward dimension designs with the right pattern",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Role-playing dimensions",
            "Junk and degenerate dimensions",
            "Snowflakes and outriggers",
          ],
          status: "live",
          level: "core",
          prerequisites: ["star-schema"],
          plain:
            "Real dimensions are messy: one date table used three ways, a pile of yes/no flags, an order number with nowhere to live. A handful of named patterns handles them.",
          terms: [
            "role-playing-dimension",
            "junk-dimension",
            "degenerate-dimension",
            "snowflake",
            "outrigger",
          ],
        },
        {
          slug: "scd",
          title: "Slowly changing dimensions",
          summary: "Keeping history when descriptions change.",
          minutes: 25,
          signature:
            "A customer moves city: apply SCD types 0, 1, 2 and 3 and see what last year's report says",
          formats: ["simulation", "checkpoint"],
          concepts: ["Type 1: overwrite", "Type 2: new row with dates", "Types 0, 3 and hybrids"],
          status: "live",
          level: "core",
          prerequisites: ["dimension-patterns"],
          plain:
            "Customers move, products get renamed. Should old sales show the old city or the new one? Slowly changing dimension techniques let you choose, per attribute, whether to keep history.",
          terms: ["scd", "scd-type-1", "scd-type-2", "mini-dimension", "surrogate-key"],
        },
      ],
    },
    {
      slug: "approaches",
      title: "Other approaches",
      summary: "Beyond the classic star.",
      modules: [
        {
          slug: "inmon-kimball",
          title: "Inmon, Kimball and the enterprise warehouse",
          summary: "Two schools, and how they converged.",
          minutes: 20,
          signature:
            "Build the same warehouse top-down and bottom-up and compare time to first report",
          formats: ["animated-infographic", "checkpoint"],
          concepts: ["Inmon's normalised warehouse", "Kimball's dimensional bus", "Hybrids today"],
          status: "live",
          level: "core",
          prerequisites: ["conformed-dimensions"],
          plain:
            "In the 1990s two approaches competed: build one normalised enterprise warehouse first, then marts; or build dimensional marts that share dimensions. Most modern platforms mix both.",
          terms: [
            "enterprise-data-warehouse",
            "data-mart",
            "corporate-information-factory",
            "bus-matrix",
          ],
        },
        {
          slug: "data-vault",
          title: "Data Vault",
          summary: "Hubs, links and satellites.",
          minutes: 25,
          signature:
            "Load customer data from two source systems into hubs, links and satellites, then add a third source",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Hubs, links and satellites",
            "Auditability and history",
            "When Data Vault fits",
          ],
          status: "live",
          level: "deep",
          prerequisites: ["inmon-kimball"],
          plain:
            "Data Vault separates the stable business keys, the relationships between them, and the changing descriptive details into different tables. It makes adding new sources and keeping full history easier, at the cost of more tables and joins.",
          terms: ["data-vault", "hub", "link-table", "satellite"],
        },
        {
          slug: "wide-tables",
          title: "One big table",
          summary: "Denormalising for columnar engines.",
          minutes: 20,
          signature:
            "Query a star and a single wide table on a columnar engine and compare joins, storage and flexibility",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Wide denormalised tables",
            "Columnar storage changes the trade-offs",
            "Nested and repeated fields",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["star-schema"],
          plain:
            "Columnar engines read only the columns a query needs and compress repeated values well, so a single very wide table can be practical. It's simple to query but harder to keep consistent.",
          terms: ["one-big-table", "columnar-storage", "nested-fields", "denormalisation"],
        },
        {
          slug: "semantic-layer",
          title: "Metrics and semantic layers",
          summary: "Define revenue once.",
          minutes: 20,
          signature:
            "Three dashboards compute 'active customers' three ways; define it once in a semantic layer",
          formats: ["simulation", "checkpoint"],
          concepts: ["Metric definitions", "Semantic layers", "Consistency across tools"],
          status: "live",
          level: "applied",
          prerequisites: ["star-schema"],
          plain:
            "Even with good tables, different teams calculate the same metric differently. A semantic layer defines metrics and how tables join once, and every tool asks it instead of writing its own SQL.",
          terms: ["semantic-layer", "metric-definition"],
        },
      ],
    },
    {
      slug: "practice",
      title: "Modern practice",
      summary: "Modelling in today's tools and data stores.",
      modules: [
        {
          slug: "dbt-layers",
          title: "Layered modelling with dbt",
          summary: "Staging, intermediate and marts.",
          minutes: 25,
          signature:
            "Organise a project into staging, intermediate and mart models and trace one metric back to its sources",
          formats: ["build-connect", "checkpoint"],
          concepts: ["Staging, intermediate, marts", "Models as code", "Lineage and tests"],
          status: "live",
          level: "applied",
          prerequisites: ["star-schema"],
          plain:
            "Modern teams build models as code in layers: clean each source, combine and reshape, then publish business-ready tables. Tools like dbt make each step a versioned, tested query with visible lineage.",
          terms: ["dbt", "staging-model", "mart-model", "lineage-graph", "data-test"],
        },
        {
          slug: "nosql-modelling",
          title: "Modelling for NoSQL",
          summary: "Start from the access patterns.",
          minutes: 25,
          signature:
            "Model the same orders data for a relational database, a document store and a key-value store",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Access-pattern-first design",
            "Embedding vs referencing",
            "Single-table design",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["normalisation"],
          plain:
            "Document and key-value databases don't do joins well, so you design around the questions the application asks, often duplicating data deliberately so each read is a single lookup.",
          terms: ["access-pattern", "embedding", "referencing", "single-table-design"],
        },
        {
          slug: "graph-modelling",
          title: "Graph models",
          summary: "When relationships are the point.",
          minutes: 20,
          signature: "Find friends-of-friends and fraud rings in a table model and a graph model",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Nodes, edges and properties",
            "Property graphs and RDF",
            "When to use a graph",
          ],
          status: "live",
          level: "applied",
          prerequisites: ["keys-relationships"],
          plain:
            "When the important questions are about connections, like who knows whom or which accounts share a phone, a graph model stores relationships directly and makes multi-hop questions natural.",
          terms: ["property-graph", "graph-node", "graph-edge", "rdf"],
        },
        {
          slug: "modelling-time",
          title: "Modelling time",
          summary: "Valid time, system time and snapshots.",
          minutes: 25,
          signature:
            "Correct a price that was wrong last month and answer what you knew then versus what was true then",
          formats: ["simulation", "checkpoint"],
          concepts: ["Effective dating", "Bitemporal models", "Snapshots and event tables"],
          status: "live",
          level: "deep",
          prerequisites: ["scd"],
          plain:
            "Data changes, and sometimes past data turns out to be wrong. Tracking both when something was true and when you recorded it lets you answer 'what did the report say last month?' as well as 'what was actually true?'.",
          terms: ["valid-time", "transaction-time", "bitemporal"],
        },
        {
          slug: "evolving-models",
          title: "Naming, documentation and change",
          summary: "Keeping a model usable for years.",
          minutes: 20,
          signature:
            "Rename a column used by twelve reports, safely, with conventions, docs and deprecation",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Naming conventions", "Documentation and catalogs", "Changing models safely"],
          status: "live",
          level: "applied",
          prerequisites: ["dbt-layers"],
          plain:
            "A model is used by many people for years. Consistent names, written definitions and a careful way to change things keep it understandable and stop changes from silently breaking reports.",
          terms: ["model-contract", "model-version", "deprecation", "data-catalog"],
        },
      ],
    },
    {
      slug: "capstone",
      title: "Capstone",
      summary: "Everything together.",
      modules: [
        {
          slug: "capstone-model",
          title: "Capstone: model a food-delivery business",
          summary: "From questions to a warehouse design.",
          minutes: 40,
          signature:
            "Interview the business, design facts and dimensions, handle history, and test your model against ten real questions",
          formats: ["branching-scenario", "checkpoint"],
          concepts: ["Applying data modelling"],
          status: "live",
          level: "applied",
          prerequisites: ["scd", "conformed-dimensions", "fact-tables"],
          plain:
            "Everything in this track in one design: turn a food-delivery company's questions into a warehouse model, and check it answers them correctly.",
          terms: [
            "grain",
            "accumulating-snapshot",
            "scd-type-2",
            "conformed-dimension",
            "semantic-layer",
            "model-contract",
          ],
        },
      ],
    },
  ],
};

const dataQuality: Track = {
  slug: "data-quality",
  title: "Data Quality",
  area: "Data engineering",
  category: "data-engineering",
  tagline: "Tests, contracts and observability for data.",
  description:
    "How to make data trustworthy and keep it that way: what quality means and its dimensions, testing data like code, profiling, validation frameworks, where to test in a pipeline, failing well, data contracts, schema evolution, ownership, freshness objectives, data observability, anomaly detection, lineage, data incidents, duplicates and entity resolution, reconciliation, late data, quality for machine learning and AI, and the tool landscape. Vendor-neutral, covering open-source frameworks, commercial observability platforms and the quality features of AWS, Google Cloud, Azure and Databricks. By the end you can design the checks, contracts and monitors a pipeline needs, and handle the day something gets through.",
  accent: "assay",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "Why bad data costs so much.",
      modules: [
        {
          slug: "why-quality",
          title: "Why data quality matters",
          summary: "When numbers lie.",
          minutes: 20,
          signature:
            "Follow one bad value from a form field to a board report and count who it fooled",
          formats: ["scroll-story", "checkpoint"],
          concepts: ["What data quality means", "The cost of bad data", "Fit for purpose"],
          status: "live",
          level: "beginner",
          plain:
            "Data is good enough when it is fit for the job people use it for. Bad data rarely announces itself: a wrong number flows quietly into reports, models and decisions until someone notices the damage.",
          terms: ["data-quality", "fitness-for-use", "data-consumer", "hidden-data-factory"],
        },
        {
          slug: "quality-dimensions",
          title: "Dimensions of data quality",
          summary: "Six ways data goes wrong.",
          minutes: 20,
          signature: "Inspect a customer table, find each defect and name the dimension it breaks",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Completeness, uniqueness, validity",
            "Accuracy, consistency, timeliness",
            "Measuring each dimension",
          ],
          status: "live",
          level: "beginner",
          prerequisites: ["why-quality"],
          plain:
            "'Bad data' is too vague to fix. Breaking it into dimensions, such as missing values, duplicates, wrong formats, out-of-date records, makes each problem measurable and gives you a checklist.",
          terms: ["dq-dimension", "completeness", "validity", "accuracy", "timeliness"],
        },
      ],
    },
    {
      slug: "testing",
      title: "Testing data",
      summary: "Checks that run every time data moves.",
      modules: [
        {
          slug: "data-tests",
          title: "Testing data like code",
          summary: "Assertions about every load.",
          minutes: 25,
          signature:
            "Write not-null, unique, accepted-value and relationship tests and watch a bad load fail them",
          formats: ["build-connect", "checkpoint"],
          concepts: ["Assertions on data", "Generic tests", "Tests in version control"],
          status: "live",
          level: "beginner",
          prerequisites: ["quality-dimensions"],
          plain:
            "Software teams test code before it ships. Data teams can test data the same way: small, automatic assertions such as 'every order has a customer' that run on every load and fail loudly.",
          terms: ["data-test", "assertion", "generic-test"],
        },
        {
          slug: "profiling",
          title: "Profiling a dataset",
          summary: "Know your data before you judge it.",
          minutes: 20,
          signature: "Profile a new supplier file and turn what you find into rules",
          formats: ["simulation", "checkpoint"],
          concepts: ["Column statistics", "Distributions and outliers", "From profile to rules"],
          status: "live",
          level: "beginner",
          prerequisites: ["data-tests"],
          plain:
            "Before writing rules you need to know what normal looks like. Profiling counts nulls, distinct values, ranges and patterns in each column, and often reveals problems nobody suspected.",
          terms: ["data-profiling", "constraint-suggestion"],
        },
        {
          slug: "expectations",
          title: "Validation frameworks",
          summary: "Great Expectations, Soda, dbt and Deequ.",
          minutes: 25,
          signature:
            "Express the same five rules in three validation tools and compare what each reports",
          formats: ["simulation", "checkpoint"],
          concepts: ["Declarative checks", "Validation results and docs", "Choosing a framework"],
          status: "live",
          level: "core",
          prerequisites: ["data-tests"],
          plain:
            "Rather than hand-writing SQL checks, teams use frameworks where you declare expectations ('values between 0 and 100') and the tool runs them and reports results. Several open-source options exist.",
          terms: ["validation-framework", "expectation"],
        },
        {
          slug: "where-to-test",
          title: "Where to test in a pipeline",
          summary: "Catch it early, check it often.",
          minutes: 25,
          signature:
            "Place checks along a pipeline and see where each kind of bad data gets caught, or slips through",
          formats: ["build-connect", "checkpoint"],
          concepts: ["Testing at each layer", "Write-audit-publish", "Branches for data"],
          status: "live",
          level: "core",
          prerequisites: ["expectations"],
          plain:
            "A check at the end catches problems after the damage; a check only at the start misses what transformations break. Good pipelines test at every stage, and some stage new data out of sight until it passes.",
          terms: ["write-audit-publish", "shift-left", "data-branch"],
        },
        {
          slug: "severity",
          title: "Failing well",
          summary: "Warn, block or quarantine.",
          minutes: 20,
          signature:
            "Decide what each failed check should do, then run a bad night's load and see the consequences",
          formats: ["simulation", "checkpoint"],
          concepts: ["Severity levels", "Quarantine and dead letters", "Circuit breakers"],
          status: "live",
          level: "core",
          prerequisites: ["where-to-test"],
          plain:
            "Not every failure should stop the pipeline. Some checks should only warn, some should block publishing, and some should set bad rows aside so the rest can flow. Choosing well avoids both bad data and needless outages.",
          terms: ["test-severity", "quarantine", "dead-letter-queue", "circuit-breaker"],
        },
      ],
    },
    {
      slug: "contracts",
      title: "Contracts and ownership",
      summary: "Agreements between producers and consumers.",
      modules: [
        {
          slug: "data-contracts",
          title: "Data contracts",
          summary: "A promise from producer to consumer.",
          minutes: 25,
          signature:
            "Write a contract for an orders feed, then see which upstream change it catches",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Schema, semantics and guarantees",
            "Producer and consumer",
            "Open contract standards",
          ],
          status: "live",
          level: "core",
          prerequisites: ["data-tests"],
          plain:
            "Most data breaks because someone upstream changed something without knowing who depended on it. A data contract writes down what a dataset promises, its fields, meanings and freshness, and checks the promise automatically.",
          terms: ["data-contract", "data-producer", "odcs"],
        },
        {
          slug: "schema-evolution",
          title: "Schema changes",
          summary: "Change without breaking readers.",
          minutes: 25,
          signature:
            "Evolve an event schema under backward, forward and full compatibility and see which consumers break",
          formats: ["simulation", "checkpoint"],
          concepts: ["Breaking and compatible changes", "Compatibility modes", "Schema registries"],
          status: "live",
          level: "core",
          prerequisites: ["data-contracts"],
          plain:
            "Data shapes change: fields are added, renamed, retyped. Some changes are safe for existing readers and some are not. Compatibility rules, enforced by a schema registry, keep producers from breaking consumers.",
          terms: ["schema-evolution", "schema-registry", "backward-compatibility"],
        },
        {
          slug: "ownership",
          title: "Ownership and stewardship",
          summary: "Every dataset needs a name next to it.",
          minutes: 20,
          signature:
            "Assign owners, stewards and consumers for six datasets and route four incidents to the right person",
          formats: ["simulation", "checkpoint"],
          concepts: ["Owners and stewards", "Governance that helps", "Domain ownership"],
          status: "live",
          level: "core",
          prerequisites: ["data-contracts"],
          plain:
            "When nobody owns a dataset, nobody fixes it. Clear ownership says who answers questions, who approves changes and who gets woken when it breaks.",
          terms: ["data-governance", "data-owner", "data-steward", "data-mesh"],
        },
        {
          slug: "data-slas",
          title: "Freshness, SLAs and SLOs",
          summary: "How late is too late?",
          minutes: 20,
          signature:
            "Set a freshness objective for a dashboard and watch the error budget over a bad month",
          formats: ["simulation", "checkpoint"],
          concepts: ["Freshness and timeliness", "Service levels for data", "Error budgets"],
          status: "live",
          level: "core",
          prerequisites: ["ownership"],
          plain:
            "Users care whether data is there and up to date when they need it. Service level objectives turn 'the dashboard should be fresh' into a measurable target, with a budget for how often it may miss.",
          terms: ["data-freshness", "slo", "sla", "error-budget"],
        },
      ],
    },
    {
      slug: "observability",
      title: "Data observability",
      summary: "Seeing problems you didn't write tests for.",
      modules: [
        {
          slug: "data-observability",
          title: "Data observability",
          summary: "Monitoring the data, not just the jobs.",
          minutes: 25,
          signature:
            "Watch a table through freshness, volume, schema, distribution and lineage signals and spot the silent failure",
          formats: ["simulation", "checkpoint"],
          concepts: ["Signals to monitor", "Tests vs monitoring", "Data downtime"],
          status: "live",
          level: "core",
          prerequisites: ["data-slas"],
          plain:
            "A job can succeed while delivering half the rows or a column full of nulls. Data observability watches the data itself, how fresh, how much, what shape, so unknown problems surface too.",
          terms: ["data-observability", "data-downtime"],
        },
        {
          slug: "anomaly-detection",
          title: "Anomaly detection",
          summary: "Fixed thresholds versus learned baselines.",
          minutes: 25,
          signature:
            "Tune a row-count monitor with fixed limits and with a seasonal baseline, and count false alarms",
          formats: ["simulation", "checkpoint"],
          concepts: ["Thresholds", "Baselines and seasonality", "Alert fatigue"],
          status: "live",
          level: "core",
          prerequisites: ["data-observability"],
          plain:
            "Writing a rule for every metric is impossible, so monitors learn what normal looks like and flag what isn't. The hard part is catching real problems without crying wolf every Monday.",
          terms: ["anomaly-detection", "seasonality", "z-score", "alert-fatigue"],
        },
        {
          slug: "lineage",
          title: "Lineage and impact",
          summary: "Upstream causes, downstream damage.",
          minutes: 20,
          signature:
            "Trace a broken dashboard back to its source, then see everything else the same fault touched",
          formats: ["build-connect", "checkpoint"],
          concepts: ["Table and column lineage", "Root cause analysis", "Impact analysis"],
          status: "live",
          level: "core",
          prerequisites: ["data-observability"],
          plain:
            "Lineage is the map of which data feeds which. It answers two urgent questions in an incident: where did this break, and who else is affected?",
          terms: ["data-lineage", "impact-analysis", "openlineage"],
        },
        {
          slug: "data-incidents",
          title: "Handling data incidents",
          summary: "Detect, triage, fix, learn.",
          minutes: 25,
          signature: "Run a data incident from first alert to post-incident review",
          formats: ["branching-scenario", "checkpoint"],
          concepts: ["Triage and severity", "Communicating impact", "Backfills and reviews"],
          status: "live",
          level: "applied",
          prerequisites: ["lineage"],
          plain:
            "When bad data reaches users, speed and honesty matter: confirm the problem, tell the people affected, stop the spread, repair the data and learn why it happened.",
          terms: ["data-incident", "incident-commander", "backfill", "postmortem"],
        },
      ],
    },
    {
      slug: "hard-problems",
      title: "Hard problems",
      summary: "Duplicates, reconciliation, lateness and ML.",
      modules: [
        {
          slug: "deduplication",
          title: "Duplicates and entity resolution",
          summary: "Is this the same customer?",
          minutes: 25,
          signature:
            "Match customer records from two systems with exact and fuzzy rules and pick the surviving values",
          formats: ["simulation", "checkpoint"],
          concepts: ["Exact and fuzzy matching", "Survivorship", "Master data"],
          status: "live",
          level: "applied",
          prerequisites: ["quality-dimensions"],
          plain:
            "The same person appears as 'Asha Rao' in one system and 'A. Rao' in another. Entity resolution decides which records are the same thing and which values to keep, without merging strangers.",
          terms: ["entity-resolution", "survivorship", "master-data-management"],
        },
        {
          slug: "reconciliation",
          title: "Reconciliation",
          summary: "Do the numbers add up?",
          minutes: 20,
          signature:
            "Reconcile a warehouse table against its source by counts, sums and row-level diffs",
          formats: ["simulation", "checkpoint"],
          concepts: ["Counts and control totals", "Row-level diffs", "Tolerances"],
          status: "live",
          level: "applied",
          prerequisites: ["data-tests"],
          plain:
            "After data moves, you need proof nothing was lost or changed on the way. Reconciliation compares source and target, from simple totals to row-by-row differences.",
          terms: ["reconciliation", "control-total"],
        },
        {
          slug: "late-data",
          title: "Late and missing data",
          summary: "When data arrives out of order.",
          minutes: 20,
          signature:
            "Handle late-arriving events with reprocessing windows and idempotent backfills",
          formats: ["simulation", "checkpoint"],
          concepts: ["Late and out-of-order data", "Idempotent loads", "Backfills"],
          status: "live",
          level: "applied",
          prerequisites: ["data-slas"],
          plain:
            "Data doesn't always arrive on time or in order. Pipelines that can safely re-run a period, and know how long to wait, avoid both gaps and double counting.",
          terms: ["late-data", "idempotent", "event-time"],
        },
        {
          slug: "ml-data-quality",
          title: "Data quality for ML and AI",
          summary: "Garbage in, confident garbage out.",
          minutes: 25,
          signature: "Train on clean and dirty data, then watch a model drift as inputs change",
          formats: ["simulation", "checkpoint"],
          concepts: ["Training data quality", "Drift and skew", "Data for AI applications"],
          status: "live",
          level: "applied",
          prerequisites: ["data-observability"],
          plain:
            "Models learn whatever is in their data, including its mistakes. Label errors, skewed samples and inputs that drift after launch quietly degrade predictions and AI answers.",
          terms: ["data-drift", "concept-drift", "training-serving-skew"],
        },
        {
          slug: "dq-platforms",
          title: "Tools and platforms",
          summary: "Open source, vendors and cloud services.",
          minutes: 20,
          signature: "Map the data quality tools on the market to the jobs in this track",
          formats: ["animated-infographic", "checkpoint"],
          concepts: ["Open-source frameworks", "Observability platforms", "Cloud-native options"],
          status: "live",
          level: "applied",
          prerequisites: ["expectations", "data-observability"],
          plain:
            "There are open-source validation libraries, commercial observability platforms and quality features built into cloud data platforms. They cover different jobs, and most teams combine a few.",
          terms: ["rules-as-code", "data-catalog"],
        },
      ],
    },
    {
      slug: "capstone",
      title: "Capstone",
      summary: "Everything together.",
      modules: [
        {
          slug: "capstone-quality",
          title: "Capstone: the wrong revenue number",
          summary: "From incident to prevention.",
          minutes: 40,
          signature:
            "A board report shows revenue 18% too high: find the cause, fix the data and put the right defences in place",
          formats: ["branching-scenario", "fix-the-problem", "checkpoint"],
          concepts: ["Applying data quality"],
          status: "live",
          level: "applied",
          prerequisites: ["data-incidents", "data-contracts", "reconciliation"],
          plain:
            "Everything in this track in one incident: trace a wrong number to its source, repair it, and choose the tests, contracts and monitors that would have caught it.",
          terms: ["defence-in-depth", "data-incident"],
        },
      ],
    },
  ],
};

const aiAgents: Track = {
  slug: "ai-agents",
  title: "AI Agents",
  area: "AI & machine learning",
  category: "ai-ml",
  tagline: "Tools, planning, memory and guardrails.",
  description:
    "How AI agents work and how to build ones you can trust: the agent loop, workflows versus agents, tool design, the Model Context Protocol, code and computer use, planning, reflection, error recovery, memory, long-running context, durable state, multi-agent systems, agent-to-agent protocols, frameworks and managed platforms, guardrails, prompt injection, humans in the loop, evaluation, and cost and tracing. Vendor-neutral, covering open-source frameworks and the agent services of OpenAI, Anthropic, Google, AWS and Microsoft. By the end you can decide when an agent is the right tool, design one, and keep it safe and affordable in production.",
  accent: "orbit",
  chapters: [
    {
      slug: "big-picture",
      title: "The big picture",
      summary: "What makes a program an agent.",
      modules: [
        {
          slug: "what-is-an-agent",
          title: "What an agent is",
          summary: "A model in a loop, with tools.",
          minutes: 20,
          signature:
            "Follow one request as a chatbot, a workflow and an agent, and see who decides each step",
          formats: ["scroll-story", "checkpoint"],
          concepts: [
            "A model, tools and a loop",
            "Autonomy is a dial",
            "When an agent is worth it",
          ],
          status: "live",
          level: "beginner",
          plain:
            "A chatbot answers once. An agent is given a goal and works towards it on its own: it decides what to do next, uses tools such as search or a calendar, looks at the result and keeps going until it's done.",
          terms: ["ai-agent", "agent-workflow", "agent-autonomy", "tool-calling"],
        },
        {
          slug: "agent-loop",
          title: "The agent loop",
          summary: "Think, act, observe, repeat.",
          minutes: 20,
          signature:
            "Step through an agent solving a task one turn at a time and read every tool call and result",
          formats: ["step-through", "checkpoint"],
          concepts: ["Reason and act", "Tool results as observations", "Stopping conditions"],
          status: "planned",
          level: "beginner",
          prerequisites: ["what-is-an-agent"],
          plain:
            "Every agent runs the same loop: the model looks at the goal and what it knows, picks an action, your code carries it out, and the result goes back to the model. The loop ends when the model says it's finished, or a limit is hit.",
        },
        {
          slug: "workflows-vs-agents",
          title: "Workflows or agents?",
          summary: "Fixed steps or free choice.",
          minutes: 25,
          signature:
            "Match six business tasks to chaining, routing, parallel, orchestrator and evaluator patterns, or a full agent",
          formats: ["build-connect", "checkpoint"],
          concepts: [
            "Prompt chaining and routing",
            "Parallel and orchestrator-workers",
            "Start simple",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["agent-loop"],
          plain:
            "Many 'agents' are better built as workflows, where your code fixes the steps and the model fills each one in. Workflows are cheaper and more predictable; agents are for tasks where nobody can know the steps in advance.",
        },
      ],
    },
    {
      slug: "tools",
      title: "Tools",
      summary: "How agents act on the world.",
      modules: [
        {
          slug: "tool-design",
          title: "Designing tools",
          summary: "Names, descriptions and errors the model can use.",
          minutes: 25,
          signature: "Rewrite three badly designed tools and watch the agent's success rate change",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Clear names and descriptions",
            "Inputs, outputs and errors",
            "Fewer, better tools",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["agent-loop"],
          plain:
            "A model only knows a tool from its name, description and inputs. Vague descriptions, confusing parameters and unhelpful error messages cause most agent mistakes, so tools deserve the same care as an interface for people.",
        },
        {
          slug: "mcp",
          title: "Model Context Protocol",
          summary: "One plug for many tools.",
          minutes: 25,
          signature:
            "Connect one assistant to three MCP servers and trace a request through host, client and server",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Hosts, clients and servers",
            "Tools, resources and prompts",
            "Local and remote servers",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["tool-design"],
          plain:
            "Every app used to wire up its own tool integrations. The Model Context Protocol is an open standard, like a universal plug: a tool provider writes one MCP server, and any compatible assistant can use it.",
        },
        {
          slug: "computer-use",
          title: "Code, browsers and computers",
          summary: "Agents that type, click and run code.",
          minutes: 25,
          signature:
            "Give an agent a code sandbox, a browser and a desktop, and compare speed, reliability and risk on one task",
          formats: ["simulation", "checkpoint"],
          concepts: ["Code execution", "Browser and computer use", "Sandboxes"],
          status: "planned",
          level: "core",
          prerequisites: ["tool-design"],
          plain:
            "Some agents act through general-purpose tools: they write and run code, browse websites or look at a screen and move the mouse. These tools are very flexible but slower and riskier, so they run in isolated sandboxes.",
        },
      ],
    },
    {
      slug: "planning",
      title: "Planning and reasoning",
      summary: "Breaking goals into steps.",
      modules: [
        {
          slug: "planning",
          title: "Planning and decomposition",
          summary: "Plan first, or decide as you go.",
          minutes: 25,
          signature:
            "Run the same research task with step-by-step reasoning and with a plan-then-execute agent, and compare",
          formats: ["simulation", "checkpoint"],
          concepts: ["Decomposing a goal", "Plan and execute", "Re-planning"],
          status: "planned",
          level: "core",
          prerequisites: ["agent-loop"],
          plain:
            "Big goals need breaking into steps. Some agents decide one step at a time; others write a plan first and then carry it out, revising it when something unexpected happens.",
        },
        {
          slug: "reflection",
          title: "Reflection and self-correction",
          summary: "Check the work, then improve it.",
          minutes: 20,
          signature:
            "Add a critic to an agent's loop and watch its draft improve, or go round in circles",
          formats: ["simulation", "checkpoint"],
          concepts: ["Evaluator and optimiser", "Feedback from tools", "Knowing when to stop"],
          status: "planned",
          level: "core",
          prerequisites: ["planning"],
          plain:
            "Agents get better results when they check their own work: running the tests, re-reading the question or asking a second model to critique. Feedback from the real world, like a failing test, is worth more than the model's own opinion.",
        },
        {
          slug: "errors-recovery",
          title: "Errors, retries and limits",
          summary: "When a step goes wrong.",
          minutes: 20,
          signature:
            "Inject timeouts, bad inputs and dead ends into an agent's run and choose how it should recover",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Errors as information", "Retries and fallbacks", "Step and budget limits"],
          status: "planned",
          level: "core",
          prerequisites: ["reflection"],
          plain:
            "Tools fail, websites change and models misread results. Robust agents treat errors as information, retry sensibly, try another route, and stop when a step or spending limit is reached instead of looping forever.",
        },
      ],
    },
    {
      slug: "memory",
      title: "Memory and context",
      summary: "What an agent remembers.",
      modules: [
        {
          slug: "agent-memory",
          title: "Memory",
          summary: "Short-term, long-term and shared.",
          minutes: 25,
          signature:
            "Give an assistant working, episodic and semantic memory and see what it remembers a week later",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "The context window as working memory",
            "Long-term memory stores",
            "What to remember and forget",
          ],
          status: "planned",
          level: "core",
          prerequisites: ["agent-loop"],
          plain:
            "A model remembers nothing between calls; everything it knows about the task must be in its context. Agents add memory by saving notes, facts and past episodes somewhere and loading the useful ones back in.",
        },
        {
          slug: "context-management",
          title: "Managing long tasks",
          summary: "Keeping the context window useful.",
          minutes: 25,
          signature:
            "Run a 200-step task and choose when to summarise, take notes or hand work to a sub-agent",
          formats: ["simulation", "checkpoint"],
          concepts: ["Context fills up", "Compaction and notes", "Sub-agents for isolation"],
          status: "planned",
          level: "core",
          prerequisites: ["agent-memory"],
          plain:
            "Long tasks produce more text than fits in a model's context, and quality drops as it fills. Agents keep going by summarising old turns, writing notes to files and giving self-contained jobs to helper agents with fresh contexts.",
        },
        {
          slug: "durable-agents",
          title: "State, pauses and resumption",
          summary: "Agents that survive restarts.",
          minutes: 20,
          signature:
            "Crash an agent halfway through a refund and resume it from a checkpoint without paying twice",
          formats: ["simulation", "checkpoint"],
          concepts: ["Saving state", "Checkpoints and replay", "Pausing for approval"],
          status: "planned",
          level: "applied",
          prerequisites: ["context-management"],
          plain:
            "Real tasks can take minutes or days and must survive crashes, deploys and waiting for a person. Saving the agent's state after each step lets it pause, resume and avoid repeating actions that already happened.",
        },
      ],
    },
    {
      slug: "multi-agent",
      title: "Many agents",
      summary: "Teams, protocols and frameworks.",
      modules: [
        {
          slug: "multi-agent",
          title: "Multi-agent systems",
          summary: "When one agent isn't enough.",
          minutes: 25,
          signature:
            "Split a research job between an orchestrator and three workers, and compare speed, cost and quality with one agent",
          formats: ["simulation", "checkpoint"],
          concepts: ["Orchestrator and sub-agents", "Handoffs", "The cost of coordination"],
          status: "planned",
          level: "applied",
          prerequisites: ["context-management"],
          plain:
            "Several agents can work in parallel or specialise, with one coordinating. That can be faster and better for broad tasks, but it multiplies cost and adds new ways to fail, so one agent is often the right answer.",
        },
        {
          slug: "agent-protocols",
          title: "Agents talking to agents",
          summary: "Standards for cooperation.",
          minutes: 20,
          signature:
            "Have a travel agent discover and delegate to a hotel agent from another company",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Agent cards and discovery",
            "Tasks between agents",
            "MCP versus agent-to-agent",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["mcp", "multi-agent"],
          plain:
            "When agents from different companies need to cooperate, they need a shared language. Agent-to-agent protocols let one agent find another, learn what it can do and hand it a task, much as MCP standardises tools.",
        },
        {
          slug: "agent-frameworks",
          title: "Frameworks and platforms",
          summary: "Build it, or use a kit.",
          minutes: 20,
          signature:
            "Map agent frameworks and cloud agent services to the jobs they handle for you",
          formats: ["animated-infographic", "checkpoint"],
          concepts: [
            "Agent SDKs and graph frameworks",
            "Managed agent platforms",
            "Choosing and staying portable",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["multi-agent"],
          plain:
            "You can write an agent loop in a few dozen lines, or use a framework that adds tools, memory, tracing and multi-agent support. Cloud providers also run agents for you. Each saves work and adds dependence.",
        },
      ],
    },
    {
      slug: "production",
      title: "Safety and production",
      summary: "Trustworthy agents in the real world.",
      modules: [
        {
          slug: "guardrails",
          title: "Guardrails and permissions",
          summary: "Limit what can go wrong.",
          minutes: 25,
          signature:
            "Set permissions for an email agent and see which of five risky actions it can still take",
          formats: ["simulation", "checkpoint"],
          concepts: ["Least privilege", "Approvals for risky actions", "Input and output checks"],
          status: "planned",
          level: "applied",
          prerequisites: ["computer-use"],
          plain:
            "An agent can only do damage with the access you give it. Good designs grant the fewest permissions needed, ask a person before irreversible actions, and check inputs and outputs automatically.",
        },
        {
          slug: "agent-security",
          title: "Prompt injection and agents",
          summary: "When the data gives orders.",
          minutes: 25,
          signature:
            "Send an agent to read a web page with hidden instructions and find the combination that leaks data",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: [
            "Indirect prompt injection",
            "Private data, untrusted content, a way out",
            "Defences that work",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["guardrails"],
          plain:
            "Agents read emails, web pages and documents written by strangers, and a model can't reliably tell data from instructions. Hidden text can hijack an agent, so the defence is limiting what a hijacked agent could do.",
        },
        {
          slug: "human-in-the-loop",
          title: "Humans in the loop",
          summary: "Who decides, and when.",
          minutes: 20,
          signature:
            "Choose where an expense agent asks a person, and balance speed against mistakes over a month",
          formats: ["simulation", "checkpoint"],
          concepts: ["Approval and escalation", "Levels of autonomy", "Designing the handover"],
          status: "planned",
          level: "applied",
          prerequisites: ["guardrails"],
          plain:
            "Most useful agents work with people, not instead of them. Deciding which steps need approval, when to escalate and how to show the person what the agent did is central to trusting it.",
        },
        {
          slug: "agent-evals",
          title: "Evaluating agents",
          summary: "Did it work, and how?",
          minutes: 25,
          signature:
            "Score five agent runs on outcome, path and cost, and see why one success rate isn't enough",
          formats: ["simulation", "checkpoint"],
          concepts: [
            "Outcome versus trajectory",
            "Benchmarks for agents",
            "Reliability over many runs",
          ],
          status: "planned",
          level: "applied",
          prerequisites: ["errors-recovery"],
          plain:
            "An agent can reach the right answer by a wasteful or dangerous route, or succeed once and fail the next time. Evaluating agents means checking outcomes, the steps taken, cost and consistency across many runs.",
        },
        {
          slug: "agent-ops",
          title: "Cost, latency and tracing",
          summary: "Running agents day to day.",
          minutes: 20,
          signature:
            "Trace a slow, expensive agent run step by step and cut its cost without hurting results",
          formats: ["fix-the-problem", "checkpoint"],
          concepts: ["Tokens per task", "Tracing agent runs", "Caching and model choice"],
          status: "planned",
          level: "applied",
          prerequisites: ["agent-evals"],
          plain:
            "Agents make many model calls per task, so cost and delay add up quickly. Tracing every step shows where time and tokens go, and techniques like caching, smaller models for easy steps and fewer loops bring them down.",
        },
      ],
    },
    {
      slug: "capstone",
      title: "Capstone",
      summary: "Everything together.",
      modules: [
        {
          slug: "capstone-agent",
          title: "Capstone: the support agent",
          summary: "Design, break and fix a real agent.",
          minutes: 40,
          signature:
            "Design a customer-support agent, watch it fail in five realistic ways and fix each with what you've learned",
          formats: ["branching-scenario", "fix-the-problem", "checkpoint"],
          concepts: ["Applying agent design"],
          status: "planned",
          level: "applied",
          prerequisites: ["guardrails", "agent-evals", "human-in-the-loop"],
          plain:
            "Everything in this track in one project: choose workflow or agent, design the tools, add memory and guardrails, keep a person in the loop and prove it works.",
        },
      ],
    },
  ],
};

export const tracks: Track[] = [
  lakehouse,
  systemDesign,
  llmFoundations,
  agileScrum,
  ragSystems,
  cloudArchitecture,
  streamingData,
  kubernetes,
  ciCd,
  observability,
  apiDesign,
  databaseInternals,
  enterprisePatterns,
  spark,
  dataModelling,
  dataQuality,
  aiAgents,
  playground,
];

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
        slug: "streaming-data",
        blurb: "Events, windows, state and exactly-once pipelines.",
      },
      {
        title: "Apache Spark",
        slug: "spark",
        blurb: "How distributed dataframes plan, shuffle and scale.",
      },
      {
        title: "Data Modelling",
        slug: "data-modelling",
        blurb: "Stars, snowflakes, vaults and when to use each.",
      },
      {
        title: "Data Quality",
        slug: "data-quality",
        blurb: "Tests, contracts and observability for data.",
      },
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
        slug: "rag-systems",
        blurb: "Grounding models in your documents: retrieval, chunking and ranking.",
      },
      { title: "AI Agents", slug: "ai-agents", blurb: "Tools, planning, memory and guardrails." },
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
    accent: "stratus",
    tracks: [
      {
        title: "Cloud Architecture",
        slug: "cloud-architecture",
        blurb: "Networks, identity and landing zones across the big clouds.",
      },
      {
        title: "Kubernetes",
        slug: "kubernetes",
        blurb: "Pods, controllers and scheduling, taken apart.",
      },
      {
        title: "CI/CD",
        slug: "ci-cd",
        blurb: "From commit to production, safely and often.",
      },
      {
        title: "Observability",
        slug: "observability",
        blurb: "Metrics, logs, traces and SLOs in depth.",
      },
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
      {
        title: "API Design",
        slug: "api-design",
        blurb: "Resources, versions, pagination and contracts.",
      },
      {
        title: "Database Internals",
        slug: "database-internals",
        blurb: "Pages, indexes, logs and transactions underneath SQL.",
      },
      {
        title: "Enterprise Patterns",
        slug: "enterprise-patterns",
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
    accent: "cadence",
    tracks: [
      {
        title: "Agile & Scrum",
        slug: "agile-scrum",
        blurb: "The ceremonies, and the thinking behind them.",
      },
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
