/** Everything a learner can change in this module, saved for resume. */
export interface A11yLawState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: A11yLawState = { fixed: [] };
