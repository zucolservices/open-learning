import type { Parity } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EnvState {
  [key: string]: unknown;
  parity: Parity;
  frame: number;
}

export const initialState: EnvState = { parity: "test-like", frame: 0 };
