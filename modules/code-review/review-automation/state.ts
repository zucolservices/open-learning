import type { Tool } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AutoState {
  [key: string]: unknown;
  assigned: Record<string, Tool>;
}

export const initialState: AutoState = { assigned: {} };
