import type { Def } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CsrfState {
  [key: string]: unknown;
  on: Def[];
  pair: number;
  cors: number;
}

export const initialState: CsrfState = { on: [], pair: 0, cors: 0 };
