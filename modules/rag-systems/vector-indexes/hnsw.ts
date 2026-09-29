/**
 * A small, readable HNSW on 2D points, built in the browser for the walk-through. Levels are
 * drawn with the paper's exponential rule; each layer links a point to its M nearest points on
 * that layer (a simplification of the paper's heuristic); search is greedy on upper layers and a
 * beam of width ef on layer 0.
 */

export interface Pt {
  x: number;
  y: number;
  level: number;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export const M = 5;
export const LAYERS = 3;

export function buildPoints(n: number, seed = 11): Pt[] {
  const r = rng(seed);
  const mL = 1 / Math.log(M);
  const pts: Pt[] = [];
  // A few loose clusters, like real embeddings.
  const centres = Array.from({ length: 6 }, () => [0.15 + r() * 0.7, 0.15 + r() * 0.7]);
  for (let i = 0; i < n; i++) {
    const [cx, cy] = centres[Math.floor(r() * centres.length)];
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.16;
    const level = Math.min(LAYERS - 1, Math.floor(-Math.log(Math.max(1e-9, r())) * mL));
    pts.push({
      x: Math.min(0.98, Math.max(0.02, cx + Math.cos(a) * d)),
      y: Math.min(0.98, Math.max(0.02, cy + Math.sin(a) * d)),
      level,
    });
  }
  return pts;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/** links[layer][i] = neighbours of point i on that layer (only for points present on it). */
export function buildLinks(pts: Pt[]): number[][][] {
  return Array.from({ length: LAYERS }, (_, l) => {
    const on = pts.map((p, i) => (p.level >= l ? i : -1)).filter((i) => i >= 0);
    const links: number[][] = pts.map(() => []);
    for (const i of on) {
      links[i] = on
        .filter((j) => j !== i)
        .sort((a, b) => dist(pts[i], pts[a]) - dist(pts[i], pts[b]))
        .slice(0, M);
    }
    // Make links two-way so the graph is navigable.
    for (const i of on) for (const j of links[i]) if (!links[j].includes(i)) links[j].push(i);
    return links;
  });
}

export interface Hop {
  layer: number;
  from: number;
  to: number;
}

export interface SearchResult {
  hops: Hop[];
  visited: number;
  found: number;
  entry: number;
}

export function searchHnsw(
  pts: Pt[],
  links: number[][][],
  q: { x: number; y: number },
  ef = 6,
): SearchResult {
  const entry = pts.findIndex((p) => p.level === LAYERS - 1);
  const hops: Hop[] = [];
  let cur = entry;
  const seen = new Set<number>([cur]);
  for (let l = LAYERS - 1; l >= 1; l--) {
    let improved = true;
    while (improved) {
      improved = false;
      for (const n of links[l][cur]) {
        seen.add(n);
        if (dist(pts[n], q) < dist(pts[cur], q)) {
          hops.push({ layer: l, from: cur, to: n });
          cur = n;
          improved = true;
        }
      }
    }
  }
  // Layer 0: beam search of width ef.
  const cand = [cur];
  const best = new Set<number>([cur]);
  while (cand.length) {
    cand.sort((a, b) => dist(pts[a], q) - dist(pts[b], q));
    const c = cand.shift()!;
    const worst = [...best].sort((a, b) => dist(pts[b], q) - dist(pts[a], q))[0];
    if (best.size >= ef && dist(pts[c], q) > dist(pts[worst], q)) break;
    for (const n of links[0][c]) {
      if (seen.has(n)) continue;
      seen.add(n);
      const w = [...best].sort((a, b) => dist(pts[b], q) - dist(pts[a], q))[0];
      if (best.size < ef || dist(pts[n], q) < dist(pts[w], q)) {
        if (dist(pts[n], q) < dist(pts[c], q)) hops.push({ layer: 0, from: c, to: n });
        cand.push(n);
        best.add(n);
        if (best.size > ef) best.delete(w);
      }
    }
  }
  const found = [...best].sort((a, b) => dist(pts[a], q) - dist(pts[b], q))[0];
  return { hops, visited: seen.size, found, entry };
}

export function exactNearest(pts: Pt[], q: { x: number; y: number }) {
  let b = 0;
  pts.forEach((p, i) => {
    if (dist(p, q) < dist(pts[b], q)) b = i;
  });
  return b;
}
