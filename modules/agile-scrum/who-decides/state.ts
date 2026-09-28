/** Everything a learner can change in this module, saved for resume. */
export interface DecideState {
  [key: string]: unknown;
  /** Answer given per situation id. */
  answers: Record<string, string>;
  /** Which situation is showing. */
  at: number;
  /** Selected accountability in the "three accountabilities" step. */
  who: string;
}

export const initialState: DecideState = { answers: {}, at: 0, who: "po" };
