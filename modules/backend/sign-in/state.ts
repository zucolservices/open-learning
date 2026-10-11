import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SignState {
  [key: string]: unknown;
  method: Method;
  step: number;
  leaked: boolean;
}

export const initialState: SignState = { method: "plain", step: 0, leaked: false };
