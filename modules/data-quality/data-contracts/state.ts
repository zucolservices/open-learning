import type { Clause } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ContractState {
  [key: string]: unknown;
  clauses: Clause[];
  change: string;
}

export const initialState: ContractState = { clauses: ["schema"], change: "rename" };
