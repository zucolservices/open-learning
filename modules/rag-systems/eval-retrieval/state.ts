import type { Labels } from "./metrics";

/** Everything a learner can change in this module, saved for resume. */
export interface EvalState {
  [key: string]: unknown;
  q: number;
  setup: "keyword" | "vector" | "hybrid" | "rerank";
  k: number;
  /** The learner's own labels, per question, replacing ours once edited. */
  labels: Record<string, Labels>;
}

export const initialState: EvalState = { q: 1, setup: "vector", k: 5, labels: {} };
