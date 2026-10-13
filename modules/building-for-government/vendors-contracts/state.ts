/** Everything a learner can change in this module, saved for resume. */
export interface ContractState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: ContractState = { fixed: [] };
