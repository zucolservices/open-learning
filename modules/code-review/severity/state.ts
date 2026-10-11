import type { Label, Verdict } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SevState {
  [key: string]: unknown;
  labels: Record<string, Label>;
  verdict: Verdict | null;
}

export const initialState: SevState = { labels: {}, verdict: null };
