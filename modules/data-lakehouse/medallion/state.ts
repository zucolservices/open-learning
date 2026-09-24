import type { WriteMode } from "./model";

export type Action = "warn" | "drop" | "fail" | "quarantine";

/** Everything a learner can change in this module, saved for resume. */
export interface MedallionState {
  [key: string]: unknown;
  actAmount: Action;
  actTs: Action;
  inputs: Record<string, string[]>;
  pick: string;
  ran: boolean;
  mode: WriteMode;
  runs: number;
  rerunGold: boolean;
  backfilled: boolean;
}

export const initialState: MedallionState = {
  actAmount: "warn",
  actTs: "warn",
  inputs: {},
  pick: "s_orders",
  ran: false,
  mode: "append",
  runs: 1,
  rerunGold: false,
  backfilled: false,
};
