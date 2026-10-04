import type { Signal } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OnlineState {
  [key: string]: unknown;
  canary: boolean;
  signals: Signal[];
}

export const initialState: OnlineState = { canary: false, signals: ["thumbs"] };
