import type { OpId, Scenario } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ShuffleState {
  [key: string]: unknown;
  frame: number;
  m: number;
  r: number;
  op: OpId;
  scenario: Scenario;
}

export const initialState: ShuffleState = { frame: 0, m: 3, r: 3, op: "groupBy", scenario: "none" };
