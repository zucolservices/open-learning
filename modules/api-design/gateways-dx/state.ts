import type { Feature, Policy } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface GwState {
  [key: string]: unknown;
  policies: Policy[];
  features: Feature[];
}

export const initialState: GwState = { policies: [], features: [] };
