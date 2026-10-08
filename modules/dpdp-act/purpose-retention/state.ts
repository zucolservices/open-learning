/** Everything a learner can change in this module, saved for resume. */
export interface RetainState {
  [key: string]: unknown;
  lastSeen: string;
  returns: boolean;
  big: boolean;
}

export const initialState: RetainState = { lastSeen: "mid", returns: false, big: true };
