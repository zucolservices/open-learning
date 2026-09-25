/** Real sentence-transformer embeddings (all-MiniLM-L6-v2, 384 dims), precomputed; see SOURCES.md. */
import data from "./data.json";

export interface Item {
  text: string;
  v: number[];
}
export interface Word extends Item {
  group: string;
  p: [number, number, number];
}

export const MODEL_NAME = data.model;
export const WORDS = data.words as Word[];
export const FAQ = data.faq as Item[];
export const QUERIES = data.queries as Item[];

export const GROUPS = ["royalty", "drinks", "animals", "transport", "feelings", "places"] as const;

/** Vectors are normalised, so the dot product is the cosine similarity. */
export function cosine(a: number[], b: number[]): number {
  let s = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    s += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return s / Math.sqrt(na * nb);
}

export function nearest(v: number[], items: Item[], exclude: string[] = [], k = 5) {
  return items
    .filter((w) => !exclude.includes(w.text))
    .map((w) => ({ text: w.text, sim: cosine(v, w.v) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k);
}

export const byText = (t: string) => WORDS.find((w) => w.text === t)!;
