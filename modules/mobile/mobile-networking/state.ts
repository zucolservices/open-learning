/** Everything a learner can change in this module, saved for resume. */
export interface NetState {
  [key: string]: unknown;
  net: string;
  fixes: string[];
}

export const initialState: NetState = { net: "dropping", fixes: [] };
