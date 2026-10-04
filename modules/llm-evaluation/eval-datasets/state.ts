import type { SourceId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DatasetState {
  [key: string]: unknown;
  sources: SourceId[];
  heldOut: boolean;
  traces: number;
}

export const initialState: DatasetState = { sources: ["logs"], heldOut: false, traces: 30 };
