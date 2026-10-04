import type { Tool } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ExpState {
  [key: string]: unknown;
  tool: Tool;
  bad: boolean;
  ran: boolean;
}

export const initialState: ExpState = { tool: "dbt", bad: true, ran: false };
