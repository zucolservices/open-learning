import type { Strategy } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PlanState {
  [key: string]: unknown;
  strategy: Strategy;
  surprise: boolean;
  todo: number;
}

export const initialState: PlanState = { strategy: "plan", surprise: false, todo: 0 };
