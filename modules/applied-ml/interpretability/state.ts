/** Everything a learner can change in this module, saved for resume. */
export interface ExplainState {
  [key: string]: unknown;
  who: number;
  debt: number | null;
  dup: boolean;
}

export const initialState: ExplainState = { who: 0, debt: null, dup: false };
