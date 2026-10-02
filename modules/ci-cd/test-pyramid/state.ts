import type { Suite } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TestState {
  [key: string]: unknown;
  suite: Suite;
  flaky: number;
  retry: boolean;
}

export const initialState: TestState = {
  suite: { unit: 100, integration: 40, e2e: 120 },
  flaky: 10,
  retry: false,
};
