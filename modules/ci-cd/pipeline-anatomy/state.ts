import type { Part, Platform } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AnatomyState {
  [key: string]: unknown;
  part: Part;
  frame: number;
  fail: boolean;
  platform: Platform;
}

export const initialState: AnatomyState = {
  part: "trigger",
  frame: 0,
  fail: false,
  platform: "GitHub Actions",
};
