import type { Strategy } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReleaseState {
  [key: string]: unknown;
  strategy: Strategy;
  canary: number;
}

export const initialState: ReleaseState = { strategy: "recreate", canary: 5 };
