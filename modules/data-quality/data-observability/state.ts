import type { Signal } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ObsState {
  [key: string]: unknown;
  on: Signal[];
  day: number;
  lineage: boolean;
}

export const initialState: ObsState = { on: ["job"], day: 6, lineage: false };
