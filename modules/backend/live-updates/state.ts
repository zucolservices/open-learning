import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LiveState {
  [key: string]: unknown;
  method: Method;
  multi: boolean;
  pubsub: boolean;
}

export const initialState: LiveState = { method: "poll", multi: false, pubsub: false };
