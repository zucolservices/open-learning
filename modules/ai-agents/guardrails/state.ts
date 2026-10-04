import type { Send } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface GuardState {
  [key: string]: unknown;
  send: Send;
  del: boolean;
  approval: boolean;
  outputCheck: boolean;
  rateLimit: boolean;
}

export const initialState: GuardState = {
  send: "anyone",
  del: true,
  approval: false,
  outputCheck: false,
  rateLimit: false,
};
