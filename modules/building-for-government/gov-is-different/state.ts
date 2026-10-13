/** Everything a learner can change in this module, saved for resume. */
export interface DiffState {
  [key: string]: unknown;
  on: string[];
}

export const initialState: DiffState = { on: [] };
