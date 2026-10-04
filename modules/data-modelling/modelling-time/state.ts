/** Everything a learner can change in this module, saved for resume. */
export interface TimeState {
  [key: string]: unknown;
  valid: number;
  known: number;
  sys: boolean;
}

export const initialState: TimeState = { valid: 55, known: 55, sys: true };
