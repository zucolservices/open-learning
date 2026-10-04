import type { Action } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SevState {
  [key: string]: unknown;
  actions: Record<string, Action>;
  ran: boolean;
  tab: string;
  breaker: boolean;
}

export const initialState: SevState = { actions: {}, ran: false, tab: "dbt", breaker: false };
