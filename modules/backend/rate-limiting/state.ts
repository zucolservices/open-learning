import type { Limit } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RlState {
  [key: string]: unknown;
  limit: Limit;
  shed: boolean;
}

export const initialState: RlState = { limit: "none", shed: false };
