import type { Impl, PropId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PbtState {
  [key: string]: unknown;
  impl: Impl;
  props: PropId[];
  ran: boolean;
}

export const initialState: PbtState = { impl: "default", props: ["length"], ran: false };
