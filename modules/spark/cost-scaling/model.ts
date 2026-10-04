/** A nightly job's three stages on a fixed or dynamic cluster, with optional spot capacity. All prices and timings illustrative. */

export const CORES_PER_EXEC = 4;
export const RATE = 0.4; // $ per executor-hour on demand
export const SPOT_DISCOUNT = 0.7;

export const STAGES = [
  { name: "read + filter", work: 3200, par: 400 }, // core-minutes, max tasks at once
  { name: "per-store model", work: 600, par: 20 },
  { name: "join + write", work: 1200, par: 200 },
];

export const SIZES = [10, 25, 50, 100];
export const SPOTS = [0, 0.5, 1];
export type Shuffle = "service" | "tracking";

export interface Run {
  stages: { mins: number; execs: number; busy: number }[];
  mins: number;
  cost: number;
}

export function run(
  n: number,
  dynamic: boolean,
  shuffle: Shuffle,
  spot: number,
  decom: boolean,
): Run {
  const out: { mins: number; execs: number; busy: number }[] = [];
  let prevExecs = 0;
  for (const s of STAGES) {
    const cores = Math.min(n * CORES_PER_EXEC, s.par);
    const mins = s.work / cores;
    const needed = Math.min(n, Math.ceil(s.par / CORES_PER_EXEC));
    let execs = n;
    if (dynamic) {
      // Shuffle tracking keeps executors whose shuffle output this stage still reads.
      execs = shuffle === "tracking" ? Math.max(needed, prevExecs) : needed;
    }
    out.push({ mins, execs, busy: needed });
    prevExecs = needed;
  }
  const penalty = 1 + spot * (decom ? 0.03 : 0.12);
  const ramp = dynamic ? 1 : 0; // ~60 s idle timeout before each scale-down, plus ramp-up
  const mins = out.reduce((a, b) => a + b.mins, 0) * penalty + ramp * (STAGES.length - 1);
  const execMins =
    out.reduce((a, b) => a + b.mins * b.execs, 0) * penalty + (dynamic ? n * ramp : 0);
  const rate = RATE * (1 - spot * SPOT_DISCOUNT);
  return { stages: out, mins, cost: (execMins / 60) * rate };
}

export const SHAPES = [
  {
    name: "One fat executor per node",
    spec: "15 cores · 63 GB",
    pros: "Few JVMs, big shared memory.",
    cons: "Huge heaps mean long garbage-collection pauses; Cloudera found HDFS writes slowed with many threads.",
  },
  {
    name: "Three medium executors",
    spec: "5 cores · 19 GB each",
    pros: "The classic 2015 Cloudera example, kept as a rule of thumb.",
    cons: "Written for Spark 1.3 and HDFS; a starting point, not a law.",
  },
  {
    name: "Fifteen tiny executors",
    spec: "1 core · ~4 GB each",
    pros: "Simple isolation.",
    cons: "No sharing of broadcast data or cache between tasks; more JVM overhead.",
  },
];
