import type { Choice } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DebtState {
  [key: string]: unknown;
  plan: Choice[];
}

export const initialState: DebtState = { plan: [] };
