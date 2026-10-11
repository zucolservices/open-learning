/** Everything a learner can change in this module, saved for resume. */
export interface UpState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: UpState = { fixed: [] };
