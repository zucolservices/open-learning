import type { Tool } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PerfState {
  [key: string]: unknown;
  on: Tool[];
}

export const initialState: PerfState = { on: [] };
