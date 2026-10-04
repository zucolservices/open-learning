/** A toy model of one join stage with and without AQE. All sizes and timings are illustrative. */

export type Scenario = "tiny" | "skew";
export interface Features {
  coalesce: boolean;
  join: boolean;
  skew: boolean;
}

export const CORES = 8;
const OVERHEAD_S = 0.3; // scheduling and start-up per task
const S_PER_MB = 0.05;
const TARGET_MB = 64;
const SKEW_FACTOR = 5;
const SKEW_MIN_MB = 256;

/** 200 shuffle partitions of 2–12 MB, plus one hot key in the skew scenario. */
export function partitions(sc: Scenario): number[] {
  return Array.from({ length: 200 }, (_, i) => {
    if (sc === "skew" && i === 37) return 1600;
    return 2 + ((i * 37) % 11);
  });
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

export interface Result {
  tasks: number[];
  op: string;
  notes: string[];
  longest: number;
  stage: number;
}

function makespan(tasks: number[], perMb: number) {
  const cores = Array<number>(CORES).fill(0);
  for (const mb of tasks) {
    const k = cores.indexOf(Math.min(...cores));
    cores[k] += OVERHEAD_S + mb * perMb;
  }
  return Math.max(...cores);
}

export function run(sc: Scenario, aqe: boolean, f: Features): Result {
  let tasks = partitions(sc);
  const notes: string[] = [];
  let op = "SortMergeJoin";
  let perMb = S_PER_MB;
  const on = (x: boolean) => aqe && x;

  if (sc === "tiny" && on(f.join)) {
    op = "BroadcastHashJoin";
    perMb = S_PER_MB * 0.5;
    notes.push(
      "The dimension side turned out to be 4 MB, under the 10 MB threshold: switched to a broadcast join. No sort, and shuffle files are read locally.",
    );
  }
  if (sc === "skew" && on(f.join))
    notes.push(
      "Both sides are big, so switching the join doesn't apply: it stays a sort-merge join.",
    );
  if (sc === "tiny" && on(f.skew)) notes.push("No partition is skewed here, so nothing is split.");
  if (sc === "skew" && on(f.skew)) {
    const med = median(tasks);
    const out: number[] = [];
    for (const mb of tasks) {
      if (mb > SKEW_FACTOR * med && mb > SKEW_MIN_MB) {
        const n = Math.ceil(mb / TARGET_MB);
        for (let k = 0; k < n; k++) out.push(mb / n);
        notes.push(
          `Partition 37 (${mb.toLocaleString("en-GB")} MB) is over ${SKEW_FACTOR}× the median and over ${SKEW_MIN_MB} MB: split into ${n} tasks, with the matching rows from the other side copied to each.`,
        );
      } else out.push(mb);
    }
    tasks = out;
  }
  if (on(f.coalesce)) {
    const out: number[] = [];
    let acc = 0;
    for (const mb of tasks) {
      if (mb >= TARGET_MB) {
        if (acc) out.push(acc);
        acc = 0;
        out.push(mb);
      } else if (acc + mb > TARGET_MB) {
        out.push(acc);
        acc = mb;
      } else acc += mb;
    }
    if (acc) out.push(acc);
    notes.push(
      `Neighbouring small partitions merged to about ${TARGET_MB} MB each: ${tasks.length} tasks became ${out.length}.`,
    );
    tasks = out;
  }
  if (!aqe) notes.push("AQE off: the plan made before running is used as is.");
  const longest = Math.max(...tasks.map((mb) => OVERHEAD_S + mb * perMb));
  return { tasks, op, notes, longest, stage: makespan(tasks, perMb) };
}

export const fmtS = (s: number) => (s >= 60 ? `${(s / 60).toFixed(1)} min` : `${s.toFixed(1)} s`);
