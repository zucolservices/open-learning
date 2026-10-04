/** Everything a learner can change in this module, saved for resume. */
export interface StatsState {
  [key: string]: unknown;
  n: number;
  runs: number;
  wilson: boolean;
  gap: number;
}

export const initialState: StatsState = { n: 100, runs: 1, wilson: false, gap: 3 };
