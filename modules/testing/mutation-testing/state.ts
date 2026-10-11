/** Everything a learner can change in this module, saved for resume. */
export interface MutationState {
  [key: string]: unknown;
  tests: string[];
  marked: string[];
}

export const initialState: MutationState = { tests: ["t1", "t2"], marked: [] };
