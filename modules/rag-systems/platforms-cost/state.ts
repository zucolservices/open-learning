/** Everything a learner can change in this module, saved for resume. */
export interface CostState {
  [key: string]: unknown;
  layer: number;
  pages: number;
  perDay: number;
  k: number;
  model: string;
  embedder: string;
  store: string;
  lcTokens: number;
  lcPerDay: number;
}

export const initialState: CostState = {
  layer: 0,
  pages: 50000,
  perDay: 20000,
  k: 5,
  model: "flashlite",
  embedder: "titan",
  store: "pg",
  lcTokens: 200000,
  lcPerDay: 2000,
};
