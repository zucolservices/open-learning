import type { QueryId, Scheme } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PartitioningState {
  [key: string]: unknown;
  pruneFilter: "date" | "timestamp" | "customer";
  scheme: Scheme;
  query: QueryId;
  fix?: string;
}

export const initialState: PartitioningState = {
  pruneFilter: "date",
  scheme: "none",
  query: "day",
};
