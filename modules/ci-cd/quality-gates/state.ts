import type { Rule } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface GateState {
  [key: string]: unknown;
  rules: Rule[];
  frame: number;
}

export const initialState: GateState = { rules: ["checks"], frame: 0 };
