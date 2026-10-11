/** Everything a learner can change in this module, saved for resume. */
export interface SmallState {
  [key: string]: unknown;
  split: string[];
}

export const initialState: SmallState = { split: [] };
