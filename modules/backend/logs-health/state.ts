/** Everything a learner can change in this module, saved for resume. */
export interface OpsState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: OpsState = { fixed: [] };
