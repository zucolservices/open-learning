import type { GlossaryEntry } from "./types";

/** Streaming Data Systems track glossary. `module` slugs refer to this track. */
export const streamingData = {
  "bounded-data": {
    term: "Bounded data",
    definition:
      "A dataset with an end, such as yesterday's payments or a file: you can read all of it and then compute an answer. Batch processing works on bounded data.",
    module: "batch-vs-streams",
  },
  "unbounded-data": {
    term: "Unbounded data",
    definition:
      "Data that keeps arriving with no end, such as payments, clicks or sensor readings. Stream processing is designed for it (Tyler Akidau: an engine \u201cdesigned with infinite data sets in mind\u201d).",
    module: "batch-vs-streams",
  },
  "lambda-architecture": {
    term: "Lambda architecture",
    definition:
      "Running two pipelines side by side: a slow, complete batch layer and a fast, approximate real-time layer, merged when queried. Described by Nathan Marz in 2011; costly because the logic is written twice.",
    module: "batch-vs-streams",
  },
  "kappa-architecture": {
    term: "Kappa architecture",
    definition:
      "One streaming pipeline only; to recompute, replay the retained log through a new version of the job. Proposed by Jay Kreps in 2014.",
    module: "batch-vs-streams",
  },
} satisfies Record<string, GlossaryEntry>;
