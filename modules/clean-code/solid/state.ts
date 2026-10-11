/** Everything a learner can change in this module, saved for resume. */
export interface SolidState {
  [key: string]: unknown;
  step: number;
  answers: Record<string, boolean>;
}

export const initialState: SolidState = { step: 0, answers: {} };
