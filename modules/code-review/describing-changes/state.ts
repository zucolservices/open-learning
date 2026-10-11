/** Everything a learner can change in this module, saved for resume. */
export interface DescState {
  [key: string]: unknown;
  picks: Record<string, number>;
  selfReviewed: boolean;
}

export const initialState: DescState = { picks: {}, selfReviewed: false };
