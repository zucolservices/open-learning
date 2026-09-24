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
  utilisation: {
    term: "Utilisation",
    definition:
      "The share of time a resource (a server, CPU, disk, barista) is busy. Waiting time rises steeply as it nears 100%.",
    module: "latency-throughput",
  },
  percentile: {
    term: "Percentile (p50, p99)",
    definition:
      "The value below which a given share of measurements fall. p99 latency = 99% of requests were faster than this.",
    analogy: "If you're in the 90th percentile for height, 90% of people are shorter than you.",
    module: "latency-throughput",
  },
  "tail-latency": {
    term: "Tail latency",
    definition:
      "The latency of the slowest requests (p99, p99.9). Small in number, but they're what users notice.",
    module: "latency-throughput",
  },
  "fan-out": {
    term: "Fan-out",
    definition:
      "Handling one request by sending sub-requests to many servers and combining their answers. The whole request waits for the slowest.",
    module: "latency-throughput",
  },
  "littles-law": {
    term: "Little's Law",
    definition:
      "In any stable system, the average number of items inside equals the arrival rate times the average time each spends inside: L = λ × W.",
    analogy: "One customer a minute, each staying five minutes: five people in the café.",
    module: "latency-throughput",
  },
  "back-of-envelope": {
    term: "Back-of-the-envelope estimate",
    definition:
      "A quick, rough calculation (users, requests per second, storage, bandwidth) to find the right order of magnitude before designing.",
    analogy:
      "Estimating how many cups of tea your office drinks a year from how many people work there.",
    module: "estimation",
  },
  qps: {
    term: "QPS / requests per second",
    definition:
      "Queries (or requests) per second: the basic measure of how much load a system handles.",
    module: "estimation",
  },
  "health-check": {
    term: "Health check",
    definition:
      "A regular test a load balancer runs against each server (such as requesting /health) to decide whether to keep sending it traffic.",
    module: "load-balancing",
  },
  "single-point-of-failure": {
    term: "Single point of failure",
    definition: "One component whose failure takes the whole system down.",
    analogy: "The only bridge into town.",
    module: "load-balancing",
  },
  "sticky-session": {
    term: "Sticky session",
    definition:
      "Sending all of a user's requests to the same server, usually because that server holds their session state.",
    module: "load-balancing",
  },
  stateless: {
    term: "Stateless server",
    definition:
      "A server that keeps nothing a user needs between requests, so any server can handle any request. State lives in a shared store or with the client.",
    analogy: "Any supermarket checkout can serve any shopper.",
    module: "autoscaling",
  },
  autoscaling: {
    term: "Autoscaling",
    definition:
      "Automatically adding servers when load rises and removing them when it falls, based on a metric such as CPU or queue length.",
    module: "autoscaling",
  },
} satisfies Record<string, GlossaryEntry>;
