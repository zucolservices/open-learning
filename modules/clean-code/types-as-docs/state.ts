import type { Flags } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TypesState {
  [key: string]: unknown;
  flags: Flags;
  union: boolean;
  seen: string[];
}

export const initialState: TypesState = {
  flags: { paid: false, delivered: false, cancelled: false },
  union: false,
  seen: [],
};
