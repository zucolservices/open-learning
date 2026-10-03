/** Everything a learner can change in this module, saved for resume. */
export interface QjState {
  [key: string]: unknown;
  index: boolean;
  warm: boolean;
}

export const initialState: QjState = { index: false, warm: false };
