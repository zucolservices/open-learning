/** Everything a learner can change in this module, saved for resume. */
export interface TypesState {
  [key: string]: unknown;
  rps: number;
  slow: boolean;
}

export const initialState: TypesState = { rps: 20, slow: false };
