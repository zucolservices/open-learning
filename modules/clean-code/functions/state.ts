/** Everything a learner can change in this module, saved for resume. */
export interface FunctionsState {
  [key: string]: unknown;
  extracted: Record<string, number>;
}

export const initialState: FunctionsState = { extracted: {} };
