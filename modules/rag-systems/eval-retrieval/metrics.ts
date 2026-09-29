/** Retrieval metrics over one ranked list and graded labels (2 answers it, 1 helps, 0 or missing: not relevant). */
export type Labels = Record<string, number>;

export function hitAt(list: string[], rel: Labels, k: number) {
  return list.slice(0, k).some((id) => (rel[id] ?? 0) > 0) ? 1 : 0;
}

export function recallAt(list: string[], rel: Labels, k: number) {
  const total = Object.values(rel).filter((g) => g > 0).length;
  if (!total) return 0;
  return list.slice(0, k).filter((id) => (rel[id] ?? 0) > 0).length / total;
}

export function precisionAt(list: string[], rel: Labels, k: number) {
  return list.slice(0, k).filter((id) => (rel[id] ?? 0) > 0).length / k;
}

/** Reciprocal rank of the first relevant passage within the top k (0 if none). */
export function rrAt(list: string[], rel: Labels, k: number) {
  const i = list.slice(0, k).findIndex((id) => (rel[id] ?? 0) > 0);
  return i < 0 ? 0 : 1 / (i + 1);
}

/** DCG with linear gain and a log2(position + 1) discount. */
export function dcg(gains: number[]) {
  return gains.reduce((s, g, i) => s + g / Math.log2(i + 2), 0);
}

/** nDCG@k: DCG of the list over DCG of the ideal ordering of all labelled passages. */
export function ndcgAt(list: string[], rel: Labels, k: number) {
  const ideal = Object.values(rel)
    .filter((g) => g > 0)
    .sort((a, b) => b - a)
    .slice(0, k);
  const idcg = dcg(ideal);
  return idcg ? dcg(list.slice(0, k).map((id) => rel[id] ?? 0)) / idcg : 0;
}

export const METRICS = [
  ["Hit rate", hitAt],
  ["Recall", recallAt],
  ["Precision", precisionAt],
  ["MRR", rrAt],
  ["nDCG", ndcgAt],
] as const;
