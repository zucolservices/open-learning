import type { Bug } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ServeState {
  [key: string]: unknown;
  bugs: Bug[];
  shared: boolean;
  mode: number;
  stage: number;
}

export const initialState: ServeState = { bugs: ["units"], shared: false, mode: 0, stage: 0 };
