/** Everything a learner can change in this module, saved for resume. */
export interface MeasureState {
  [key: string]: unknown;
  picked: string[];
}

export const initialState: MeasureState = { picked: ["visits", "users", "transactions"] };
