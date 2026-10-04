import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AnomState {
  [key: string]: unknown;
  method: Method;
  min: number;
  max: number;
  k: number;
}

export const initialState: AnomState = { method: "fixed", min: 80, max: 160, k: 3 };
