import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TuneState {
  [key: string]: unknown;
  method: Method;
  budget: number;
  round: number;
}

export const initialState: TuneState = { method: "grid", budget: 16, round: 0 };
