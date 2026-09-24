/** URL shortener arithmetic: load, storage, key space, collisions, and a load test. */

export const SEC_PER_MONTH = 30 * 86400;
export const BYTES_PER_LINK = 500;

export function estimate(perMonth: number, ratio: number, years: number) {
  const writes = perMonth / SEC_PER_MONTH;
  const reads = writes * ratio;
  const total = perMonth * 12 * years;
  const bytes = total * BYTES_PER_LINK;
  // Shortest base62 key with 10× headroom over the links we'll ever store.
  const keyLen = Math.ceil(Math.log(total * 10) / Math.log(62));
  return { writes, reads, peakReads: reads * 2, total, bytes, keyLen };
}

export const space = (len: number) => 62 ** len;

/** Chance at least one pair collides among n random keys (birthday bound). */
export const pAnyCollision = (n: number, N: number) => 1 - Math.exp((-n * (n - 1)) / (2 * N));

/** Chance the next random key hits one already taken. */
export const pNextCollides = (n: number, N: number) => Math.min(1, n / N);

/** Expected number of keys that land on an already-used key. */
export const expectedCollisions = (n: number, N: number) => n - N * (1 - Math.exp(-n / N));

export function human(n: number): string {
  const units: [number, string][] = [
    [1e12, " trillion"],
    [1e9, " billion"],
    [1e6, " million"],
    [1e3, " thousand"],
  ];
  for (const [v, u] of units) if (n >= v) return `${(n / v).toFixed(n / v < 10 ? 1 : 0)}${u}`;
  return n < 10 ? n.toFixed(n < 1 ? 2 : 1) : Math.round(n).toString();
}

export function bytesHuman(b: number): string {
  const units: [number, string][] = [
    [1e15, " PB"],
    [1e12, " TB"],
    [1e9, " GB"],
    [1e6, " MB"],
  ];
  for (const [v, u] of units) if (b >= v) return `${(b / v).toFixed(b / v < 10 ? 1 : 0)}${u}`;
  return `${Math.round(b / 1e3)} KB`;
}

/* Load test ------------------------------------------------------------------------------------- */

export type Store = "sql" | "kv";
export type Cache = "none" | "redis" | "cdn";
export type Analytics = "sync" | "async";

export interface LoadResult {
  dbReads: number; // reads/s reaching the database
  dbWrites: number;
  dbLimit: number;
  p50: number; // ms, redirect
  p99: number;
  saturated: boolean;
  analyticsOk: boolean;
  notes: string[];
}

export function loadTest(
  reads: number,
  writes: number,
  store: Store,
  cache: Cache,
  analytics: Analytics,
): LoadResult {
  const hit = cache === "none" ? 0 : cache === "redis" ? 0.9 : 0.95;
  const dbReads = reads * (1 - hit);
  const dbWrites = writes + (analytics === "sync" ? reads : 0);
  const dbLimit = store === "sql" ? 20000 : 1_000_000; // illustrative: one big SQL primary vs a scaled-out key-value store
  const load = (dbReads + dbWrites * 3) / dbLimit; // writes cost more
  const saturated = load > 0.8;
  const dbMs = store === "sql" ? 3 : 5;
  const base = cache === "cdn" ? 15 : 40; // network to the nearest edge vs to our region
  const hitMs = cache === "cdn" ? 0 : cache === "redis" ? 1 : dbMs;
  const syncMs = analytics === "sync" ? dbMs : 0;
  const p50 = base + (hit > 0.5 ? hitMs : dbMs) + syncMs;
  const p99 = saturated ? 2000 : base * 2 + dbMs * 4 + syncMs * 4 + (cache === "none" ? 10 : 0);
  const notes: string[] = [];
  if (saturated)
    notes.push(
      analytics === "sync"
        ? "Recording every click in the main database turns each read into a write: the database is overwhelmed."
        : "The database can't keep up with this many lookups. Cache them, or use a store that scales out.",
    );
  if (cache === "cdn")
    notes.push(
      "Redirects cached at the edge never reach you, so count clicks from the CDN's logs.",
    );
  if (analytics === "async")
    notes.push("Clicks go onto a stream and are counted in the background; redirects don't wait.");
  if (!saturated && cache !== "none")
    notes.push(
      `${Math.round(hit * 100)}% of lookups are served from cache: popular links get most clicks.`,
    );
  return {
    dbReads,
    dbWrites,
    dbLimit,
    p50,
    p99,
    saturated,
    analyticsOk: cache !== "cdn" || analytics === "async",
    notes,
  };
}
