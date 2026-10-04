/** Everything a learner can change in this module, saved for resume. */
export interface BenchState {
  [key: string]: unknown;
  pick: string;
}

export const initialState: BenchState = { pick: "mmlu" };
