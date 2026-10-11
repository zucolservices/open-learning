/** Everything a learner can change in this module, saved for resume. */
export interface FormState {
  [key: string]: unknown;
  fixed: string[];
  submitted: boolean;
  controlled: boolean;
}

export const initialState: FormState = { fixed: [], submitted: false, controlled: false };
