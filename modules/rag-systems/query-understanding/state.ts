/** Everything a learner can change in this module, saved for resume. */
export interface QueryState {
  [key: string]: unknown;
  c: number;
  picks: Record<string, string>;
}

export const initialState: QueryState = { c: 0, picks: {} };
