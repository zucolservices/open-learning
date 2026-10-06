/** Everything a learner can change in this module, saved for resume. */
export interface OverfitState {
  [key: string]: unknown;
  degree: number;
  lambdaIdx: number;
  complex: boolean;
}

export const initialState: OverfitState = { degree: 1, lambdaIdx: 0, complex: true };
