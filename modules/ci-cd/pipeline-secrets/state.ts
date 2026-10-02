import type { Door } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SecretsState {
  [key: string]: unknown;
  fixed: Door[];
  frame: number;
}

export const initialState: SecretsState = { fixed: [], frame: 0 };
