/** Everything a learner can change in this module, saved for resume. */
export interface CoverageState {
  [key: string]: unknown;
  cases: string[];
  fixed: boolean;
}

export const initialState: CoverageState = { cases: ["a"], fixed: false };
