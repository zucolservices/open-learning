import type { Op } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MemState {
  [key: string]: unknown;
  heap: number;
  cores: number;
  cache: number;
  part: number;
  op: Op;
  python: boolean;
}

export const initialState: MemState = {
  heap: 1,
  cores: 2,
  cache: 1,
  part: 1,
  op: "sort",
  python: false,
};
