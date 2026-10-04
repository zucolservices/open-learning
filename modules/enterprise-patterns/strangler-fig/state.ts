/** Everything a learner can change in this module, saved for resume. */
export interface SfState {
  [key: string]: unknown;
  moved: string[];
  verified: string[];
  retired: boolean;
  bigbang: boolean;
}

export const initialState: SfState = { moved: [], verified: [], retired: false, bigbang: false };
