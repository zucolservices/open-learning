/** Consumer-group simulation: 6 partitions, consumers that each handle CAPACITY events a second. */

export const PARTITIONS = 6;
export const CAPACITY = 30;
export const PAUSE = 3; // seconds a rebalance stops affected consumers

/** Range-style assignment: consumer c gets a contiguous block of partitions; extras get none. */
export function assign(consumers: number): number[] {
  const owner = Array(PARTITIONS).fill(-1);
  if (consumers <= 0) return owner;
  const n = Math.min(consumers, PARTITIONS);
  const base = Math.floor(PARTITIONS / n);
  const extra = PARTITIONS % n;
  let p = 0;
  for (let c = 0; c < n; c++) {
    const take = base + (c < extra ? 1 : 0);
    for (let k = 0; k < take; k++) owner[p++] = c;
  }
  return owner;
}

/** One second: new events arrive on every partition, each consumer splits its capacity over its partitions. */
export function tick(lag: number[], owner: number[], rate: number, paused: boolean[]): number[] {
  const next = lag.map((l) => l + rate);
  const counts = new Map<number, number>();
  owner.forEach((c) => c >= 0 && counts.set(c, (counts.get(c) ?? 0) + 1));
  return next.map((l, p) => {
    const c = owner[p];
    if (c < 0 || paused[p]) return l;
    const share = CAPACITY / (counts.get(c) ?? 1);
    return Math.max(0, l - share);
  });
}
