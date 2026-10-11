/** Everything a learner can change in this module, saved for resume. */
export interface AdaptState {
  [key: string]: unknown;
  dp: number;
  adapt: boolean;
  safe: boolean;
}

export const initialState: AdaptState = { dp: 700, adapt: false, safe: false };
