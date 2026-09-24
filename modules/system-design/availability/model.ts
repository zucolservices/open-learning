/** Availability arithmetic: series, parallel, zones, and downtime. */

export const YEAR_MIN = 365.25 * 24 * 60;

export const series = (xs: number[]) => xs.reduce((a, x) => a * x, 1);
export const parallel = (a: number, n: number) => 1 - (1 - a) ** n;

/** Downtime per year, in minutes. */
export const downtimeMin = (a: number) => (1 - a) * YEAR_MIN;

/** "3 h 36 min", "52.6 min", "5.3 min", "32 s" */
export function humanDowntime(min: number): string {
  if (min >= 60 * 24 * 2) return `${(min / 60 / 24).toFixed(1)} days`;
  if (min >= 90) {
    const h = Math.floor(min / 60);
    const m = Math.round(min - h * 60);
    return m ? `${h} h ${m} min` : `${h} h`;
  }
  if (min >= 1) return `${min < 10 ? min.toFixed(1) : Math.round(min)} min`;
  return `${Math.round(min * 60)} s`;
}

/** Number of nines, e.g. 0.9995 → 3.3 */
export const nines = (a: number) => (a >= 1 ? Infinity : -Math.log10(1 - a));

export function pct(a: number): string {
  if (a >= 0.999999) return "99.9999+%";
  // Truncate (never round up into a nine you don't have), with precision matching the nines.
  const d = Math.max(1, Math.floor(nines(a) + 0.01));
  const v = Math.floor(a * 100 * 10 ** d) / 10 ** d;
  return `${v.toFixed(d).replace(/0+$/, "").replace(/\.$/, "")}%`;
}

export interface Tier {
  id: string;
  label: string;
  a: number; // one instance
  max: number; // most copies allowed
  zonal: boolean; // runs inside a zone
}

export const ZONE = 0.999; // one zone (a data centre building), illustrative

/**
 * A redundant tier: instances fail independently. Without `spread`, the shared zone is left to the
 * caller (count it once for the whole system); with it, instances go one per zone (up to 3 zones).
 */
export function tierAvailability(t: Tier, n: number, spread: boolean): number {
  if (!t.zonal || !spread) return parallel(t.a, n);
  // Instances round-robin across 3 zones; the tier is down only if every zone is down or has no live instance.
  const zones = Math.min(3, n);
  const perZone = Array.from(
    { length: zones },
    (_, z) => Math.floor(n / zones) + (z < n % zones ? 1 : 0),
  );
  const zoneUp = perZone.map((k) => ZONE * parallel(t.a, k));
  return 1 - zoneUp.reduce((acc, u) => acc * (1 - u), 1);
}
