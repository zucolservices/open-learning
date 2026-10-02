import type { Cadence, Checks } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DoraState {
  [key: string]: unknown;
  every: Cadence;
  checks: Checks;
}

export const initialState: DoraState = { every: 7, checks: "weak" };
