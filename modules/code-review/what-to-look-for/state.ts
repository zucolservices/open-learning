/** Everything a learner can change in this module, saved for resume. */
export interface LookState {
  [key: string]: unknown;
  picked: string[];
}

export const initialState: LookState = { picked: [] };
