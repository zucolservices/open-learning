/** Everything a learner can change in this module, saved for resume. */
export interface ReviewState {
  [key: string]: unknown;
  choices: Record<string, string>;
  at: number;
}

export const initialState: ReviewState = { choices: {}, at: 0 };
