import type { Situation } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RollbackState {
  [key: string]: unknown;
  situation: Situation;
  action: string;
}

export const initialState: RollbackState = { situation: "flagged", action: "" };
