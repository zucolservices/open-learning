/** Everything a learner can change in this module, saved for resume. */
export interface JoinState {
  [key: string]: unknown;
  c: number;
  o: number;
  index: boolean;
  sorted: boolean;
}

export const initialState: JoinState = { c: 1000, o: 1000000, index: false, sorted: false };
