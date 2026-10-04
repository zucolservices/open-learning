import type { Engine } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  engine: Engine;
  passes: number;
}

export const initialState: WhyState = { engine: "mr", passes: 5 };
