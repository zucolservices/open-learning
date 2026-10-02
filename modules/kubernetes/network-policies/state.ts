/** Everything a learner can change in this module, saved for resume. */
export interface NpState {
  [key: string]: unknown;
  on: string[];
}

export const initialState: NpState = { on: [] };
