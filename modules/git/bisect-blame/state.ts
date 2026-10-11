import { START, type Range } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BisectState {
  [key: string]: unknown;
  range: Range;
  ignore: boolean;
  line: number;
}

export const initialState: BisectState = { range: START, ignore: false, line: 2 };
