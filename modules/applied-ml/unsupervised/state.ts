/** Everything a learner can change in this module, saved for resume. */
export interface UnsupState {
  [key: string]: unknown;
  k: number;
  seed: number;
  iters: number;
  angle: number;
}

export const initialState: UnsupState = { k: 3, seed: 1, iters: 0, angle: 90 };
