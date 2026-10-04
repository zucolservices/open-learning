/** A toy shuffle: records with keys spread over map tasks, regrouped by key onto reduce tasks. */

export const KEYS = ["A", "B", "C", "D", "E", "F"];

/** Records per map task, before the shuffle (keys scattered). Illustrative. */
const ALL = [
  "A",
  "C",
  "F",
  "B",
  "A",
  "E",
  "D",
  "C",
  "B",
  "F",
  "A",
  "D",
  "E",
  "C",
  "B",
  "F",
  "D",
  "A",
  "E",
  "B",
  "C",
  "F",
  "D",
  "E",
];

export function mapInputs(m: number): string[][] {
  const out: string[][] = Array.from({ length: m }, () => []);
  ALL.forEach((k, i) => out[i % m].push(k));
  return out;
}

/** Hash partitioning stand-in: key index modulo number of reducers. */
export const dest = (k: string, r: number) => KEYS.indexOf(k) % r;

export const FRAMES = [
  {
    phase: "Before",
    text: "Each map task holds a mix of keys. To total each key, all of its records must end up together.",
  },
  {
    phase: "Map side: write",
    text: "Each map task sorts its records by destination and writes one shuffle file to its local disk, split into a block per reduce task.",
  },
  {
    phase: "Reduce side: fetch",
    text: "Each reduce task fetches its block from every map task: all-to-all, across the network.",
  },
  {
    phase: "After",
    text: "Each reduce task now holds every record for its keys and can aggregate them. The next stage begins.",
  },
];

export type OpId =
  | "filter"
  | "groupBy"
  | "orderBy"
  | "joinBig"
  | "joinSmall"
  | "repartition"
  | "coalesce"
  | "distinct"
  | "window";

export const OPS: { id: OpId; label: string; shuffles: boolean; plan: string; note: string }[] = [
  {
    id: "filter",
    label: "filter / select / withColumn",
    shuffles: false,
    plan: "Project\n└ Filter\n  └ Scan",
    note: "Each row is handled where it is: narrow, no shuffle.",
  },
  {
    id: "groupBy",
    label: "groupBy(...).agg(...)",
    shuffles: true,
    plan: "HashAggregate (final)\n└ Exchange hashpartitioning(key, 200)\n  └ HashAggregate (partial)",
    note: "Partial totals first, then a shuffle by key. The partial step shrinks what crosses the network.",
  },
  {
    id: "orderBy",
    label: "orderBy(...)",
    shuffles: true,
    plan: "Sort\n└ Exchange rangepartitioning(amount, 200)",
    note: "A global sort sends ranges of values to each partition.",
  },
  {
    id: "joinBig",
    label: "join two large tables",
    shuffles: true,
    plan: "SortMergeJoin\n├ Exchange hashpartitioning(id, 200)\n└ Exchange hashpartitioning(id, 200)",
    note: "Both sides shuffle so matching keys meet in the same partition.",
  },
  {
    id: "joinSmall",
    label: "join a large table to a small one",
    shuffles: false,
    plan: "BroadcastHashJoin\n├ Scan big\n└ BroadcastExchange\n  └ Scan small",
    note: "The small side is copied to every executor; the large side doesn't move (module 10).",
  },
  {
    id: "repartition",
    label: "repartition(400)",
    shuffles: true,
    plan: "Exchange RoundRobinPartitioning(400)",
    note: "Repartitioning is a shuffle by definition.",
  },
  {
    id: "coalesce",
    label: "coalesce(10) from 200",
    shuffles: false,
    plan: "Coalesce 10",
    note: "Merging partitions on the same executors avoids a full shuffle.",
  },
  {
    id: "distinct",
    label: "distinct()",
    shuffles: true,
    plan: "HashAggregate\n└ Exchange hashpartitioning(all columns, 200)",
    note: "Duplicates must meet to be removed.",
  },
  {
    id: "window",
    label: "window over partitionBy(user)",
    shuffles: true,
    plan: "Window\n└ Sort\n  └ Exchange hashpartitioning(user, 200)",
    note: "Each user's rows must sit together in one partition.",
  },
];

export type Scenario = "none" | "service" | "k8s";

export const SCENARIOS: Record<Scenario, { title: string; outcome: string; good: boolean }> = {
  none: {
    title: "No shuffle service",
    good: false,
    outcome:
      "The executor served its own shuffle files. Once it is gone, so are they: the map tasks that wrote them must run again.",
  },
  service: {
    title: "External shuffle service (YARN, standalone)",
    good: true,
    outcome:
      "A long-running service on each node keeps serving the files after the executor is removed. Reducers carry on.",
  },
  k8s: {
    title: "Kubernetes with shuffle tracking",
    good: true,
    outcome:
      "There's no external service on Kubernetes. Instead, dynamic allocation keeps executors that hold live shuffle data rather than removing them (on by default).",
  },
};
