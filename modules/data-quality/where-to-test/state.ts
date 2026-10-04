import type { CheckId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WhereState {
  [key: string]: unknown;
  enabled: CheckId[];
  ran: boolean;
  wap: number;
}

export const initialState: WhereState = { enabled: ["grain"], ran: false, wap: 0 };
