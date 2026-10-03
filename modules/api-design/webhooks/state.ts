import type { Defence } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HookState {
  [key: string]: unknown;
  on: Defence[];
}

export const initialState: HookState = { on: [] };
