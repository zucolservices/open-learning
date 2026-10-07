import type { Policy, Storage } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PwState {
  [key: string]: unknown;
  storage: Storage;
  strong: boolean;
  policy: Policy;
  hibp: number;
}

export const initialState: PwState = { storage: "plain", strong: false, policy: "old", hibp: 0 };
