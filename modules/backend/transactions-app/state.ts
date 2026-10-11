import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TxState {
  [key: string]: unknown;
  mode: Mode;
  tried: string[];
  tx: boolean;
}

export const initialState: TxState = { mode: "none", tried: [], tx: false };
