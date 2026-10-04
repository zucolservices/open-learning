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
} satisfies Record<string, GlossaryEntry>;
