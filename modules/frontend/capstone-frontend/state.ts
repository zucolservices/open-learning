import type { Metric } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  matches: Record<string, Metric>;
  fixes: string[];
  audit: Record<string, boolean>;
  prove: string | null;
}

export const initialState: CapState = { matches: {}, fixes: [], audit: {}, prove: null };
