import type { Check, Scenario } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReconState {
  [key: string]: unknown;
  scenario: Scenario;
  ran: Check[];
  tol: number;
  depth: number;
}

export const initialState: ReconState = { scenario: "duplost", ran: [], tol: 0, depth: 0 };
