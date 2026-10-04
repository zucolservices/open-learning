import type { Option } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FwState {
  [key: string]: unknown;
  option: Option;
}

export const initialState: FwState = { option: "raw" };
