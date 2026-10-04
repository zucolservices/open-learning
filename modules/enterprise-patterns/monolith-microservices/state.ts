import type { Shape } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MmState {
  [key: string]: unknown;
  shape: Shape;
  teams: number;
}

export const initialState: MmState = { shape: "fifty", teams: 3 };
