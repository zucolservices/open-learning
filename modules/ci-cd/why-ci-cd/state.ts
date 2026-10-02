import type { Batch } from "./model";

export type Mode = "ci" | "delivery" | "deployment";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  batch: Batch;
  mode: Mode;
}

export const initialState: WhyState = { batch: 240, mode: "ci" };
