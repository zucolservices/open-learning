/** Everything a learner can change in this module, saved for resume. */
export interface QpState {
  [key: string]: unknown;
  node: string;
  analyze: boolean;
}

export const initialState: QpState = { node: "index", analyze: false };
