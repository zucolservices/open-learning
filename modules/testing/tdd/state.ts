/** Everything a learner can change in this module, saved for resume. */
export interface TddState {
  [key: string]: unknown;
  stage: number;
}

export const initialState: TddState = { stage: 0 };
