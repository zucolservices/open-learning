import type { Algo, Pattern } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RlState {
  [key: string]: unknown;
  pattern: Pattern;
  algo: Algo;
}

export const initialState: RlState = { pattern: "edge", algo: "window" };
