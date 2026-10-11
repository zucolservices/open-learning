import type { Action } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StaticState {
  [key: string]: unknown;
  triage: Record<string, Action>;
}

export const initialState: StaticState = { triage: {} };
