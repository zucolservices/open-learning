import type { Control, Incident } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SafeState {
  [key: string]: unknown;
  on: Control[];
  incident: Incident;
  decision: boolean;
}

export const initialState: SafeState = { on: [], incident: "password", decision: true };
