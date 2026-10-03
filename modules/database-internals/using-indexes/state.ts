import type { Ix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface UiState {
  [key: string]: unknown;
  ix: Ix;
}

export const initialState: UiState = { ix: "none" };
