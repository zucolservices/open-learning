/** Five small index structures over the same five restaurant reviews (illustrative). */

export type Kind = "hash" | "inverted" | "brin" | "spatial" | "vector";

export const REVIEWS = [
  { id: 1, text: "crispy dosa great chutney", lat: 2, lng: 3, vec: [0.9, 0.2], day: 1 },
  { id: 2, text: "spicy biryani great value", lat: 7, lng: 6, vec: [0.2, 0.9], day: 2 },
  { id: 3, text: "dosa soggy slow service", lat: 3, lng: 2, vec: [0.8, 0.3], day: 3 },
  { id: 4, text: "great filter coffee", lat: 8, lng: 2, vec: [0.6, 0.1], day: 4 },
  { id: 5, text: "biryani cold slow", lat: 6, lng: 7, vec: [0.3, 0.8], day: 5 },
];

export const KINDS: Record<Kind, { name: string; question: string; pg: string }> = {
  hash: {
    name: "Hash",
    question: "Exactly this value? (no ranges, no sorting)",
    pg: "CREATE INDEX ON reviews USING hash (reviewer_id);",
  },
  inverted: {
    name: "Inverted (GIN)",
    question: "Which documents contain this word?",
    pg: "CREATE INDEX ON reviews USING gin (to_tsvector('english', text));",
  },
  brin: {
    name: "Block range (BRIN)",
    question: "Which blocks could hold this date range?",
    pg: "CREATE INDEX ON reviews USING brin (created_at);",
  },
  spatial: {
    name: "Spatial (GiST)",
    question: "What's inside this area, or nearest to this point?",
    pg: "CREATE INDEX ON restaurants USING gist (location);",
  },
  vector: {
    name: "Vector (HNSW)",
    question: "Which items are most similar to this one?",
    pg: "CREATE INDEX ON reviews USING hnsw (embedding vector_cosine_ops);",
  },
};

export function inverted(): [string, number[]][] {
  const m = new Map<string, number[]>();
  for (const r of REVIEWS) for (const w of r.text.split(" ")) m.set(w, [...(m.get(w) ?? []), r.id]);
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export function nearest(v: number[]): number[] {
  return [...REVIEWS]
    .map((r) => ({ id: r.id, d: Math.hypot(r.vec[0] - v[0], r.vec[1] - v[1]) }))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.id);
}
