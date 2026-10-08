import type { Dials } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SdfState {
  [key: string]: unknown;
  dials: Dials;
  notified: boolean;
}

export const initialState: SdfState = {
  dials: { volume: 1, rights: 1, sovereignty: 0, elections: 0, security: 0, order: 0 },
  notified: false,
};
