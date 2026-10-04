/** Everything a learner can change in this module, saved for resume. */
export interface ErrState {
  [key: string]: unknown;
  picks: Record<string, string>;
  jitter: boolean;
}

export const initialState: ErrState = { picks: {}, jitter: false };
