/** Everything a learner can change in this module, saved for resume. */
export interface SafetyState {
  [key: string]: unknown;
  strictness: number;
  smart: boolean;
}

export const initialState: SafetyState = { strictness: 0.3, smart: false };
