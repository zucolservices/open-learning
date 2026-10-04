/** Everything a learner can change in this module, saved for resume. */
export interface CompareState {
  [key: string]: unknown;
  fixed: number;
  broke: number;
  seed: number;
  bonferroni: boolean;
}

export const initialState: CompareState = { fixed: 12, broke: 2, seed: 3, bonferroni: false };
