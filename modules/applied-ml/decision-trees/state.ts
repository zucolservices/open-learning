/** Everything a learner can change in this module, saved for resume. */
export interface TreeState {
  [key: string]: unknown;
  depth: number;
  p: number;
  dropSeed: number;
}

export const initialState: TreeState = { depth: 1, p: 0.3, dropSeed: 0 };
