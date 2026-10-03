import type { Level } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReplState {
  [key: string]: unknown;
  level: Level;
}

export const initialState: ReplState = { level: "local" };
