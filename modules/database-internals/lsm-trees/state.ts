/** Everything a learner can change in this module, saved for resume. */
export interface LsmState {
  [key: string]: unknown;
  n: number;
  key: string;
  bloom: boolean;
}

export const initialState: LsmState = { n: 0, key: "asha", bloom: false };
