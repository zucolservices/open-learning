import type { How } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ConvState {
  [key: string]: unknown;
  hows: Record<string, How>;
  adr: Record<string, number>;
}

export const initialState: ConvState = { hows: {}, adr: {} };
