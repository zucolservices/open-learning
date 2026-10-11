import type { Fix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReadableState {
  [key: string]: unknown;
  fixes: Fix[];
  guess: string | null;
  style: number;
}

export const initialState: ReadableState = { fixes: [], guess: null, style: 0 };
