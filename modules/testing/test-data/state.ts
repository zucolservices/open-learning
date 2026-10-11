/** Everything a learner can change in this module, saved for resume. */
export interface DataState {
  [key: string]: unknown;
  converted: string[];
  events: string[];
}

export const initialState: DataState = { converted: [], events: [] };
