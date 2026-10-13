/** Everything a learner can change in this module, saved for resume. */
export interface PerfState {
  [key: string]: unknown;
  fixes: string[];
}

export const initialState: PerfState = { fixes: [] };
