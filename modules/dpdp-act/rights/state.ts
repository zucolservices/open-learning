import type { Action, Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RightsState {
  [key: string]: unknown;
  kind: Kind;
  verify: string;
  actions: Record<string, Action>;
  included: string[];
}

export const initialState: RightsState = { kind: "erase", verify: "", actions: {}, included: [] };
