import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SamplingState {
  [key: string]: unknown;
  mode: Mode;
  headPct: number;
  keepErrors: boolean;
  keepSlow: boolean;
  rest: number;
  frame: number;
}

export const initialState: SamplingState = {
  mode: "head",
  headPct: 1,
  keepErrors: true,
  keepSlow: true,
  rest: 1,
  frame: 0,
};
