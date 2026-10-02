/** Everything a learner can change in this module, saved for resume. */
export interface PctState {
  [key: string]: unknown;
  tail: boolean;
  servers: number;
  shareA: number;
}

export const initialState: PctState = { tail: false, servers: 1, shareA: 90 };
