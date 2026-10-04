import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MemState {
  [key: string]: unknown;
  kinds: Kind[];
  filter: boolean;
  recency: boolean;
  importance: boolean;
  relevance: boolean;
}

export const initialState: MemState = {
  kinds: [],
  filter: false,
  recency: true,
  importance: false,
  relevance: false,
};
