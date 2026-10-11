/** Everything a learner can change in this module, saved for resume. */
export interface SafetyState {
  [key: string]: unknown;
  habits: string[];
}

export const initialState: SafetyState = { habits: [] };
