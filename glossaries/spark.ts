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
} satisfies Record<string, GlossaryEntry>;
