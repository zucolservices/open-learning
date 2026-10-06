import type { Drift, Speed } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MonitorState {
  [key: string]: unknown;
  drift: Drift;
  speed: Speed;
  shift: number;
}

export const initialState: MonitorState = { drift: "data", speed: "sudden", shift: 0.5 };
