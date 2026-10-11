/** Everything a learner can change in this module, saved for resume. */
export interface FeedbackState {
  [key: string]: unknown;
  picks: Record<string, number>;
}

export const initialState: FeedbackState = { picks: {} };
