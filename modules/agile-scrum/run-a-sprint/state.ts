import type { Picks } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SprintState {
  [key: string]: unknown;
  day: number;
  picks: Picks;
}

export const initialState: SprintState = { day: 0, picks: {} };
