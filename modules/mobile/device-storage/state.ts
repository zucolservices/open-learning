/** Everything a learner can change in this module, saved for resume. */
export interface StoreState {
  [key: string]: unknown;
  picks: Record<string, string>;
}

export const initialState: StoreState = { picks: {} };
