import type { Pattern } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PatState {
  [key: string]: unknown;
  open: string;
  picks: Record<string, Pattern>;
  full: boolean;
  snow: boolean;
}

export const initialState: PatState = { open: "dates", picks: {}, full: false, snow: true };
