import type { Query } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LogState {
  [key: string]: unknown;
  format: "text" | "structured";
  query: Query;
  field: number;
  redact: boolean;
}

export const initialState: LogState = { format: "text", query: "order", field: 0, redact: false };
