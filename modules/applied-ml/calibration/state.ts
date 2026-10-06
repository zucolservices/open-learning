import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CalState {
  [key: string]: unknown;
  kind: Kind;
  recal: boolean;
  rainy: number;
}

export const initialState: CalState = { kind: "overconfident", recal: false, rainy: 5 };
