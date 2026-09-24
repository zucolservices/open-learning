/** Models for eviction, stampedes and synchronised expiry. Illustrative, seeded. */

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

export type Policy = "lru" | "lfu" | "random";

/**
 * 1,000 items with Zipf popularity; 30,000 requests. Optionally a crawler reads 15,000
 * one-off pages in the middle, and/or popularity shifts halfway (a new set of items
 * becomes the most popular).
 */
export function evictionSim(
  policy: Policy,
  capacity: number,
  scan: boolean,
  shift: boolean,
  seed = 5,
) {
  const r = rng(seed);
  const N = 1000;
  const weights: number[] = [];
  let h = 0;
  for (let i = 1; i <= N; i++) {
    weights.push(1 / i);
    h += 1 / i;
  }
  const cdf: number[] = [];
  let acc = 0;
  for (const w of weights) {
    acc += w / h;
    cdf.push(acc);
  }
  const pick = () => {
    const x = r();
    let lo = 0;
    let hi = N - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const TOTAL = 30_000;
  const lru = new Map<number, true>();
  const freq = new Map<number, number>();
  const keys: number[] = []; // for random eviction
  const index = new Map<number, number>();
  let hits = 0;
  let requests = 0;
  const window: number[] = []; // hit ratio per 1,000 requests (normal traffic only)
  let wHits = 0;
  let wReq = 0;

  const has = (k: number) => (policy === "lru" ? lru.has(k) : index.has(k));
  const touch = (k: number) => {
    if (policy === "lru") {
      lru.delete(k);
      lru.set(k, true);
    } else if (policy === "lfu") freq.set(k, (freq.get(k) ?? 0) + 1);
  };
  const size = () => (policy === "lru" ? lru.size : keys.length);
  const evict = () => {
    if (policy === "lru") {
      const oldest = lru.keys().next().value as number;
      lru.delete(oldest);
    } else {
      let victimPos = 0;
      if (policy === "random") victimPos = Math.floor(r() * keys.length);
      else {
        // LFU: smallest counter among a sample of 16 (like Redis's sampled approximation, a bit wider).
        let best = Infinity;
        for (let s = 0; s < 16; s++) {
          const pos = Math.floor(r() * keys.length);
          const c = freq.get(keys[pos]) ?? 0;
          if (c < best) {
            best = c;
            victimPos = pos;
          }
        }
      }
      const victim = keys[victimPos];
      const last = keys.pop()!;
      if (victimPos < keys.length) {
        keys[victimPos] = last;
        index.set(last, victimPos);
      }
      index.delete(victim);
      freq.delete(victim);
    }
  };
  const insert = (k: number) => {
    if (size() >= capacity) evict();
    if (policy === "lru") lru.set(k, true);
    else {
      index.set(k, keys.length);
      keys.push(k);
      if (policy === "lfu") freq.set(k, 1);
    }
  };
  const access = (k: number, count: boolean) => {
    if (has(k)) {
      touch(k);
      if (count) {
        hits++;
        wHits++;
      }
    } else insert(k);
    if (count) {
      requests++;
      wReq++;
      if (wReq === 1000) {
        window.push(wHits / wReq);
        wHits = 0;
        wReq = 0;
      }
    }
  };

  for (let n = 0; n < TOTAL; n++) {
    let k = pick();
    if (shift && n >= TOTAL / 2) k = (k + 500) % N; // the popular items change
    access(k, true);
    if (scan && n >= 10_000 && n < 13_000)
      for (let c = 0; c < 5; c++) access(100_000 + n * 5 + c, false); // a crawler reads 15,000 one-off pages
  }
  return { hitRatio: hits / requests, window };
}

/* Stampede ------------------------------------------------------------------------------------ */

export type Mitigation = "none" | "coalesce" | "early" | "swr" | "lease";

/** Database queries for one hot key around its expiry; 20 app servers, 2,000 req/s, 500 ms recompute. */
export function stampede(m: Mitigation) {
  const RATE = 2000;
  const RECOMPUTE_S = 0.5;
  const SERVERS = 20;
  const DB_LIMIT = 200; // concurrent queries before the database slows down
  const buckets = 30; // 50 ms buckets from −0.5 s to +1.0 s
  const q = new Array(buckets).fill(0);
  const at = (t: number) => Math.min(buckets - 1, Math.max(0, Math.floor((t + 0.5) / 0.05)));
  let userWaitMs = 0;
  let staleServedS = 0;
  let queries = 0;
  if (m === "none") {
    // Every request that arrives before the first recompute finishes also misses.
    queries = RATE * RECOMPUTE_S;
    for (let i = 0; i < queries; i++) q[at((i / queries) * RECOMPUTE_S)]++;
    userWaitMs = RECOMPUTE_S * 1000 * (queries / DB_LIMIT); // the database is overwhelmed
  } else if (m === "coalesce") {
    queries = SERVERS; // one per app server (singleflight inside each process)
    q[at(0)] += SERVERS;
    userWaitMs = RECOMPUTE_S * 1000;
  } else if (m === "early") {
    queries = 1;
    q[at(-0.3)] += 1; // one request refreshes shortly before expiry
  } else if (m === "swr") {
    queries = 1;
    q[at(0)] += 1;
    staleServedS = RECOMPUTE_S;
  } else {
    queries = 1;
    q[at(0)] += 1;
    userWaitMs = RECOMPUTE_S * 1000; // others wait briefly and retry
  }
  return {
    buckets: q,
    queries,
    overloaded: queries > DB_LIMIT,
    userWaitMs,
    staleServedS,
    dbLimit: DB_LIMIT,
  };
}

/* Synchronised expiry ---------------------------------------------------------------------------- */

/** 10,000 keys cached at the same moment with a 60-minute TTL; expiries per minute with ±jitter. */
export function expiryHistogram(jitterPct: number, seed = 9) {
  const r = rng(seed);
  const minutes = 30; // show 45–75 minutes after warm-up
  const hist = new Array(minutes).fill(0);
  for (let i = 0; i < 10_000; i++) {
    const ttl = 60 * (1 + (r() * 2 - 1) * (jitterPct / 100));
    const bucket = Math.floor(ttl - 45);
    if (bucket >= 0 && bucket < minutes) hist[bucket]++;
  }
  return hist;
}
