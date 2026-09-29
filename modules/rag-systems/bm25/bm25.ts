/**
 * A small, faithful BM25 (the Lucene variant) over the Kalpanagar help pages. Runs live in the
 * browser: tokenise → inverted index → score.
 */
import { CORPUS } from "../_shared/corpus";

export interface Doc {
  id: string;
  title: string;
  text: string;
}

export const DOCS: Doc[] = CORPUS.flatMap((d) =>
  d.paras.map((t, i) => ({ id: `${d.id}-${i + 1}`, title: d.title, text: t })),
);

export const STOP = new Set(
  "a an and are as at be by can for from has have if in into is it its of on or our that the their them then there these they this to was we will with you your after all any each every must not no than".split(
    " ",
  ),
);

/** A deliberately simple suffix stripper (plurals, -ing, -ed), standing in for a real stemmer. */
export function stem(w: string) {
  if (w.length <= 3) return w;
  if (w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.endsWith("sses")) return w.slice(0, -2);
  if (/(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  return w;
}

export interface TokOpts {
  stop: boolean;
  stem: boolean;
}

export function tokenize(text: string, o: TokOpts) {
  const raw = text.toLowerCase().match(/[\p{L}\p{M}\p{N}₹]+/gu) ?? [];
  return raw.filter((w) => !(o.stop && STOP.has(w))).map((w) => (o.stem ? stem(w) : w));
}

export interface Index {
  N: number;
  avgdl: number;
  lens: number[];
  /** term → [docIndex, termFrequency][] */
  postings: Map<string, [number, number][]>;
}

export function buildIndex(docs: Doc[], o: TokOpts): Index {
  const postings = new Map<string, [number, number][]>();
  const lens: number[] = [];
  docs.forEach((d, i) => {
    const toks = tokenize(`${d.title} ${d.text}`, o);
    lens.push(toks.length);
    const tf = new Map<string, number>();
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const [t, f] of tf) {
      if (!postings.has(t)) postings.set(t, []);
      postings.get(t)!.push([i, f]);
    }
  });
  return { N: docs.length, avgdl: lens.reduce((a, b) => a + b, 0) / docs.length, lens, postings };
}

/** Lucene's IDF: ln(1 + (N − n + 0.5) / (n + 0.5)). */
export function idf(ix: Index, term: string) {
  const n = ix.postings.get(term)?.length ?? 0;
  return Math.log(1 + (ix.N - n + 0.5) / (n + 0.5));
}

/**
 * Lucene's current form (since 8.0): the textbook formula also multiplies the top by (k1 + 1),
 * which changes the numbers but never the order.
 */
export function termScore(
  f: number,
  dl: number,
  avgdl: number,
  idfv: number,
  k1: number,
  b: number,
) {
  return (idfv * f) / (f + k1 * (1 - b + (b * dl) / avgdl));
}

export interface Hit {
  doc: number;
  score: number;
  parts: { term: string; tf: number; score: number }[];
}

export function search(ix: Index, qTerms: string[], k1: number, b: number): Hit[] {
  const uniq = [...new Set(qTerms)];
  const hits = new Map<number, Hit>();
  for (const t of uniq) {
    const idfv = idf(ix, t);
    for (const [d, f] of ix.postings.get(t) ?? []) {
      const s = termScore(f, ix.lens[d], ix.avgdl, idfv, k1, b);
      const h = hits.get(d) ?? { doc: d, score: 0, parts: [] };
      h.score += s;
      h.parts.push({ term: t, tf: f, score: s });
      hits.set(d, h);
    }
  }
  return [...hits.values()].sort((a, b2) => b2.score - a.score);
}
