import type { Level } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CacheState {
  [key: string]: unknown;
  level: Level;
  mem: number;
  pick: number;
}

export const initialState: CacheState = { level: "none", mem: 1, pick: 1 };
