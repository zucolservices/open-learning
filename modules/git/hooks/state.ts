import type { Check, Point } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HookState {
  [key: string]: unknown;
  att: Record<Check, Point[]>;
  noVerify: boolean;
  tried: boolean;
}

export const initialState: HookState = {
  att: { secrets: [], format: [], message: [], tests: [] },
  noVerify: false,
  tried: false,
};
