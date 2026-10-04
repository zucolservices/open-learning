/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  delay: number;
}

export const initialState: WhyState = { delay: 2800 };
