import type { Wiring } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  n: number;
  wiring: Wiring;
  changed: boolean;
}

export const initialState: WhyState = { n: 8, wiring: "p2p", changed: false };
