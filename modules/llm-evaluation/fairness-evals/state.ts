import type { Fix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FairnessState {
  [key: string]: unknown;
  fix: Fix;
  disambiguated: boolean;
  answer: string | null;
}

export const initialState: FairnessState = { fix: "none", disambiguated: false, answer: null };
