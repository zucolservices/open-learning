/** Everything a learner can change in this module, saved for resume. */
export interface VitalsState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: VitalsState = { fixed: [] };
