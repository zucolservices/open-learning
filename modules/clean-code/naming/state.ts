import { ORIGINAL } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface NamingState {
  [key: string]: unknown;
  choice: Record<string, number>;
}

export const initialState: NamingState = { choice: { ...ORIGINAL } };
