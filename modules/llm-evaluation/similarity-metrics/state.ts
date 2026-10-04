/** Everything a learner can change in this module, saved for resume. */
export interface SimilarityState {
  [key: string]: unknown;
  pick: string;
  custom: string;
}

export const initialState: SimilarityState = { pick: "para", custom: "" };
