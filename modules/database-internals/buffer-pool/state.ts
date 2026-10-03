import type { Policy } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BpState {
  [key: string]: unknown;
  policy: Policy;
}

export const initialState: BpState = { policy: "lru" };
