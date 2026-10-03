import type { Action } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LockState {
  [key: string]: unknown;
  actions: Action[];
}

export const initialState: LockState = { actions: [] };
