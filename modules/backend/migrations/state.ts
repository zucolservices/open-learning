/** Everything a learner can change in this module, saved for resume. */
export interface MigState {
  [key: string]: unknown;
  safe: boolean;
  step: number;
}

export const initialState: MigState = { safe: false, step: 0 };
