import type { Check, DateCase } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface InputState {
  [key: string]: unknown;
  on: Check[];
  date: DateCase;
}

export const initialState: InputState = { on: [], date: "good" };
