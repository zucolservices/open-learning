import type { Era } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EsbState {
  [key: string]: unknown;
  frame: number;
  era: Era;
}

export const initialState: EsbState = { frame: 0, era: "esb" };
