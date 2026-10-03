import type { Level, Scenario } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface IsoState {
  [key: string]: unknown;
  scenario: Scenario;
  level: Level;
}

export const initialState: IsoState = { scenario: "lost", level: "rc" };
