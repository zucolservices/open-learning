import type { Approach } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TtsState {
  [key: string]: unknown;
  approach: Approach;
  stream: boolean;
}

export const initialState: TtsState = { approach: "neural", stream: false };
