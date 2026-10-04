import type { Impl } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PyState {
  [key: string]: unknown;
  impl: Impl;
  caseIdx: number;
}

export const initialState: PyState = { impl: "pickled", caseIdx: 2 };
