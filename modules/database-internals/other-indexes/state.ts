import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OiState {
  [key: string]: unknown;
  kind: Kind;
  word: string;
}

export const initialState: OiState = { kind: "inverted", word: "dosa" };
