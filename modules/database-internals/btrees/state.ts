/** Everything a learner can change in this module, saved for resume. */
export interface BtState {
  [key: string]: unknown;
  n: number;
  find: number;
}

export const initialState: BtState = { n: 3, find: 45 };
