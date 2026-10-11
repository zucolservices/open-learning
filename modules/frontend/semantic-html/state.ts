/** Everything a learner can change in this module, saved for resume. */
export interface SemState {
  [key: string]: unknown;
  picks: Record<string, string>;
}

export const initialState: SemState = { picks: {} };
