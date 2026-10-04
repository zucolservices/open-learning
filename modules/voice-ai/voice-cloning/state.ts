import type { Decision } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CloneState {
  [key: string]: unknown;
  picks: Record<string, Decision>;
}

export const initialState: CloneState = { picks: {} };
