/** Everything a learner can change in this module, saved for resume. */
export interface DocState {
  [key: string]: unknown;
  step: number;
  digital: boolean;
}

export const initialState: DocState = { step: 0, digital: false };
