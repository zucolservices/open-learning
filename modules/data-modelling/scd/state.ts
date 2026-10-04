import type { ScdType } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ScdState {
  [key: string]: unknown;
  t: ScdType;
  moved: boolean;
  asOf: string;
}

export const initialState: ScdState = { t: 2, moved: false, asOf: "2026-05-22" };
