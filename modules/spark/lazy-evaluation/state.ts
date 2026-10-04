/** Everything a learner can change in this module, saved for resume. */
export interface LazyState {
  [key: string]: unknown;
  chain: string[];
  ran: boolean;
}

export const initialState: LazyState = { chain: ["read"], ran: false };
