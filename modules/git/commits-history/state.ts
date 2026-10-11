import type { Repo } from "../_shared/repo";

/** Everything a learner can change in this module, saved for resume. */
export interface HistState {
  [key: string]: unknown;
  frame: number;
  headRepo: Repo | null;
}

export const initialState: HistState = { frame: 0, headRepo: null };
