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
} satisfies Record<string, GlossaryEntry>;
