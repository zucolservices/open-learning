import type { Phase } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DetectState {
  [key: string]: unknown;
  alerts: string[];
  phase: Phase;
  revealed: boolean;
}

export const initialState: DetectState = { alerts: [], phase: "detect", revealed: false };
