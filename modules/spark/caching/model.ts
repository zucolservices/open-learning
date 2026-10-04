/** Three actions reusing one expensive DataFrame, with and without caching. Times are illustrative. */

export type Level = "none" | "MEMORY_ONLY" | "MEMORY_AND_DISK" | "DISK_ONLY";

export const CACHED_GB = 40;
export const MEMS = [16, 32, 64]; // storage memory across the cluster, GB
export const ACTIONS = ["count()", "write daily report", "train model"];

const COMPUTE = 6; // minutes to rebuild from source
const FROM_MEMORY = 0.3;
const FROM_DISK = 1.2;
const CACHE_COST = 0.4;

export function times(level: Level, memGb: number) {
  const f = Math.min(1, memGb / CACHED_GB);
  const disk = level === "DISK_ONLY";
  const fitted = level === "none" ? 0 : disk ? 0 : f;
  const reuse =
    level === "none"
      ? COMPUTE
      : level === "MEMORY_ONLY"
        ? f * FROM_MEMORY + (1 - f) * COMPUTE
        : level === "MEMORY_AND_DISK"
          ? f * FROM_MEMORY + (1 - f) * FROM_DISK
          : FROM_DISK;
  const first = level === "none" ? COMPUTE : COMPUTE + CACHE_COST;
  const each = [first, reuse, reuse];
  const memPct = Math.round(fitted * 100);
  const diskPct = level === "MEMORY_AND_DISK" ? 100 - memPct : disk ? 100 : 0;
  return { each, total: each.reduce((a, b) => a + b, 0), memPct, diskPct };
}

export const LEVELS: {
  id: Exclude<Level, "none">;
  where: string;
  miss: string;
  python: boolean;
  note: string;
}[] = [
  {
    id: "MEMORY_ONLY",
    where: "memory (Java objects)",
    miss: "recomputed",
    python: true,
    note: "The RDD default. Partitions that don't fit aren't cached; they're rebuilt each time.",
  },
  {
    id: "MEMORY_AND_DISK",
    where: "memory, then disk",
    miss: "read from disk",
    python: true,
    note: "The DataFrame default, kept in a compressed columnar format. PySpark shows it as MEMORY_AND_DISK_DESER.",
  },
  {
    id: "DISK_ONLY",
    where: "disk",
    miss: "n/a",
    python: true,
    note: "Only worth it if recomputing is much slower than reading from local disk.",
  },
];

export const MORE: [string, string][] = [
  [
    "MEMORY_ONLY_SER, MEMORY_AND_DISK_SER",
    "Serialised bytes: smaller, more CPU to read. Java and Scala only; Python always pickles.",
  ],
  ["…_2 (e.g. MEMORY_AND_DISK_2)", "A second copy on another node, for faster recovery."],
  ["OFF_HEAP", "Outside the Java heap. Experimental; needs off-heap memory enabled."],
];
