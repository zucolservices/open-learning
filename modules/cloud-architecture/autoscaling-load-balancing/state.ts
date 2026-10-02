import type { Shape } from "./sim";

/** Everything a learner can change in this module, saved for resume. */
export interface ScalingState {
  [key: string]: unknown;
  shape: Shape;
  target: number;
  warmup: number;
  min: number;
  scheduled: boolean;
  checks: "aws" | "gcp";
  broken: boolean;
}

export const initialState: ScalingState = {
  shape: "office",
  target: 60,
  warmup: 5,
  min: 2,
  scheduled: false,
  checks: "aws",
  broken: false,
};
