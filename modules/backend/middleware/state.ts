import { START } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MwState {
  [key: string]: unknown;
  order: string[];
}

export const initialState: MwState = { order: START };
