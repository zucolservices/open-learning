/** Everything a learner can change in this module, saved for resume. */
export interface OpState {
  [key: string]: unknown;
  frame: number;
}

export const initialState: OpState = { frame: 0 };
