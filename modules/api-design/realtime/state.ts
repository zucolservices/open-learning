import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RtState {
  [key: string]: unknown;
  method: Method;
  interval: number;
}

export const initialState: RtState = { method: "poll", interval: 5 };
