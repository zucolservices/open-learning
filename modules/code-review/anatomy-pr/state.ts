/** Everything a learner can change in this module, saved for resume. */
export interface PrState {
  [key: string]: unknown;
  fixes: string[];
}

export const initialState: PrState = { fixes: [] };
