/** Everything a learner can change in this module, saved for resume. */
export interface BeState {
  [key: string]: unknown;
  slow: string[];
}

export const initialState: BeState = { slow: [] };
