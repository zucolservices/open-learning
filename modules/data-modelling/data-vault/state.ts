/** Everything a learner can change in this module, saved for resume. */
export interface DVState {
  [key: string]: unknown;
  load: number;
  v2: boolean;
}

export const initialState: DVState = { load: 0, v2: true };
