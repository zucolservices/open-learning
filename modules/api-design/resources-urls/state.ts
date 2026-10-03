/** Everything a learner can change in this module, saved for resume. */
export interface UrlState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: UrlState = { fixed: [] };
