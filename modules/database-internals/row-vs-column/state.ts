import type { Layout, Query } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RcState {
  [key: string]: unknown;
  layout: Layout;
  query: Query;
}

export const initialState: RcState = { layout: "row", query: "checkout" };
