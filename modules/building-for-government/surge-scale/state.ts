/** Everything a learner can change in this module, saved for resume. */
export interface SurgeState {
  [key: string]: unknown;
  cache: boolean;
  light: boolean;
  queue: boolean;
  sms: boolean;
}

export const initialState: SurgeState = { cache: false, light: false, queue: false, sms: false };
