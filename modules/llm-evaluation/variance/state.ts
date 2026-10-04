/** Everything a learner can change in this module, saved for resume. */
export interface VarianceState {
  [key: string]: unknown;
  k: number;
  seed: number;
  asks: number;
  runs: number;
}

export const initialState: VarianceState = { k: 1, seed: 1, asks: 0, runs: 1 };
