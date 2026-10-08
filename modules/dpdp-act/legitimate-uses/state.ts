import type { Ground } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LegitState {
  [key: string]: unknown;
  current: string;
  picks: Record<string, Ground>;
  use: string;
}

export const initialState: LegitState = { current: "receipt", picks: {}, use: "a" };
