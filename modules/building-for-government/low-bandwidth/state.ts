/** Everything a learner can change in this module, saved for resume. */
export interface BwState {
  [key: string]: unknown;
  fixed: string[];
  net: string;
  channels: string[];
}

export const initialState: BwState = { fixed: [], net: "2g", channels: [] };
