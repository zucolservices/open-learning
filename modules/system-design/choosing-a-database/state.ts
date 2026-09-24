/** Everything a learner can change in this module, saved for resume. */
export interface DbState {
  [key: string]: unknown;
  family: string;
  picks: Record<string, string>;
  active: string;
}

export const initialState: DbState = { family: "relational", picks: {}, active: "ledger" };
