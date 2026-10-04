import type { Pattern } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MapState {
  [key: string]: unknown;
  pattern: Pattern;
}

export const initialState: MapState = { pattern: "acl" };
