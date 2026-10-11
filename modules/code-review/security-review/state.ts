import type { Verdict } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SecState {
  [key: string]: unknown;
  found: string[];
  miss: number | null;
  verdict: Verdict | null;
}

export const initialState: SecState = { found: [], miss: null, verdict: null };
