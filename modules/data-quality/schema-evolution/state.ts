import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SchemaState {
  [key: string]: unknown;
  change: string;
  mode: Mode;
}

export const initialState: SchemaState = { change: "add-required", mode: "BACKWARD" };
