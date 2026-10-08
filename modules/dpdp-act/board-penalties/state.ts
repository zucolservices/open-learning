import type { Factors } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PenState {
  [key: string]: unknown;
  item: string;
  f: Factors;
  significant: boolean;
  undertaking: boolean;
}

export const initialState: PenState = {
  item: "1",
  f: { gravity: 1, sensitive: 1, repeat: false, gain: false, mitigation: 1 },
  significant: true,
  undertaking: false,
};
