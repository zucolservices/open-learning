/** Everything a learner can change in this module, saved for resume. */
export interface LinearState {
  [key: string]: unknown;
  slope: number;
  intercept: number;
  steps: number;
  lr: number;
  mode: "hand" | "gd";
  w: number;
  b: number;
}

export const initialState: LinearState = {
  slope: 0.5,
  intercept: 40,
  steps: 0,
  lr: 0.1,
  mode: "hand",
  w: 0.15,
  b: -3,
};
