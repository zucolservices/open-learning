import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TestState {
  [key: string]: unknown;
  on: Kind[];
  fact: number;
}

export const initialState: TestState = { on: [], fact: 0 };
