/** Everything a learner can change in this module, saved for resume. */
export interface OpenState {
  [key: string]: unknown;
  on: string[];
}

export const initialState: OpenState = { on: [] };
