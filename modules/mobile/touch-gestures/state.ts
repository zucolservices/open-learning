/** Everything a learner can change in this module, saved for resume. */
export interface TouchState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: TouchState = { fixed: [] };
