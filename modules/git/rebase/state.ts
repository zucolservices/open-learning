import type { Action } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RebaseState {
  [key: string]: unknown;
  stage: 0 | 1 | 2;
  compare: boolean;
  actions: Record<string, Action>;
  shared: number;
}

export const initialState: RebaseState = { stage: 0, compare: false, actions: {}, shared: 0 };
