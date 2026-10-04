import type { Style } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StyleState {
  [key: string]: unknown;
  style: Style;
}

export const initialState: StyleState = { style: "file" };
