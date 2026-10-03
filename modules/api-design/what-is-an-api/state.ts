/** Everything a learner can change in this module, saved for resume. */
export interface ApiState {
  [key: string]: unknown;
  change: string | null;
  tried: string[];
}

export const initialState: ApiState = { change: null, tried: [] };
