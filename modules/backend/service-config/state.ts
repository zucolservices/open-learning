import type { Place } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CfgState {
  [key: string]: unknown;
  places: Record<string, Place>;
  validate: boolean;
}

export const initialState: CfgState = { places: {}, validate: false };
