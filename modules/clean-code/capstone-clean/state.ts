/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  spotted: number[];
  stage: number;
}

export const initialState: CapState = { spotted: [], stage: 0 };
