import type { Change, Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PageState {
  [key: string]: unknown;
  mode: Mode;
  change: Change;
  loaded: boolean;
  depth: number;
}

export const initialState: PageState = {
  mode: "offset",
  change: "insert",
  loaded: false,
  depth: 1,
};
