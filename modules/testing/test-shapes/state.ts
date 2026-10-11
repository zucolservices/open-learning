import type { Mix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ShapesState {
  [key: string]: unknown;
  mix: Mix;
}

export const initialState: ShapesState = { mix: { unit: 20, integration: 10, e2e: 40 } };
