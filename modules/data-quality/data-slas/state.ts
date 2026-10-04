import type { Target } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SlaState {
  [key: string]: unknown;
  deadline: number;
  target: Target;
}

export const initialState: SlaState = { deadline: 7, target: 99 };
