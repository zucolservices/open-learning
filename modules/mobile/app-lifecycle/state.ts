/** Everything a learner can change in this module, saved for resume. */
export interface LifeState {
  [key: string]: unknown;
  step: number;
  saved: boolean;
}

export const initialState: LifeState = { step: 0, saved: false };
