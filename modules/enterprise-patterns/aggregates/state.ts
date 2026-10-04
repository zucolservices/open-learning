import type { Design } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AggState {
  [key: string]: unknown;
  design: Design;
}

export const initialState: AggState = { design: "loose" };
