import type { Approach } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ApprState {
  [key: string]: unknown;
  picks: Record<string, Approach>;
}

export const initialState: ApprState = { picks: {} };
