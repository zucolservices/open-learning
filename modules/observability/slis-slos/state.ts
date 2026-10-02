import type { Nine } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SloState {
  [key: string]: unknown;
  pick: string;
  target: Nine;
}

export const initialState: SloState = { pick: "", target: 99.9 };
