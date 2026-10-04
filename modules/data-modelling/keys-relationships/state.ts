import type { ActionId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface KeyState {
  [key: string]: unknown;
  log: ActionId[];
  enforce: boolean;
  cand: number;
}

export const initialState: KeyState = { log: [], enforce: true, cand: 0 };
