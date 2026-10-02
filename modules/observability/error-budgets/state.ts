/** Everything a learner can change in this module, saved for resume. */
export interface BudgetState {
  [key: string]: unknown;
  spent: string[];
  burn: number;
}

export const initialState: BudgetState = { spent: [], burn: 14.4 };
