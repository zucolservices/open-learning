/** Everything a learner can change in this module, saved for resume. */
export interface StoreReviewState {
  [key: string]: unknown;
  fixed: string[];
  submitted: string[];
  rounds: number;
}

export const initialState: StoreReviewState = { fixed: [], submitted: [], rounds: 0 };
