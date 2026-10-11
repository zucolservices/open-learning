import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReactState {
  [key: string]: unknown;
  mode: Mode;
  compiler: boolean;
  count: number;
  clicks: number;
  tried: string[];
}

export const initialState: ReactState = {
  mode: "diff",
  compiler: false,
  count: 0,
  clicks: 0,
  tried: [],
};
