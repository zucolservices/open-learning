import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PrState {
  [key: string]: unknown;
  stage: number;
  method: Method;
}

export const initialState: PrState = { stage: 0, method: "merge" };
