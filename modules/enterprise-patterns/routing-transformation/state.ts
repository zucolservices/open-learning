import type { Stage } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RtState {
  [key: string]: unknown;
  on: Stage[];
  apps: number;
}

export const initialState: RtState = { on: [], apps: 6 };
