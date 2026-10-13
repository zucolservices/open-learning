/** Everything a learner can change in this module, saved for resume. */
export interface BuyState {
  [key: string]: unknown;
  picks: Record<string, string>;
}

export const initialState: BuyState = { picks: {} };
