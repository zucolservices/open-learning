/** Everything a learner can change in this module, saved for resume. */
export interface FeedState {
  [key: string]: unknown;
  mode: "push" | "pull";
  posts: number; // times the poster has posted (animation key)
  opens: number; // times the reader opened the feed
  strategy: "write" | "read" | "hybrid";
  threshold: number; // index into THRESHOLDS
  paging: "offset" | "cursor";
  pageStage: number; // 0 nothing, 1 page 1 loaded, 2 new posts arrived, 3 page 2 loaded
}

export const initialState: FeedState = {
  mode: "push",
  posts: 0,
  opens: 0,
  strategy: "write",
  threshold: 1,
  paging: "offset",
  pageStage: 0,
};
