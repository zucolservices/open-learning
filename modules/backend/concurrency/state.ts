import type { Work } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ConcState {
  [key: string]: unknown;
  work: Work;
  blocking: boolean;
}

export const initialState: ConcState = { work: "io", blocking: false };
