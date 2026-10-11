import type { Wait } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface E2eState {
  [key: string]: unknown;
  wait: Wait;
  fresh: boolean;
  ran: boolean;
}

export const initialState: E2eState = { wait: "sleep500", fresh: false, ran: false };
