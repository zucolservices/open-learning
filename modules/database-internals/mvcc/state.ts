/** Everything a learner can change in this module, saved for resume. */
export interface MvccState {
  [key: string]: unknown;
  frame: number;
}

export const initialState: MvccState = { frame: 0 };
