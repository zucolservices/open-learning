/** Everything a learner can change in this module, saved for resume. */
export interface DiffState {
  [key: string]: unknown;
  picks: Record<string, string>;
}

export const initialState: DiffState = { picks: {} };
