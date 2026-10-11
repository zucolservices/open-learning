import type { Home } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MgmtState {
  [key: string]: unknown;
  picks: Record<string, Home>;
  store: boolean;
  changes: number;
}

export const initialState: MgmtState = { picks: {}, store: false, changes: 0 };
