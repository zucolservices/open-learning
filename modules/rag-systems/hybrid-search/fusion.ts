/** Keyword (BM25, live), vector (precomputed e5 vectors, dot product) and two ways to fuse them. */
import { buildIndex, search, tokenize } from "../bm25/bm25";
import { PASSAGES, QUERIES } from "./corpus";
import V from "./vectors.json";

const OPTS = { stop: true, stem: true };
const IX = buildIndex(PASSAGES, OPTS);

export function keywordRanks(qi: number) {
  const hits = search(IX, tokenize(QUERIES[qi].q, OPTS), 1.2, 0.75);
  return hits.map((h) => ({ id: PASSAGES[h.doc].id, score: h.score }));
}

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);

export function vectorRanks(qi: number) {
  const q = V.queries[qi];
  return V.ids
    .map((id, i) => ({ id, score: dot(q, V.passages[i]) }))
    .sort((a, b) => b.score - a.score);
}

export type Ranked = { id: string; score: number }[];

/** Weighted reciprocal rank fusion: w/(k + rank_vec) + (1 − w)/(k + rank_kw), ranks from 1. */
export function rrf(kw: Ranked, vec: Ranked, k: number, w: number): Ranked {
  const s = new Map<string, number>();
  if (w < 1) kw.forEach((x, r) => s.set(x.id, (s.get(x.id) ?? 0) + ((1 - w) * 2) / (k + r + 1)));
  if (w > 0) vec.forEach((x, r) => s.set(x.id, (s.get(x.id) ?? 0) + (w * 2) / (k + r + 1)));
  return [...s.entries()].map(([id, score]) => ({ id, score })).sort((a, b) => b.score - a.score);
}

/** Min–max normalise each list's scores, then a weighted sum (a “convex combination”). */
export function convex(kw: Ranked, vec: Ranked, w: number): Ranked {
  const norm = (l: Ranked) => {
    if (!l.length) return new Map<string, number>();
    const hi = Math.max(...l.map((x) => x.score));
    const lo = Math.min(...l.map((x) => x.score));
    return new Map(l.map((x) => [x.id, hi === lo ? 1 : (x.score - lo) / (hi - lo)]));
  };
  const a = w < 1 ? norm(kw) : new Map<string, number>();
  const b = w > 0 ? norm(vec) : new Map<string, number>();
  const ids = new Set([...a.keys(), ...b.keys()]);
  return [...ids]
    .map((id) => ({ id, score: (1 - w) * (a.get(id) ?? 0) + w * (b.get(id) ?? 0) }))
    .sort((x, y) => y.score - x.score);
}

export const rankOf = (l: Ranked, id: string) => {
  const i = l.findIndex((x) => x.id === id);
  return i < 0 ? null : i + 1;
};
