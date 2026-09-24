/**
 * Cascading-failure model. A web frontend has a fixed pool of worker threads. Each page needs a
 * quick call to Orders and a call to Recommendations. From 10 s to 30 s Recommendations becomes
 * very slow. Requests that can't get a thread wait in a queue; after 2 s the user gives up.
 */

export const DT = 0.01; // s
export const SECONDS = 40;
export const THREADS = 40;
export const RATE = 200; // pages/s
export const SLOW: [number, number] = [10, 30];
const ORDERS = 0.03;
const RECS = 0.05;
const RECS_SLOW = 4;
const GIVE_UP = 2;

export interface ResilienceOptions {
  timeout: boolean; // 300 ms on the Recommendations call
  breaker: boolean; // open after >50% of the last 20 calls failed; retry one after 5 s
  bulkhead: boolean; // at most 30 concurrent Recommendations calls
}

export interface ResilienceResult {
  full: number[]; // per second: pages with recommendations
  degraded: number[]; // pages served without recommendations
  failed: number[]; // users who gave up
  busy: number[]; // average busy threads per second
  breakerOpen: boolean[]; // per second: was the breaker open at any point
  totals: { full: number; degraded: number; failed: number };
}

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

export const TIMEOUT = 0.3;
export const BULKHEAD = 30;
const WINDOW = 20;
const OPEN_FOR = 5;

export function simulate(o: ResilienceOptions): ResilienceResult {
  const r = rng(11);
  const ticks = Math.round(SECONDS / DT);
  const full = Array(SECONDS).fill(0);
  const degraded = Array(SECONDS).fill(0);
  const failed = Array(SECONDS).fill(0);
  const busyAcc = Array(SECONDS).fill(0);
  const breakerOpen = Array(SECONDS).fill(false);
  const queue: number[] = []; // arrival times
  let qHead = 0;
  // running page: finish time, whether it used recs (and holds a recs slot), outcome
  const running: {
    end: number;
    recs: boolean;
    ok: boolean;
    recsFailed: boolean;
    probe?: boolean;
  }[] = [];
  let recsInFlight = 0;
  const recent: boolean[] = []; // true = failure
  let state: "closed" | "open" | "half" = "closed";
  let openUntil = 0;
  let probeInFlight = false;
  const lam = RATE * DT;

  for (let k = 0; k < ticks; k++) {
    const t = k * DT;
    const sec = Math.min(SECONDS - 1, Math.floor(t));
    const slow = t >= SLOW[0] && t < SLOW[1];
    // finish pages
    for (let i = running.length - 1; i >= 0; i--) {
      const p = running[i];
      if (p.end <= t) {
        if (p.recs) {
          recsInFlight -= 1;
          if (p.probe) {
            probeInFlight = false;
            if (p.recsFailed) {
              state = "open";
              openUntil = t + OPEN_FOR;
            } else state = "closed";
            recent.length = 0;
          } else if (state === "closed") {
            recent.push(p.recsFailed);
            if (recent.length > WINDOW) recent.shift();
            if (
              o.breaker &&
              recent.length >= 10 &&
              recent.filter(Boolean).length / recent.length > 0.5
            ) {
              state = "open";
              openUntil = t + OPEN_FOR;
              recent.length = 0;
            }
          }
        }
        if (p.ok) full[sec] += 1;
        else degraded[sec] += 1;
        running.splice(i, 1);
      }
    }
    // arrivals (Poisson approximated by Bernoulli per small tick)
    let n = 0;
    const u = r();
    let pk = Math.exp(-lam);
    let cdf = pk;
    while (u > cdf) {
      n += 1;
      pk *= lam / n;
      cdf += pk;
    }
    for (let j = 0; j < n; j++) queue.push(t);
    // users give up
    while (qHead < queue.length && t - queue[qHead] > GIVE_UP) {
      failed[sec] += 1;
      qHead += 1;
    }
    // start pages on free threads
    while (running.length < THREADS && qHead < queue.length) {
      qHead += 1;
      if (state === "open" && t >= openUntil) state = "half";
      if (state === "open") breakerOpen[sec] = true;
      const probe = state === "half" && !probeInFlight;
      const bulkFull = o.bulkhead && recsInFlight >= BULKHEAD;
      if (state === "open" || (state === "half" && !probe) || bulkFull) {
        // skip Recommendations: fallback page
        running.push({ end: t + ORDERS, recs: false, ok: false, recsFailed: false });
        continue;
      }
      if (probe) probeInFlight = true;
      const recsTime = slow ? RECS_SLOW * (0.8 + 0.4 * r()) : RECS * (0.6 + 0.8 * r());
      const timedOut = o.timeout && recsTime > TIMEOUT;
      const wait = timedOut ? TIMEOUT : recsTime;
      recsInFlight += 1;
      running.push({
        end: t + ORDERS + wait,
        recs: true,
        ok: !timedOut,
        recsFailed: timedOut,
        probe,
      });
    }
    busyAcc[sec] += running.length;
  }
  const per = 1 / DT;
  return {
    full,
    degraded,
    failed,
    busy: busyAcc.map((b) => b / per),
    breakerOpen,
    totals: {
      full: full.reduce((a, x) => a + x, 0),
      degraded: degraded.reduce((a, x) => a + x, 0),
      failed: failed.reduce((a, x) => a + x, 0),
    },
  };
}
