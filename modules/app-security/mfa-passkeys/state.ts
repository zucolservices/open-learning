import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MfaState {
  [key: string]: unknown;
  method: Method;
  pk: number;
}

export const initialState: MfaState = { method: "sms", pk: 0 };
