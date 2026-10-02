/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  happened: string[];
}

export const initialState: WhyState = { happened: [] };
