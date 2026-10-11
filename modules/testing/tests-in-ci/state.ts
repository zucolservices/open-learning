import type { Opt } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CiState {
  [key: string]: unknown;
  opts: Opt[];
}

export const initialState: CiState = { opts: [] };
