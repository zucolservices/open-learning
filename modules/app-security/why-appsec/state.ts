import type { Defence } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  on: Defence[];
  likelihood: number;
  impact: number;
}

export const initialState: WhyState = { on: [], likelihood: 2, impact: 2 };
