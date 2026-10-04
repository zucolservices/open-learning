import type { Strategy } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LateState {
  [key: string]: unknown;
  strategy: Strategy;
  lookback: number;
  retry: boolean;
}

export const initialState: LateState = { strategy: "yesterday", lookback: 3, retry: false };
