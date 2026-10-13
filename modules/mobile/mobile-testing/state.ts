/** Everything a learner can change in this module, saved for resume. */
export interface TestState {
  [key: string]: unknown;
  picked: string[];
}

export const initialState: TestState = { picked: ["a-flag", "i-new"] };
