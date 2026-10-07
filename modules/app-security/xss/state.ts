import type { Comment, Kind, Render } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface XssState {
  [key: string]: unknown;
  comment: Comment;
  renderMode: Render;
  csp: boolean;
  kind: Kind;
}

export const initialState: XssState = {
  comment: "plain",
  renderMode: "raw",
  csp: false,
  kind: "stored",
};
