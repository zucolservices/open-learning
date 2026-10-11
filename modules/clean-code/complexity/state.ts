/** Everything a learner can change in this module, saved for resume. */
export interface ComplexState {
  [key: string]: unknown;
  version: number;
}

export const initialState: ComplexState = { version: 0 };
