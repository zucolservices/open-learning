import type { Approach } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HydState {
  [key: string]: unknown;
  approach: Approach;
  stage: number;
  tried: string[];
}

export const initialState: HydState = { approach: "full", stage: 0, tried: [] };
