/**
 * A load balancer in front of six single-worker servers (each serves one request at a time,
 * first come first served). Seeded and deterministic.
 */

export type Algo = "rr" | "random" | "least" | "p2c";

export interface LbOptions {
  algo: Algo;
  slow: boolean; // server 6 takes 4× as long
  dead: boolean; // server 5 is broken from the start: every request to it fails instantly
  activeCheckS: number; // active health checks detect the dead server after this many seconds
  passive: boolean; // passive checks: eject a server after 5 errors in a row
  load: number; // arrival rate as a share of total healthy capacity
}

export interface LbResult {
  share: number[]; // requests sent to each server
  errors: number;
  p50: number;
  p99: number;
  maxQueue: number[];
  detectedAtS: number | null;
}

const SERVERS = 6;
const SERVICE_MS = 20;
const REQUESTS = 30_000;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function simulate(o: LbOptions, seed = 11): LbResult {
  const r = rng(seed);
  const expo = (mean: number) => -Math.log(1 - r()) * mean;
  const serviceMean = (i: number) => (o.slow && i === 5 ? SERVICE_MS * 4 : SERVICE_MS);
  const isDead = (i: number) => o.dead && i === 4;
  // Capacity of the servers that actually work (requests per ms).
  let capacity = 0;
  for (let i = 0; i < SERVERS; i++) if (!isDead(i)) capacity += 1 / serviceMean(i);
  const lambda = capacity * o.load;

  const finishes: number[][] = Array.from({ length: SERVERS }, () => []);
  const ptr = new Array(SERVERS).fill(0);
  const free = new Array(SERVERS).fill(0);
  const share = new Array(SERVERS).fill(0);
  const maxQueue = new Array(SERVERS).fill(0);
  const latencies: number[] = [];
  let errors = 0;
  let rrNext = 0;
  let deadErrors = 0; // consecutive failures seen from the broken server
  let ejected = false;
  let detectedAt: number | null = null;
  let t = 0;

  const outstanding = (i: number, now: number) => {
    const f = finishes[i];
    while (ptr[i] < f.length && f[ptr[i]] <= now) ptr[i]++;
    return f.length - ptr[i];
  };

  for (let n = 0; n < REQUESTS; n++) {
    t += expo(1 / lambda);
    const activeDetected = o.dead && t >= o.activeCheckS * 1000;
    const removed = ejected || activeDetected;
    if (o.dead && removed && detectedAt === null) detectedAt = t / 1000;
    const pool = [...Array(SERVERS).keys()].filter((i) => !(isDead(i) && removed));
    let pick: number;
    if (o.algo === "rr") {
      pick = pool[rrNext % pool.length];
      rrNext++;
    } else if (o.algo === "random") {
      pick = pool[Math.floor(r() * pool.length)];
    } else if (o.algo === "least") {
      let best = pool[0];
      let bestN = Infinity;
      // Ties go to the first; start from a rotating offset so ties spread out.
      for (let k = 0; k < pool.length; k++) {
        const i = pool[(k + n) % pool.length];
        const q = outstanding(i, t);
        if (q < bestN) {
          best = i;
          bestN = q;
        }
      }
      pick = best;
    } else {
      const a = pool[Math.floor(r() * pool.length)];
      let b = pool[Math.floor(r() * pool.length)];
      if (pool.length > 1) while (b === a) b = pool[Math.floor(r() * pool.length)];
      pick = outstanding(a, t) <= outstanding(b, t) ? a : b;
    }
    share[pick]++;
    if (isDead(pick)) {
      errors++;
      deadErrors++;
      if (o.passive && deadErrors >= 5) ejected = true;
      continue;
    }
    const start = Math.max(t, free[pick]);
    const done = start + expo(serviceMean(pick));
    free[pick] = done;
    finishes[pick].push(done);
    maxQueue[pick] = Math.max(maxQueue[pick], outstanding(pick, t));
    latencies.push(done - t);
  }
  latencies.sort((a, b) => a - b);
  const pct = (p: number) =>
    latencies[Math.min(latencies.length - 1, Math.floor((p / 100) * latencies.length))] ?? 0;
  return { share, errors, p50: pct(50), p99: pct(99), maxQueue, detectedAtS: detectedAt };
}
