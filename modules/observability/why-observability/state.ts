import type { Attr } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyObsState {
  [key: string]: unknown;
  captured: "totals" | "rich";
  attr: Attr;
  drill: string;
}

export const initialState: WhyObsState = { captured: "totals", attr: "bank", drill: "" };
