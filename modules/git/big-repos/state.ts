import type { Way } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BigState {
  [key: string]: unknown;
  way: Way;
  lfs: boolean;
  fileMb: number;
}

export const initialState: BigState = { way: "full", lfs: false, fileMb: 30 };
