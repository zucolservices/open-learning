import type { Change, Org } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ConwayState {
  [key: string]: unknown;
  org: Org;
  change: Change;
}

export const initialState: ConwayState = { org: "layers", change: "tip" };
