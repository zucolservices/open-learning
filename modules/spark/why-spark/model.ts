/**
 * An iterative job (several passes over the same data) on a MapReduce-style engine that reads from
 * and writes to disk every pass, versus an engine that keeps the data in memory. Times illustrative.
 */

export type Engine = "mr" | "spark";

export const COST = { readDisk: 6, writeDisk: 7, compute: 2, readMem: 0.3 };

export interface Seg {
  kind: "read" | "write" | "compute" | "mem";
  t: number;
}

export function timeline(engine: Engine, passes: number): Seg[] {
  const segs: Seg[] = [];
  for (let p = 0; p < passes; p++) {
    if (engine === "mr") {
      segs.push({ kind: "read", t: COST.readDisk });
      segs.push({ kind: "compute", t: COST.compute });
      segs.push({ kind: "write", t: COST.writeDisk });
    } else {
      segs.push(p === 0 ? { kind: "read", t: COST.readDisk } : { kind: "mem", t: COST.readMem });
      segs.push({ kind: "compute", t: COST.compute });
    }
  }
  return segs;
}

export const total = (segs: Seg[]) => Math.round(segs.reduce((n, s) => n + s.t, 0) * 10) / 10;
