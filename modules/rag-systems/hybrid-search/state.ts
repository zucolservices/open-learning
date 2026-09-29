/** Everything a learner can change in this module, saved for resume. */
export interface HybridState {
  [key: string]: unknown;
  q: number;
  fusion: "rrf" | "convex";
  k: number;
  w: number;
}

export const initialState: HybridState = { q: 1, fusion: "rrf", k: 60, w: 0.5 };
