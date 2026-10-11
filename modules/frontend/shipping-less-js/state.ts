/** Everything a learner can change in this module, saved for resume. */
export interface JsState {
  [key: string]: unknown;
  fixed: string[];
  budget: boolean;
}

export const initialState: JsState = { fixed: [], budget: true };
