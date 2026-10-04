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
} satisfies Record<string, GlossaryEntry>;
