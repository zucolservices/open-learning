/** Hashing models for the sharding module. Deterministic. */

/** A small, well-mixed 32-bit hash (FNV-1a + avalanche). */
export function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return h >>> 0;
}

export type Scheme = "mod" | "ring" | "vnodes";

/** Keys drawn on the ring. */
export const KEYS = Array.from({ length: 72 }, (_, i) => `order-${1000 + i * 7}`);
/** A larger sample for honest percentages. */
const SAMPLE = Array.from({ length: 4000 }, (_, i) => `k-${i}`);
export const SERVER_NAMES = ["A", "B", "C", "D", "E"];
export const VNODES = 32;

const TWO32 = 2 ** 32;
export const angleOf = (h: number) => (h / TWO32) * Math.PI * 2;

/** Points on the ring for each server (one, or several virtual nodes). */
export function ringPoints(servers: number, scheme: Scheme) {
  const pts: { server: number; h: number }[] = [];
  for (let s = 0; s < servers; s++) {
    const reps = scheme === "vnodes" ? VNODES : 1;
    for (let v = 0; v < reps; v++)
      pts.push({ server: s, h: hash(`server-${SERVER_NAMES[s]}#${v}`) });
  }
  return pts.sort((a, b) => a.h - b.h);
}

export function owner(key: string, servers: number, scheme: Scheme) {
  const h = hash(key);
  if (scheme === "mod") return h % servers;
  const pts = ringPoints(servers, scheme);
  const next = pts.find((p) => p.h >= h) ?? pts[0]; // first point clockwise
  return next.server;
}

export function assignment(servers: number, scheme: Scheme, keys: string[] = KEYS) {
  return keys.map((k) => owner(k, servers, scheme));
}

/** Share of keys that change owner when going from `from` servers to `to`. */
export function movedShare(from: number, to: number, scheme: Scheme) {
  const a = assignment(from, scheme, SAMPLE);
  const b = assignment(to, scheme, SAMPLE);
  return a.filter((x, i) => x !== b[i]).length / SAMPLE.length;
}

export function loads(servers: number, scheme: Scheme) {
  const counts = new Array(servers).fill(0);
  for (const o of assignment(servers, scheme, SAMPLE)) counts[o]++;
  return counts.map((c) => c / SAMPLE.length); // share of keys per server
}
