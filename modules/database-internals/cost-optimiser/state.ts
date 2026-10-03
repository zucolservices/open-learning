import type { Stage } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CoState {
  [key: string]: unknown;
  stage: Stage;
  extended: boolean;
}

export const initialState: CoState = { stage: 0, extended: false };
