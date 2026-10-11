import type { Purpose } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  tags: Record<string, Purpose>;
}

export const initialState: WhyState = { tags: {} };
