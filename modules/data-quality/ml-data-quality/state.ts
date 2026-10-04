/** Everything a learner can change in this module, saved for resume. */
export interface MlState {
  [key: string]: unknown;
  noise: number;
  data: number;
  concept: number;
}

export const initialState: MlState = { noise: 0, data: 0, concept: 0 };
