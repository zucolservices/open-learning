/** Everything a learner can change in this module, saved for resume. */
export interface MetricsState {
  [key: string]: unknown;
  picked: string[];
}

export const initialState: MetricsState = { picked: [] };
