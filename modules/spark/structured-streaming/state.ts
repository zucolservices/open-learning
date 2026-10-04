import type { Trig } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StreamState {
  [key: string]: unknown;
  batch: number;
  trig: Trig;
  crashed: boolean;
}

export const initialState: StreamState = { batch: 0, trig: "default", crashed: false };
