/** Everything a learner can change in this module, saved for resume. */
export interface FeState {
  [key: string]: unknown;
  chosen: string[];
  encoding: "onehot" | "ordinal" | "target";
  hour: number;
}

export const initialState: FeState = { chosen: [], encoding: "onehot", hour: 23 };
