import type { FixId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FixState {
  [key: string]: unknown;
  fixes: FixId[];
  tab: string;
}

export const initialState: FixState = { fixes: [], tab: "metadata" };
