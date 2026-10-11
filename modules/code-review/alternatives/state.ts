import type { Style } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AltState {
  [key: string]: unknown;
  picks: Record<string, Style>;
}

export const initialState: AltState = { picks: {} };
