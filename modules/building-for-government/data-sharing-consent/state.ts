/** Everything a learner can change in this module, saved for resume. */
export interface ShareState {
  [key: string]: unknown;
  picks: Record<string, string>;
  consent: boolean;
  log: boolean;
}

export const initialState: ShareState = { picks: {}, consent: false, log: false };
