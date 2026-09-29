/** Everything a learner can change in this module, saved for resume. */
export interface SecurityState {
  [key: string]: unknown;
  leak: number;
  inject: number;
}

export const initialState: SecurityState = { leak: 0, inject: 0 };
