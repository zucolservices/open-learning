/** Everything a learner can change in this module, saved for resume. */
export interface InOutState {
  [key: string]: unknown;
  frame: number;
  gb: number;
  region: "us" | "mumbai";
}

export const initialState: InOutState = { frame: 0, gb: 5000, region: "mumbai" };
