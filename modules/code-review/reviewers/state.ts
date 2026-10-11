import { RULES, type Count } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReviewersState {
  [key: string]: unknown;
  order: string[];
  count: Count;
}

export const initialState: ReviewersState = { order: RULES.map((r) => r.id), count: "five" };
