import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CommentsState {
  [key: string]: unknown;
  labels: Record<number, Kind>;
  fixed: boolean;
  view: "martin" | "ousterhout";
}

export const initialState: CommentsState = { labels: {}, fixed: false, view: "martin" };
