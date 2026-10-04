import type { Fix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SkewState {
  [key: string]: unknown;
  share: number;
  fix: Fix;
  salt: number;
  agg: boolean;
}

export const initialState: SkewState = { share: 2, fix: "none", salt: 8, agg: false };
