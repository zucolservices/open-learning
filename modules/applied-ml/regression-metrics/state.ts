import type { Pattern } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RegMetState {
  [key: string]: unknown;
  miss: number;
  zero: boolean;
  c: number;
  pattern: Pattern;
}

export const initialState: RegMetState = { miss: 0, zero: false, c: 20, pattern: "random" };
