import type { Rule } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AlertState {
  [key: string]: unknown;
  rule: Rule;
}

export const initialState: AlertState = { rule: "naive" };
