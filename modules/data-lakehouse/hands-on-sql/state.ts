/** Everything a learner can change in this module, saved for resume. */
export interface SqlState {
  [key: string]: unknown;
  sql: Record<string, string>;
  seen: Record<string, boolean>;
}

export const initialState: SqlState = { sql: {}, seen: {} };
