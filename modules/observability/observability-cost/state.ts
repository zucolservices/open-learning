import type { Lever } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CostState {
  [key: string]: unknown;
  levers: Lever[];
}

export const initialState: CostState = { levers: [] };
