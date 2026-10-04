import type { Mode, Probe } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OcState {
  [key: string]: unknown;
  mode: Mode;
  probe: Probe;
}

export const initialState: OcState = { mode: "orch", probe: "happy" };
