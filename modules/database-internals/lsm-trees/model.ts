/** A miniature LSM tree: a 4-entry memtable, L0 files, and compaction into L1 (illustrative). */

export interface Entry {
  key: string;
  value: string | null; // null = tombstone
}

export const OPS: Entry[] = [
  { key: "asha", value: "₹500" },
  { key: "ravi", value: "₹200" },
  { key: "meera", value: "₹900" },
  { key: "joe", value: "₹50" },
  { key: "asha", value: "₹650" },
  { key: "kiran", value: "₹300" },
  { key: "ravi", value: null },
  { key: "zoya", value: "₹120" },
  { key: "meera", value: "₹950" },
  { key: "dev", value: "₹75" },
  { key: "joe", value: "₹60" },
  { key: "isha", value: "₹410" },
  { key: "asha", value: "₹700" },
  { key: "zoya", value: null },
  { key: "bala", value: "₹15" },
  { key: "noor", value: "₹88" },
];

export const MEM_CAP = 4;
export const L0_MAX = 3;

export interface Lsm {
  memtable: Entry[];
  l0: Entry[][]; // newest first, each sorted by key
  l1: Entry[]; // one sorted run
  event: string;
}

const sorted = (es: Entry[]) => [...es].sort((a, b) => a.key.localeCompare(b.key));

function merge(runs: Entry[][], bottom: boolean): Entry[] {
  // runs are newest first; the first value seen for a key wins
  const seen = new Map<string, Entry>();
  for (const r of runs) for (const e of r) if (!seen.has(e.key)) seen.set(e.key, e);
  return sorted([...seen.values()].filter((e) => !(bottom && e.value === null)));
}

export function replay(n: number): Lsm {
  let mem: Entry[] = [];
  let l0: Entry[][] = [];
  let l1: Entry[] = [];
  let event = "Empty: nothing written yet.";
  OPS.slice(0, n).forEach((op) => {
    mem = [...mem.filter((e) => e.key !== op.key), op];
    event =
      op.value === null
        ? `DELETE ${op.key}: a tombstone goes into the memtable.`
        : `PUT ${op.key}: added to the memtable in memory (and the log).`;
    if (mem.length >= MEM_CAP) {
      l0 = [sorted(mem), ...l0];
      mem = [];
      event += " The memtable is full, so it's written out as a sorted file in L0.";
      if (l0.length >= L0_MAX) {
        l1 = merge([...l0, l1], true);
        l0 = [];
        event +=
          " L0 has 3 files: compaction merges them into L1, keeping only the newest value of each key and dropping tombstones.";
      }
    }
  });
  return { memtable: sorted(mem), l0, l1, event };
}

export function read(
  s: Lsm,
  key: string,
  bloom: boolean,
): {
  steps: { where: string; result: "found" | "miss" | "skipped" | "deleted" }[];
  value: string | null;
} {
  const steps: { where: string; result: "found" | "miss" | "skipped" | "deleted" }[] = [];
  const check = (where: string, run: Entry[]): Entry | undefined => {
    const hit = run.find((e) => e.key === key);
    if (!hit && bloom && where !== "memtable") {
      steps.push({ where, result: "skipped" });
      return undefined;
    }
    steps.push({ where, result: hit ? (hit.value === null ? "deleted" : "found") : "miss" });
    return hit;
  };
  const m = check("memtable", s.memtable);
  if (m) return { steps, value: m.value };
  for (let i = 0; i < s.l0.length; i++) {
    const h = check(`L0 file ${i + 1}`, s.l0[i]);
    if (h) return { steps, value: h.value };
  }
  if (s.l1.length) {
    const h = check("L1", s.l1);
    if (h) return { steps, value: h.value };
  }
  return { steps, value: null };
}
