/** Everything a learner can change in this module, saved for resume. */
export interface FormState {
  [key: string]: unknown;
  fixed: string[];
  bank: boolean;
}

export const initialState: FormState = { fixed: [], bank: false };
