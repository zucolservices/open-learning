import type { Shuffle } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CostState {
  [key: string]: unknown;
  size: number;
  dynamic: boolean;
  shuffle: Shuffle;
  spot: number;
  decom: boolean;
  shape: number;
}

export const initialState: CostState = {
  size: 3,
  dynamic: false,
  shuffle: "service",
  spot: 0,
  decom: false,
  shape: 1,
};
