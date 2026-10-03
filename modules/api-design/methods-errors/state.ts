/** Everything a learner can change in this module, saved for resume. */
export interface ErrState {
  [key: string]: unknown;
  answers: Record<string, number>;
  after: boolean;
}

export const initialState: ErrState = { answers: {}, after: false };
