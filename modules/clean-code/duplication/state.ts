/** Everything a learner can change in this module, saved for resume. */
export interface DupState {
  [key: string]: unknown;
  stage: number;
  gstFixed: boolean;
}

export const initialState: DupState = { stage: 0, gstFixed: false };
