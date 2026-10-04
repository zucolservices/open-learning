/** Everything a learner can change in this module, saved for resume. */
export interface EvalState {
  [key: string]: unknown;
  path: boolean;
  budget: boolean;
  p: number;
  k: number;
}

export const initialState: EvalState = { path: false, budget: false, p: 75, k: 3 };
