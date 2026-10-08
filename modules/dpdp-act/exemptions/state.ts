import type { Ex } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ExState {
  [key: string]: unknown;
  current: string;
  picks: Record<string, Ex>;
  grid: Ex;
}

export const initialState: ExState = { current: "sue", picks: {}, grid: "c" };
