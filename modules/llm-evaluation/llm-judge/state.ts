import type { Fixes } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface JudgeState {
  [key: string]: unknown;
  fixes: Fixes;
  pick: number | null;
}

export const initialState: JudgeState = {
  fixes: { swap: false, rubric: false, otherFamily: false, reference: false, reason: false },
  pick: null,
};
