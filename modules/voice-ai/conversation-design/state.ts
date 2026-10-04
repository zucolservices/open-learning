import type { FixId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DesignState {
  [key: string]: unknown;
  fixes: Record<FixId, boolean>;
  attempt: number;
}

export const initialState: DesignState = {
  fixes: { greet: false, confirm: false, correct: false, recover: false, handover: false },
  attempt: 0,
};
