import type { Model } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OwnState {
  [key: string]: unknown;
  owners: Record<string, Model>;
  person: boolean;
}

export const initialState: OwnState = { owners: {}, person: true };
