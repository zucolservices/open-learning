/** Caching a made-up café menu query. Simplified model; numbers are illustrative. */

export type Ttl = "none" | "60" | "3600";

export function metrics(ttl: Ttl, invalidate: boolean, coalesce: boolean) {
  if (ttl === "none") return { hit: 0, latency: 200, stale: 0, stampede: 0, dbPerMin: 6000 };
  const secs = Number(ttl);
  return {
    hit: ttl === "60" ? 99 : 99.9,
    latency: ttl === "60" ? 3 : 1.2,
    stale: invalidate ? 0 : secs,
    stampede: coalesce ? 1 : 500,
    dbPerMin: ttl === "60" ? 60 : 1,
  };
}
