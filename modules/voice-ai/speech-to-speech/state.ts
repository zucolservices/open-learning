import type { Arch, Scenario } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface S2sState {
  [key: string]: unknown;
  arch: Arch;
  scenario: Scenario;
}

export const initialState: S2sState = { arch: "cascade", scenario: "upset" };
