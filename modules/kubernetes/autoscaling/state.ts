/** Everything a learner can change in this module, saved for resume. */
export interface AsState {
  [key: string]: unknown;
  hpa: boolean;
  nodes: boolean;
  target: number;
  minute: number;
}

export const initialState: AsState = { hpa: false, nodes: false, target: 70, minute: 50 };
