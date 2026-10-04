import type { Fix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WriteState {
  [key: string]: unknown;
  fixes: Fix[];
}

export const initialState: WriteState = { fixes: [] };
