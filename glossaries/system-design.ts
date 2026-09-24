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
  "vertical-scaling": {
    term: "Scaling up (vertical scaling)",
    definition: "Handling more load by moving to a bigger machine: more CPU, memory or disk.",
    analogy: "Replacing your car with a bus.",
    module: "what-scale-means",
  },
  "horizontal-scaling": {
    term: "Scaling out (horizontal scaling)",
    definition: "Handling more load by adding more machines that share the work.",
    analogy: "Adding more cars instead of buying a bigger one.",
    module: "what-scale-means",
  },
  "load-balancer": {
    term: "Load balancer",
    definition:
      "A component that receives requests at one address and spreads them across many servers.",
    analogy: "A host at a restaurant door showing each guest to a free table.",
    module: "load-balancing",
  },
  cache: {
    term: "Cache",
    definition:
      "A fast store of recently or frequently used answers, so they don't have to be fetched or computed again.",
    analogy: "Keeping today's most-ordered dishes ready on the pass.",
    module: "caching-patterns",
  },
  replica: {
    term: "Replica",
    definition:
      "A copy of a database kept up to date from the original, used to share reads or to take over if the original fails.",
    module: "replication",
  },
  cdn: {
    term: "CDN",
    definition:
      "Content delivery network: servers around the world that keep copies of files close to users, so they download faster.",
    analogy: "Stocking popular books in every neighbourhood library instead of one central one.",
    module: "cdn-edge",
  },
  queue: {
    term: "Queue",
    definition:
      "A buffer where one part of a system leaves work for another to pick up later, so neither has to wait for the other.",
    analogy: "The ticket rail in a kitchen: waiters clip orders on, cooks take them when ready.",
    module: "queues-streams",
  },
  shard: {
    term: "Shard",
    definition:
      "One piece of a dataset that has been split across several machines; each shard holds part of the data.",
    analogy: "Splitting a phone book into A–H, I–P and Q–Z volumes.",
    module: "sharding",
  },
} satisfies Record<string, GlossaryEntry>;
