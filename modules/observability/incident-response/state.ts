/** Everything a learner can change in this module, saved for resume. */
export interface IncState {
  [key: string]: unknown;
  picks: string[];
}

export const initialState: IncState = { picks: [] };
