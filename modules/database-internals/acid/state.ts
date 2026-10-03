import type { Failure } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AcidState {
  [key: string]: unknown;
  txn: boolean;
  failure: Failure;
}

export const initialState: AcidState = { txn: false, failure: "closed" };
