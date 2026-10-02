import type { Step } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FlagState {
  [key: string]: unknown;
  pct: Step;
  killed: boolean;
  flag: string;
  log: string[];
  stale: number;
}

export const initialState: FlagState = {
  pct: 0,
  killed: false,
  flag: "new-checkout",
  log: [],
  stale: 3,
};
