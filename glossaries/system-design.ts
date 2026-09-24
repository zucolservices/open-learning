import type { GlossaryEntry } from "./types";

/** System Design at Scale track glossary. `module` slugs refer to this track. */
export const systemDesign = {
  scalability: {
    term: "Scalability",
    definition:
      "A system's ability to handle more load (users, requests, data) by adding resources, without being redesigned.",
    analogy: "A restaurant that can open more tables and hire more cooks when the queue grows.",
    module: "what-scale-means",
  },
  latency: {
    term: "Latency",
    definition: "How long one request takes, from asking to getting the answer.",
    analogy: "How long you wait at the counter for your coffee.",
    module: "latency-throughput",
  },
  throughput: {
    term: "Throughput",
    definition: "How much work a system completes per unit of time, such as requests per second.",
    analogy: "How many coffees the counter serves per hour.",
    module: "latency-throughput",
  },
} satisfies Record<string, GlossaryEntry>;
