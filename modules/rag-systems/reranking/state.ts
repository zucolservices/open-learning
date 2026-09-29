/** Everything a learner can change in this module, saved for resume. */
export interface RerankState {
  [key: string]: unknown;
  q: number;
  scorer: "minilm" | "bgem3" | "llm";
  threshold: number;
}

export const initialState: RerankState = { q: 1, scorer: "bgem3", threshold: 0.5 };
