import type { Job, Shape } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OState {
  [key: string]: unknown;
  shape: Shape;
  job: Job;
}

export const initialState: OState = { shape: "norm", job: "checkout" };
