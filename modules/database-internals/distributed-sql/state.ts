import type { Action } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DistState {
  [key: string]: unknown;
  actions: Action[];
  frame: number;
}

export const initialState: DistState = { actions: [], frame: 0 };
