import type { Design } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SimpleState {
  [key: string]: unknown;
  design: Design | null;
  step: number;
  tried: Design[];
}

export const initialState: SimpleState = { design: null, step: 0, tried: [] };
