/** Everything a learner can change in this module, saved for resume. */
export interface InvState {
  [key: string]: unknown;
  picks: string[];
}

export const initialState: InvState = { picks: [] };
