/** Spark's unified memory model for one executor, with a toy rule for spill and OOM. */

export const HEAPS = [2048, 4096, 8192, 16384]; // MB
export const CORE_OPTS = [1, 2, 4, 8];
export const CACHES = [0, 1024, 3072]; // MB cached on this executor
export const PARTS = [128, 512, 2048]; // in-memory working set per task, MB
export type Op = "sort" | "collect";

const RESERVED = 300;
const FRACTION = 0.6;
const STORAGE_FRACTION = 0.5;

export interface Mem {
  heap: number;
  usable: number;
  unified: number;
  user: number;
  floor: number; // storage that execution can't evict
  cached: number;
  evicted: number;
  execution: number;
  perTask: number;
  outcome: "fits" | "spill" | "oom";
  spillMb: number;
}

export function memory(heap: number, cores: number, cache: number, ws: number, op: Op): Mem {
  const usable = heap - RESERVED;
  const unified = usable * FRACTION;
  const user = usable - unified;
  const floor = unified * STORAGE_FRACTION;
  const wantExec = Math.min(unified, ws * cores);
  const room = unified - Math.min(cache, unified);
  const evictable = Math.max(0, Math.min(cache, unified) - floor);
  const evicted = Math.max(0, Math.min(evictable, wantExec - room));
  const cached = Math.min(cache, unified) - evicted;
  const execution = unified - cached;
  const perTask = execution / cores;
  const outcome = ws <= perTask ? "fits" : op === "sort" ? "spill" : "oom";
  return {
    heap,
    usable,
    unified,
    user,
    floor,
    cached,
    evicted,
    execution,
    perTask,
    outcome,
    spillMb: outcome === "spill" ? ws - perTask : 0,
  };
}

export const overhead = (heap: number) => Math.max(384, heap * 0.1);

export const fmt = (mb: number) =>
  mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
