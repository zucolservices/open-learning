import type { ChangeId, Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ContractState {
  [key: string]: unknown;
  changes: ChangeId[];
  mode: Mode;
  flow: number;
}

export const initialState: ContractState = { changes: ["rename-status"], mode: "none", flow: 0 };
