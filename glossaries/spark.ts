import type { GlossaryEntry } from "./types";

/** Apache Spark track glossary. `module` slugs refer to this track. */
export const spark = {
  cluster: {
    term: "Cluster",
    definition: "A group of computers working together as one system, each handling part of a job.",
    module: "why-spark",
  },
  mapreduce: {
    term: "MapReduce",
    definition:
      "Google's 2004 model for processing large data on many machines: a map step processes each piece, a reduce step combines results by key. Hadoop made it widely available; it writes data to disk between steps.",
    module: "why-spark",
  },
  "in-memory-processing": {
    term: "In-memory processing",
    definition:
      "Keeping data in a computer's main memory between processing steps instead of writing it to disk and reading it back, which is much faster.",
    module: "why-spark",
  },
  "iterative-job": {
    term: "Iterative job",
    definition:
      "A job that passes over the same data many times, such as training a machine-learning model. It benefits most from keeping data in memory.",
    module: "why-spark",
  },
  driver: {
    term: "Driver",
    definition:
      "The process that runs your Spark program, creates the SparkSession, plans the work and schedules tasks on executors.",
    analogy: "A head chef who plans the order and hands out jobs.",
    module: "cluster-anatomy",
  },
  executor: {
    term: "Executor",
    definition:
      "A process started for one Spark application on a worker machine. It runs tasks and keeps data in memory or on disk for that application.",
    module: "cluster-anatomy",
  },
  task: {
    term: "Task",
    definition:
      "The smallest unit of work in Spark: one operation on one partition of data, run by one executor.",
    module: "cluster-anatomy",
  },
  "cluster-manager": {
    term: "Cluster manager",
    definition:
      "The service that gives a Spark application machines to run on: Spark's standalone manager, Hadoop YARN or Kubernetes.",
    module: "cluster-anatomy",
  },
  "deploy-mode": {
    term: "Deploy mode",
    definition:
      "Where a Spark application's driver runs: inside the cluster (cluster mode) or on the machine that submitted it (client mode).",
    module: "cluster-anatomy",
  },
  "spark-connect": {
    term: "Spark Connect",
    definition:
      "A client-server option, since Spark 3.4, in which a lightweight client sends DataFrame plans to a remote Spark cluster and receives results back.",
    module: "cluster-anatomy",
  },
  rdd: {
    term: "RDD (resilient distributed dataset)",
    definition:
      "Spark's original data abstraction: an immutable collection of objects split into partitions across a cluster, processed by your functions, and rebuilt from its lineage if a partition is lost.",
    module: "rdds-dataframes",
  },
  dataframe: {
    term: "DataFrame",
    definition:
      "A distributed table of rows with named, typed columns. Because Spark knows the schema and the operations, it can optimise DataFrame code heavily.",
    analogy: "A labelled spreadsheet rather than a box of papers.",
    module: "rdds-dataframes",
  },
  "dataset-spark": {
    term: "Dataset (Spark)",
    definition:
      "A typed version of a DataFrame for Scala and Java, combining compile-time types with Spark's optimiser. In those languages a DataFrame is a Dataset of rows.",
    module: "rdds-dataframes",
  },
  "schema-spark": {
    term: "Schema",
    definition:
      "The names and types of a DataFrame's columns, which Spark uses to plan and optimise work.",
    module: "rdds-dataframes",
  },
  lineage: {
    term: "Lineage",
    definition:
      "The recorded chain of transformations that produced a dataset. Spark uses it to recompute lost partitions instead of keeping copies.",
    analogy: "Keeping the recipe, so you can cook the dish again.",
    module: "rdds-dataframes",
  },
  transformation: {
    term: "Transformation",
    definition:
      "An operation that defines a new DataFrame or RDD from an existing one, such as filter or select. It is added to Spark's plan but not run until an action needs the result.",
    module: "lazy-evaluation",
  },
  action: {
    term: "Action",
    definition:
      "An operation that needs a real result, such as count, show, collect or write. It makes Spark run the plan as a job.",
    module: "lazy-evaluation",
  },
  "lazy-evaluation": {
    term: "Lazy evaluation",
    definition:
      "Delaying work until a result is actually needed. Spark records transformations and only runs them when an action is called, so it can optimise the whole plan first.",
    analogy: "A personal shopper who writes the list and only sets off when you say go.",
    module: "lazy-evaluation",
  },
  dag: {
    term: "DAG",
    definition:
      "Directed acyclic graph: the network of steps Spark builds from your transformations, with arrows from each step to the ones that use its output and no loops.",
    module: "lazy-evaluation",
  },
  "narrow-transformation": {
    term: "Narrow transformation",
    definition:
      "A transformation where each output partition needs data from only one input partition, like filter or select. Spark can chain these together without moving data.",
    module: "lazy-evaluation",
  },
  "wide-transformation": {
    term: "Wide transformation",
    definition:
      "A transformation where an output partition needs data from many input partitions, like groupBy or most joins. It requires a shuffle and starts a new stage.",
    module: "lazy-evaluation",
  },
  partition: {
    term: "Partition",
    definition:
      "One chunk of a distributed dataset. Spark processes each partition with one task, so the number of partitions limits how much work runs at once.",
    analogy: "A bundle of exam papers handed to one marker.",
    module: "partitions",
  },
  parallelism: {
    term: "Parallelism",
    definition:
      "How many tasks run at the same time; limited by both the number of partitions and the number of free task slots (cores).",
    module: "partitions",
  },
  coalesce: {
    term: "coalesce",
    definition:
      "A DataFrame operation that reduces the number of partitions by merging neighbouring ones, without a full shuffle. It cannot increase the count.",
    module: "partitions",
  },
  repartition: {
    term: "repartition",
    definition:
      "A DataFrame operation that reshuffles all rows into a new number of evenly balanced partitions, optionally by key. It can increase or decrease the count, at the cost of a shuffle.",
    module: "partitions",
  },
  "spark-sql": {
    term: "Spark SQL",
    definition:
      "Spark's module for structured data. It runs both SQL queries and DataFrame code through the same optimiser and execution engine.",
    module: "spark-sql",
  },
  "temp-view": {
    term: "Temporary view",
    definition:
      "A name given to a DataFrame so it can be queried with SQL. It lasts only for the current Spark session and stores no data.",
    module: "spark-sql",
  },
  "ansi-mode": {
    term: "ANSI mode",
    definition:
      "Spark SQL's standards-following behaviour, on by default since Spark 4.0: invalid input such as a bad cast or integer overflow raises an error instead of silently returning NULL or a wrong number.",
    module: "spark-sql",
  },
  catalyst: {
    term: "Catalyst",
    definition:
      "Spark SQL's query optimiser. It turns SQL or DataFrame code into a logical plan, rewrites it with rules, chooses a physical plan and generates code to run it.",
    analogy: "A route planner: you give the destination, it picks the route.",
    module: "catalyst",
  },
  "logical-plan": {
    term: "Logical plan",
    definition:
      "A tree describing what a query computes (filters, joins, aggregations) without saying how each step will run.",
    module: "catalyst",
  },
  "physical-plan": {
    term: "Physical plan",
    definition:
      "A tree describing exactly how a query will run: which scan, which join algorithm, where data is exchanged between machines.",
    module: "catalyst",
  },
  "predicate-pushdown": {
    term: "Predicate pushdown",
    definition:
      "Moving a filter as early as possible in a plan, ideally into the data source itself, so less data is read and processed.",
    module: "catalyst",
  },
  "column-pruning": {
    term: "Column pruning",
    definition:
      "Dropping columns a query never uses, so they are never read; especially effective with columnar files like Parquet.",
    module: "catalyst",
  },
  job: {
    term: "Job",
    definition:
      "All the work Spark does in response to one action, such as count or write. One action can start more than one job.",
    module: "jobs-stages-tasks",
  },
  stage: {
    term: "Stage",
    definition:
      "A part of a job that can run without exchanging data between machines. Stages are separated by shuffles, and each runs one task per partition.",
    module: "jobs-stages-tasks",
  },
  "spark-ui": {
    term: "Spark UI",
    definition:
      "The web interface every Spark driver serves (by default on port 4040), showing jobs, stages, tasks, SQL plans, storage and executors.",
    module: "jobs-stages-tasks",
  },
  "history-server": {
    term: "History Server",
    definition:
      "A Spark service that rebuilds the UI of finished applications from their event logs.",
    module: "jobs-stages-tasks",
  },
  shuffle: {
    term: "Shuffle",
    definition:
      "Spark's way of regrouping data across partitions, for example so all rows with the same key end up together. It costs disk, serialisation and network time, and marks a stage boundary.",
    module: "shuffle",
  },
  "shuffle-file": {
    term: "Shuffle file",
    definition:
      "The file a map-side task writes to its node's local disk during a shuffle, holding one block for each task in the next stage.",
    module: "shuffle",
  },
  exchange: {
    term: "Exchange",
    definition:
      "The operator in a Spark physical plan that marks a shuffle (or a broadcast) of data between stages.",
    module: "shuffle",
  },
  "external-shuffle-service": {
    term: "External shuffle service",
    definition:
      "A long-running process on each node that serves shuffle files on behalf of executors, so they stay available after an executor is removed. Off by default; not available on Kubernetes.",
    module: "shuffle",
  },
  "broadcast-join": {
    term: "Broadcast join",
    definition:
      "A join where Spark copies the small table to every executor, so the large table can be joined where it sits without a shuffle.",
    module: "spark-joins",
  },
  "sort-merge-join": {
    term: "Sort-merge join",
    definition:
      "A join that shuffles both tables by the join key, sorts each partition, then matches rows by walking the two sorted lists together. Spark's usual choice for two large tables.",
    module: "spark-joins",
  },
  "shuffled-hash-join": {
    term: "Shuffled hash join",
    definition:
      "A join that shuffles both tables by key, then builds an in-memory hash table from the smaller side in each partition. Skips sorting but uses more memory.",
    module: "spark-joins",
  },
  "join-hint": {
    term: "Join hint",
    definition:
      "An instruction in a query (BROADCAST, MERGE, SHUFFLE_HASH or SHUFFLE_REPLICATE_NL) suggesting which join strategy Spark should use. Not guaranteed.",
    module: "spark-joins",
  },
  aqe: {
    term: "Adaptive Query Execution (AQE)",
    definition:
      "A Spark SQL feature that re-optimises the rest of a query while it runs, using the real sizes of data written at each shuffle. On by default since Spark 3.2.",
    module: "aqe",
  },
  "query-stage": {
    term: "Query stage",
    definition:
      "In AQE, a part of the plan that ends at a shuffle or broadcast. When it finishes, Spark has real statistics and can re-plan what comes next.",
    module: "aqe",
  },
  tungsten: {
    term: "Project Tungsten",
    definition:
      "A Spark effort begun in 2015 to use memory and CPU more efficiently: Spark-managed binary memory instead of Java objects, cache-aware algorithms and code generation.",
    module: "tungsten-vectorised",
  },
  "volcano-model": {
    term: "Volcano model",
    definition:
      "The classic way to run a query plan: each operator returns one row at a time when the operator above calls its next() method.",
    module: "tungsten-vectorised",
  },
  "whole-stage-codegen": {
    term: "Whole-stage code generation",
    definition:
      "Spark's technique (since 2.0) of fusing a chain of operators into one generated, compiled function, marked *(n) in explain() output.",
    module: "tungsten-vectorised",
  },
  "vectorised-execution": {
    term: "Vectorised execution",
    definition:
      "Processing data in batches of rows stored column by column, so each call handles thousands of values in a tight loop.",
    module: "tungsten-vectorised",
  },
  "native-engine": {
    term: "Native engine",
    definition:
      "An execution engine written in C++ or Rust that runs Spark's query plans outside the JVM, such as Photon, Apache Gluten's backends or DataFusion Comet.",
    module: "tungsten-vectorised",
  },
  "data-skew": {
    term: "Data skew",
    definition:
      "When a few keys hold most of the rows, so after a shuffle a few tasks do most of the work while the rest sit idle.",
    module: "skew",
  },
  straggler: {
    term: "Straggler",
    definition:
      "A task that runs far longer than the others in its stage, holding up the whole stage.",
    module: "skew",
  },
  salting: {
    term: "Salting",
    definition:
      "Adding a random number to a skewed key so its rows spread over several partitions, then combining the pieces afterwards.",
    module: "skew",
  },
  "execution-memory": {
    term: "Execution memory",
    definition:
      "The part of an executor's memory used for the work in hand: shuffles, joins, sorts and aggregations. Shared with storage memory in one pool.",
    module: "memory-spill",
  },
  "storage-memory": {
    term: "Storage memory",
    definition:
      "The part of an executor's memory used for cached data and broadcast variables. Execution can evict it, but only down to a protected floor.",
    module: "memory-spill",
  },
  spill: {
    term: "Spill",
    definition:
      "When a task runs short of execution memory and writes part of its working data to local disk, to read back later. Slower, but the task finishes.",
    module: "memory-spill",
  },
  "memory-overhead": {
    term: "Memory overhead",
    definition:
      "Memory an executor's container gets on top of the Java heap, for native and other non-heap use. By default 10% of executor memory, at least 384 MB.",
    module: "memory-spill",
  },
  "cache-spark": {
    term: "Cache (Spark)",
    definition:
      "Keeping a computed DataFrame or RDD in executor memory or on local disk after its first use, so later actions reuse it instead of recomputing it.",
    module: "caching",
  },
  "storage-level": {
    term: "Storage level",
    definition:
      "How Spark keeps cached data: in memory, on disk or both; as objects or serialised bytes; with one copy or two. Chosen with persist().",
    module: "caching",
  },
  "partition-pruning": {
    term: "Partition pruning",
    definition:
      "Skipping whole folders of a partitioned table because a filter on the partition column shows they can't contain matching rows.",
    module: "files-io",
  },
  "small-files": {
    term: "Small files problem",
    definition:
      "When a table is stored as huge numbers of tiny files, so listing, opening and closing them takes longer than reading the data.",
    module: "files-io",
  },
} satisfies Record<string, GlossaryEntry>;
