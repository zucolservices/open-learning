import type { CcType } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HygieneState {
  [key: string]: unknown;
  picks: Record<string, number>;
  type: CcType;
  scope: string;
  breaking: boolean;
}

export const initialState: HygieneState = {
  picks: {},
  type: "feat",
  scope: "menu",
  breaking: false,
};
