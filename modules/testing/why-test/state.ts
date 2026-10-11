import type { Net } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyTestState {
  [key: string]: unknown;
  nets: Net[];
}

export const initialState: WhyTestState = { nets: [] };
