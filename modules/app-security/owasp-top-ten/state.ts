/** Everything a learner can change in this module, saved for resume. */
export interface TopState {
  [key: string]: unknown;
  risk: number;
  list: number;
}

export const initialState: TopState = { risk: 0, list: 0 };
