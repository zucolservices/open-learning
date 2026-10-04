/** Everything a learner can change in this module, saved for resume. */
export interface TurnState {
  [key: string]: unknown;
  timeout: number;
  semantic: boolean;
  threshold: number;
}

export const initialState: TurnState = { timeout: 500, semantic: false, threshold: 50 };
