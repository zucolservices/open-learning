import type { Impl } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TestsState {
  [key: string]: unknown;
  flagged: string[];
  impl: Impl;
}

export const initialState: TestsState = { flagged: [], impl: "real" };
