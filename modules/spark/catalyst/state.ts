/** Everything a learner can change in this module, saved for resume. */
export interface CatState {
  [key: string]: unknown;
  frame: number;
  pushdown: boolean;
  pruning: boolean;
}

export const initialState: CatState = { frame: 0, pushdown: true, pruning: true };
