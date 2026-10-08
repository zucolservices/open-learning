import type { BackupWay, Comp } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PbdState {
  [key: string]: unknown;
  on: Comp[];
  backup: BackupWay;
}

export const initialState: PbdState = { on: [], backup: "nothing" };
