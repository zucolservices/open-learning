import type { Hint } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface JoinState {
  [key: string]: unknown;
  size: number;
  equi: boolean;
  hint: Hint;
  frame: number;
}

export const initialState: JoinState = { size: 0, equi: true, hint: "none", frame: 0 };
