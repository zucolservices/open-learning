/** Everything a learner can change in this module, saved for resume. */
export interface SecGovState {
  [key: string]: unknown;
  picks: Record<string, string>;
}

export const initialState: SecGovState = { picks: {} };
