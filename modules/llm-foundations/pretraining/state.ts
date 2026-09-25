/** Everything a learner can change in this module, saved for resume. */
export interface PretrainState {
  [key: string]: unknown;
  budget: number; // index into BUDGETS
  logN: number; // log10 of model size
}

export const initialState: PretrainState = { budget: 1, logN: 11.45 };
