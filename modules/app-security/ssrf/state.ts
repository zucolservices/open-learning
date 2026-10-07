import type { Fix, Target } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SsrfState {
  [key: string]: unknown;
  target: Target;
  fixes: Fix[];
}

export const initialState: SsrfState = { target: "image", fixes: [] };
