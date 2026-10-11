/** Everything a learner can change in this module, saved for resume. */
export interface ValState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: ValState = { fixed: [] };
