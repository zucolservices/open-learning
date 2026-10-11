import type { Strategy } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StratState {
  [key: string]: unknown;
  strategy: Strategy;
  deployed: boolean;
  percent: number;
}

export const initialState: StratState = { strategy: "gitflow", deployed: false, percent: 0 };
