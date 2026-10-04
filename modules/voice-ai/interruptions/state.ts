import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface IntState {
  [key: string]: unknown;
  at: number;
  kind: Kind;
  stopAudio: boolean;
  truncate: boolean;
  minWords: boolean;
}

export const initialState: IntState = {
  at: 9,
  kind: "real",
  stopAudio: false,
  truncate: false,
  minWords: false,
};
