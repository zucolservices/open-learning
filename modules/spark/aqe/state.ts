import type { Scenario } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AqeState {
  [key: string]: unknown;
  scenario: Scenario;
  aqe: boolean;
  coalesce: boolean;
  join: boolean;
  skew: boolean;
}

export const initialState: AqeState = {
  scenario: "tiny",
  aqe: false,
  coalesce: true,
  join: true,
  skew: true,
};
