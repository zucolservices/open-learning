/**
 * A small price-update topic for the retention simulation. Three events a day, keyed by product.
 * Segments roll every 3 days and time retention is 6 days, scaled down from Kafka's 7-day defaults
 * so the effect fits on screen. Day 8 brings a tombstone: "milk" is discontinued.
 */
import type { Policy } from "./state";

export interface Rec {
  offset: number;
  day: number;
  key: string;
  value: string | null;
}

const KEYS = ["tea", "sugar", "rice", "milk"];
export const DAYS = 14;
export const SEGMENT_DAYS = 3;
export const RETAIN_DAYS = 6;
export const SIZE_SEGMENTS = 1;
export const TOMBSTONE_KEEP = 2; // stand-in for delete.retention.ms

export const RECORDS: Rec[] = (() => {
  const out: Rec[] = [];
  let o = 0;
  for (let d = 0; d < DAYS; d++) {
    for (let j = 0; j < 3; j++) {
      const key = KEYS[(d + j) % 4];
      if (key === "milk" && d >= 8) continue; // discontinued from day 9
      out.push({ offset: o++, day: d, key, value: `₹${40 + ((d * 7 + j * 13) % 60)}` });
    }
    if (d === 8) out.push({ offset: o++, day: d, key: "milk", value: null });
  }
  return out;
})();

export const segmentOf = (r: Rec) => Math.floor(r.day / SEGMENT_DAYS);

/** Records still present on `today`, under a policy. */
export function visible(policy: Policy, today: number): Set<number> {
  const written = RECORDS.filter((r) => r.day <= today);
  const active = Math.floor(today / SEGMENT_DAYS);
  let keep = new Set(written.map((r) => r.offset));

  if (policy === "time" || policy === "both") {
    // Whole segments go once their newest record is older than the retention period.
    const segs = new Map<number, number>();
    for (const r of written) segs.set(segmentOf(r), Math.max(segs.get(segmentOf(r)) ?? 0, r.day));
    for (const r of written) {
      const s = segmentOf(r);
      if (s !== active && today - segs.get(s)! > RETAIN_DAYS) keep.delete(r.offset);
    }
  }
  if (policy === "size") {
    for (const r of written) if (segmentOf(r) < active - SIZE_SEGMENTS) keep.delete(r.offset);
  }
  if (policy === "compact" || policy === "both") {
    // In closed segments, keep only the latest record per key (looking across the whole log).
    const latest = new Map<string, number>();
    for (const r of written) latest.set(r.key, r.offset);
    keep = new Set(
      [...keep].filter((o) => {
        const r = RECORDS[o];
        if (segmentOf(r) === active) return true;
        if (latest.get(r.key) !== o) return false;
        if (r.value === null && today - r.day > TOMBSTONE_KEEP) return false;
        return true;
      }),
    );
  }
  return keep;
}
