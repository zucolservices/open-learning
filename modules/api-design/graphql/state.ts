import type { Field } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface GqlState {
  [key: string]: unknown;
  fields: Field[];
  n: number;
  m: number;
  loader: boolean;
}

export const initialState: GqlState = { fields: ["rating"], n: 10, m: 5, loader: false };
