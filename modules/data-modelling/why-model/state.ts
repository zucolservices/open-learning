import type { Q } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  q: Q;
  modelled: boolean;
  def: number;
}

export const initialState: WhyState = { q: "revenue", modelled: false, def: 0 };
