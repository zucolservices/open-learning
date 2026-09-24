/**
 * A single-server queue (M/M/1): random arrivals, random service times, first come first served.
 * Seeded, so the same settings always give the same numbers.
 */

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const expo = (r: () => number, mean: number) => -Math.log(1 - r()) * mean;

export function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[i];
}

export interface QueueResult {
  waits: number[]; // time in line, sorted (seconds)
  totals: number[]; // wait + service, sorted (seconds)
  mean: number; // mean total time
  p50: number;
  p95: number;
  p99: number;
  meanWait: number;
  throughputPerMin: number;
}

/** utilisation ρ = arrival rate × service time; service time in seconds. */
export function simulate(
  utilisation: number,
  serviceS = 60,
  customers = 80_000,
  seed = 7,
): QueueResult {
  const r = rng(seed);
  const meanGap = serviceS / utilisation;
  let t = 0;
  let free = 0;
  const waits: number[] = [];
  const totals: number[] = [];
  const warm = 5_000;
  let first = 0;
  let last = 0;
  for (let i = 0; i < customers + warm; i++) {
    t += expo(r, meanGap);
    const start = Math.max(t, free);
    const service = expo(r, serviceS);
    free = start + service;
    if (i >= warm) {
      if (i === warm) first = t;
      last = t;
      waits.push(start - t);
      totals.push(free - t);
    }
  }
  waits.sort((a, b) => a - b);
  totals.sort((a, b) => a - b);
  const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
  const meanWait = waits.reduce((a, b) => a + b, 0) / waits.length;
  return {
    waits,
    totals,
    mean,
    meanWait,
    p50: percentile(totals, 50),
    p95: percentile(totals, 95),
    p99: percentile(totals, 99),
    throughputPerMin: (customers / (last - first)) * 60,
  };
}

/** Theory for M/M/1: mean wait in line as a multiple of service time. */
export const waitMultiple = (rho: number) => rho / (1 - rho);

/** Chance a request touching n servers hits at least one slow response. */
export const fanoutSlow = (pSlow: number, n: number) => 1 - Math.pow(1 - pSlow, n);
