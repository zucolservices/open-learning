import type { Test } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface NormState {
  [key: string]: unknown;
  stage: number;
  test: Test;
  viol: number;
}

export const initialState: NormState = { stage: 0, test: "phone", viol: 0 };
