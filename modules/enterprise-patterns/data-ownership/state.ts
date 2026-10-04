import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DoState {
  [key: string]: unknown;
  mode: Mode;
}

export const initialState: DoState = { mode: "shared" };
