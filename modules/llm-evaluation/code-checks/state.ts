import type { GraderId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CodeChecksState {
  [key: string]: unknown;
  grader: GraderId;
  c: number;
  k: number;
}

export const initialState: CodeChecksState = { grader: "exact", c: 3, k: 1 };
