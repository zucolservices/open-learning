import type { Dim } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DimState {
  [key: string]: unknown;
  picks: Record<string, Dim>;
  open: Dim;
}

export const initialState: DimState = { picks: {}, open: "completeness" };
