import type { Label } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CardState {
  [key: string]: unknown;
  labels: Label[];
}

export const initialState: CardState = { labels: ["method"] };
