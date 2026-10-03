import type { Crash, Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WalState {
  [key: string]: unknown;
  mode: Mode;
  crash: Crash;
}

export const initialState: WalState = { mode: "nolog", crash: "midway" };
