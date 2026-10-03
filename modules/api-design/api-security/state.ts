/** Everything a learner can change in this module, saved for resume. */
export interface SecState {
  [key: string]: unknown;
  hole: string;
  fixed: string[];
}

export const initialState: SecState = { hole: "bola", fixed: [] };
