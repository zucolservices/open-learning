/**
 * The outage: a cold cache causes a stampede on the database; failing requests are retried three
 * times at once, which keeps the database overloaded, which stops the cache from warming.
 * Minute by minute from 21:00. Illustrative numbers.
 */

export const MINUTES = 31;
const R = 3000; // user requests/s
const DB_CAP = 1000; // database reads/s
const REPLICA_BOOST = 800;
const WARM_TARGET = 0.95;

export interface Fixes {
  coalesce: boolean; // one database read per missing key, others wait for it
  budget: boolean; // retry budget + backoff with jitter
  shed: boolean; // database proxy rejects work above its concurrency limit
  replicas: boolean; // add read replicas (ready after 12 minutes)
  restart: boolean; // restart all app servers at 21:05
}

export interface OutageMinute {
  t: number;
  userSuccess: number;
  hit: number;
  dbLoad: number;
  dbCap: number;
}

/** Minutes after 21:00 until each fix takes effect (a config flag is quick; a code change needs a deploy). */
export const DELAY: Record<keyof Fixes, number> = {
  shed: 2,
  budget: 3,
  restart: 5,
  replicas: 12,
  coalesce: 20,
};

export function run(f: Fixes): {
  minutes: OutageMinute[];
  recoveredAt: number | null;
  avgSuccess: number;
} {
  let hit = 0.2; // the cache node restarted at 20:58
  const minutes: OutageMinute[] = [];
  let recoveredAt: number | null = null;
  let streak = 0;
  for (let t = 0; t < MINUTES; t++) {
    const on = (k: keyof Fixes) => f[k] && t >= DELAY[k];
    const cap = DB_CAP + (on("replicas") ? REPLICA_BOOST : 0);
    const misses = R * (1 - hit);
    const reads = on("coalesce") ? misses * 0.15 : misses; // hot keys: many requests share a few keys
    // Solve for the failure rate with retries feeding back into load.
    let fail = 0.5;
    let load = reads;
    let succ = 0;
    for (let k = 0; k < 30; k++) {
      const mult = on("budget") ? 1 + Math.min(0.1, fail) : 1 + fail + fail * fail;
      load = reads * mult;
      if (on("shed")) {
        const admitted = Math.min(load, cap * 0.9);
        succ = admitted / load;
        load = admitted;
      } else succ = load <= cap ? 1 : Math.max(0.02, (cap / load) ** 2);
      fail = 0.5 * fail + 0.5 * (1 - succ);
    }
    const userSuccess = hit + (1 - hit) * succ;
    minutes.push({ t, userSuccess, hit, dbLoad: load, dbCap: cap });
    // The cache warms only from successful database reads.
    hit = hit + (WARM_TARGET - hit) * 0.45 * succ;
    // Restarting app servers at 21:05 drops their local caches and reconnects everyone at once.
    if (f.restart && t === DELAY.restart - 1) hit = 0.2;
    if (userSuccess > 0.99) {
      streak += 1;
      if (streak >= 3 && recoveredAt === null) recoveredAt = t - 2;
    } else streak = 0;
  }
  const avgSuccess = minutes.reduce((a, m) => a + m.userSuccess, 0) / minutes.length;
  return { minutes, recoveredAt, avgSuccess };
}
