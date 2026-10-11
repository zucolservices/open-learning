import type { Variant } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface UnitState {
  [key: string]: unknown;
  suite: string[];
  variant: Variant;
}

export const initialState: UnitState = { suite: ["one", "type"], variant: "correct" };
