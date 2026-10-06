import type { Split } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SplitsState {
  [key: string]: unknown;
  split: Split;
  k: number;
  fold: number;
}

export const initialState: SplitsState = { split: "random", k: 5, fold: 0 };
